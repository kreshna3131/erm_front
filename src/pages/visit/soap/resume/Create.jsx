import "assets/css/flatpickr.css"
import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"
import axios from "axios"
import { FormikSubmitButton } from "components/Button"
import { TextareaLimit } from "components/TextArea"
import { Indonesian } from "flatpickr/dist/l10n/id"
import { useFormik } from "formik"
import { dynamicFormControlClass } from "helpers/formik-helper"
import { useState } from "react"
import { Modal } from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import Flatpickr from "react-flatpickr"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useOutletContext, useParams } from "react-router"
import * as Yup from "yup"
import {
  DateWarningValidation,
  DateSuccessValidation,
} from "../inspection/Create"

/**
 * Skema validasi untuk formik
 */
export const validationSchema = Yup.object().shape({
  resume_date: Yup.string().required("Kolom ini harus diisi"),
  resume_time: Yup.string().required("Kolom ini harus diisi"),
  diagnosis: Yup.string().required("Kolom ini harus diisi"),
  terapi: Yup.string().required("Kolom ini harus diisi"),
  riwayat_tindakan: Yup.string().required("Kolom ini harus diisi"),
})

/**
 * Komponen utama halaman create resume
 */
export default function Create() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id: visitId, soapId } = useParams()
  const [submitStatus, setSubmitStatus] = useState({})
  const [initialValues, setInitialValues] = useState({
    resume_date: "",
    resume_time: "",
    diagnosis: "",
    terapi: "",
    riwayat_tindakan: "",
  })

  /**
   * Mengambil data user yang login
   */
  const { user } = useOutletContext()

  /**
   * Mengambil data soap
   */
  const { data: soapData } = useQuery(
    `visit-${visitId}-soap-${soapId}-edit`,
    async () =>
      axios.get(`/visit/${visitId}/soap/${soapId}/edit`).then((res) => res.data)
  )

  /**
   * Menyimpan data resume
   */
  const { mutate } = useMutation(async (data) =>
    axios
      .post(`/visit/${visitId}/soap/${soapId}/adult/resume/create`, data)
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
      mutate(values, {
        onSuccess: function () {
          setSubmitStatus({
            status: "success",
            message: "Data telah berhasil disimpan ke dalam basis data.",
          })
          setSubmitting(false)
          queryClient.invalidateQueries(
            `visit-${visitId}-soap-${soapId}-adult-resume-listing`
          )
        },
        onError: function () {
          setSubmitStatus({
            status: "danger",
            message:
              "Maaf, sepertinya ada beberapa kesalahan yang terdeteksi, silakan coba lagi.",
          })
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
      <Modal dialogClassName="mw-600px" show="true" animation={false}>
        <Modal.Header>
          <div className="d-flex align-items-center">
            <Modal.Title as="h3" className="me-3">
              Tambah
            </Modal.Title>
            <small className="text-gray-500 fs-6 fw-light me-3">
              SOAP {soapData?.soap_number}
            </small>
            <span class="badge px-4 py-2 bg-light-primary text-primary me-2">
              Umum Dewasa
            </span>
          </div>
          <GrayCrossIcon
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </Modal.Header>

        <Modal.Body>
          <form
            className="form w-100"
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <div className="row align-items-center mb-4">
              <label
                htmlFor="resume_date"
                className="col-sm-4 text-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0"
              >
                Tanggal pemeriksaan
              </label>
              <div className="col-sm-8">
                <div className="row align-items-center">
                  <div className="col-sm-6">
                    <div className="position-relative">
                      <Flatpickr
                        options={{
                          mode: "single",
                          enableTime: false,
                          dateFormat: "d/M/Y",
                          maxDate: new Date(),
                          locale: Indonesian,
                        }}
                        onClose={() => formik.setFieldTouched("resume_date")}
                        onChange={(date) => {
                          formik.setFieldValue("resume_date", date[0])
                          formik.setFieldTouched("resume_date")
                        }}
                        className="form-control form-control-solid"
                        value={formik.values.resume_date}
                        name="resume_date"
                      />
                      <span
                        role="button"
                        className="position-absolute"
                        style={{ right: "20px", top: "11px" }}
                        onClick={() => {
                          formik.setFieldValue("resume_date", "")
                          if (formik.values.resume_date === "") {
                            formik.setFieldTouched("resume_date")
                          }
                        }}
                      >
                        <GrayCrossIcon />
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="position-relative">
                      <Flatpickr
                        options={{
                          mode: "time",
                          locale: Indonesian,
                        }}
                        onClose={() => formik.setFieldTouched("resume_time")}
                        onChange={(date) => {
                          formik.setFieldValue("resume_time", date[0])
                          formik.setFieldTouched("resume_time")
                        }}
                        className="form-control form-control-solid"
                        value={formik.values.resume_time}
                        name="resume_time"
                      />
                      <span
                        role="button"
                        className="position-absolute"
                        style={{ right: "20px", top: "11px" }}
                        onClick={() => {
                          formik.setFieldValue("resume_time", "")
                          if (formik.values.resume_time === "") {
                            formik.setFieldTouched("resume_time")
                          }
                        }}
                      >
                        <GrayCrossIcon />
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-2">
                    {(formik.errors.resume_date || formik.errors.resume_time) &&
                      (formik.touched.resume_date ||
                        formik.touched.resume_time) && (
                        <DateWarningValidation />
                      )}
                    {!formik.errors.resume_date &&
                      !formik.errors.resume_time &&
                      (formik.touched.resume_date ||
                        formik.touched.resume_time) && (
                        <DateSuccessValidation />
                      )}
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <label
                htmlFor="doctor"
                className="col-sm-4 form-label fs-6 text-end fw-medium text-gray-700 mt-sm-3 mt-0"
              >
                Dokter
              </label>
              <div className="col-sm-8">
                <input
                  value={user?.name}
                  id="doctor"
                  className="form-control form-control-solid cursor-not-allowed"
                  autoComplete="off"
                  disabled={true}
                />
              </div>
            </div>
            <div className="row mb-4">
              <label
                htmlFor="diagnosis"
                className="col-sm-4 form-label fs-6 text-end fw-medium text-gray-700 mt-sm-3 mt-0"
              >
                Diagnosis
              </label>
              <div className="col-sm-8">
                <textarea
                  {...formik.getFieldProps("diagnosis")}
                  id="diagnosis"
                  className={dynamicFormControlClass(formik, "diagnosis")}
                  rows={3}
                  autoComplete="off"
                  maxLength={200}
                ></textarea>
                <TextareaLimit
                  currentCharacter={formik.values.diagnosis}
                  maxCharacter={200}
                />
              </div>
            </div>
            <div className="row mb-4">
              <label
                htmlFor="terapi"
                className="col-sm-4 form-label fs-6 text-end fw-medium text-gray-700 mt-sm-3 mt-0"
              >
                Terapi saat ini
              </label>
              <div className="col-sm-8">
                <textarea
                  {...formik.getFieldProps("terapi")}
                  id="terapi"
                  className={dynamicFormControlClass(formik, "terapi")}
                  rows={3}
                  autoComplete="off"
                  maxLength={200}
                ></textarea>
                <TextareaLimit
                  currentCharacter={formik.values.terapi}
                  maxCharacter={200}
                />
              </div>
            </div>
            <div className="row mb-4">
              <label
                htmlFor="riwayat_tindakan"
                className="col-sm-4 form-label fs-6 text-end fw-medium text-gray-700 mt-sm-3 mt-0"
              >
                Riwayat tindakan atau OP rawat inap
              </label>
              <div className="col-sm-8">
                <textarea
                  {...formik.getFieldProps("riwayat_tindakan")}
                  id="riwayat_tindakan"
                  className={dynamicFormControlClass(
                    formik,
                    "riwayat_tindakan"
                  )}
                  rows={3}
                  autoComplete="off"
                  maxLength={200}
                ></textarea>
                <TextareaLimit
                  currentCharacter={formik.values.riwayat_tindakan}
                  maxCharacter={200}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <FormikSubmitButton formik={formik} />
        </Modal.Footer>
      </Modal>
    </>
  )
}
