import { ReactComponent as GrayPencilIcon } from "assets/icons/gray-pencil-2.svg"
import { ReactComponent as PrimaryArrowLeftIcon } from "assets/icons/primary-arrow-left.svg"
import { ReactComponent as PrimaryPencilIcon } from "assets/icons/primary-pencil.svg"
import { ReactComponent as SearchIcon } from "assets/icons/search.svg"
import { ReactComponent as WarningExclamationIcon } from "assets/icons/warning-exclamation.svg"
import { ReactComponent as PrimaryExclamationIcon } from "assets/icons/primary-exclamation.svg"
import { ReactComponent as TripleDotIcon } from "assets/icons/triple-dot.svg"
import { ReactComponent as DangerDownloadIcon } from "assets/icons/danger-download.svg"
import { ReactComponent as InfoPreviewIcon } from "assets/icons/info-preview.svg"
import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import { HoverBorderedTr } from "components/table/TableRow"
import { TextareaLimit } from "components/TextArea"
import { useFormik } from "formik"
import { dynamicFormControlClass } from "helpers/formik-helper"
import useBreadcrumb from "hooks/useBreadcrumb"
import _ from "lodash"
import { useEffect, useRef, useState } from "react"
import {
  Accordion,
  Overlay,
  OverlayTrigger,
  Tooltip,
  useAccordionButton,
} from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQuery, useQueryClient } from "react-query"
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router"
import { useSearchParams } from "react-router-dom"
import styled from "styled-components"
import * as Yup from "yup"
import DetailPatient from "../../ButtonDetailPatient"
import { DonwnlodPDFButton } from "../assessment/Index"
import Create from "./Create"
import Edit from "./Edit"
import useOnClickOutside from "hooks/useOnClickOutside"
import { DownloadSoapLabel } from "../Index"
import { isTruncated, truncate } from "helpers/string-helper"

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
      text: "Resume",
      path: null,
    },
  ],
}

/**
 * Styling accordion
 */
const AccordionWhite = styled.div`
  .accordion-button {
    background-color: white;
    border-bottom: 1px solid #eff2f5;

    &:not(.collapsed) {
      svg {
        path:not(.exception),
        rect:not(.exception),
        circle:not(.exception) {
          fill: #f79d25;
          transition: all 0.3s;
        }
      }

      &::after {
        background-image: url("data:image/svg+xml,<svg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23F79D25%27><path fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/></svg>");
      }
    }
  }
`
/**
 * Komponen utama untuk halaman resume
 */
export default function Index() {
  const { id: visitId, resumeId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
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
          text: "Resume",
          path: null,
        },
      ],
    })
  }, [])
  useBreadcrumb(breadCrumbJson)

  /**
   * Mengambil data resume
   */
  const { data: resumeData, status: resumeStatus } = useQuery(
    [`visit-${visitId}-resume-result-listing`, filter],
    async (key) =>
      axios
        .get(`/visit/${visitId}/resume-result/listing`, {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
  )

  /**
   * Logic pencarian resume
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
            <div className="card-header border-0 pt-6 position-relative">
              <div className="card-toolbar">
                {resumeData?.unfilled_action_count !== 0 ? (
                  <div className="d-flex align-items-center">
                    <WarningExclamationIcon className="me-3" />
                    <p className="text-gray-600 m-0">
                      {resumeData?.unfilled_action_count} Resume belum memiliki
                      tindakan
                    </p>
                  </div>
                ) : (
                  <div className="d-flex align-items-center">
                    <PrimaryExclamationIcon className="me-3" />
                    <p className="text-gray-600 m-0">
                      Semua resume sudah memiliki tindakan
                    </p>
                  </div>
                )}
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
              {resumeStatus !== "success" && (
                <div className="d-flex flex-center min-h-400px">
                  {[resumeStatus].includes("loading") && <PrimaryLoader />}
                  {[resumeStatus].includes("error") && <ErrorMessage />}
                </div>
              )}
              {resumeStatus === "success" && (
                <>
                  <div className="table-responsive">
                    <table className="table" style={{ minWidth: "1300px" }}>
                      <TableHeading
                        filterProp={[filter, setFilter]}
                        columns={[
                          {
                            name: "created_at",
                            heading: "Tanggal resume",
                            width: "15%",
                          },
                          {
                            name: "created_by",
                            heading: "Dokter",
                            width: "10%",
                          },
                          {
                            name: "assesment_name",
                            heading: "Assesmen",
                            width: "15%",
                          },
                          {
                            name: "info",
                            heading: "Kunjungan",
                            width: "20%",
                          },
                          {
                            name: "tindakan",
                            heading: "Tindakan",
                            width: "30%",
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
                        {resumeData?.data.length === 0 && (
                          <tr>
                            <td className="py-10 align-middle" colSpan={7}>
                              <center className="text-gray-600">
                                Belum ada data yang dapat ditampilkan
                              </center>
                            </td>
                          </tr>
                        )}
                        {resumeData?.data.map(
                          /** @param {import("interfaces/resume").Resume} resume */
                          (resume, key) => {
                            return (
                              <HoverBorderedTr key={`data-table-${key}`}>
                                <td className="align-middle text-gray-700">
                                  {resume.created_at}
                                </td>
                                <td className="align-middle text-gray-700">
                                  {resume.created_by}
                                </td>
                                <td className="align-middle text-gray-700">
                                  <span class="badge px-4 py-2 bg-light-primary text-primary me-2">
                                    {resume.assesment_name}
                                  </span>
                                </td>
                                <td className="align-middle text-gray-700">
                                  {resume.info}
                                </td>
                                <td className="align-middle text-gray-700">
                                  {resume.tindakan &&
                                  isTruncated(resume.tindakan, 100) ? (
                                    <OverlayTrigger
                                      placement="left"
                                      overlay={
                                        <Tooltip id={`tooltip-${key}`}>
                                          {resume.tindakan}
                                        </Tooltip>
                                      }
                                    >
                                      <span>
                                        {truncate(resume.tindakan, 100)}
                                      </span>
                                    </OverlayTrigger>
                                  ) : (
                                    <>{resume.tindakan}</>
                                  )}
                                </td>
                                <td className="align-middle text-gray-700">
                                  <ButtonLightStyled
                                    disabled={
                                      !allPermissions.includes(
                                        "ubah assesment hasil terintegrasi"
                                      )
                                    }
                                    className="btn btn-light-primary btn-icon"
                                    onClick={() => navigate(`${resume.id}`)}
                                  >
                                    <PrimaryPencilIcon />
                                  </ButtonLightStyled>
                                </td>
                              </HoverBorderedTr>
                            )
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                  <TableFooter
                    data={resumeData}
                    filterProp={[filter, setFilter]}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {location.pathname.includes("create") && <Create />}
      {resumeId && !location.pathname.includes("delete") && <Edit />}
    </>
  )
}

/**
 * Komponen untuk update riwayat alergi
 */
function UpdateAllergyHistory() {
  const queryClient = useQueryClient()
  const { id: visitId, soapId } = useParams()
  const [submitStatus, setSubmitStatus] = useState()
  const [initialValues, setInitialValues] = useState({
    riwayat_alergi: "",
  })

  /**
   * Mengambil data riwayat alergi
   */
  const allergyQuery = useQuery(
    `visit-${visitId}-soap-adult-allergy-edit`,
    async (key) =>
      axios
        .get(`visit/${visitId}/soap/adult/allergy/edit`)
        .then((res) => res.data),
    {
      onSuccess: function (res) {
        setInitialValues({
          riwayat_alergi: res.riwayat_alergi
            ? res.riwayat_alergi.toString()
            : "",
        })
      },
    }
  )

  /**
   * Konfigurasi formik
   */
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      riwayat_alergi: Yup.string().required("Kolom ini wajib untuk diisi"),
    }),
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true)
      mutate({
        _method: "PATCH",
        ...values,
      })
    },
  })

  /**
   * Menyimpan data riwayat alergi
   */
  const { mutate } = useMutation(
    async (data) =>
      axios.post(`/visit/${visitId}/soap/adult/allergy/update`, data),
    {
      onSuccess: function () {
        queryClient.invalidateQueries(
          `visit-${visitId}-soap-${soapId}-adult-resume-listing`
        )
        formik.setSubmitting(false)
        setSubmitStatus({
          status: "success",
          message: "Data telah berhasil disimpan ke dalam basis data.",
        })
      },
      onError: function () {
        formik.setSubmitting(false)
        setSubmitStatus({
          status: "danger",
          message:
            "Maaf, sepertinya ada beberapa kesalahan yang terdeteksi, silakan coba lagi.",
        })
      },
    }
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
            setSubmitStatus({})
          }}
          confirmBtnText="OK mengerti"
        >
          <div className="text-gray-600 mb-5">{submitStatus?.message}</div>
        </SweetAlert>
      )}
      <AccordionWhite>
        <Accordion className="mb-4" defaultActiveKey="1">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <div className="d-flex align-items-center">
                <GrayPencilIcon className="me-3" />
                <span className="fw-bold fs-5 text-gray-700 mb-0">
                  Riwayat Alergi
                </span>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              {allergyQuery.status === "loading" && (
                <p className="text-center text-gray-600 my-5">Loading...</p>
              )}
              {allergyQuery.status === "error" && (
                <p className="text-center text-gray-600 my-5">Error...</p>
              )}
              {allergyQuery.status === "success" && (
                <form onSubmit={formik.handleSubmit}>
                  <textarea
                    {...formik.getFieldProps("riwayat_alergi")}
                    rows={3}
                    className={dynamicFormControlClass(
                      formik,
                      "riwayat_alergi"
                    )}
                    maxLength={500}
                  ></textarea>
                  <TextareaLimit
                    currentCharacter={formik.values.riwayat_alergi}
                    maxCharacter={500}
                  />
                  <div className="d-flex justify-content-end">
                    <CloseAccordion>Batal</CloseAccordion>
                    <button
                      onClick={() => formik.submitForm()}
                      className="btn btn-primary"
                      disabled={formik.isSubmitting || !formik.isValid}
                    >
                      {!formik.isSubmitting && (
                        <span className="indicator-label fw-medium">
                          Simpan
                        </span>
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
                </form>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </AccordionWhite>
    </>
  )
}

/**
 * Tombol untuk menutup akordion
 * @param {{
 * children: *
 * eventkey: String
 * }}
 */
function CloseAccordion({ children, eventkey }) {
  const closeAccordion = useAccordionButton("1")

  return (
    <button
      type="button"
      className="btn btn-light me-5"
      onClick={closeAccordion}
    >
      {children}
    </button>
  )
}

/**
 * Komponen toolbar halaman resume
 */
function Toolbar() {
  const navigate = useNavigate()

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
                  Resume Rawat Jalan
                </h1>
              </div>
            </div>
            <div className="col-sm-6 d-flex justify-content-start justify-content-sm-end">
              <DownloadResultButton />
              <div className="me-n4">
                <DetailPatient />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Komponen tombol untuk mendownload / preview resume rawat jalan
 */
function DownloadResultButton() {
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
          .get(`/visit/${visitId}/resume-result/print-pdf`, {
            responseType: "blob",
          })
          .then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `Histori rekam medis SOAP.pdf`)
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
          .get(`/visit/${visitId}/resume-result/preview-pdf`, {
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
        placement="bottom-end"
      >
        <div className="card shadow-sm w-200px">
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
