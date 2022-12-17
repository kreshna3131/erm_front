import { ReactComponent as BlueGlass } from "assets/icons/blue-glass.svg"
import { ReactComponent as Checklist } from "assets/icons/checklist.svg"
import { ReactComponent as Clock } from "assets/icons/clock.svg"
import { ReactComponent as CrossSign } from "assets/icons/cross-sign.svg"
import { ReactComponent as PrimaryArrow } from "assets/icons/primary-arrow-right.svg"
import { ReactComponent as Search } from "assets/icons/search.svg"
import { ReactComponent as TripleDot } from "assets/icons/triple-dot.svg"
import { ReactComponent as WarningExclamation } from "assets/icons/warning-exclamation.svg"
import { ReactComponent as WarningPencil } from "assets/icons/warning-pencil.svg"
import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import { DropdownStatusStyled } from "components/Dropdown"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import { HoverBorderedTr } from "components/table/TableRow"
import UpdateModal from "components/table/UpdateModal"
import { localeStatus } from "helpers/helper"
import { isTruncated, truncate } from "helpers/string-helper"
import useBreadcrumb from "hooks/useBreadcrumb"
import useOnClickOutside from "hooks/useOnClickOutside"
import useSidebarActiveMenu, {
  useOpenAccordionMenu,
} from "hooks/useSidebarActiveMenu"
import _ from "lodash"
import { useRef, useState } from "react"
import { Dropdown, Overlay, OverlayTrigger, Tooltip } from "react-bootstrap"
import { useQuery } from "react-query"
import { useLocation } from "react-router"
import { useNavigate, useParams } from "react-router-dom"
import FilterButton from "./FilterButton"

const createdTruncateLength = 15

/**
 * Skema menu breadcrumb permintaan lab
 */
const breadCrumbJson = {
  title: "Laboratorium",
  items: [
    { text: "Laboratorium", path: "/laboratory/request" },
    { text: "Permintaan", path: null },
  ],
}

// komponen utama Permintaan Laboratorium
export default function Index() {
  const navigate = useNavigate()

  useBreadcrumb(breadCrumbJson)
  useOpenAccordionMenu("laboratory")
  useSidebarActiveMenu("laboratory/request")

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

  /**
   * Logic pencarian tindakan lab
   */
  const setSearchValue = useRef(
    _.debounce((value) => {
      setFilter({
        ...filter,
        page: 1,
        search: value,
      })
    }, 1000)
  )

  /**
   * Mengambil data permintaan lab
   */
  const { data: labData, status: labStatus } = useQuery(
    ["laboratory", filter],
    async (key) =>
      axios
        .get("/visit/laboratorium/listing", {
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
              {labStatus === "success" && (
                <div
                  className="d-flex justify-content-end"
                  data-kt-user-table-toolbar="base"
                >
                  <span className="text-gray-600">
                    <WarningExclamation className="me-2" />
                    {labData?.is_read_count} permintaan belum dibaca komentarnya
                  </span>
                </div>
              )}
            </div>

            <div className="card-title align-items-sm-center flex-column flex-sm-row">
              <div className="d-flex align-items-center position-relative w-full w-sm-250px mb-2 mb-sm-0 me-7">
                <span className="svg-icon svg-icon-1 position-absolute ms-4">
                  <Search />
                </span>
                <input
                  type="text"
                  data-kt-user-table-filter="search"
                  className="form-control form-control-solid ps-14"
                  placeholder="Search"
                  onKeyUp={(event) => {
                    setSearchValue.current(event.target.value)
                  }}
                />
              </div>
              <FilterButton
                filterProps={[filter, setFilter]}
                labStatus={labStatus}
              />
            </div>
          </div>
          <div className="card-body p-10">
            {labStatus === "loading" && (
              <PrimaryLoader className="min-h-400px" />
            )}
            {labStatus === "error" && <ErrorMessage className="min-h-400px" />}
            {labStatus === "success" && (
              <>
                <div className="table-responsive">
                  <table className="table" style={{ minWidth: "1000px" }}>
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
                          name: "user_id",
                          heading: "Dibuat Untuk",
                          width: "13%",
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
                      {labData && labData?.data.length === 0 && (
                        <tr>
                          <td colSpan={7}>
                            <center className="text-gray-600">
                              Belum ada data yang dapat ditampilkan
                            </center>
                          </td>
                        </tr>
                      )}
                      {labData?.data.map((data, key) => {
                        return (
                          <HoverBorderedTr
                            key={`data-table-${key}`}
                            dynamicBg={getHoverBg(data)}
                          >
                            <td className="align-middle text-gray-700">
                              {data.unique_id}
                            </td>
                            <td className="align-middle text-gray-700">
                              {data.created_at}
                            </td>
                            <td className="align-middle text-gray-700">
                              {data.info}
                              {data.is_read_lab === 0 ? (
                                <WarningExclamation className="ms-2" />
                              ) : (
                                ""
                              )}
                            </td>
                            <td className="align-middle text-gray-700">
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
                            </td>
                            <td className="align-middle text-gray-700">
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
                            </td>
                            <td className="align-middle text-gray-700">
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
                            </td>
                            <td className="align-middle">
                              <div className="d-flex ">
                                <UpdateStatusButton
                                  id={data.id}
                                  currentStatus={data.status}
                                />
                                <ButtonLightStyled
                                  className="btn btn-light-primary p-3 ms-3"
                                  onClick={() =>
                                    navigate(
                                      `/laboratory/request/${data.id}/detail`
                                    )
                                  }
                                >
                                  <PrimaryArrow />
                                </ButtonLightStyled>
                              </div>
                            </td>
                          </HoverBorderedTr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <TableFooter data={labData} filterProp={[filter, setFilter]} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Tombol untuk mengubah status permintaan lab
 * @param {{
 * id: Number
 * currentStatus: import("interfaces/laboratorium").Status
 * }}
 */
function UpdateStatusButton({ id, currentStatus }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { status } = useParams()
  const [show, setShow] = useState(false)
  const overlayContainerRef = useRef()
  const overlayTargetRef = useRef()
  useOnClickOutside(overlayContainerRef, () => setShow(false))
  return (
    <>
      {location.pathname.includes(`/${id}/status/${status}`) && (
        <UpdateModal
          url={`visit/laboratorium/${id}/update-status`}
          data={{ status: status }}
          query={`laboratory`}
          message={`
            Anda yakin ingin mengganti status permintaan laboratorium menjadi ${localeStatus(
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
          <Dropdown.Menu show={true} className="py-5 w-200px me-2">
            <DropdownStatusStyled
              disabled={["cancel", "done"].includes(currentStatus)}
            >
              <Dropdown.Item
                active={currentStatus === "waiting"}
                onClick={() => {
                  setShow(false)
                  navigate(`${id}/status/waiting`)
                }}
              >
                <Clock className="me-4" />
                <span>Menunggu</span>
              </Dropdown.Item>
              <Dropdown.Item
                active={currentStatus === "fixing"}
                onClick={() => {
                  setShow(false)
                  navigate(`${id}/status/fixing`)
                }}
              >
                <WarningPencil className="me-4" />
                <span>Perbaikan</span>
              </Dropdown.Item>
              <Dropdown.Item
                active={currentStatus === "progress"}
                onClick={() => {
                  setShow(false)
                  navigate(`${id}/status/progress`)
                }}
              >
                <BlueGlass className="me-4" />
                <span>Proses</span>
              </Dropdown.Item>
              <Dropdown.Item
                active={currentStatus === "done"}
                onClick={() => {
                  setShow(false)
                  navigate(`${id}/status/done`)
                }}
              >
                <Checklist className="me-4" />
                <span>Selesai</span>
              </Dropdown.Item>
            </DropdownStatusStyled>
          </Dropdown.Menu>
        </Overlay>
      </div>
    </>
  )
}

/**
 * Fungsi untuk mengambil warna background untuk table
 * @param {import("interfaces/laboratorium").Laboratorium} data
 */
function getHoverBg(data) {
  if (data.is_read_lab === 0) {
    return "#fff7ee"
  }

  if (data.status === "cancel") {
    return "#fbebf0"
  }

  return "#FFFFFF"
}
