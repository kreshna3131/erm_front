import "assets/css/flatpickr.css"
import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"
import axios from "axios"
import { FormikSubmitButton } from "components/Button"
import { TextareaLimit } from "components/TextArea"
import { Indonesian } from "flatpickr/dist/l10n/id"
import { useFormik } from "formik"
import { dynamicFormControlClass } from "helpers/formik-helper"
import { useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import Flatpickr from "react-flatpickr"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useOutletContext, useParams } from "react-router"
import styled from "styled-components"
import * as Yup from "yup"

export const DateWarningValidation = styled.div`
  height: 1.5rem;
  width: 1.5rem;
  background-image: url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23cb003f%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23cb003f%27 stroke=%27none%27/%3e%3c/svg%3e");
  background-size: calc(0.75em + 0.75rem) calc(0.75em + 0.75rem);
`

export const DateSuccessValidation = styled.div`
  height: 1.5rem;
  width: 1.5rem;
  background-image: url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 8 8%27%3e%3cpath fill=%27%2375c44c%27 d=%27M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z%27/%3e%3c/svg%3e");
`

/**
 * Skema validasi untuk formik
 */
export const validationSchema = Yup.object().shape({
  test_date: Yup.string().required("Kolom ini harus diisi"),
  test_time: Yup.string().required("Kolom ini harus diisi"),
  test_result: Yup.string().required("Kolom ini harus diisi"),
  user_name: Yup.string().required("Kolom ini harus diisi"),
  user_role: Yup.string().required("Kolom ini harus diisi"),
})

/**
 * Komponen utama untuk halaman create inspection
 */
export default function Create() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id: visitId, soapId } = useParams()
  const [submitStatus, setSubmitStatus] = useState({})
  const [initialValues, setInitialValues] = useState({
    test_date: "",
    test_time: "",
    test_result: "",
  })

  /**
   * Mengambil data user yang login
   */
  const { user } = useOutletContext()

  /**
   * Mengupdate nilai inisial formik
   */
  useEffect(() => {
    if (user) {
      setInitialValues({
        ...initialValues,
        user_name: user.name,
        user_role: user.roles?.[0]?.name,
      })
    }
  }, [user])

  /**
   * Mengambil data soap
   */
  const { data: soapData } = useQuery(
    `visit-${visitId}-soap-${soapId}-edit`,
    async () =>
      axios.get(`/visit/${visitId}/soap/${soapId}/edit`).then((res) => res.data)
  )

  /**
   * Menyimpan data inspeksi
   */
  const { mutate } = useMutation(async (data) =>
    axios
      .post(`/visit/${visitId}/soap/${soapId}/adult/inspection/create`, data)
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
            `visit-${visitId}-soap-${soapId}-adult-inspection-listing`
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
                htmlFor="test_date"
                className="col-sm-4 text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0"
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
                        onClose={() => formik.setFieldTouched("test_date")}
                        onChange={(date) => {
                          formik.setFieldValue("test_date", date[0])
                          formik.setFieldTouched("test_date")
                        }}
                        className="form-control form-control-solid"
                        value={formik.values.test_date}
                        name="test_date"
                      />
                      <span
                        role="button"
                        className="position-absolute"
                        style={{ right: "20px", top: "11px" }}
                        onClick={() => {
                          formik.setFieldValue("test_date", "")
                          if (formik.values.test_time === "") {
                            formik.setFieldTouched("test_date")
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
                        onClose={() => formik.setFieldTouched("test_time")}
                        onChange={(date) => {
                          formik.setFieldValue("test_time", date[0])
                          formik.setFieldTouched("test_time")
                        }}
                        value={formik.values.test_time}
                        name="test_time"
                        className="form-control form-control-solid"
                      />
                      <span
                        role="button"
                        className="position-absolute"
                        style={{ right: "20px", top: "11px" }}
                        onClick={() => {
                          formik.setFieldValue("test_time", "")
                          if (formik.values.test_time === "") {
                            formik.setFieldTouched("test_time")
                          }
                        }}
                      >
                        <GrayCrossIcon />
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-2">
                    {(formik.errors.test_date || formik.errors.test_time) &&
                      (formik.touched.test_date ||
                        formik.touched.test_time) && <DateWarningValidation />}
                    {!formik.errors.test_date &&
                      !formik.errors.test_time &&
                      (formik.touched.test_date ||
                        formik.touched.test_time) && <DateSuccessValidation />}
                  </div>
                </div>
              </div>
            </div>
            <div className="row align-items-center mb-4">
              <label
                htmlFor="user_name"
                className="col-sm-4 text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0"
              >
                Dibuat oleh
              </label>
              <div className="col-sm-8">
                <input
                  id="user_name"
                  {...formik.getFieldProps("user_name")}
                  className="form-control form-control-solid cursor-not-allowed"
                  type="text"
                  name="user_name"
                  autoComplete="off"
                  disabled={true}
                />
              </div>
            </div>
            <div className="row align-items-center mb-4">
              <label
                htmlFor="user_role"
                className="col-sm-4 text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0"
              >
                Sebagai
              </label>
              <div className="col-sm-8">
                <input
                  id="user_role"
                  {...formik.getFieldProps("user_role")}
                  className="form-control form-control-solid cursor-not-allowed"
                  type="text"
                  name="user_role"
                  autoComplete="off"
                  disabled={true}
                />
              </div>
            </div>
            <div className="row mb-8">
              <label
                htmlFor="test_result"
                className="col-sm-4 form-label fs-6 text-sm-end fw-medium text-gray-700 mt-sm-3 mt-0"
              >
                Hasil pemeriksaan dan perkembangan
              </label>
              <div className="col-sm-8">
                <textarea
                  {...formik.getFieldProps("test_result")}
                  id="test_result"
                  className={dynamicFormControlClass(formik, "test_result")}
                  rows={3}
                  autoComplete="off"
                  maxLength={200}
                ></textarea>
                <TextareaLimit
                  currentCharacter={formik.values.test_result}
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
