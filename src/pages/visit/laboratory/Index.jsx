import { ReactComponent as BlueGlassIcon } from "assets/icons/blue-glass.svg"
import { ReactComponent as PrimaryChecklistIcon } from "assets/icons/checklist.svg"
import { ReactComponent as WarningClockIcon } from "assets/icons/clock.svg"
import { ReactComponent as CancelIcon } from "assets/icons/cross-sign.svg"
import { ReactComponent as DangerDownloadIcon } from "assets/icons/danger-download.svg"
import { ReactComponent as InfoPreviewIcon } from "assets/icons/info-preview.svg"
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg"
import { ReactComponent as ArrowRightIcon } from "assets/icons/primary-arrow-right.svg"
import { ReactComponent as SearchIcon } from "assets/icons/search.svg"
import { ReactComponent as TripleDotIcon } from "assets/icons/triple-dot.svg"
import { ReactComponent as WarningExclamationIcon } from "assets/icons/warning-exclamation.svg"
import { ReactComponent as WarningPencilIcon } from "assets/icons/warning-pencil.svg"
import axios from "axios"
import clsx from "clsx"
import { ButtonLightStyled } from "components/Button"
import { DropdownStatusStyled } from "components/Dropdown"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import { HoverBorderedTrBg } from "components/table/TableRow"
import UpdateModal from "components/table/UpdateModal"
import useBreadcrumb from "hooks/useBreadcrumb"
import useOnClickOutside from "hooks/useOnClickOutside"
import useSidebarActiveMenu from "hooks/useSidebarActiveMenu"
import _ from "lodash"
import { useRef, useState } from "react"
import { Dropdown, Overlay } from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { useQuery } from "react-query"
import {
  Link,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom"
import DetailPatient from "../DetailPatient"
import { HistoryMedicDownloadButton } from "../HistoryMedicDownloadButton"
import { breadCrumbJson, DownloadSoapLabel } from "../soap/Index"
import TabMenu from "../TabMenu"

/**
 * Menerjemahkan status
 * @param {import("interfaces/laboratorium").Status} status
 */
export function localeStatus(status) {
  switch (status) {
    case "waiting":
      return "Menunggu"

    case "fixing":
      return "Perbaikan"

    case "cancel":
      return "Batalkan"

    default:
      return status
  }
}

/**
 * Mengganti background row table berdasarkan status
 * @param {import("interfaces/laboratorium").Status} status
 */
export function dynamicRowBg(status) {
  switch (status) {
    case "fixing":
      return "#fff7ee"

    case "done":
      return "#ecf7f6"

    case "cancel":
      return "#fbebf0"

    default:
      return ""
  }
}

/**
 * Komponen Utama Halaman Laboratory
 */
export default function Index() {
  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("visit")
  const navigate = useNavigate()
  const location = useLocation()
  const { id: visitId } = useParams()
  const [submitStatus, setSubmitStatus] = useState({})
  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
  })
  const [isSearching, setIsSearching] = useState(false)
  const { allPermissions } = useOutletContext()

  /**
   * Logic pencarian laboratorium
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
   * Mengambil data laboratorium
   */
  const { data: laboratoriumData, status: laboratoriumStatus } = useQuery(
    [`visit-${visitId}-laboratorium`, filter],
    async (key) =>
      axios
        .get(`/visit/${visitId}/laboratorium/listing`, {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
  )

  return (
    <>
      {submitStatus?.status && (
        <SweetAlert
          title=""
          type={submitStatus.status}
          style={{
            minHeight: "322px",
            width: "364px",
            padding: "30px",
            borderRadius: "10px",
          }}
          onConfirm={() => {
            if (submitStatus.status === "success") {
              setSubmitStatus({})
            } else {
              setSubmitStatus({})
            }
          }}
          confirmBtnText="OK mengerti"
        >
          <div className="text-gray-600 mb-5">{submitStatus?.message}</div>
        </SweetAlert>
      )}

      <div className="post d-flex flex-column-fluid" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          <DetailPatient id={visitId} />
          <div className="card">
            <TabMenu isSearching={isSearching} />
            <div className="card-header border-0 pt-6">
              <div className="card-toolbar">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      !allPermissions.includes(
                        "tambah permintaan laboratorium di kunjungan"
                      )
                        ? ""
                        : "request"
                    )
                  }
                  disabled={
                    !allPermissions.includes(
                      "tambah permintaan laboratorium di kunjungan"
                    )
                  }
                  className="btn btn-primary me-3"
                >
                  <PlusIcon /> Tambah
                </button>
                <HistoryMedicDownloadButton
                  downloadUrl={`/visit/${visitId}/laboratorium/print-pdf`}
                  downloadName="Histori laboratorium.pdf"
                  previewUrl={`/visit/${visitId}/laboratorium/preview-pdf`}
                />
              </div>
              <div className="card-title">
                <div className="d-flex align-items-center position-relative my-1">
                  <span className="svg-icon svg-icon-1 position-absolute ms-4">
                    <SearchIcon />
                  </span>
                  <input
                    onFocus={() => setIsSearching(true)}
                    onBlur={() => setIsSearching(false)}
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
              {laboratoriumStatus === "loading" && (
                <PrimaryLoader className="min-h-300px" />
              )}
              {laboratoriumStatus === "error" && (
                <ErrorMessage className="min-h-300px" />
              )}
              {laboratoriumStatus === "success" && (
                <>
                  <div className="table-responsive">
                    <table className="table" style={{ minWidth: "1200px" }}>
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
                            heading: "Tanggal dibuat",
                            width: "15%",
                          },
                          {
                            name: "info",
                            heading: "Terdapat",
                            width: "20%",
                          },
                          {
                            name: "created_by",
                            heading: "Dibuat oleh",
                            width: "15%",
                          },
                          {
                            name: "status",
                            heading: "Status",
                            width: "7%",
                          },
                          {
                            name: "updated_by",
                            heading: "Terakhir diubah",
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
                        {laboratoriumData.data.length === 0 && (
                          <tr>
                            <td className="py-10 align-middle" colSpan={7}>
                              <center className="text-gray-600">
                                Belum ada data yang dapat ditampilkan
                              </center>
                            </td>
                          </tr>
                        )}
                        {laboratoriumData.data.map(
                          /** @param {import("interfaces/laboratorium").Laboratorium} laboratorium */
                          (laboratorium, key) => {
                            return (
                              <HoverBorderedTrBg
                                dynamicBg={dynamicRowBg(laboratorium.status)}
                                key={`data-table-${key}`}
                              >
                                <td className="align-middle text-gray-700">
                                  {laboratorium.unique_id}
                                </td>
                                <td className="align-middle text-gray-700">
                                  {laboratorium.created_at}
                                </td>
                                <td className="align-middle text-gray-700">
                                  <div className="d-flex align-items-center">
                                    <span className="me-3">
                                      {laboratorium.info}
                                    </span>
                                    {!laboratorium.is_read_doc && (
                                      <WarningExclamationIcon />
                                    )}
                                  </div>
                                </td>
                                <td className="align-middle text-gray-700">
                                  {laboratorium.created_by}
                                </td>
                                <td className="align-middle text-gray-700">
                                  {laboratorium.status === "waiting" && (
                                    <WarningClockIcon />
                                  )}
                                  {laboratorium.status === "progress" && (
                                    <BlueGlassIcon />
                                  )}
                                  {laboratorium.status === "fixing" && (
                                    <WarningPencilIcon />
                                  )}
                                  {laboratorium.status === "done" && (
                                    <PrimaryChecklistIcon />
                                  )}
                                  {laboratorium.status === "cancel" && (
                                    <CancelIcon />
                                  )}
                                </td>
                                <td className="align-middle text-gray-700">
                                  {laboratorium.updated_at ?? "-"}
                                </td>
                                <td className="align-middle text-gray-700">
                                  <div className="d-flex">
                                    <UpdateStatusButton
                                      id={laboratorium.id}
                                      currentStatus={laboratorium.status}
                                      disabled={
                                        ["done", "cancel"].includes(
                                          laboratorium.status
                                        ) || laboratorium.allow === 0
                                      }
                                    />
                                    <ButtonLightStyled
                                      disabled={laboratorium.allow === 0}
                                      onClick={() =>
                                        navigate(
                                          location.pathname +
                                            "/" +
                                            `${laboratorium.id}`
                                        )
                                      }
                                      className="btn btn-icon btn-light-primary"
                                    >
                                      <ArrowRightIcon />
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
                    data={laboratoriumData}
                    filterProp={[filter, setFilter]}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Komponen tombol untuk mendownload / preview PDF
 */
function DownloadButton() {
  const overlayTarget = useRef()
  const overlayContainer = useRef()
  const { id: visitId } = useParams()
  const [showOverlay, setShowOverlay] = useState(false)
  useOnClickOutside(overlayContainer, () => setShowOverlay(false))

  const { isFetching: downloadPdfIsFetching, refetch: downloadPdfRefetch } =
    useQuery(
      "downloadPDF",
      async () =>
        axios
          .get(`/visit/${visitId}/laboratorium/print-pdf`, {
            responseType: "blob",
          })
          .then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `Histori laboratorium.pdf`)
            document.body.appendChild(link)
            link.click()

            return res.data
          }),
      {
        enabled: false,
      }
    )

  const { isFetching: previewPdfIsFetching, refetch: previewPdfRefetch } =
    useQuery(
      "previewPdf",
      async () =>
        axios
          .get(`/visit/${visitId}/laboratorium/preview-pdf`, {
            responseType: "blob",
          })
          .then((res) => {
            const blob = new Blob([res.data], {
              type: "application/pdf",
            })
            const url = window.URL.createObjectURL(blob)
            window.open(url)

            return res.data
          }),
      {
        enabled: false,
      }
    )

  return (
    <div className="position-relative w-50px" ref={overlayContainer}>
      <ButtonLightStyled
        ref={overlayTarget}
        onClick={() => setShowOverlay(!showOverlay)}
        className="btn btn-icon btn-light-warning me-3"
      >
        <TripleDotIcon />
      </ButtonLightStyled>
      <Overlay
        show={showOverlay}
        container={overlayContainer.current}
        target={overlayTarget.current}
        placement="right-start"
      >
        <div className="card shadow-sm w-200px" style={{ marginLeft: "-45px" }}>
          <div className="card-body p-4">
            <div className="d-flex flex-column">
              <DownloadSoapLabel className="mb-3">
                <p className="fs-6 m-0">Download</p>
                <ButtonLightStyled
                  disabled={downloadPdfIsFetching}
                  className="btn btn-icon btn-light-danger"
                  onClick={() => downloadPdfRefetch()}
                >
                  {downloadPdfIsFetching ? (
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
              </DownloadSoapLabel>
              <DownloadSoapLabel>
                <p className="fs-6 m-0">Preview</p>
                <ButtonLightStyled
                  disabled={previewPdfIsFetching}
                  className="btn btn-icon btn-light-info"
                  onClick={() => previewPdfRefetch()}
                >
                  {previewPdfIsFetching ? (
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
              </DownloadSoapLabel>
            </div>
          </div>
        </div>
      </Overlay>
    </div>
  )
}

/**
 * Tombol komponen untuk mengupdate permintaan laboratorium
 * @param {{
 * id: Number
 * currentStatus: String
 * disabled: Boolean
 * }}
 */
function UpdateStatusButton({ id, currentStatus, disabled }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { id: visitId, status } = useParams()
  const [show, setShow] = useState(false)
  const overlayContainerRef = useRef()
  const overlayTargetRef = useRef()
  useOnClickOutside(overlayContainerRef, () => setShow(false))

  return (
    <>
      {location.pathname.includes(`/laboratory/${id}/status/${status}`) && (
        <UpdateModal
          url={`/visit/laboratorium/${id}/update-status`}
          data={{ status: status }}
          query={`visit-${visitId}-laboratorium`}
          message={`
            Anda yakin ingin mengganti status permintaan menjadi ${localeStatus(
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
          className="btn btn-icon btn-light-warning me-3"
        >
          <TripleDotIcon />
        </ButtonLightStyled>
        <Overlay
          show={show}
          target={overlayTargetRef.current}
          container={overlayContainerRef.current}
          placement="left"
        >
          <Dropdown.Menu show={true} className="py-5 w-200px">
            <DropdownStatusStyled disabled={disabled}>
              <Dropdown.Item
                active={currentStatus === "waiting"}
                className="d-flex align-items-center px-8 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(`${id}/status/waiting`)
                }}
              >
                <WarningClockIcon className="me-4" />
                <span>Menunggu</span>
              </Dropdown.Item>
              <Dropdown.Item
                active={currentStatus === "fixing"}
                className="d-flex align-items-center px-8 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(`${id}/status/fixing`)
                }}
              >
                <WarningPencilIcon className="me-4" />
                <span>Perbaikan</span>
              </Dropdown.Item>
              <Dropdown.Item
                active={currentStatus === "cancel"}
                className="d-flex align-items-center px-8 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(`${id}/status/cancel`)
                }}
              >
                <CancelIcon className="me-4" />
                <span>Batalkan</span>
              </Dropdown.Item>
            </DropdownStatusStyled>
          </Dropdown.Menu>
        </Overlay>
      </div>
    </>
  )
}
