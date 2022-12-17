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
import { HoverBorderedTrBg } from "components/table/TableRow"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import UpdateModalRecipe from "components/table/UpdateModalRecipe"
import { DropdownStatusStyled } from "components/Dropdown"

const breadCrumbJson = {
  title: "Farmasi",
  items: [
    { text: "Farmasi", path: "/pharmacy/request" },
    { text: "Permintaan", path: null },
  ],
}

// komponen utama pharmacy
export default function Index() {
  const navigate = useNavigate()
  const location = useLocation()

  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("pharmacy-request")

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

  // get listing data pharmacy
  const { data: pharmacyData, status: pharmacyStatus } = useQuery(
    ["recipe-listing", filter],
    async (key) =>
      axios
        .get("/visit/recipe/listing", {
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
              {pharmacyStatus === "success" && (
                <div
                  className="d-flex justify-content-end"
                  data-kt-user-table-toolbar="base"
                >
                  <span className="text-gray-600">
                    <WarningExclamation className="me-2" />
                    {pharmacyData?.is_read_count} permintaan belum dibaca
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
                pharmacyStatus={pharmacyStatus}
              />
            </div>
          </div>
          <div className="card-body p-10">
            {pharmacyStatus === "loading" && (
              <PrimaryLoader className="min-h-400px" />
            )}
            {pharmacyStatus === "error" && (
              <ErrorMessage className="min-h-400px" />
            )}
            {pharmacyStatus === "success" && (
              <>
                <div className="table-responsive">
                  <table className="table" style={{ minWidth: "1100px" }}>
                    <TableHeading
                      filterProp={[filter, setFilter]}
                      columns={[
                        {
                          name: "unique_id",
                          heading: "ID Permintaan",
                          width: "10%",
                        },
                        {
                          name: "created_at",
                          heading: "Tanggal Dibuat",
                          width: "18%",
                        },
                        {
                          name: "info",
                          heading: "Terdapat",
                          width: "20%",
                        },
                        {
                          name: "created_by",
                          heading: "Dibuat Oleh",
                          width: "13%",
                        },
                        {
                          name: "status",
                          heading: "Status",
                          width: "7%",
                        },
                        {
                          name: "created_for",
                          heading: "Nama Pasien",
                          width: "13%",
                        },
                        {
                          name: "nota_number",
                          heading: "Kode Nota",
                          width: "9%",
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
                      {pharmacyData && pharmacyData?.data.length === 0 && (
                        <tr>
                          <td colSpan={7}>
                            <center className="text-gray-600">
                              Belum ada data yang dapat ditampilkan
                            </center>
                          </td>
                        </tr>
                      )}
                      {pharmacyData?.data.map((data, key) => (
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
                            {data.is_read_apo === 0 ? (
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
                          <th className="align-middle text-gray-700">
                            {data.nota_number}
                          </th>
                          <th className="align-middle">
                            <div className="d-flex ">
                              <UpdatePharmacyStatusButton
                                id={data.id}
                                status={data.status}
                              />
                              <ButtonLightStyled
                                className="btn btn-light-primary p-3 ms-3"
                                onClick={() =>
                                  // navigate(
                                  //   location.pathname + "/" + recipe.id + "/concoction"
                                  // )
                                  navigate(
                                    updateRouteDetail(
                                      location,
                                      data.id,
                                      data.type,
                                      data.visit_id
                                    )
                                  )
                                }
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
                  data={pharmacyData}
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

// update route untuk update status resep
function updateRoute(location, id, status) {
  return location.pathname + "/receipt/" + id + "/status/" + status
}

// update route untuk masuk ke detail
function updateRouteDetail(location, recipeId, recipeType, visitId) {
  const recipeTypeSplit = recipeType && recipeType.split(",")

  if (recipeTypeSplit.length < 2 && recipeTypeSplit[0] === "Non Racikan") {
    return (
      location.pathname +
      "/" +
      visitId +
      "/receipt/" +
      recipeId +
      "/non-concoction"
    )
  } else {
    return (
      location.pathname + "/" + visitId + "/receipt/" + recipeId + "/concoction"
    )
  }
}

// komponen untuk update status resep
function UpdatePharmacyStatusButton({ id, status: statusRecipe }) {
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
        <UpdateModalRecipe
          url={`visit/recipe/${id}/update-status`}
          data={{ status: status }}
          query={`recipe-listing`}
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
              disabled={["done", "cancel"].includes(statusRecipe)}
            >
              <Dropdown.Item
                active={statusRecipe === "waiting"}
                className="d-flex align-items-center px-8 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(updateRoute(location, id, "waiting"))
                }}
              >
                <Clock className="me-4" />
                <span
                  className={statusRecipe === "waiting" ? "text-primary" : ""}
                >
                  Menunggu
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                active={statusRecipe === "fixing"}
                className="d-flex align-items-center px-8 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(updateRoute(location, id, "fixing"))
                }}
              >
                <WarningPencil className="me-4" />
                <span
                  className={statusRecipe === "fixing" ? "text-primary" : ""}
                >
                  Perbaikan
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                active={statusRecipe === "progress"}
                className="d-flex align-items-center px-8 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(updateRoute(location, id, "progress"))
                }}
              >
                <BlueGlass className="me-4" />
                <span
                  className={statusRecipe === "progress" ? "text-primary" : ""}
                >
                  Proses
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                active={statusRecipe === "done"}
                className="d-flex align-items-center px-8 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(updateRoute(location, id, "done"))
                }}
              >
                <Checklist className="me-4" />
                <span className={statusRecipe === "done" ? "text-primary" : ""}>
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
  if (data.is_read_apo === 0) {
    return "#fff5e8"
  }
  if (data.status === "cancel") {
    return "#fae5eb"
  }

  return "#FFFFFF"
}
