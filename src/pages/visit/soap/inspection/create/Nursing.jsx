import { ReactComponent as GrayPencilIcon } from "assets/icons/gray-pencil-2.svg"
import { ReactComponent as PrimaryArrowLeftIcon } from "assets/icons/primary-arrow-left.svg"
import { ReactComponent as PrimaryPasteIcon } from "assets/icons/primary-paste.svg"
import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import InputAppendNumber from "components/FormBuiler/InputAppendNumber"
import InputAppendText from "components/FormBuiler/InputAppendText"
import InputText from "components/FormBuiler/InputText"
import InputTextArea from "components/FormBuiler/InputTextArea"
import { useFormik } from "formik"
import useBreadcrumb from "hooks/useBreadcrumb"
import useCheckPermission from "hooks/useCheckPermission"
import { DateTime } from "luxon"
import DetailPatient from "pages/visit/ButtonDetailPatient"
import { useEffect, useState } from "react"
import { Accordion } from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQueryClient } from "react-query"
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router"
import styled from "styled-components"
import * as Yup from "yup"
import {
  AccordionWhite,
  FloatingActionButton as BaseFloatingActionButton,
} from "../../assessment/Edit"

export const FloatingActionButton = styled(BaseFloatingActionButton)`
  height: 43px;
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
 * Nilai awal formik
 */
export const initialValues = {
  integration: "keperawatan",
  keluhan: "",
  tekanan_darah: "",
  frekuensi_nadi: "",
  frekuensi_napas: "",
  keadaan_umum: "",
  berat_badan: "",
  tinggi_badan: "",
  tindakan_resusitasi: "",
  gds: "",
  kepala: "",
  diagnosis_keperawatan: "",
  implementasi: "",
}

/**
 * Validasi formik
 */
export const validationSchema = Yup.object().shape({
  integration: Yup.string().required(),
  keluhan: Yup.string().required(),
  tekanan_darah: Yup.string().required(),
  frekuensi_nadi: Yup.string().required(),
  frekuensi_napas: Yup.string().required(),
  keadaan_umum: Yup.string().required(),
  berat_badan: Yup.string().required(),
  tinggi_badan: Yup.string().required(),
  tindakan_resusitasi: Yup.string().required(),
  gds: Yup.string().required(),
  diagnosis_keperawatan: Yup.string().required(),
  implementasi: Yup.string().required(),
})

export default function Nursing() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { id: visitId } = useParams()
  const [submitStatus, setSubmitStatus] = useState({
    status: "",
    message: "",
  })

  /** Menambahkan permission */
  const { user: loggedUser } = useOutletContext()
  useCheckPermission(loggedUser, "tambah assesment hasil terintegrasi")

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
          text: "Tambah",
          path: null,
        },
      ],
    })
  }, [])
  useBreadcrumb(breadCrumbJson)

  /**
   * Menyimpan data hasil integrasi
   */
  const { mutate } = useMutation(async (data) =>
    axios
      .post(`/visit/${visitId}/integration-result/store`, data)
      .then((res) => res.data)
  )

  /**
   * Konfigurasi formik
   */
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true)
      mutate(values, {
        onSuccess: async () => {
          await queryClient.prefetchQuery(
            `visit-${visitId}-integration-result-listing`,
            async (key) =>
              axios
                .get(`/visit/${visitId}/integration-result/listing`)
                .then((res) => res.data)
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
      })
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
      </FloatingActionButton>
      <Toolbar />
      <div className="post d-flex flex-column-fluid pt-5 pt-lg-15" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
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
                  {formik.errors.diagnosis_keperawatan &&
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
                      name: "diagnosis_keperawatan",
                      label: "Diagnosis Keperawatan",
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
                      name: "implementasi",
                      label: "Implementasi",
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
        </div>
      </div>
    </>
  )
}

function Toolbar() {
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
              <h3 className="m-0 me-3">Tambah</h3>
              <span class="badge px-4 py-2 bg-light-info text-info me-3 my-1">
                {DateTime.now().toFormat("dd/MM/yyyy") +
                  " jam " +
                  DateTime.now().toFormat("hh.mm")}
              </span>
              <span class="badge px-4 py-2 bg-light-purple text-purple my-1">
                Keperawatan
              </span>
            </div>
            <div className="col-sm-3 d-flex justify-content-start justify-content-sm-end">
              <div className="my-2">
                <DetailPatient />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
