import React from "react"
import * as Yup from "yup"
import { useFormik } from "formik"
import { Link, useOutletContext, useSearchParams } from "react-router-dom"
import { useState } from "react"
import clsx from "clsx"
import axios from "axios"
import { setClientCredential } from "../../hooks/useAuth"
import { useEffect } from "react"
import { DateTime } from "luxon"
import { dashboardUrl } from "../../config"

/**
 * Skema validasi login untuk formik
 */
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Format email tidak valid")
    .min(3, "Email minmal berisi 3 karakter")
    .max(255, "Email maksimum berisi 255 karakter")
    .required("Email harus diisi"),
  password: Yup.string()
    .min(8, "Password minmal berisi 8 karakter")
    .max(255, "Password maksimum berisi 255 karakter")
    .required("Password harus diisi"),
})

/**
 * Skema data awal untuk formik
 */
const initialValues = {
  email: "",
  password: "",
}

/**
 * Komponen utama halaman login
 */
export default function Login() {
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useOutletContext(null)
  const [searchParams] = useSearchParams()
  const today = DateTime.local()

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true)
      setSubmitting(true)
      axios
        .post("login", {
          email: values.email,
          password: values.password,
        })
        .then((response) => {
          let redirect = dashboardUrl

          if (response?.data?.message === "Please verify the two factor code") {
            redirect = "/two-factor"
          }

          setClientCredential(response?.data?.token).then(() => {
            window.location.href = redirect
          })
        })
        .catch((error) => {
          switch (error?.response?.data?.message) {
            case "You has been blocked":
              setInfo({
                type: "danger",
                message:
                  "Akun kamu telah diblokir dari aplikasi ini dikarenakan melanggar ketentuan yang berlaku atau hal lainnya.",
              })
              break

            case "Invalid credentials":
              setInfo({
                type: "danger",
                message:
                  "Kombinasi email dan password salah, silakan cek ulang lagi",
              })
              break

            case "Throttle request":
              setInfo({
                type: "danger",
                message: `Anda terlalu banyak melakukan percobaan login, silakan tunggu ${error?.response?.data?.decay_second} detik lagi`,
              })

              localStorage.setItem(
                "login-throttle-end",
                today.plus({
                  second: error?.response?.data?.decay_second,
                })
              )
              break

            case "Your Ip has been banned.":
              setInfo({
                type: "danger",
                message:
                  "Ip Anda terlah diblokir karena terlalu banyak melakukan percobaan login.",
              })
              break

            default:
              setInfo({
                type: "danger",
                message: "Terjadi kesalahan silakan coba beberapa saat lagi",
              })
              break
          }

          setSubmitting(false)
          setLoading(false)
        })
    },
  })

  const loginThrottleEnd = localStorage.getItem("login-throttle-end")
  useEffect(() => {
    if (loginThrottleEnd) {
      const limit = DateTime.fromISO(loginThrottleEnd)
        .diff(DateTime.now())
        .toFormat("s")

      throttleCountdown(limit)
    }
  }, [loginThrottleEnd])

  function throttleCountdown(limit) {
    let waitTime = limit
    let interval = setInterval(() => {
      waitTime = waitTime - 1
      setInfo({
        type: "danger",
        message: `Anda terlalu banyak melakukan percobaan login, silakan tunggu ${waitTime} detik lagi`,
      })

      if (parseInt(waitTime) <= 0) {
        localStorage.removeItem("login-throttle-end")
        setInfo(null)
        clearInterval(interval)
      }
    }, 1000)
  }

  useEffect(() => {
    if (searchParams.get("twoFactor") === "expired") {
      setInfo({
        type: "danger",
        message: "Kode two factor telah kedaluwarsa, silakan login ulang",
      })
    }
  }, [searchParams])

  useEffect(() => {
    if (localStorage.getItem("isLogin") == "true") {
      setInfo({
        type: "danger",
        message:
          "Sesi telah kedaluwarsa dikarenakan tidak ada aktivitas permintaan terhadap sistem.",
      })
      localStorage.removeItem("isLogin")
    }
  }, [])

  return (
    <form
      className="form w-100"
      onSubmit={formik.handleSubmit}
      noValidate
      id="kt_login_signin_form"
    >
      <div className="text-center mb-8">
        <h1 className="text-dark mb-3">Sign In</h1>
      </div>
      {info && (
        <div
          className={`alert alert-${info.type} text-${info.type} border-0`}
          role="alert"
        >
          {info.message}
        </div>
      )}
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
      <div className="mb-8">
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-stack mb-2">
            <label className="form-label fw-medium text-gray-700 fs-6 mb-0">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="link-primary fs-6 fw-medium"
              style={{ marginLeft: "5px" }}
            >
              Forgot Password ?
            </Link>
          </div>
        </div>
        <input
          {...formik.getFieldProps("password")}
          type="password"
          autoComplete="off"
          className={clsx(
            "form-control form-control-solid",
            {
              "is-invalid": formik.touched.password && formik.errors.password,
            },
            {
              "is-valid": formik.touched.password && !formik.errors.password,
            }
          )}
        />
      </div>
      <div className="text-center text-gray-600">
        <button
          type="submit"
          id="kt_sign_in_submit"
          className="btn btn-primary w-100 mb-5"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className="indicator-label fw-medium">Login</span>}
          {loading && (
            <span className="indicator-progress" style={{ display: "block" }}>
              Please wait...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
    </form>
  )
}
