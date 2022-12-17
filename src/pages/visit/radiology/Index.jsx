import { ReactComponent as BlueGlassIcon } from "assets/icons/blue-glass.svg"
import { ReactComponent as PrimaryChecklistIcon } from "assets/icons/checklist.svg"
import { ReactComponent as WarningClockIcon } from "assets/icons/clock.svg"
import { ReactComponent as CancelIcon } from "assets/icons/cross-sign.svg"
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
import { dynamicRowBg } from "../laboratory/Index"
import { breadCrumbJson } from "../soap/Index"
import TabMenu from "../TabMenu"

/**
 * Menerjemahkan status
 * @param {"waiting" | "fixing" | "done" | "cancel"} status
 * @returns
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
      return ""
  }
}

/**
 * Komponen halaman utama untuk Radiologi
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
   * Logic pencarian radiologi
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
   * Mengambil data list radiologi
   */
  const { data: radiologyData, status: radiologyStatus } = useQuery(
    [`visit-${visitId}-radiology`, filter],
    async (key) =>
      axios
        .get(`/visit/${visitId}/radiology/listing`, {
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
                        "tambah permintaan radiologi di kunjungan"
                      )
                        ? ""
                        : "add-request"
                    )
                  }
                  disabled={
                    !allPermissions.includes(
                      "tambah permintaan radiologi di kunjungan"
                    )
                  }
                  className="btn btn-primary me-3"
                >
                  <PlusIcon /> Tambah
                </button>
                <HistoryMedicDownloadButton
                  downloadUrl={`/visit/${visitId}/radiology/print-pdf`}
                  downloadName="Histori radiologi.pdf"
                  previewUrl={`/visit/${visitId}/radiology/preview-pdf`}
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
              {radiologyStatus === "loading" && (
                <PrimaryLoader className="min-h-300px" />
              )}
              {radiologyStatus === "error" && (
                <ErrorMessage className="min-h-300px" />
              )}
              {radiologyStatus === "success" && (
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
                        {radiologyData.data.length === 0 && (
                          <tr>
                            <td className="py-10 align-middle" colSpan={7}>
                              <center className="text-gray-600">
                                Belum ada data yang dapat ditampilkan
                              </center>
                            </td>
                          </tr>
                        )}
                        {radiologyData.data.map(
                          /** @param {import("interfaces/radiology").Radiology} radiology */
                          (radiology, key) => {
                            return (
                              <HoverBorderedTrBg
                                key={`data-table-${key}`}
                                dynamicBg={dynamicRowBg(radiology.status)}
                              >
                                <td className="align-middle text-gray-700">
                                  {radiology.unique_id}
                                </td>
                                <td className="align-middle text-gray-700">
                                  {radiology.created_at}
                                </td>
                                <td className="align-middle text-gray-700">
                                  <div className="d-flex align-items-center">
                                    <span className="me-3">
                                      {radiology.info}
                                    </span>
                                    {!radiology.is_read_doc && (
                                      <WarningExclamationIcon />
                                    )}
                                  </div>
                                </td>
                                <td className="align-middle text-gray-700">
                                  {radiology.created_by}
                                </td>
                                <td className="align-middle text-gray-700">
                                  {radiology.status === "waiting" && (
                                    <WarningClockIcon />
                                  )}
                                  {radiology.status === "progress" && (
                                    <BlueGlassIcon />
                                  )}
                                  {radiology.status === "fixing" && (
                                    <WarningPencilIcon />
                                  )}
                                  {radiology.status === "done" && (
                                    <PrimaryChecklistIcon />
                                  )}
                                  {radiology.status === "cancel" && (
                                    <CancelIcon />
                                  )}
                                </td>
                                <td className="align-middle text-gray-700">
                                  {radiology.updated_at ?? "-"}
                                </td>
                                <td className="align-middle text-gray-700">
                                  <div className="d-flex">
                                    <UpdateStatusButton
                                      id={radiology.id}
                                      currentStatus={radiology.status}
                                      disabled={
                                        ["done", "cancel"].includes(
                                          radiology.status
                                        ) || radiology.allow === 0
                                      }
                                    />
                                    <ButtonLightStyled
                                      onClick={() =>
                                        navigate(
                                          location.pathname +
                                            "/" +
                                            `${radiology.id}`
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
                    data={radiologyData}
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
 * Tombol untuk mengupdate status radiologi
 * @param {{
 * id: Number
 * currentStatus: String
 * disabled: Boolean
 * }}
 * @returns
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
      {location.pathname.includes(`/radiology/${id}/status/${status}`) && (
        <UpdateModal
          url={`/visit/radiology/${id}/update-status`}
          data={{ status: status }}
          query={`visit-${visitId}-radiology`}
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
          className="btn btn-icon btn-light-warning me-2"
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
