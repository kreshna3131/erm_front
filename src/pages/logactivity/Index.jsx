import axios from "axios"
import _ from "lodash"
import React, { useRef, useState } from "react"
import { useQuery } from "react-query"
import { ReactComponent as Search } from "../../assets/icons/search.svg"
import TableFooter from "../../components/table/TableFooter"
import TableHeading from "../../components/table/TableHeading"
import useBreadcrumb from "../../hooks/useBreadcrumb"
import useSidebarActiveMenu from "../../hooks/useSidebarActiveMenu"

import { ReactComponent as ExclamationIcon } from "../../assets/icons/primary-exclamation.svg"
import FilterDate from "./FilterDate"
import { isTruncated, truncate } from "../../helpers/string-helper"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { useNavigate } from "react-router"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import { HoverBorderedTr } from "components/table/TableRow"

// skema awal breacumb
const breadCrumbJson = {
  title: "Activity Log",
  items: [{ text: "Activity Log", path: null }],
}

// Komponen Utama log activity
export default function Index() {
  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("log-activity")
  const navigate = useNavigate()

  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
  })

  // skema search
  const setSearchValue = useRef(
    _.debounce((value) => {
      setFilter({
        ...filter,
        page: 1,
        search: value,
      })
    }, 1000)
  )

  // truncate
  const noteTruncateLength = 60
  const nameTruncateLength = 15

  // mengambil listing log activity
  const { data: logData, status: logStatus } = useQuery(
    ["activity-log", filter],
    async (key) =>
      axios
        .get("/activity-log/listing", {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
  )

  // dynamic route ketika diklik redirect ke typenya
  function dynamicRoute(data) {
    const type = data.recipe_type.split(",")
    switch (data.type) {
      case "Laboratorium":
        return `/visit/${data.visit_id}/laboratory/${data.request_id}`

      case "Radiologi":
        return `/visit/${data.visit_id}/radiology/${data.request_id}`

      case "Rehab Medic":
        return `/visit/${data.visit_id}/rehab/${data.request_id}`

      case "ICD-10":
        return `/visit/${data.visit_id}/icd/diagnosa-ten`

      case "ICD-9":
        return `/visit/${data.visit_id}/icd/diagnosa-nine`

      case "Resep":
        if (type.length === 1 && type[0] === "Non Racikan") {
          return `/visit/${data.visit_id}/receipt/${data.request_id}/non-concoction`
        }
        return `/visit/${data.visit_id}/receipt/${data.request_id}/concoction`

      case "Assesmen":
        return `/visit/${data.visit_id}/soap/${data.soap_id}/document/${data.dokumen_id}`

      case "Soap":
        return `/visit/${data.visit_id}/soap/${data.unique_id}`

      default:
        return ""
    }
  }
  return (
    <div className="post d-flex flex-column-fluid" id="kt_post">
      <div id="kt_content_container" className="container-fluid">
        <div className="card">
          <div className="card-header border-0 pt-6">
            <div className="card-toolbar">
              {logStatus === "success" && (
                <div
                  className="d-flex justify-content-end"
                  data-kt-user-table-toolbar="base"
                >
                  <span className="text-gray-600">
                    <ExclamationIcon className="me-2" />
                    Total ada {logData?.today_count} aktivitas untuk hari ini
                  </span>
                </div>
              )}
            </div>

            <div className="card-title">
              <FilterDate filterProps={[filter, setFilter]} />
              <div className="d-flex align-items-center position-relative my-1">
                <span className="svg-icon svg-icon-1 position-absolute ms-4">
                  <Search />
                </span>
                <input
                  type="text"
                  data-kt-user-table-filter="search"
                  className="form-control form-control-solid w-250px ps-14"
                  placeholder="Search"
                  onKeyUp={(event) => {
                    setSearchValue.current(event.target.value)
                  }}
                />
              </div>
            </div>
          </div>
          <div className="card-body p-10">
            {logStatus === "loading" && (
              <PrimaryLoader className="min-h-400px" />
            )}
            {logStatus === "error" && <ErrorMessage className="min-h-400px" />}
            {logStatus === "success" && (
              <>
                <div className="table-responsive">
                  <table
                    className="table"
                    style={{
                      minWidth: "1400px",
                    }}
                  >
                    <TableHeading
                      filterProp={[filter, setFilter]}
                      columns={[
                        {
                          name: "user_name",
                          heading: "Nama",
                          width: "15%",
                        },
                        {
                          name: "user_role",
                          heading: "Sebagai",
                          width: "12%",
                        },
                        {
                          name: "unique_id",
                          heading: "ID Permintaan",
                          width: "12%",
                        },
                        {
                          name: "note",
                          heading: "Catatan",
                          width: "35%",
                        },
                        {
                          name: "action",
                          heading: "Yang dilakukan",
                          width: "10%",
                        },
                        {
                          name: "created_at",
                          heading: "Tanggal",
                          width: "20%",
                        },
                      ]}
                    />
                    <tbody>
                      {logData?.data.length === 0 && (
                        <tr>
                          <td colSpan={6}>
                            <center className="text-gray-600">
                              Belum ada data yang dapat ditampilkan
                            </center>
                          </td>
                        </tr>
                      )}
                      {logData?.data.map((data, key) => (
                        <HoverBorderedTr key={`data-table-${key}`}>
                          <td className="align-middle text-gray-700">
                            {isTruncated(data.user_name, nameTruncateLength) ? (
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-${key}`}>
                                    {data.user_name}
                                  </Tooltip>
                                }
                              >
                                <span>
                                  {truncate(data.user_name, nameTruncateLength)}
                                </span>
                              </OverlayTrigger>
                            ) : (
                              <>{data.user_name}</>
                            )}
                          </td>
                          <td className="align-middle text-gray-700">
                            {data.user_role}
                          </td>
                          <td className="align-middle text-primary">
                            <span
                              role="button"
                              onClick={() => navigate(dynamicRoute(data))}
                            >
                              {data.unique_id}
                            </span>
                          </td>
                          <td className="align-middle text-gray-700">
                            {isTruncated(data.note, noteTruncateLength) ? (
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-${key}`}>
                                    {data.note}
                                  </Tooltip>
                                }
                              >
                                <span>
                                  {truncate(data.note, noteTruncateLength)}
                                </span>
                              </OverlayTrigger>
                            ) : (
                              <>{data.note}</>
                            )}
                          </td>
                          <td className="align-middle text-gray-700">
                            {data.action}
                          </td>
                          <td className="align-middle text-gray-700">
                            {data.created_at}
                          </td>
                        </HoverBorderedTr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <TableFooter data={logData} filterProp={[filter, setFilter]} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
