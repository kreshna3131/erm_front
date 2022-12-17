import axios from "axios"
import clsx from "clsx"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import { useFormik } from "formik"
import useBreadcrumb from "hooks/useBreadcrumb"
import useCheckPermission from "hooks/useCheckPermission"
import useSidebarActiveMenu from "hooks/useSidebarActiveMenu"
import { useEffect, useState } from "react"
import SweetAlert from "react-bootstrap-sweetalert"
import { useQuery } from "react-query"
import { Link, useOutletContext } from "react-router-dom"
import * as Yup from "yup"

/**
 * Data menu breadcrumb
 */
const breadCrumbJson = {
  title: "Profile saya",
  items: [{ text: "Profile saya", path: null }],
}

/**
 * Skema validasi tambah user untuk formik
 */
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Nama minmal berisi 3 karakter")
    .max(255, "Nama maksimum berisi 255 karakter")
    .required("Nama harus diisi"),
  password: Yup.string()
    .min(8, "Password minimal berisi 8 karakter")
    .required("Password harus diisi"),
  password_confirmation: Yup.string()
    .required("Konfirmasi password harus diisi")
    .oneOf(
      [Yup.ref("password"), null, ""],
      "Konfirmasi password harus sama dengan password"
    ),
})

/**
 * Komponen utama halaman edit user
 */
export default function Edit() {
  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("user")
  const [loading, setLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({})
  const [info, setInfo] = useState()
  const [initialValues, setInitialValues] = useState({
    name: "",
  })
  const { allPermissions } = useOutletContext()

  /**
   * Konfigurasi formik
   */
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true)
      setSubmitting(true)
      axios
        .post(`/profile/update`, {
          ...values,
          ...{
            _method: "PATCH",
          },
        })
        .then(() => {
          setSubmitStatus({
            status: "success",
            message: "Data telah berhasil disimpan ke dalam basis data.",
          })
          setLoading(false)
          setSubmitting(false)
          setInitialValues({
            ...initialValues,
            password: "",
            password_confirmation: "",
          })
        })
        .catch((err) => {
          switch (err.response.status) {
            case 422:
              const errors = err.response.data.errors
              formik.setErrors({
                ...formik.errors,
                ...errors,
              })
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
          setLoading(false)
        })
    },
  })

  /**
   * Mengambil data user
   */
  const { data: user, status: userStatus } = useQuery(`profile`, () =>
    axios.get(`profile/edit`).then((res) => res.data)
  )

  /**
   * Inisialisasi nilai formik
   */
  useEffect(() => {
    if (user) {
      setInitialValues({
        name: user.name ?? "",
      })
    }
  }, [user])

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

      <div className="post d-flex flex-column-fluid" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-10">
              <form className="form w-100" onSubmit={formik.handleSubmit}>
                <div className="card">
                  {[userStatus].includes("loading") && (
                    <div
                      className="card-body p-7 d-flex justify-content-center align-items-center"
                      style={{
                        minHeight: "500px",
                      }}
                    >
                      <PrimaryLoader />
                    </div>
                  )}
                  {[userStatus].includes("error") && (
                    <div
                      className="card-body p-7 d-flex justify-content-center align-items-center"
                      style={{
                        minHeight: "500px",
                      }}
                    >
                      <ErrorMessage />
                    </div>
                  )}
                  {[userStatus].every((el) => el === "success") && (
                    <div className="card-body p-7">
                      <h1 className="text-dark">Profile saya</h1>
                      <p className="text-gray-600 mb-8">
                        Silakan ubah, nama dan password dengan kolom di bawah
                        ini.
                      </p>
                      {info && (
                        <div
                          className={`alert alert-${info.type} text-${info.type} border-0`}
                          role="alert"
                        >
                          {info.message}
                        </div>
                      )}
                      <div className="form-group mb-8">
                        <div className="row">
                          <div className="col-sm-3 d-flex justify-content-sm-end text-sm-end">
                            <label
                              htmlFor="name"
                              className="form-label fs-6 fw-medium text-gray-700 mt-sm-3 mt-0"
                            >
                              Nama
                            </label>
                          </div>
                          <div className="col-sm-8">
                            <input
                              id="name"
                              {...formik.getFieldProps("name")}
                              className={clsx(
                                "form-control form-control-solid",
                                {
                                  "is-invalid":
                                    formik.touched.name && formik.errors.name,
                                },
                                {
                                  "is-valid":
                                    formik.touched.name && !formik.errors.name,
                                }
                              )}
                              type="text"
                              name="name"
                              autoComplete="off"
                            />
                            {formik.touched.name && formik.errors.name && (
                              <span className="invalid-feedback" type="invalid">
                                {formik.errors.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="form-group mb-8">
                        <div className="row">
                          <div className="col-sm-3 d-flex justify-content-sm-end text-sm-end">
                            <label
                              htmlFor="name"
                              className="form-label fs-6 fw-medium text-gray-700 mt-sm-3 mt-0"
                            >
                              Password
                            </label>
                          </div>
                          <div className="col-sm-8">
                            <input
                              id="password"
                              {...formik.getFieldProps("password")}
                              className={clsx(
                                "form-control form-control-solid",
                                {
                                  "is-invalid":
                                    formik.touched.password &&
                                    formik.errors.password,
                                },
                                {
                                  "is-valid":
                                    formik.touched.password &&
                                    !formik.errors.password,
                                }
                              )}
                              type="password"
                              name="password"
                              autoComplete="off"
                            />
                            {formik.touched.password && formik.errors.password && (
                              <span className="invalid-feedback" type="invalid">
                                {formik.errors.password}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="form-group mb-8">
                        <div className="row">
                          <div className="col-sm-3 d-flex justify-content-sm-end text-sm-end">
                            <label
                              htmlFor="name"
                              className="form-label fs-6 fw-medium text-gray-700 mt-sm-3 mt-0"
                            >
                              Konfirmasi password
                            </label>
                          </div>
                          <div className="col-sm-8">
                            <input
                              id="password_confirmation"
                              {...formik.getFieldProps("password_confirmation")}
                              className={clsx(
                                "form-control form-control-solid",
                                {
                                  "is-invalid":
                                    formik.touched.password_confirmation &&
                                    formik.errors.password_confirmation,
                                },
                                {
                                  "is-valid":
                                    formik.touched.password_confirmation &&
                                    !formik.errors.password_confirmation,
                                }
                              )}
                              type="password"
                              name="password_confirmation"
                              autoComplete="off"
                            />
                            {formik.touched.password_confirmation &&
                              formik.errors.password_confirmation && (
                                <span
                                  className="invalid-feedback"
                                  type="invalid"
                                >
                                  {formik.errors.password_confirmation}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <Link
                          to="/user"
                          type="button"
                          className="btn btn-white mb-5 me-4"
                        >
                          <span className="indicator-label fw-medium">
                            Batal
                          </span>
                        </Link>
                        <button
                          type="submit"
                          className="btn btn-primary mb-5"
                          disabled={
                            formik.isSubmitting ||
                            !formik.isValid ||
                            !allPermissions.includes("ubah profile")
                          }
                        >
                          {!loading && (
                            <span className="indicator-label fw-medium">
                              Simpan
                            </span>
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
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
