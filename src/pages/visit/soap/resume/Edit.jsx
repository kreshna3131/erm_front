import "assets/css/flatpickr.css"
import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"
import axios from "axios"
import { FormikSubmitButton } from "components/Button"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import { TextareaLimit } from "components/TextArea"
import { useFormik } from "formik"
import { dynamicFormControlClass } from "helpers/formik-helper"
import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useParams } from "react-router"
import * as Yup from "yup"

const validationSchema = Yup.object().shape({
  tindakan: Yup.string().required(),
})

/**
 * Komponen utama untuk halaman edit resume
 */
export default function Edit() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id: visitId, soapId, resumeId } = useParams()
  const [submitStatus, setSubmitStatus] = useState({})
  const [initialValues, setInitialValues] = useState({
    tindakan: "",
  })

  /**
   * Mengambil data resume
   */
  const resumeQuery = useQuery(
    `visit-resume-result-${resumeId}-edit`,
    async () =>
      axios.get(`/visit/resume-result/${resumeId}/edit`).then((res) => res.data)
  )
  /** @type {import("interfaces/resume").Resume} */
  const resumeData = resumeQuery.data
  const resumeStatus = resumeQuery.status

  /**
   * Mengupdate nilai inisial formik
   */
  useEffect(() => {
    if (resumeStatus === "success") {
      setInitialValues({
        tindakan: resumeData.tindakan ?? "",
      })
    }
  }, [resumeStatus])

  /*
   * Menyimpan data resume
   */
  const { mutate } = useMutation((data) =>
    axios
      .post(`visit/resume-result/${resumeId}/update`, data)
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
            setSubmitStatus({
              status: "success",
              message: "Data telah berhasil disimpan ke dalam basis data.",
            })
            setSubmitting(false)
            queryClient.invalidateQueries(
              `visit-resume-result-${resumeId}-edit`
            )
            queryClient.invalidateQueries(
              `visit-${visitId}-resume-result-listing`
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
      <Modal dialogClassName="mw-700px" show="true" animation={false}>
        <Modal.Header>
          <div className="d-flex align-items-center">
            <Modal.Title as="h3" className="me-3">
              Tindakan
            </Modal.Title>
            <span class="badge px-4 py-2 bg-light-info text-info me-3 my-1">
              {DateTime.now().toFormat("dd/MM/yyyy") +
                " jam " +
                DateTime.now().toFormat("hh.mm")}
            </span>
            {resumeStatus === "success" && (
              <span class="badge px-4 py-2 bg-light-primary text-primary me-2">
                {resumeData.assesment_name}
              </span>
            )}
          </div>
          <GrayCrossIcon
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </Modal.Header>
        <Modal.Body className="p-10">
          {resumeStatus === "loading" && (
            <div className="d-flex flex-center min-h-350px">
              <PrimaryLoader />
            </div>
          )}
          {resumeStatus === "error" && (
            <div className="d-flex flex-center min-h-350px">
              <ErrorMessage />
            </div>
          )}
          {resumeStatus === "success" && (
            <form
              className="form w-100"
              onSubmit={formik.handleSubmit}
              noValidate
            >
              <textarea
                rows={5}
                className={dynamicFormControlClass(formik, "tindakan")}
                maxLength={255}
                {...formik.getFieldProps("tindakan")}
              ></textarea>
              <TextareaLimit currentCharacter={formik.values.tindakan} />
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
