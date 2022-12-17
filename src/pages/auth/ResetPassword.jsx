import React, { useState, useEffect } from "react"
import * as Yup from "yup"
import { useFormik } from "formik"
import clsx from "clsx"
import axios from "axios"
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom"
import { setClientCredential } from "../../hooks/useAuth"
import { Link } from "react-router-dom"
import { dashboardUrl } from "../../config"

/**
 * Skema validasi reset password untuk formik
 */
const resetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Format email tidak valid")
    .min(3, "Email minmal berisi 3 karakter")
    .max(255, "Email maksimum berisi 255 karakter")
    .required("Email harus diisi"),
  password: Yup.string()
    .min(8, "Password minmal berisi 8 karakter")
    .max(255, "Password maksimum berisi 255 karakter")
    .required("Password harus diisi"),
  passwordConfirmation: Yup.string()
    .required("Password harus diisi")
    .when("password", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref("password")], "Password tidak sama"),
    }),
})

/**
 * Komponen utama halaman reset password
 */
export default function ResetPassword() {
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useOutletContext(null)
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")
  const createPassword = searchParams.get("create_password")
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
  })

  function checkValidToken() {
    axios
      .get(`check-token?token=${token}&email=${email}`)
      .then((res) => {})
      .catch((err) => {
        setInfo({
          type: "danger",
          message:
            "Tautan untuk mengatur password kamu telah kedaluwarsa. Silakan lakukan permintaan kembali untuk mengatur ulang password.",
        })
        navigate("/")
      })
  }

  useEffect(() => {
    checkValidToken()
  }, [])

  useEffect(() => {
    setInitialValues({
      ...initialValues,
      ...{
        email: email,
      },
    })
  }, [email])

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: resetPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      setSubmitting(true)
      axios
        .post("reset-password", {
          email: values.email,
          password: values.password,
          password_confirmation: values.passwordConfirmation,
          token: token,
        })
        .then((response) => {
          setClientCredential(response.data.token).then(() => {
            window.location.href = dashboardUrl
          })
        })
        .catch((error) => {
          setInfo({
            type: "danger",
            message: "Password gagal di update",
          })
          setStatus("Password update failed")
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
        <h1 className="text-dark mb-3">
          {createPassword ? "Create" : "Reset"} Password
        </h1>
        <p className="fs-6 text-gray-600">
          Silakan membuat password baru dan pastikan Anda selalu mengingatnya.
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
          className="form-control form-control-solid"
          autoComplete="off"
          readOnly
        />
      </div>
      <div className="mb-8">
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-stack mb-2">
            <label className="form-label fw-medium text-gray-700 fs-6 mb-0">
              Password
            </label>
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
      <div className="mb-8">
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-stack mb-2">
            <label className="form-label fw-medium text-gray-700 fs-6 mb-0">
              Tulis ulang password baru
            </label>
          </div>
        </div>
        <input
          {...formik.getFieldProps("passwordConfirmation")}
          type="password"
          autoComplete="off"
          className={clsx(
            "form-control form-control-solid",
            {
              "is-invalid":
                formik.touched.passwordConfirmation &&
                formik.errors.passwordConfirmation,
            },
            {
              "is-valid":
                formik.touched.passwordConfirmation &&
                !formik.errors.passwordConfirmation,
            }
          )}
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
