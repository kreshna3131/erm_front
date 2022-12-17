import { ReactComponent as DangerDownloadIcon } from "assets/icons/danger-download.svg"
import { ReactComponent as DropdownChecklistIcon } from "assets/icons/dropdown-checklist.svg"
import { ReactComponent as ForbiddenIcon } from "assets/icons/forbidden.svg"
import { ReactComponent as PrimaryArrowLeftIcon } from "assets/icons/primary-arrow-left.svg"
import { ReactComponent as PrimaryMagnifyIcon } from "assets/icons/primary-magnify.svg"
import { ReactComponent as TripleDotIcon } from "assets/icons/triple-dot.svg"
import { ReactComponent as WhitePencilIcon } from "assets/icons/white-pencil.svg"
import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import UpdateModal from "components/table/UpdateModal"
import { localeStatus } from "helpers/helper"
import useBreadcrumb from "hooks/useBreadcrumb"
import useOnClickOutside from "hooks/useOnClickOutside"
import { useEffect, useRef, useState } from "react"
import { Dropdown, Overlay } from "react-bootstrap"
import { useQuery } from "react-query"
import { useLocation, useNavigate, useParams } from "react-router"
import DetailPatient from "../../ButtonDetailPatient"
import { DropdownItemStyled } from "../../DetailPatient"
import { AssessmentTypeLabel } from "../Index"

/**
 * Fungsi untuk mengambil route dinamik
 * berdasarkan tipe
 * @param {String} type
 * @param {subDocumentId} subDocumentId
 */
function dynamicRoute(type, subDocumentId) {
  switch (type) {
    case "inspection":
      return "inspection"

    case "resume":
      return "resume"

    default:
      return `sub-document/${subDocumentId}/edit`
  }
}

/**
 * Komponen utama untuk halaman assesment
 */
export default function Index() {
  const { id: visitId, soapId, documentId } = useParams()
  const navigate = useNavigate()
  const [breadCrumbJson, setBreadCrumbJson] = useState({
    title: "Pelayanan",
    items: [
      { text: "Kunjungan", path: "/visit" },
      {
        text: "Pelayanan",
        path: `/visit/${visitId}/soap`,
      },
      {
        text: "SOAP",
        path: `/visit/${visitId}/soap/${soapId}`,
      },
      {
        text: "Edit",
        path: null,
      },
    ],
  })

  /**
   * Mengambil data dokumen
   */
  const { data: documentData, status: documentStatus } = useQuery(
    `visit-${visitId}-soap-${soapId}-document-${documentId}-edit`,
    async () =>
      axios
        .get(`visit/${visitId}/soap/${soapId}/assesment/${documentId}/edit`)
        .then((res) => res.data)
  )

  /**
   * Mengupdate skema menu breacrumb
   */
  useEffect(() => {
    if (documentData) {
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
            path: `/visit/${visitId}/soap/${soapId}`,
          },
          {
            text: "Assesmen " + documentData.type,
            path: null,
          },
        ],
      })
    }
  }, [documentData])
  useBreadcrumb(breadCrumbJson)

  /**
   * Mengambil data sub-dokumen
   */
  const { data: subDocumentData, status: subDocumentStatus } = useQuery(
    `visit-${visitId}-soap-${soapId}-document-${documentId}-sub-document`,
    async () =>
      axios
        .get(
          `visit/${visitId}/soap/${soapId}/assesment/${documentId}/sub-dokumen`
        )
        .then((res) => res.data)
  )

  return (
    <>
      {documentStatus === "success" && <Toolbar documentData={documentData} />}
      <div className="post d-flex flex-column-fluid pt-5 pt-lg-15" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          {subDocumentStatus !== "success" && (
            <div className="d-flex flex-center min-h-400px">
              {subDocumentStatus === "loading" && (
                <PrimaryLoader className="min-h-450px" />
              )}
              {subDocumentStatus === "error" && (
                <ErrorMessage className="min-h-400px" />
              )}
            </div>
          )}
          {subDocumentStatus === "success" && (
            <div className="row">
              {subDocumentData.map(
                /** @param {import("interfaces/subDocument").subDocument} subDocument */
                (subDocument, key) => {
                  return (
                    <div className="col-xl-4 col-md-6" key={key}>
                      <div
                        className={`card mb-4 min-h-350px position-relative ${
                          [subDocument.visibility, subDocument.allow].includes(
                            0
                          ) && key === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <ForbiddenIcon
                          className="position-absolute w-100px h-100px"
                          style={{
                            right: "10px",
                          }}
                        />
                        <div className="card-body">
                          <div className="bullet d-flex flex-center rounded-circle bg-primary w-50px h-50px mb-10">
                            <span className="fs-3 text-white">{key + 1}</span>
                          </div>
                          <h1 className="fs-3 mb-5 min-h-50px">
                            {subDocument.name}
                          </h1>
                          <div className="min-h-150px">
                            <table className="w-100 mb-5">
                              <tbody>
                                <tr>
                                  <th className="text-gray-700 w-50">
                                    Bisa diisi oleh
                                  </th>
                                  <td className="text-gray-600 w-50">
                                    {subDocument.role}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-gray-700 w-50">
                                    Dibuat oleh
                                  </th>
                                  <td className="text-gray-600 w-50">
                                    {subDocument.created_by}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-gray-700 w-50">
                                    Terakhir diubah
                                  </th>
                                  <td className="text-gray-600 w-50">
                                    {subDocument.updated_at}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-gray-700 w-50">
                                    Diubah oleh
                                  </th>
                                  <td className="text-gray-600 w-50">
                                    {subDocument.updated_by}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="d-flex justify-content-end">
                            <button
                              onClick={() =>
                                navigate(
                                  dynamicRoute(subDocument.type, subDocument.id)
                                )
                              }
                              className={`btn btn-primary
                            ${
                              [
                                subDocument.visibility,
                                subDocument.allow,
                              ].includes(0)
                                ? "disabled"
                                : ""
                            }
                          `}
                            >
                              {subDocument.type === "assesment" ? (
                                <>
                                  <WhitePencilIcon className="me-3" />
                                  Ubah
                                </>
                              ) : (
                                <>
                                  <PrimaryMagnifyIcon className="me-3" />
                                  Detail
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/**
 * Komponen toolbar untuk halaman asesmen
 * @param {{documentData: Object}}
 */
function Toolbar({ documentData }) {
  const navigate = useNavigate()
  const overlayParent = useRef()
  const { id: visitId, soapId, documentId } = useParams()
  const downloadUrl = `visit/${visitId}/soap/${soapId}/assesment/${documentId}/printPdf`

  return (
    <div className="toolbar mt-n3 mt-lg-0" id="kt_toolbar">
      <div className="container-fluid">
        <div className="row justify-content-between">
          <div className="col-md-9 d-flex align-items-center my-3 my-md-0">
            <ButtonLightStyled
              onClick={() => navigate(-1)}
              className="btn btn-icon btn-light-primary flex-shrink-0 me-8"
            >
              <PrimaryArrowLeftIcon />
            </ButtonLightStyled>
            <div className="overflow-hidden">
              <h1 className="fs-3 mb-0 me-4 text-truncate">
                Assesmen {documentData.type}
              </h1>
            </div>
            <div className="mb-n1 me-2">
              <AssessmentTypeLabel type={documentData.type} />
            </div>
            <AssessmentStatus status={documentData.status} />
          </div>
          <div className="col-md-3 d-flex justify-content-start justify-content-md-end">
            <DonwnlodPDFButton type={documentData.type} url={downloadUrl} />
            <div ref={overlayParent} className="position-relative">
              <UpdateStatusButton
                disabled={documentData.allow === 0}
                currentStatus={documentData.status}
              />
            </div>
            <DetailPatient />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Komponen tombol untuk download pdf
 * @param {{type: String, url: String}}
 */
export function DonwnlodPDFButton({ type, url }) {
  /**
   * Mendownload file pdf
   */
  const { status: pdfStatus, refetch: pdfRefetch } = useQuery(
    "downloadPDF",
    async () =>
      axios
        .get(url, {
          responseType: "blob",
        })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", `Assesmen ${type}.pdf`)
          document.body.appendChild(link)
          link.click()

          return res.data
        }),
    {
      enabled: false,
    }
  )

  return (
    <ButtonLightStyled
      onClick={() => pdfRefetch()}
      className="btn btn-icon btn-light-danger me-3"
      disabled={pdfStatus === "loading"}
    >
      <DangerDownloadIcon />
    </ButtonLightStyled>
  )
}

/**
 * Komponen badge status
 * @param {{status: String}}
 */
function AssessmentStatus({ status }) {
  switch (status) {
    case "done":
      return (
        <div className={`badge px-4 py-2 bg-light-primary text-primary me-2`}>
          Selesai
        </div>
      )

    case "cancel":
      return (
        <div className={`badge px-4 py-2 bg-light-danger text-danger me-2`}>
          Batalkan
        </div>
      )

    default:
      return <></>
  }
}

/**
 * Komponen tombol untuk update status asesmen
 * @param {{disabled: Boolean, currentStatus: String}}
 */
function UpdateStatusButton({ disabled, currentStatus }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const { id: visitId, soapId, documentId, status } = useParams()
  const overlayTargetRef = useRef()
  const overlayContainerRef = useRef()
  useOnClickOutside(overlayContainerRef, () => setShow(false))

  return (
    <>
      {location.pathname.includes(`/document/${documentId}/status`) && (
        <UpdateModal
          url={`visit/${visitId}/soap/${soapId}/assesment/${documentId}/update-status`}
          data={{ status: status }}
          query={`visit-${visitId}-soap-${soapId}-document-${documentId}-edit`}
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
          className="btn btn-icon btn-light-warning me-3"
          onClick={() => setShow(!show)}
        >
          <TripleDotIcon />
        </ButtonLightStyled>
        <Overlay
          container={overlayContainerRef.current}
          target={overlayTargetRef.current}
          show={show}
          placement="bottom-end"
        >
          <Dropdown.Menu className="w-200px mt-2" show={true}>
            <DropdownItemStyled>
              <Dropdown.Item
                active={currentStatus === "progress"}
                className="d-flex align-items-center px-5 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate("status/progress/detail")
                }}
              >
                <DropdownChecklistIcon className="me-4" />
                <span>Progress</span>
              </Dropdown.Item>
            </DropdownItemStyled>
            <DropdownItemStyled>
              <Dropdown.Item
                active={currentStatus === "done"}
                className="d-flex align-items-center px-5 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate("status/done/detail")
                }}
              >
                <DropdownChecklistIcon className="me-4" />
                <span>Selesai</span>
              </Dropdown.Item>
            </DropdownItemStyled>
            <DropdownItemStyled>
              <Dropdown.Item
                active={currentStatus === "cancel"}
                className="d-flex align-items-center px-5 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate("status/cancel/detail")
                }}
              >
                <DropdownChecklistIcon className="me-4" />
                <span>Batalkan</span>
              </Dropdown.Item>
            </DropdownItemStyled>
          </Dropdown.Menu>
        </Overlay>
      </div>
    </>
  )
}
