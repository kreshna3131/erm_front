import React from "react"
import * as Yup from "yup"
import { useFormik } from "formik"
import { useState } from "react"
import clsx from "clsx"
import axios from "axios"
import { Link } from "react-router-dom"

/**
 * Skema validasi lupa password untuk formik
 */
const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Format email tidak valid")
    .min(3, "Email minmal berisi 3 karakter")
    .max(255, "Email maksimum berisi 255 karakter")
    .required("Email harus diisi"),
})

/**
 * Skema data awal untuk formik
 */
const initialValues = {
  email: "",
}

/**
 * Komponen utama halaman lupa password
 */
export default function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState(null)

  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      setSubmitting(true)
      axios
        .post("send-reset-link", {
          email: values.email,
        })
        .then(() => {
          setInfo({
            type: "success",
            message:
              "Kami sudah mengirim surel yang berisi tautan untuk mereset kata sandi Anda!",
          })
          setSubmitting(false)
          setLoading(false)
        })
        .catch((error) => {
          setInfo({
            type: "danger",
            message: "Tautan reset kata sandi gagal dikirim!",
          })
          setSubmitting(false)
          setLoading(false)
        })
    },
  })

  return (
    <form
      className="form w-100"
      onSubmit={formik.handleSubmit}
      noValidate
      id="kt_login_signin_form"
    >
      <div className="text-center mb-8">
        <h1 className="text-dark mb-3">Forgot Password</h1>
        <p className="fs-6 text-gray-600 w-lg-350px m-auto mb-4">
          Masukkan alamat email Anda pada form di bawah untuk meminta tautan
          reset password.
        </p>
        {info && (
          <div
            className={`alert alert-${info.type} text-${info.type} border-0`}
            role="alert"
          >
            {info.message}
          </div>
        )}
      </div>
      <div className="mb-8">
        <label className="form-label fs-6 fw-medium text-gray-700">Email</label>
        <input
          {...formik.getFieldProps("email")}
          className={clsx(
            "form-control form-control-solid",
            { "is-invalid": formik.touched.email && formik.errors.email },
            {
              "is-valid": formik.touched.email && !formik.errors.email,
            }
          )}
          type="email"
          name="email"
          autoComplete="off"
        />
      </div>
      <div className="text-center mb-8">
        <button
          type="submit"
          id="kt_sign_in_submit"
          className="btn btn-primary w-100 mb-5"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && (
            <span className="indicator-label fw-medium">Submit</span>
          )}
          {loading && (
            <span className="indicator-progress" style={{ display: "block" }}>
              Please wait...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
      <p className="fs-6 text-gray-600 text-center mb-0">
        Sudah ingat? <Link to="/">Login</Link>
      </p>
    </form>
  )
}
