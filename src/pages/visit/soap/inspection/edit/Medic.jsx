import { ReactComponent as GrayPencilIcon } from "assets/icons/gray-pencil-2.svg"
import { ReactComponent as PrimaryArrowLeftIcon } from "assets/icons/primary-arrow-left.svg"
import { ReactComponent as PrimaryPasteIcon } from "assets/icons/primary-paste.svg"
import { ReactComponent as PurpleExclamationIcon } from "assets/icons/purple-exclamation.svg"
import { ReactComponent as DangerDownloadIcon } from "assets/icons/danger-download.svg"
import { ReactComponent as TripleDotIcon } from "assets/icons/triple-dot.svg"
import { ReactComponent as DropdownChecklistIcon } from "assets/icons/dropdown-checklist.svg"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import InputAppendNumber from "components/FormBuiler/InputAppendNumber"
import InputAppendText from "components/FormBuiler/InputAppendText"
import InputRencanaTindakLanjut from "components/FormBuiler/InputRencanaTindakLanjut"
import InputText from "components/FormBuiler/InputText"
import InputTextArea from "components/FormBuiler/InputTextArea"
import { useFormik } from "formik"
import useBreadcrumb from "hooks/useBreadcrumb"
import { DateTime } from "luxon"
import DetailPatient from "pages/visit/ButtonDetailPatient"
import { useEffect, useRef, useState } from "react"
import { Accordion, Dropdown, Overlay } from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQuery, useQueryClient } from "react-query"
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router"
import { AccordionWhite, FloatingActionButton } from "../../assessment/Edit"
import {
  initialValues as baseInitialValues,
  validationSchema,
} from "../create/Medic"
import DetailAuthor from "../DetailAuthor"
import { AssessmentTypeLabel } from "../Index"
import useCheckPermission from "hooks/useCheckPermission"
import useOnClickOutside from "hooks/useOnClickOutside"
import UpdateModal from "components/table/UpdateModal"
import { DropdownItemStyled } from "pages/visit/DetailPatient"
import { localeStatus } from "helpers/helper"

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

export default function Medic() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { id: visitId, inspectionId } = useParams()
  const [initialValues, setInitialValues] = useState(baseInitialValues)
  const [submitStatus, setSubmitStatus] = useState({
    status: "",
    message: "",
  })

  /** Menambahkan permission */
  const { user: loggedUser } = useOutletContext()
  useCheckPermission(loggedUser, "ubah assesment hasil terintegrasi")

  /**
   * Mengupdate skema menu breadcrumb
   */
  const [breadCrumbJson, setBreadCrumbJson] = useState(initialBreadCrumbJson)
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
          path: `/visit/${visitId}/soap/inspection/`,
        },
        {
          text: "Detail",
          path: null,
        },
      ],
    })
  }, [])
  useBreadcrumb(breadCrumbJson)

  /**
   * Mengambil data detail hasil terintegrasi
   */
  const { data: inspectionData, status: inspectionStatus } = useQuery(
    `visit-integration-result-${inspectionId}-edit`,
    async () =>
      axios
        .get(`/visit/integration-result/${inspectionId}/edit`)
        .then((res) => res.data)
  )
  useEffect(() => {
    if (inspectionData) {
      setInitialValues(inspectionData)
    }
  }, [inspectionData])

  /**
   * Menyimpan data hasil integrasi
   */
  const { mutate } = useMutation(async (data) =>
    axios
      .post(`/visit/integration-result/${inspectionId}/update`, data)
      .then((res) => res.data)
  )

  /**
   * Konfigurasi formik
   */
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true)
      mutate(
        {
          _method: "PATCH",
          ...values,
        },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries(
              `visit-${visitId}-integration-result-listing`
            )
            await queryClient.invalidateQueries(
              `visit-integration-result-${inspectionId}-edit`
            )
            setSubmitStatus({
              status: "success",
              message: "Data telah berhasil disimpan ke dalam basis data.",
            })
            setSubmitting(false)
          },
          onError: (err) => {
            switch (err.response.status) {
              case 422:
                formik.setErrors(err.response.data.errors)
                break

              default:
                setSubmitStatus({
                  status: "danger",
                  message:
                    "Maaf, sepertinya ada beberapa kesalahan yang terdeteksi, silakan coba lagi.",
                })
                break
            }
            setSubmitting(false)
          },
        }
      )
    },
  })

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
              navigate(-1)
            } else {
              setSubmitStatus({})
            }
          }}
          confirmBtnText="OK mengerti"
        >
          <div className="text-gray-600 mb-5">{submitStatus?.message}</div>
        </SweetAlert>
      )}
      <FloatingActionButton>
        <ButtonLightStyled
          onClick={() => formik.submitForm()}
          className="btn btn-icon btn-light-primary"
          disabled={formik.isSubmitting}
        >
          <PrimaryPasteIcon />
        </ButtonLightStyled>
        <ButtonLightStyled
          onClick={() => navigate(location.pathname + "/detail-author")}
          className="btn btn-icon btn-light-purple"
        >
          <PurpleExclamationIcon />
        </ButtonLightStyled>
        {inspectionStatus === "success" && (
          <DetailAuthor inspectionData={inspectionData} />
        )}
      </FloatingActionButton>
      {inspectionStatus === "success" && (
        <Toolbar inspectionData={inspectionData} />
      )}
      <div className="post d-flex flex-column-fluid pt-5 pt-lg-15" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          {inspectionStatus === "loading" && (
            <div className="d-flex flex-center min-h-400px">
              <PrimaryLoader />
            </div>
          )}
          {inspectionStatus === "error" && (
            <div className="d-flex flex-center min-h-400px">
              <ErrorMessage />
            </div>
          )}
          {inspectionStatus === "success" && (
            <>
              <AccordionWhite>
                <Accordion className="mb-5" defaultActiveKey="0">
                  <Accordion.Item className="bg-white mb-5" eventKey="0">
                    <Accordion.Header>
                      <div className="d-flex align-items-center">
                        <GrayPencilIcon className="me-3" />
                        <h5 className="text-gray-700 m-0 me-3">Subjective</h5>
                        <span
                          class="d-flex flex-center badge bg-light-primary text-primary"
                          style={{ height: "30px", width: "30px" }}
                        >
                          S
                        </span>
                      </div>
                      {formik.errors.keluhan && formik.submitCount !== 0 && (
                        <p
                          className="position-absolute text-danger mb-0"
                          style={{ right: "70px" }}
                        >
                          Ada kolom yang belum diisi di group ini
                        </p>
                      )}
                    </Accordion.Header>
                    <Accordion.Body>
                      <InputTextArea
                        formik={formik}
                        item={{ name: "keluhan", label: "keluhan" }}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item className="bg-white mb-5" eventKey="1">
                    <Accordion.Header>
                      <div className="d-flex align-items-center">
                        <GrayPencilIcon className="me-3" />
                        <h5 className="text-gray-700 m-0 me-3">Objective</h5>
                        <span
                          class="d-flex flex-center badge bg-light-primary text-primary"
                          style={{ height: "30px", width: "30px" }}
                        >
                          O
                        </span>
                      </div>
                      {Object.keys(initialValues).filter((keyName) =>
                        Object.keys(formik.errors).includes(keyName)
                      ).length !== 0 &&
                        formik.submitCount !== 0 && (
                          <p
                            className="position-absolute text-danger mb-0"
                            style={{ right: "70px" }}
                          >
                            Ada kolom yang belum diisi di group ini
                          </p>
                        )}
                    </Accordion.Header>
                    <Accordion.Body>
                      <InputAppendText
                        formik={formik}
                        item={{
                          name: "tekanan_darah",
                          label: "Tekanan Darah",
                          info: "mmHg",
                        }}
                      />
                      <InputAppendText
                        formik={formik}
                        item={{
                          name: "frekuensi_nadi",
                          label: "Frekuensi Nadi",
                          info: "X/menit",
                        }}
                      />
                      <InputAppendText
                        formik={formik}
                        item={{
                          name: "frekuensi_napas",
                          label: "Frekuensi Napas",
                          info: "X/menit",
                        }}
                      />
                      <InputText
                        formik={formik}
                        item={{
                          name: "keadaan_umum",
                          label: "Keadaan Umum",
                        }}
                      />
                      <InputAppendNumber
                        formik={formik}
                        item={{
                          name: "suhu_badan",
                          label: "Suhu Badan",
                          info: "°C",
                        }}
                      />
                      <InputAppendNumber
                        formik={formik}
                        item={{
                          name: "berat_badan",
                          label: "Berat Badan",
                          info: "g/kg",
                        }}
                      />
                      <InputAppendNumber
                        formik={formik}
                        item={{
                          name: "tinggi_badan",
                          label: "Tinggi Badan",
                          info: "cm",
                        }}
                      />
                      <InputText
                        formik={formik}
                        item={{
                          name: "tindakan_resusitasi",
                          label: "Tindakan Resusitasi",
                        }}
                      />
                      <InputAppendNumber
                        formik={formik}
                        item={{
                          name: "gds",
                          label: "GDS",
                          info: "mg/dl",
                        }}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item className="bg-white mb-5" eventKey="2">
                    <Accordion.Header>
                      <div className="d-flex align-items-center">
                        <GrayPencilIcon className="me-3" />
                        <h5 className="text-gray-700 m-0 me-3">Assesmen</h5>
                        <span
                          class="d-flex flex-center badge bg-light-primary text-primary"
                          style={{ height: "30px", width: "30px" }}
                        >
                          A
                        </span>
                      </div>
                      {formik.errors.diagnosis_kerja &&
                        formik.submitCount !== 0 && (
                          <p
                            className="position-absolute text-danger mb-0"
                            style={{ right: "70px" }}
                          >
                            Ada kolom yang belum diisi di group ini
                          </p>
                        )}
                    </Accordion.Header>
                    <Accordion.Body>
                      <InputText
                        formik={formik}
                        item={{
                          name: "diagnosis_kerja",
                          label: "Diagnosis Kerja",
                        }}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item className="bg-white mb-5" eventKey="3">
                    <Accordion.Header>
                      <div className="d-flex align-items-center">
                        <GrayPencilIcon className="me-3" />
                        <h5 className="text-gray-700 m-0 me-3">Plan</h5>
                        <span
                          class="d-flex flex-center badge bg-light-primary text-primary"
                          style={{ height: "30px", width: "30px" }}
                        >
                          P
                        </span>
                      </div>
                      {formik.errors.implementasi && formik.submitCount !== 0 && (
                        <p
                          className="position-absolute text-danger mb-0"
                          style={{ right: "70px" }}
                        >
                          Ada kolom yang belum diisi di group ini
                        </p>
                      )}
                    </Accordion.Header>
                    <Accordion.Body>
                      <InputTextArea
                        formik={formik}
                        item={{
                          name: "rencana_terapi",
                          label: "Rencana Terapi",
                        }}
                      />
                      <InputRencanaTindakLanjut
                        formik={formik}
                        item={{
                          label: "Rencacna Tindak Lanjut",
                          name: "rencana_tindak_lanjut",
                          rules: "required",
                        }}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </AccordionWhite>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  onClick={() => formik.submitForm()}
                  className="btn btn-primary mb-5"
                  disabled={formik.isSubmitting}
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
            </>
          )}
        </div>
      </div>
    </>
  )
}

/**
 * Komponen toolbar edit hasil terintegrasi keperawatan
 * @param {{
 * inspectionData: Object
 * }}
 * @returns
 */
function Toolbar({ inspectionData }) {
  const navigate = useNavigate()

  return (
    <>
      <div className="toolbar mt-n2 mt-md-n3 mt-lg-0" id="kt_toolbar">
        <div className="container-fluid">
          <div className="row justify-content-between">
            <div className="col-sm-9 d-flex flex-wrap align-items-center mb-5 mb-sm-0">
              <ButtonLightStyled
                onClick={() => navigate(-1)}
                className="btn btn-icon btn-light-primary flex-shrink-0 me-8 my-1"
              >
                <PrimaryArrowLeftIcon />
              </ButtonLightStyled>
              <h3 className="m-0 me-3">Detail</h3>
              <span class="badge px-4 py-2 bg-light-info text-info me-3 my-1">
                {inspectionData.created_at}
              </span>
              <div className="mb-n1">
                <AssessmentTypeLabel type={inspectionData.name} />
              </div>
              <span class="badge px-4 py-2 bg-light-purple text-purple my-1">
                Medis
              </span>
            </div>
            <div className="col-sm-3 d-flex justify-content-start justify-content-sm-end">
              <div className="my-2 d-flex">
                <DownloadPDFButton />
                <UpdateInspectionStatusButton currentStatus={inspectionData.status} />
                <div className="me-n4">
                  <DetailPatient />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function DownloadPDFButton() {
  const { inspectionId } = useParams()

  /**
   * Mendownload file pdf
   */
  const { isFetching: pdfIsFetching, refetch: pdfRefetch } = useQuery(
    "downloadPDF",
    async () =>
      axios
        .get(`/visit/integration-result/${inspectionId}/print-pdf`, {
          responseType: "blob",
        })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", `Hasil pemeriksaan rawat jalan terintegrasi.pdf`)
          document.body.appendChild(link)
          link.click()

          return res.data
        }),
    {
      enabled: false,
    }
  )

  return <ButtonLightStyled
    onClick={() => pdfRefetch()}
    className="btn btn-icon btn-light-danger me-3"
    disabled={pdfIsFetching}
  >
    <DangerDownloadIcon />
  </ButtonLightStyled>
}

/**
 * Komponen tombol untuk mengupdate status hasil terintegrasi
 * @param {{
 * disabled: Boolean
 * currentStatus: String
 * }}
 * @returns
 */
export function UpdateInspectionStatusButton({ disabled, currentStatus }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { id: visitId, inspectionId, status } = useParams()
  const [show, setShow] = useState(false)
  const overlayContainerRef = useRef()
  const overlayTargetRef = useRef()
  useOnClickOutside(overlayContainerRef, () => setShow(false))

  return (
    <>
      {location.pathname.includes(`/status/${status}`) && (
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
          className="btn btn-icon btn-light-warning me-3"
        >
          <TripleDotIcon />
        </ButtonLightStyled>
        <Overlay
          show={show}
          target={overlayTargetRef.current}
          container={overlayContainerRef.current}
          placement="bottom-end"
        >
          <Dropdown.Menu className="w-200px py-5" show={true}>
            <DropdownItemStyled>
              <Dropdown.Item
                active={currentStatus === "progress"}
                className="d-flex align-items-center px-5 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(`status/progress`)
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
                  navigate(`status/done`)
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
                  navigate(`status/cancel`)
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