import axios from "axios"
import _ from "lodash"
import React, { useRef, useState } from "react"
import { useQuery } from "react-query"
import { ReactComponent as Search } from "assets/icons/search.svg"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import useBreadcrumb from "hooks/useBreadcrumb"
import useSidebarActiveMenu from "hooks/useSidebarActiveMenu"
import styled from "styled-components"
import { ReactComponent as TripleDot } from "assets/icons/triple-dot.svg"
import { ReactComponent as PrimaryArrow } from "assets/icons/primary-arrow-right.svg"
import { ReactComponent as Clock } from "assets/icons/clock.svg"
import { ReactComponent as Checklist } from "assets/icons/checklist.svg"
import { ReactComponent as CrossSign } from "assets/icons/cross-sign.svg"
import { ReactComponent as BlueGlass } from "assets/icons/blue-glass.svg"
import { ReactComponent as WarningPencil } from "assets/icons/warning-pencil.svg"
import { ReactComponent as WarningExclamation } from "assets/icons/warning-exclamation.svg"
import { isTruncated, truncate } from "helpers/string-helper"
import { Dropdown, Overlay, OverlayTrigger, Tooltip } from "react-bootstrap"
import FilterButton from "./FilterButton"
import { ButtonLightStyled } from "components/Button"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router"
import { useParams } from "react-router-dom"
import useOnClickOutside from "hooks/useOnClickOutside"
import UpdateModal from "components/table/UpdateModal"
import { HoverBorderedTrBg } from "components/table/TableRow"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import { DropdownItemStyled } from "pages/visit/DetailPatient"
import { DropdownStatusStyled } from "components/Dropdown"

const breadCrumbJson = {
  title: "Rehab Medik",
  items: [{ text: "Rehab Medik", path: null }],
}

// komponen utama rehab
export default function Index() {
  const navigate = useNavigate()
  const location = useLocation()

  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("rehab-medic")

  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
    periode: [],
    status: "",
    is_read: "",
  })

  const setSearchValue = useRef(
    _.debounce((value) => {
      setFilter({
        ...filter,
        page: 1,
        search: value,
      })
    }, 1000)
  )

  const createdTruncateLength = 15

  // get listing data rehab
  const { data: rehabData, status: rehabStatus } = useQuery(
    ["rehab-listing", filter],
    async (key) =>
      axios
        .get("/visit/rehab/listing", {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
  )
  return (
    <div className="post d-flex flex-column-fluid" id="kt_post">
      <div id="kt_content_container" className="container-fluid">
        <div className="card">
          <div className="card-header border-0 pt-6">
            <div className="card-toolbar">
              {rehabStatus === "success" && (
                <div
                  className="d-flex justify-content-end"
                  data-kt-user-table-toolbar="base"
                >
                  <span className="text-gray-600">
                    <WarningExclamation className="me-2" />
                    {rehabData?.is_read_count} permintaan belum dibaca
                    komentarnya
                  </span>
                </div>
              )}
            </div>

            <div className="card-title">
              <div className="d-flex align-items-center position-relative my-1 me-7">
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
              <FilterButton
                filterProps={[filter, setFilter]}
                rehabStatus={rehabStatus}
              />
            </div>
          </div>
          <div className="card-body p-10">
            {rehabStatus === "loading" && (
              <PrimaryLoader className="min-h-400px" />
            )}
            {rehabStatus === "error" && (
              <ErrorMessage className="min-h-400px" />
            )}
            {rehabStatus === "success" && (
              <>
                <div className="table-responsive">
                  <table className="table" style={{ minWidth: "900px" }}>
                    <TableHeading
                      filterProp={[filter, setFilter]}
                      columns={[
                        {
                          name: "unique_id",
                          heading: "ID Permintaan",
                          width: "15%",
                        },
                        {
                          name: "created_at",
                          heading: "Tanggal Dibuat",
                          width: "20%",
                        },
                        {
                          name: "info",
                          heading: "Terdapat",
                          width: "25%",
                        },
                        {
                          name: "created_by",
                          heading: "Dibuat Oleh",
                          width: "13%",
                        },
                        {
                          name: "status",
                          heading: "Status",
                          width: "8%",
                        },
                        {
                          name: "created_for",
                          heading: "Nama Pasien",
                          width: "15%",
                        },
                        {
                          name: "action",
                          heading: "",
                          width: "5%",
                          sort: false,
                        },
                      ]}
                    />
                    <tbody>
                      {rehabData && rehabData?.data.length === 0 && (
                        <tr>
                          <td colSpan={7}>
                            <center className="text-gray-600">
                              Belum ada data yang dapat ditampilkan
                            </center>
                          </td>
                        </tr>
                      )}
                      {rehabData?.data.map((data, key) => (
                        <HoverBorderedTrBg
                          key={`data-table-${key}`}
                          dynamicBg={getHoverBg(data)}
                        >
                          <th className="align-middle text-gray-700">
                            {data.unique_id}
                          </th>
                          <th className="align-middle text-gray-700">
                            {data.created_at}
                          </th>
                          <th className="align-middle text-gray-700">
                            {data.info}
                            {data.is_read_rehab === 0 ? (
                              <WarningExclamation className="ms-2" />
                            ) : (
                              ""
                            )}
                          </th>
                          <th className="align-middle text-gray-700">
                            {data.created_by &&
                            isTruncated(
                              data.created_by,
                              createdTruncateLength
                            ) ? (
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-${key}`}>
                                    {data.created_by}
                                  </Tooltip>
                                }
                              >
                                <span>
                                  {truncate(
                                    data.created_by,
                                    createdTruncateLength
                                  )}
                                </span>
                              </OverlayTrigger>
                            ) : (
                              <>{data.created_by}</>
                            )}
                          </th>
                          <th className="align-middle text-gray-700">
                            {data.status === "progress" && (
                              <span style={{ marginLeft: "8px" }}>
                                <BlueGlass />
                              </span>
                            )}
                            {data.status === "waiting" && (
                              <span style={{ marginLeft: "8px" }}>
                                <Clock />
                              </span>
                            )}
                            {data.status === "fixing" && (
                              <span style={{ marginLeft: "8px" }}>
                                <WarningPencil />
                              </span>
                            )}
                            {data.status === "done" && (
                              <span style={{ marginLeft: "8px" }}>
                                <Checklist />
                              </span>
                            )}
                            {data.status === "cancel" && (
                              <span style={{ marginLeft: "8px" }}>
                                <CrossSign />
                              </span>
                            )}
                          </th>
                          <th className="align-middle text-gray-700">
                            {data.created_for &&
                            isTruncated(
                              data.created_for,
                              createdTruncateLength
                            ) ? (
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-${key}`}>
                                    {data.created_for}
                                  </Tooltip>
                                }
                              >
                                <span>
                                  {truncate(
                                    data.created_for,
                                    createdTruncateLength
                                  )}
                                </span>
                              </OverlayTrigger>
                            ) : (
                              <>{data.created_for}</>
                            )}
                          </th>
                          <th className="align-middle">
                            <div className="d-flex ">
                              <UpdateRehabStatusButton
                                id={data.id}
                                status={data.status}
                              />
                              <ButtonLightStyled
                                className="btn btn-light-primary p-3 ms-3"
                                onClick={() => navigate(`${data.id}`)}
                              >
                                <PrimaryArrow />
                              </ButtonLightStyled>
                            </div>
                          </th>
                        </HoverBorderedTrBg>
                      ))}
                    </tbody>
                  </table>
                </div>
                <TableFooter
                  data={rehabData}
                  filterProp={[filter, setFilter]}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Menerjemahkan status
export function localeStatus(status) {
  let newStatus = ""
  switch (status) {
    case "waiting":
      newStatus = "Menunggu"
      break

    case "fixing":
      newStatus = "Perbaikan"
      break

    case "progress":
      newStatus = "Proses"
      break

    case "done":
      newStatus = "Selesai"
      break

    default:
      newStatus = ""
      break
  }
  return newStatus
}

// komponen untuk update status rehab
function UpdateRehabStatusButton({ id, status: statusRehab }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { status } = useParams()
  const [show, setShow] = useState(false)
  const overlayContainerRef = useRef()
  const overlayTargetRef = useRef()
  useOnClickOutside(overlayContainerRef, () => setShow(false))
  return (
    <>
      {location.pathname.includes(`${id}/status/${status}`) && (
        <UpdateModal
          url={`visit/rehab/${id}/update-status`}
          data={{ status: status }}
          query={`rehab-listing`}
          message={`
            Anda yakin ingin mengganti status permintaan  menjadi ${localeStatus(
              status
            )}?
          `}
          successMessage={`Anda telah berhasil mengubah status menjadi ${localeStatus(
            status
          )}.`}
        />
      )}
      <div ref={overlayContainerRef}>
        <ButtonLightStyled
          ref={overlayTargetRef}
          onClick={() => setShow(!show)}
          className="btn btn-icon btn-light-warning"
        >
          <TripleDot />
        </ButtonLightStyled>
        <Overlay
          show={show}
          target={overlayTargetRef.current}
          container={overlayContainerRef.current}
          placement="left-start"
        >
          <Dropdown.Menu show={true} className="py-5 w-200px">
            <DropdownStatusStyled
              disabled={["cancel", "done"].includes(statusRehab)}
            >
              <Dropdown.Item
                active={statusRehab === "waiting"}
                onClick={() => {
                  setShow(false)
                  navigate(`${id}/status/waiting`)
                }}
              >
                <Clock className="me-4" />
                <span
                  className={statusRehab === "waiting" ? "text-primary" : ""}
                >
                  Menunggu
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                active={statusRehab === "fixing"}
                onClick={() => {
                  setShow(false)
                  navigate(`${id}/status/fixing`)
                }}
              >
                <WarningPencil className="me-4" />
                <span
                  className={statusRehab === "fixing" ? "text-primary" : ""}
                >
                  Perbaikan
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                active={statusRehab === "progress"}
                onClick={() => {
                  setShow(false)
                  navigate(`${id}/status/progress`)
                }}
              >
                <BlueGlass className="me-4" />
                <span
                  className={statusRehab === "progress" ? "text-primary" : ""}
                >
                  Proses
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                active={statusRehab === "done"}
                onClick={() => {
                  setShow(false)
                  navigate(`${id}/status/done`)
                }}
              >
                <Checklist className="me-4" />
                <span className={statusRehab === "done" ? "text-primary" : ""}>
                  Selesai
                </span>
              </Dropdown.Item>
            </DropdownStatusStyled>
          </Dropdown.Menu>
        </Overlay>
      </div>
    </>
  )
}

export const DropdownItemStyledLab = styled.div`
  span {
    color: #7e8299;
  }

  .active,
  &:hover {
    background-color: #eff2f5;

    span {
      color: #0d9a89;
    }
  }
`

// conditional tr
function getHoverBg(data) {
  if (data.is_read_rehab === 0) {
    return "#fff5e8"
  }
  if (data.status === "cancel") {
    return "#fae5eb"
  }

  return "#FFFFFF"
}
