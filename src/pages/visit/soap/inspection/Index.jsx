import { ReactComponent as DangerDownloadIcon } from "assets/icons/danger-download.svg"
import { ReactComponent as DropdownChecklistIcon } from "assets/icons/dropdown-checklist.svg"
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg"
import { ReactComponent as PrimaryArrowLeftIcon } from "assets/icons/primary-arrow-left.svg"
import { ReactComponent as PrimaryPencilIcon } from "assets/icons/primary-pencil.svg"
import { ReactComponent as SearchIcon } from "assets/icons/search.svg"
import { ReactComponent as TripleDotIcon } from "assets/icons/triple-dot.svg"
import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import { DropdownStatusStyled } from "components/Dropdown"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import { HoverBorderedTrBg } from "components/table/TableRow"
import UpdateModal from "components/table/UpdateModal"
import { useFormik } from "formik"
import { localeStatus } from "helpers/helper"
import { isTruncated, truncate } from "helpers/string-helper"
import useBreadcrumb from "hooks/useBreadcrumb"
import useOnClickOutside from "hooks/useOnClickOutside"
import _ from "lodash"
import { FloatingActionButton as BaseFloatingActionButton } from "pages/visit/Index"
import { useEffect, useRef, useState } from "react"
import { Dropdown, Overlay, OverlayTrigger, Tooltip } from "react-bootstrap"
import { useQuery } from "react-query"
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router"
import styled from "styled-components"
import * as Yup from "yup"
import DetailPatient from "../../ButtonDetailPatient"

const FloatingActionButton = styled(BaseFloatingActionButton)`
  margin-top: 30px;
  margin-bottom: 75px;

  @media (max-width: 768px) {
    margin-top: 25px;
    margin-bottom: 120px;
  }
`

/**
 * Skema awal menu breadcrumb
 */
const initialBreadCrumbJson = {
  title: "Pelayanan",
  items: [
    { text: "Kunjungan", path: "/visit" },
    {
      text: "Pelayanan",
      path: ``,
    },
    {
      text: "SOAP",
      path: ``,
    },
    {
      text: "Hasil Terintegrasi",
      path: null,
    },
  ],
}

/**
 * Komponen utama halaman inspection
 */
export default function Index() {
  const { id: visitId } = useParams()
  const navigate = useNavigate()
  const { allPermissions } = useOutletContext()
  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
  })
  const [breadCrumbJson, setBreadCrumbJson] = useState(initialBreadCrumbJson)

  /**
   * Mengupdate skema menu breadcrumb
   */
  useEffect(() => {
    setBreadCrumbJson({
      title: "Pelayanan",
      items: [
        { text: "Kunjungan", path: "/visit" },
        {
          text: "Pelayanan",
          path: `/visit/${visitId}/soap`,
        },
        {
          text: "SOAP",
          path: `/visit/${visitId}/soap`,
        },
        {
          text: "Hasil Terintegrasi",
          path: null,
        },
      ],
    })
  }, [])
  useBreadcrumb(breadCrumbJson)

  /**
   * Mengambil data inspeksi
   */
  const { data: inspectionData, status: inspectionStatus } = useQuery(
    [`visit-${visitId}-integration-result-listing`, filter],
    async (key) =>
      axios
        .get(`/visit/${visitId}/integration-result/listing`, {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
  )

  /**
   * Logic pencarian data inspeksi
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

  return (
    <>
      <Toolbar />
      <div className="post d-flex flex-column-fluid pt-5 pt-lg-15" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          <div className="card">
            <div className="card-header border-0 pt-6">
              <div className="card-toolbar">
                <CreateButton />
              </div>
              <div className="card-title">
                <div className="d-flex align-items-center position-relative my-1">
                  <span className="svg-icon svg-icon-1 position-absolute ms-4">
                    <SearchIcon />
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
            <div className="card-body">
              {inspectionStatus !== "success" && (
                <div className="d-flex flex-center min-h-400px">
                  {inspectionStatus === "loading" && <PrimaryLoader />}
                  {inspectionStatus === "error" && <ErrorMessage />}
                </div>
              )}
              {inspectionStatus === "success" && (
                <div className="position-relative">
                  <FloatingActionButton length={inspectionData.data.length}>
                    {inspectionData.data.map((data, key) => (
                      <ButtonLightStyled
                        disabled={
                          !allPermissions.includes(
                            "ubah assesment hasil terintegrasi"
                          )
                        }
                        key={key}
                        className="btn btn-light-primary btn-icon"
                        onClick={() => {
                          switch (data.integration) {
                            case "keperawatan":
                              navigate(`${data.id}/nursing`)
                              break

                            case "medis":
                              navigate(`${data.id}/medic`)

                            default:
                              break
                          }
                        }}
                      >
                        <PrimaryPencilIcon />
                      </ButtonLightStyled>
                    ))}
                  </FloatingActionButton>
                  <div className="table-responsive ms-20">
                    <table className="table" style={{ minWidth: "1200px" }}>
                      <TableHeading
                        filterProp={[filter, setFilter]}
                        columns={[
                          {
                            name: "created_at",
                            heading: "Tanggal pemeriksaan",
                            width: "15%",
                          },
                          {
                            name: "created_by",
                            heading: "Oleh",
                            width: "10%",
                          },
                          {
                            name: "created_role",
                            heading: "Sebagai",
                            width: "10%",
                          },
                          {
                            name: "assesment_name",
                            heading: "Assesmen",
                            width: "10%",
                          },
                          {
                            name: "info",
                            heading: "Kunjungan",
                            width: "10%",
                          },
                          {
                            name: "updated_at",
                            heading: "Terakhir diubah",
                            width: "10%",
                          },
                          {
                            name: "action",
                            heading: "Tindakan",
                            width: "5%",
                            sort: false,
                          },
                        ]}
                      />
                      <tbody>
                        {inspectionData.data.length === 0 && (
                          <tr>
                            <td className="py-10 align-middle" colSpan={7}>
                              <center className="text-gray-600">
                                Belum ada data yang dapat ditampilkan
                              </center>
                            </td>
                          </tr>
                        )}
                        {inspectionData.data.map(
                          /** @param {import("interfaces/inspection").Inspection} inspection */
                          (inspection, key) => {
                            const dynamicBg =
                              inspection.status === "done"
                                ? "#ecf7f6"
                                : inspection.status === "cancel"
                                ? "#fbebf0"
                                : ""
                            return (
                              <HoverBorderedTrBg
                                dynamicBg={dynamicBg}
                                key={`data-table-${key}`}
                              >
                                <td className="align-middle text-gray-700">
                                  {inspection.created_at}
                                </td>
                                <td className="align-middle text-gray-700">
                                  {inspection.created_by &&
                                  isTruncated(inspection.created_by, 20) ? (
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip id={`tooltip-${key}`}>
                                          {inspection.created_by}
                                        </Tooltip>
                                      }
                                    >
                                      <span>
                                        {truncate(inspection.created_by, 20)}
                                      </span>
                                    </OverlayTrigger>
                                  ) : (
                                    <>{inspection.created_by}</>
                                  )}
                                </td>
                                <td className="align-middle text-gray-700">
                                  {inspection.created_role}
                                </td>
                                <td className="align-middle text-gray-700">
                                  <AssessmentTypeLabel
                                    type={inspection.assesment_name}
                                  />
                                </td>
                                <td className="align-middle text-gray-700">
                                  {inspection.info === "Non Integrasi" ? (
                                    <div className="badge px-4 py-2 bg-light-success text-success me-2 mb-1">
                                      Non Integrasi
                                    </div>
                                  ) : (
                                    <>{inspection.info}</>
                                  )}
                                </td>
                                <td className="align-middle text-gray-700">
                                  {inspection.updated_at}
                                </td>
                                <td className="align-middle text-gray-700">
                                  <UpdateAssessmentStatusButton
                                    inspectionId={inspection.id}
                                    disabled={0}
                                    currentStatus={inspection.status}
                                  />
                                </td>
                              </HoverBorderedTrBg>
                            )
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                  <TableFooter
                    data={inspectionData}
                    filterProp={[filter, setFilter]}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Komponen toolbar halaman inspeksi
 */
function Toolbar() {
  const navigate = useNavigate()
  const { id: visitId } = useParams()

  /**
   * Mendownload file pdf
   */
  const { isFetching: pdfIsFetching, refetch: pdfRefetch } = useQuery(
    "downloadPDF",
    async () =>
      axios
        .get(`/visit/${visitId}/integration-result/print-pdf`, {
          responseType: "blob",
        })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute(
            "download",
            `Hasil pemeriksaan rawat jalan terintegrasi.pdf`
          )
          document.body.appendChild(link)
          link.click()

          return res.data
        }),
    {
      enabled: false,
    }
  )

  return (
    <>
      <div className="toolbar mt-n2 mt-md-n3 mt-lg-0" id="kt_toolbar">
        <div className="container-fluid">
          <div className="row justify-content-between">
            <div className="col-sm-6 d-flex align-items-center mb-5 mb-sm-0">
              <ButtonLightStyled
                onClick={() => navigate(-1)}
                className="btn btn-icon btn-light-primary flex-shrink-0 me-8"
              >
                <PrimaryArrowLeftIcon />
              </ButtonLightStyled>
              <div className="overflow-hidden">
                <h1 className="fs-3 mb-0 me-4 text-truncate">
                  Hasil Pemeriksaan Rawat Jalan Terintegerasi
                </h1>
              </div>
            </div>
            <div className="col-sm-6 d-flex justify-content-start justify-content-sm-end">
              <ButtonLightStyled
                onClick={() => pdfRefetch()}
                className="btn btn-icon btn-light-danger me-3"
                disabled={pdfIsFetching}
              >
                <DangerDownloadIcon />
              </ButtonLightStyled>
              <DetailPatient />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Komponen tombol buat hasil terintegrasi
 */
function CreateButton() {
  const navigate = useNavigate()
  const { allPermissions } = useOutletContext()
  const [showOverlay, setShowOverlay] = useState(false)
  const overlayTarget = useRef()
  const overlayContainer = useRef()
  useOnClickOutside(overlayContainer, () => setShowOverlay(false))

  const formik = useFormik({
    initialValues: {
      type: "",
    },
    validationSchema: Yup.object().shape({
      type: Yup.string().required(),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      navigate("create/" + values.type)
    },
  })

  return (
    <div className="position-relative" ref={overlayContainer}>
      <button
        disabled={
          !allPermissions.includes("tambah assesment hasil terintegrasi")
        }
        ref={overlayTarget}
        onClick={() => setShowOverlay(true)}
        to="create"
        type="button"
        className="btn btn-primary"
      >
        <PlusIcon />
        Tambah
      </button>
      <Overlay
        container={overlayContainer.current}
        show={showOverlay}
        target={overlayTarget.current}
        placement="bottom-start"
      >
        <div
          className="card shadow-sm w-350px"
          style={{
            zIndex: 10,
          }}
        >
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="m-0">Tambah hasil</h3>
            <span class="badge px-4 py-2 bg-light-success text-success">
              Non Integrasi
            </span>
          </div>
          <div className="card-body">
            {formik.errors.type && formik.submitCount > 0 && (
              <div className="text-danger rounded bg-light-danger p-3 mb-4">
                Anda wajib memilih salah satu
              </div>
            )}
            <div className="mb-2">
              <div className="form-check form-check-inline form-check-solid my-1">
                <input
                  className="form-check-input me-4"
                  id="nursing"
                  value="nursing"
                  type="radio"
                  name="type"
                  onChange={formik.handleChange}
                  checked={formik.values.type === "nursing"}
                />
                <label
                  htmlFor="nursing"
                  className="form-check-label text-gray-600"
                >
                  Assesmen Keperawatan
                </label>
              </div>
            </div>
            <div className="mb-8">
              <div className="form-check form-check-inline form-check-solid my-2">
                <input
                  className="form-check-input me-4"
                  id="medic"
                  value="medic"
                  type="radio"
                  name="type"
                  onChange={formik.handleChange}
                  checked={formik.values.type === "medic"}
                />
                <label
                  htmlFor="medic"
                  className="form-check-label text-gray-600"
                >
                  Assesmen Medis
                </label>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <button
                onClick={() => setShowOverlay(false)}
                className="btn btn-light me-3"
              >
                Batal
              </button>
              <button
                onClick={() => formik.submitForm()}
                className="btn btn-primary"
                disabled={formik.isSubmitting || !formik.isValid}
              >
                {!formik.isSubmitting && (
                  <span className="indicator-label fw-medium">Simpan</span>
                )}
                {formik.isSubmitting && (
                  <span
                    className="indicator-progress"
                    style={{ display: "block" }}
                  >
                    Please wait...
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </Overlay>
    </div>
  )
}

/**
 * Komponen tombol untuk mengupdate status soap
 * @param {{
 * id: Number
 * disabled: Boolean
 * currentStatus: String
 * }}
 * @returns
 */
function UpdateAssessmentStatusButton({
  inspectionId,
  disabled,
  currentStatus,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { allPermissions } = useOutletContext()
  const { id: visitId, status } = useParams()
  const [show, setShow] = useState(false)
  const overlayContainerRef = useRef()
  const overlayTargetRef = useRef()
  useOnClickOutside(overlayContainerRef, () => setShow(false))

  return (
    <>
      {location.pathname.includes(
        `/inspection/${inspectionId}/status/${status}`
      ) && (
        <UpdateModal
          url={`/visit/integration-result/${inspectionId}/update-status`}
          data={{ status: status }}
          query={`visit-${visitId}-integration-result-listing`}
          message={`
            Anda yakin ingin mengganti status pasien menjadi ${localeStatus(
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
          disabled={disabled}
          ref={overlayTargetRef}
          onClick={() => setShow(!show)}
          className="btn btn-icon btn-light-warning"
        >
          <TripleDotIcon />
        </ButtonLightStyled>
        <Overlay
          show={show}
          target={overlayTargetRef.current}
          container={overlayContainerRef.current}
          placement="left"
        >
          <Dropdown.Menu className="w-200px py-5" show={true}>
            <DropdownStatusStyled
              disabled={
                !allPermissions.includes("ubah assesment hasil terintegrasi")
              }
            >
              <Dropdown.Item
                active={currentStatus === "progress"}
                className="d-flex align-items-center px-5 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(`${inspectionId}/status/progress`)
                }}
              >
                <DropdownChecklistIcon className="me-4" />
                <span>Progress</span>
              </Dropdown.Item>
              <Dropdown.Item
                active={currentStatus === "done"}
                className="d-flex align-items-center px-5 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(`${inspectionId}/status/done`)
                }}
              >
                <DropdownChecklistIcon className="me-4" />
                <span>Selesai</span>
              </Dropdown.Item>
              <Dropdown.Item
                active={currentStatus === "cancel"}
                className="d-flex align-items-center px-5 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(`${inspectionId}/status/cancel`)
                }}
              >
                <DropdownChecklistIcon className="me-4" />
                <span>Batalkan</span>
              </Dropdown.Item>
            </DropdownStatusStyled>
          </Dropdown.Menu>
        </Overlay>
      </div>
    </>
  )
}

/**
 * Komponen label dinamik nama soap
 * @param {{
 * type: String
 * }}
 */
export function AssessmentTypeLabel({ type }) {
  let color = "primary"
  switch (type) {
    case "Covid":
      color = "danger"
      break

    case "Global":
      color = "warning"
      break

    case "Non Integrasi":
      color = "success"
      break

    default:
      color = "primary"
      break
  }

  return (
    <div
      className={`badge px-4 py-2 bg-light-${color} text-${color} me-2 mb-1`}
    >
      {type}
    </div>
  )
}
