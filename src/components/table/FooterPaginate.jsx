import React from "react"
import BootstrapPagination from "react-bootstrap/Pagination"
import Select from "react-select"
import { ReactComponent as ArrowLeft } from "assets/icons/arrow-left.svg"
import { ReactComponent as ArrowRight } from "assets/icons/arrow-right.svg"
import { getQueryParameter } from "helpers/url-helper"
import { globalStyle } from "helpers/react-select"



// paginate untuk di data master radiology, hanya next dan previous page
export default function FooterPaginate({ data, filterProp }) {
  const [filter, setFilter] = filterProp

  const { links, total: totalData } = data


  

  return (
    <div className="row justify-content-center mt-7 ">    
      <BootstrapPagination className="col-md-12 align-items-center justify-content-center">
        {links?.length > 0 && links.map((link, key) => {
          return (
            <BootstrapPagination.Item
              className={link.active ? "offset" : ""}
              active={link.active}
              onClick={() => {
                setFilter({
                  ...filter,
                  ...{
                    page: getQueryParameter(link.url).page,
                  },
                })
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
