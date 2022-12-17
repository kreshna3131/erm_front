import { ReactComponent as BlueGlass } from "assets/icons/blue-glass.svg"
import { ReactComponent as Checklist } from "assets/icons/checklist.svg"
import { ReactComponent as Clock } from "assets/icons/clock.svg"
import { ReactComponent as CrossSign } from "assets/icons/cross-sign.svg"
import { ReactComponent as DangerDownloadIcon } from "assets/icons/danger-download.svg"
import { ReactComponent as InfoPreviewIcon } from "assets/icons/info-preview.svg"
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
import {
  HoverBorderedTr as BaseBorderTr,
  HoverBorderedTrBg,
} from "components/table/TableRow"
import UpdateModal from "components/table/UpdateModal"
import { localeStatus } from "helpers/helper"
import { isTruncated, truncate } from "helpers/string-helper"
import useBreadcrumb from "hooks/useBreadcrumb"
import useOnClickOutside from "hooks/useOnClickOutside"
import useSidebarActiveMenu from "hooks/useSidebarActiveMenu"
import _ from "lodash"
import FilterButton from "pages/lab/request/FilterButton"
import { useRef, useState } from "react"
import { Dropdown, Overlay, OverlayTrigger, Tooltip } from "react-bootstrap"
import { useMutation, useQuery } from "react-query"
import { useLocation } from "react-router"
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"

/**
 * Kustom styled komponen table row
 */
export const BorderedTr = styled(BaseBorderTr)`
  td {
    background-color: ${(props) => props.backgroundColor};
  }

  &:not(:last-child) {
    td::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background-image: linear-gradient(
        to right,
        ${(props) =>
            props.backgroundColor !== "#FFFFFF" ? "#FFFFFF" : "#eff2f5"}
          33%,
        rgba(255, 255, 255, 0) 0%
      );
      background-position: bottom;
      background-size: 8px 2px;
      background-repeat: repeat-x;
    }
  }
`
/**
 * Data inisial breadcrumb
 */
const breadCrumbJson = {
  title: "Radiologi",
  items: [{ text: "Radiologi", path: null }],
}

/** Panjang huruf truncate untuk nama pembuat */
const createdByTruncate = 15

/**
 * Komponen utama list permintaan radiologi
 */
export default function Index() {
  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("radiology")
  const navigate = useNavigate()
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

  /** Logic pencarian data radiologi */
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
   * Mengambil data radiologi
   */
  const { data: radiologyData, status: radiologyStatus } = useQuery(
    ["radiology", filter],
    async (key) =>
      axios
        .get("/visit/radiology/listing", {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
  )

  /**
   * Preview data radiologi
   */
  const [previewClicked, setPreviewClicked] = useState(0)
  const { mutate: previewMutate, status: previewPdfStatus } = useMutation(
    async (data) => {
      setPreviewClicked(data.radiology_id)
      return axios
        .get(`visit/radiology/${data.radiology_id}/preview-pdf`, {
          responseType: "blob",
        })
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/pdf",
          })
          const url = window.URL.createObjectURL(blob)
          window.open(url)

          return res.data
        })
        .finally(() => {
          setPreviewClicked(0)
        })
    }
  )

  /**
   * Download data radiologi
   */
  const [downloadClicked, setDownloadClicked] = useState(0)
  const { mutate: downloadMutate, status: downloadPdfStatus } = useMutation(
    async (data) => {
      setDownloadClicked(data.radiology_id)
      return axios
        .get(`visit/radiology/${data.radiology_id}/print-pdf`, {
          responseType: "blob",
        })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute(
            "download",
            `Hasil radiologi - ${data.unique_id}.pdf`
          )
          document.body.appendChild(link)
          link.click()

          return res.data
        })
        .finally(() => {
          setDownloadClicked(0)
        })
    }
  )

  return (
    <div className="post d-flex flex-column-fluid" id="kt_post">
      <div id="kt_content_container" className="container-fluid">
        <div className="card">
          <div className="card-header border-0 pt-6">
            <div className="card-toolbar">
              {radiologyStatus === "success" && (
                <div
                  className="d-flex justify-content-end"
                  data-kt-user-table-toolbar="base"
                >
                  <span className="text-gray-600">
                    <WarningExclamation className="me-2" />
                    {radiologyData.is_read_count} permintaan belum dibaca
                    komentarnya
                  </span>
                </div>
              )}
            </div>

            <div className="card-title align-items-sm-center flex-column flex-sm-row w-100 w-sm-auto">
              <div className="d-flex align-items-center w-100 w-sm-250px my-2 my-sm-1 me-7">
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
                labStatus={radiologyStatus}
              />
            </div>
          </div>
          <div className="card-body p-10">
            {radiologyStatus === "loading" && (
              <PrimaryLoader className="min-h-400px" />
            )}
            {radiologyStatus === "error" && (
              <ErrorMessage className="min-h-400px" />
            )}
            {radiologyStatus === "success" && (
              <>
                <div className="table-responsive">
                  <table className="table" style={{ minWidth: "1300px" }}>
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
                          width: "15%",
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
                          heading: "Nama pasien",
                          width: "15%",
                        },
                        {
                          name: "hasil",
                          heading: "Hasil",
                          width: "13%",
                          sort: false,
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
                      {radiologyData.data.length === 0 && (
                        <tr>
                          <td colSpan={7}>
                            <center className="text-gray-600">
                              Belum ada data yang dapat ditampilkan
                            </center>
                          </td>
                        </tr>
                      )}
                      {radiologyData.data.map(
                        /**
                         * @param {import("interfaces/radiology").Radiology} radiology
                         * @param {Number} key
                         */
                        (radiology, key) => {
                          return (
                            <HoverBorderedTrBg
                              key={`data-table-${key}`}
                              dynamicBg={getHoverBg(radiology)}
                            >
                              <td className="align-middle text-gray-700">
                                {radiology.unique_id}
                              </td>
                              <td className="align-middle text-gray-700">
                                {radiology.created_at}
                              </td>
                              <td className="align-middle text-gray-700">
                                {radiology.info}
                                {radiology.is_read_rad === 0 ? (
                                  <WarningExclamation className="ms-2" />
                                ) : (
                                  ""
                                )}
                              </td>
                              <td className="align-middle text-gray-700">
                                {radiology.created_by &&
                                isTruncated(
                                  radiology.created_by,
                                  createdByTruncate
                                ) ? (
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip id={`tooltip-${key}`}>
                                        {radiology.created_by}
                                      </Tooltip>
                                    }
                                  >
                                    <span>
                                      {truncate(
                                        radiology.created_by,
                                        createdByTruncate
                                      )}
                                    </span>
                                  </OverlayTrigger>
                                ) : (
                                  <>{radiology.created_by}</>
                                )}
                              </td>
                              <td className="align-middle text-gray-700">
                                {radiology.status === "progress" && (
                                  <span style={{ marginLeft: "8px" }}>
                                    <BlueGlass />
                                  </span>
                                )}
                                {radiology.status === "waiting" && (
                                  <span style={{ marginLeft: "8px" }}>
                                    <Clock />
                                  </span>
                                )}
                                {radiology.status === "fixing" && (
                                  <span style={{ marginLeft: "8px" }}>
                                    <WarningPencil />
                                  </span>
                                )}
                                {radiology.status === "done" && (
                                  <span style={{ marginLeft: "8px" }}>
                                    <Checklist />
                                  </span>
                                )}
                                {radiology.status === "cancel" && (
                                  <span style={{ marginLeft: "8px" }}>
                                    <CrossSign />
                                  </span>
                                )}
                              </td>
                              <td className="align-middle text-gray-700">
                                {radiology.created_for}
                              </td>
                              <td className="align-middle text-gray-700">
                                <div className="d-flex">
                                  <ButtonLightStyled
                                    onClick={() =>
                                      downloadMutate({
                                        radiology_id: radiology.id,
                                        unique_id: radiology.unique_id,
                                      })
                                    }
                                    className="btn btn-icon btn-light-danger me-3"
                                    disabled={downloadPdfStatus === "loading"}
                                  >
                                    {downloadPdfStatus === "loading" &&
                                    downloadClicked === radiology.id ? (
                                      <span
                                        className="indicator-progress"
                                        style={{ display: "block" }}
                                      >
                                        <span className="spinner-border spinner-border-sm align-middle"></span>
                                      </span>
                                    ) : (
                                      <DangerDownloadIcon />
                                    )}
                                  </ButtonLightStyled>
                                  <ButtonLightStyled
                                    onClick={() =>
                                      previewMutate({
                                        radiology_id: radiology.id,
                                      })
                                    }
                                    className="btn btn-icon btn-light-info"
                                    disabled={previewPdfStatus === "loading"}
                                  >
                                    {previewPdfStatus === "loading" &&
                                    previewClicked === radiology.id ? (
                                      <span
                                        className="indicator-progress"
                                        style={{ display: "block" }}
                                      >
                                        <span className="spinner-border spinner-border-sm align-middle"></span>
                                      </span>
                                    ) : (
                                      <InfoPreviewIcon />
                                    )}
                                  </ButtonLightStyled>
                                </div>
                              </td>
                              <td className="align-middle">
                                <div className="d-flex ">
                                  <UpdateStatusButton
                                    id={radiology.id}
                                    currentStatus={radiology.status}
                                  />
                                  <ButtonLightStyled
                                    className="btn btn-light-primary p-3 ms-3"
                                    onClick={() =>
                                      navigate(
                                        `/radiology/request/${radiology.id}`
                                      )
                                    }
                                  >
                                    <PrimaryArrow />
                                  </ButtonLightStyled>
                                </div>
                              </td>
                            </HoverBorderedTrBg>
                          )
                        }
                      )}
                    </tbody>
                  </table>
                </div>
                <TableFooter
                  data={radiologyData}
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

/**
 * Tombol untuk mengubah status permintaan radiologi
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
          url={`visit/radiology/${id}/update-status`}
          data={{ status: status }}
          query={`radiology`}
          message={`
            Anda yakin ingin mengganti status permintaan radiologi menjadi ${localeStatus(
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
          placement="left"
        >
          <Dropdown.Menu show={true} className="py-5 w-200px me-2">
            <DropdownStatusStyled
              disabled={["cancel", "done"].includes(currentStatus)}
            >
              <Dropdown.Item
                active={currentStatus === "waiting"}
                onClick={() => {
                  setShow(false)
                  navigate(`request/${id}/status/waiting`)
                }}
              >
                <Clock className="me-4" />
                <span
                  className={currentStatus === "waiting" ? "text-primary" : ""}
                >
                  Menunggu
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                active={currentStatus === "fixing"}
                onClick={() => {
                  setShow(false)
                  navigate(`request/${id}/status/fixing`)
                }}
              >
                <WarningPencil className="me-4" />
                <span
                  className={currentStatus === "fixing" ? "text-primary" : ""}
                >
                  Perbaikan
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                active={currentStatus === "progress"}
                onClick={() => {
                  setShow(false)
                  navigate(`request/${id}/status/progress`)
                }}
              >
                <BlueGlass className="me-4" />
                <span
                  className={currentStatus === "progress" ? "text-primary" : ""}
                >
                  Proses
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                active={currentStatus === "done"}
                onClick={() => {
                  setShow(false)
                  navigate(`request/${id}/status/done`)
                }}
              >
                <Checklist className="me-4" />
                <span
                  className={currentStatus === "done" ? "text-primary" : ""}
                >
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

/**
 * Fungsi untuk mengambil warna background untuk table
 * @param {import("interfaces/radiology").Radiology} data
 */
function getHoverBg(data) {
  if (data.is_read_rad === 0) {
    return "#fff7ee"
  }

  if (data.status === "cancel") {
    return "#fbebf0"
  }

  return "#FFFFFF"
}
