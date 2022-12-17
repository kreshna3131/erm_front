import React from "react"
import BootstrapPagination from "react-bootstrap/Pagination"
import Select from "react-select"
import { ReactComponent as ArrowLeft } from "../../assets/icons/arrow-left.svg"
import { ReactComponent as ArrowRight } from "../../assets/icons/arrow-right.svg"
import { getQueryParameter } from "../../helpers/url-helper"
import { globalStyle } from "../../helpers/react-select"

/**
 * Data untuk select jumlah data table
 */
const options = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
]

/**
 * Komponen table footer yang reusable
 * berisi:
 * - pagination
 * - select jumlah data table
 * @param {{
 * data: *,
 * filterProp: Array
 * }}
 */
export default function TableFooter({ data, filterProp }) {
  const [filter, setFilter] = filterProp
  const { links, total: totalData } = data
  return (
    <div className="row justify-content-md-between mt-2">
      <div className="d-flex justify-content-center justify-content-md-start align-items-center col-md-4 mb-4">
        <Select
          name="pagination"
          isSearchable={false}
          className="me-5"
          style={{
            width: "80px",
          }}
          onChange={(option) => {
            setFilter({
              ...filter,
              ...{
                page: 1,
                pagination: option.value,
              },
            })
          }}
          value={{
            label: filter?.pagination,
            value: filter?.pagination,
          }}
          components={{
            IndicatorSeparator: "",
          }}
          options={options}
          placeholder="10"
          styles={globalStyle}
        />
        <span className="text-gray-600">dari {totalData} data</span>
      </div>
      <BootstrapPagination className="col-md-8 align-items-center justify-content-center justify-content-md-end mb-4">
        {links.map((link, key) => {
          return (
            <BootstrapPagination.Item
              className={link.active ? "offset cursor-default" : ""}
              style={{ zIndex: 0 }}
              active={link.active}
              onClick={() => {
                if (!link.active) {
                  setFilter({
                    ...filter,
                    ...{
                      page: getQueryParameter(link.url).page,
                    },
                  })
                }
              }}
              key={`pagination-item-${key}`}
              disabled={disabledCondition(data, link.label)}
            >
              {link.label === "&laquo; Sebelumnya" ? (
                <ArrowLeft />
              ) : link.label === "Berikutnya &raquo;" ? (
                <ArrowRight />
              ) : (
                link.label
              )}
            </BootstrapPagination.Item>
          )
        })}
      </BootstrapPagination>
    </div>
  )
}

/**
 * Kondisi ketika pagination item terdisable
 * @param {*} data
 * @param {String} label
 */
export function disabledCondition(data, label) {
  if (data.current_page === data.last_page && label === "Berikutnya &raquo;") {
    return true
  }

  if (data.current_page === 1 && label === "&laquo; Sebelumnya") {
    return true
  }

  if (label === "...") {
    return true
  }
}
