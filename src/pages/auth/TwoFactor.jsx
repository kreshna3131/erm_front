import React, { useState } from "react"
import * as Yup from "yup"
import { useFormik } from "formik"
import clsx from "clsx"
import axios from "axios"
import { dashboardUrl } from "../../config"

/**
 * Skema validasi two factor untuk formik
 */
const twoFactorSchema = Yup.object().shape({
  two_factor_code: Yup.string()
    .min(6, "Kode minmal berisi 6 karakter")
    .max(255, "Kode maksimum berisi 255 karakter")
    .required("Kode harus diisi"),
})

/**
 * Skema data awal untuk formik
 */
const initialValues = {
  two_factor_code: "",
}

/**
 * Fungsi yang berperan menghandle pengiriman ulang email two factor
 * @param {{
 * setInfo: React.Dispatch,
 * setResendLoading: React.Dispatch
 * }}
 */
function handleResend({ setInfo, setResendLoading }) {
  setResendLoading(true)
  axios
    .post("/resend-two-factor")
    .then(() => {
      setInfo({
        type: "success",
        message: "Kode two factor berhasil dikirim ulang",
      })
      setResendLoading(false)
    })
    .catch(() => {
      setInfo({
        type: "danger",
        message:
          "Kode two factor gagal dikirim ulang, silakan coba berberapa saat lagi",
      })
      setResendLoading(false)
    })
}

/**
 * Komponen utama halaman two factor
 */
export default function TwoFactor() {
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [info, setInfo] = useState()

  const formik = useFormik({
    initialValues,
    validationSchema: twoFactorSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      setSubmitting(true)
      axios
        .post("/verify-two-factor", {
          two_factor_code: values.two_factor_code,
        })
        .then(() => {
          window.location.href = dashboardUrl
        })
        .catch((error) => {
          if (
            error?.response?.data?.message ===
            "The two factor code you have entered does not match"
          ) {
            setInfo({
              type: "danger",
              message: "Kode yang Anda masukkan salah",
            })
            setSubmitting(false)
            setLoading(false)
            return
          }

          setInfo({
            type: "danger",
            message: "Terjadi kesalahan silakan coba beberapa saat lagi",
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
        <h1 className="text-dark mb-3">Two Step Verification</h1>
        <p className="text-gray-600 w-300px m-auto fs-6 mb-5">
          Masukkan kode verifikasi yang sudah kami kirimkan ke alamat email
          Anda.
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
        <input
          placeholder="Ketik kode keamanan 6 digit"
          {...formik.getFieldProps("two_factor_code")}
          className={clsx(
            "form-control form-control-solid",
            {
              "is-invalid":
                formik.touched.two_factor_code && formik.errors.two_factor_code,
            },
            {
              "is-valid":
                formik.touched.two_factor_code &&
                !formik.errors.two_factor_code,
            }
          )}
          type="text"
          name="two_factor_code"
          autoComplete="off"
        />
      </div>
      <div className="text-center mb-5">
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
      <div className="text-center fs-6">
        <span className="text-gray-600">Kamu tidak mendapatkan kode? </span>
        <span
          onClick={() => {
            if (!resendLoading) {
              handleResend({
                setInfo,
                setResendLoading,
              })
            }
          }}
          className={`text-primary ${
            !resendLoading ? "cursor-pointer" : "cursor-default"
          }`}
        >
          Resend
        </span>
      </div>
    </form>
  )
}
