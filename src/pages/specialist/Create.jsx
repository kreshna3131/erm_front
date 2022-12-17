import axios from "axios"
import clsx from "clsx"
import { useFormik } from "formik"
import { useState } from "react"
import { Form, FormControl, FormGroup, FormLabel } from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQueryClient } from "react-query"
import { useOutletContext } from "react-router"
import * as Yup from "yup"

/**
 * Skema validasi tambah user untuk formik
 */
export const validationScheme = Yup.object().shape({
  name: Yup.string()
    .min(3, "Nama spesialis minimal berisi 3 karakter")
    .max(255, "Nama spesialis maksimum berisi 255 karakter")
    .required("Nama spesialis harus diisi"),
})

const initialValues = {
  name: "",
}

export default function Create() {
  const [submitStatus, setSubmitStatus] = useState({})
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const { allPermissions } = useOutletContext()

  const mutation = useMutation(
    async (data) => {
      setLoading(true)
      return axios.post("/specialist/store/", data).then((res) => res.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("specialist")
        setSubmitStatus({
          status: "success",
          message: "Data telah berhasil disimpan ke dalam basis data.",
        })
        setLoading(false)
        formik.setSubmitting(false)
        formik.resetForm()
      },
      onError: () => {
        setSubmitStatus({
          status: "danger",
          message:
            "Maaf, sepertinya ada beberapa kesalahan yang terdeteksi, silakan coba lagi.",
        })
        setLoading(false)
        formik.setSubmitting(false)
      },
    }
  )

  const formik = useFormik({
    initialValues,
    validationSchema: validationScheme,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true)
      setSubmitting(true)
      mutation.mutate({
        name: values.name,
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
            setSubmitStatus({})
          }}
          confirmBtnText="OK mengerti"
        >
          <div className="text-gray-600 mb-5">{submitStatus?.message}</div>
        </SweetAlert>
      )}
      <form
        className="form w-100 mb-4"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="card">
          <div className="card-body p-7">
            <h1 className="text-dark">Tambah Spesialis</h1>
            <p className="text-gray-600 mb-8">
              Gunakan form di bawah untuk menambahkan data spesialis baru.
            </p>
            <FormGroup className="mb-8">
              <FormLabel
                htmlFor="create_name"
                className="form-label fs-6 fw-medium text-gray-700"
              >
                Nama Spesialis
              </FormLabel>
              <FormControl
                id="create_name"
                {...formik.getFieldProps("name")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid": formik.touched.name && formik.errors.name,
                  },
                  {
                    "is-valid": formik.touched.name && !formik.errors.name,
                  }
                )}
                type="text"
                name="name"
                autoComplete="off"
              />
              {formik.touched.name && formik.errors.name && (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.name}
                </Form.Control.Feedback>
              )}
            </FormGroup>
            <button
              type="submit"
              className="btn w-100 btn-primary mb-5"
              disabled={
                formik.isSubmitting ||
                !formik.isValid ||
                !allPermissions.includes("tambah spesialis")
              }
            >
              {!loading && (
                <span className="indicator-label fw-medium">Simpan</span>
              )}
              {loading && (
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
      </form>
    </>
  )
}
