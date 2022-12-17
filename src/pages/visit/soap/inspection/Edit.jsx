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
import { useNavigate, useParams } from "react-router"
import { validationSchema } from "./Create"
import { DateWarningValidation, DateSuccessValidation } from "./Create"

/**
 * Komponen utama untuk halaman edit inspection
 */
export default function Edit() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id: visitId, soapId, inspectionId } = useParams()
  const [submitStatus, setSubmitStatus] = useState({})
  const [initialValues, setInitialValues] = useState({
    test_date: "",
    test_time: "",
    test_result: "",
  })

  /**
   * Mengambil data inspeksi
   */
  const inspectionQuery = useQuery(
    `visit-soap-${soapId}-adult-inspection-edit-${inspectionId}`,
    async () =>
      axios
        .get(`visit/soap/${soapId}/adult/inspection/edit/${inspectionId}`)
        .then((res) => res.data)
  )
  /** @type {import("interfaces/inspection").Inspection} */
  const inspectionData = inspectionQuery.data
  const inspectionStatus = inspectionQuery.status

  /**
   * Mengupdate nilai inisial formik
   */
  useEffect(() => {
    if (inspectionStatus === "success") {
      setInitialValues({
        user_name: inspectionData.user_name,
        user_role: inspectionData.user_role,
        test_date: inspectionData.test_date,
        test_time: inspectionData.test_time,
        test_result: inspectionData.test_result,
      })
    }
  }, [inspectionStatus])

  /**
   * Menyimpan data inspeksi
   */
  const { mutate } = useMutation(async (data) =>
    axios
      .post(
        `/visit/soap/${soapId}/adult/inspection/update/${inspectionId}`,
        data
      )
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
          onSuccess: function () {
            queryClient.invalidateQueries(
              `visit-soap-${soapId}-adult-inspection-edit-${inspectionId}`
            )
            queryClient.invalidateQueries(
              `visit-${visitId}-soap-${soapId}-adult-inspection-listing`
            )
            setSubmitStatus({
              status: "success",
              message: "Data telah berhasil disimpan ke dalam basis data.",
            })
            setSubmitting(false)
          },
          onError: function () {
            setSubmitStatus({
              status: "danger",
              message:
                "Maaf, sepertinya ada beberapa kesalahan yang terdeteksi, silakan coba lagi.",
            })
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
      <Modal dialogClassName="mw-600px" show="true" animation={false}>
        <Modal.Header>
          <div className="d-flex align-items-center">
            <Modal.Title as="h3" className="me-3">
              Edit
            </Modal.Title>
            <small className="text-gray-500 fs-6 fw-light me-3">
              {inspectionData?.soap?.split(", ")[0]}
            </small>
            <span class="badge px-4 py-2 bg-light-primary text-primary me-2">
              {inspectionData?.soap?.split(", ")[1]}
            </span>
          </div>
          <GrayCrossIcon
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </Modal.Header>

        <Modal.Body>
          {inspectionStatus === "loading" && (
            <div className="d-flex flex-center min-h-350px">Loading...</div>
          )}
          {inspectionStatus === "error" && (
            <div className="d-flex flex-center min-h-350px">Error ...</div>
          )}
          {inspectionStatus === "success" && (
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
                          formik.touched.test_time) && (
                          <DateWarningValidation />
                        )}
                      {!formik.errors.test_date &&
                        !formik.errors.test_time &&
                        (formik.touched.test_date ||
                          formik.touched.test_time) && (
                          <DateSuccessValidation />
                        )}
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
              <div className="row mb-4">
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
          )}
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <FormikSubmitButton formik={formik} />
        </Modal.Footer>
      </Modal>
    </>
  )
}
