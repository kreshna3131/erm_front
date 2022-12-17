import React from "react"
import { ReactComponent as SortAsc } from "../../assets/icons/table-sort-asc.svg"
import { ReactComponent as SortDesc } from "../../assets/icons/table-sort-desc.svg"

/**
 * Komponen table heading yang reusable
 * @param {{
 * columns: Array,
 * filterProp: Array
 * }}
 */
export default function TableHeading({ columns, filterProp }) {
  const [filter, setFilter] = filterProp
  return (
    <thead>
      <tr>
        {columns.map((column, key) => (
          <th
            style={{
              width: column?.width,
            }}
            key={`table-heading-${key}`}
            className={`text-gray-500 ${
              column?.sort === false ? "" : "cursor-pointer"
            }`}
            onClick={() => {
              if (column?.sort === false) {
                return
              }

              if (filter.order_by === column.name) {
                setFilter({
                  ...filter,
                  ...{
                    order_by: column.name,
                    order_dir: filter.order_dir === "asc" ? "desc" : "asc",
                  },
                })
              } else {
                setFilter({
                  ...filter,
                  ...{
                    order_by: column.name,
                    order_dir: "asc",
                  },
                })
              }
            }}
          >
            {column.heading}{" "}
            {filter.order_by === column.name &&
              (filter.order_dir === "asc" ? <SortAsc /> : <SortDesc />)}
          </th>
        ))}
      </tr>
    </thead>
  )
}
