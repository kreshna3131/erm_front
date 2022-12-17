import { ReactComponent as MessageIcon } from "assets/icons/message.svg"
import axios from "axios"
import clsx from "clsx"
import { ButtonLightStyled } from "components/Button"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import { useFormik } from "formik"
import { globalStyle } from "helpers/react-select"
import useBreadcrumb from "hooks/useBreadcrumb"
import useCheckPermission from "hooks/useCheckPermission"
import useSidebarActiveMenu from "hooks/useSidebarActiveMenu"
import { useEffect, useState } from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { useQuery } from "react-query"
import { Link, useOutletContext, useParams } from "react-router-dom"
import Select from "react-select"
import { initialValues as importedInitialValues, loginSchema } from "./Create"

/**
 * Data menu breadcrumb
 */
const breadCrumbJson = {
  title: "Pengguna",
  items: [
    { text: "Pengguna", path: "/user" },
    {
      text: "Ubah",
      path: null,
    },
  ],
}

/**
 * Komponen utama halaman edit user
 */
export default function Edit() {
  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("user")
  const { id: userId } = useParams()
  const [loading, setLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({})
  const [info, setInfo] = useState()
  const [initialValues, setInitialValues] = useState(importedInitialValues)
  const { user: loggedUser } = useOutletContext()
  useCheckPermission(loggedUser, "ubah pengguna")

  /**
   * Konfigurasi formik
   */
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true)
      setSubmitting(true)
      axios
        .post(`user/update/${userId}`, {
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
  const { data: user, status: userStatus } = useQuery(`user-${userId}`, () =>
    axios.get(`user/edit/${userId}`).then((res) => res.data)
  )

  /**
   * Mengambil data role
   */
  const { data: roles, status: roleStatus } = useQuery("roleName", () =>
    axios.get("user/list-role").then((res) => res.data)
  )

  /**
   * Mengambil data spesialis
   */
  const { data: specialists, status: specialistStatus } = useQuery(
    "specialistName",
    () => axios.get("user/list-specialist").then((res) => res.data)
  )

  /**
   * Mengirim ulang email verifikasi
   */
  function resendEmailVerif() {
    setEmailLoading(true)
    axios
      .post(`user/${userId}/email-reset`)
      .then(() => {
        setInfo({
          type: "success",
          message:
            "Kami sudah mengirim surel yang berisi tautan untuk mereset kata sandi Anda!",
        })
        setEmailLoading(false)
      })
      .catch((error) => {
        setInfo({
          type: "danger",
          message: "Tautan reset kata sandi gagal dikirim!",
        })
        setEmailLoading(false)
      })
  }

  /**
   * Inisialisasi nilai formik
   */
  useEffect(() => {
    if (user) {
      setInitialValues({
        name: user.name ?? "",
        gender: user.gender ?? "male",
        email: user.email ?? "",
        role: userId === "1" ? "2" : user.role ?? "",
        specialist_id: user.specialist_id ?? "",
        blocked: user.blocked ?? "",
        sip_number: user.sip_number ?? "",
      })
    }
  }, [user, userId])

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
                  {[userStatus, roleStatus, specialistStatus].includes(
                    "loading"
                  ) && (
                    <div
                      className="card-body p-7 d-flex justify-content-center align-items-center"
                      style={{
                        minHeight: "500px",
                      }}
                    >
                      <PrimaryLoader />
                    </div>
                  )}
                  {[userStatus, roleStatus, specialistStatus].includes(
                    "error"
                  ) && (
                    <div
                      className="card-body p-7 d-flex justify-content-center align-items-center"
                      style={{
                        minHeight: "500px",
                      }}
                    >
                      <ErrorMessage />
                    </div>
                  )}
                  {[userStatus, roleStatus, specialistStatus].every(
                    (el) => el === "success"
                  ) && (
                    <div className="card-body p-7">
                      <h1 className="text-dark">Edit Pengguna</h1>
                      <p className="text-gray-600 mb-8">
                        Semua kolom di bawah wajib untuk diisi atau dipilih.
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
                          <div className="col-sm-3 d-flex justify-content-sm-end">
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
                          <div className="col-sm-3 d-flex justify-content-sm-end">
                            <label
                              htmlFor="sip_number"
                              className="form-label fs-6 fw-medium text-gray-700 mt-sm-3 mt-0"
                            >
                              Nomor SIP
                            </label>
                          </div>
                          <div className="col-sm-8">
                            <input
                              id="sip_number"
                              {...formik.getFieldProps("sip_number")}
                              className={clsx(
                                "form-control form-control-solid",
                                {
                                  "is-invalid":
                                    formik.touched.sip_number &&
                                    formik.errors.sip_number,
                                },
                                {
                                  "is-valid":
                                    formik.touched.sip_number &&
                                    !formik.errors.sip_number,
                                }
                              )}
                              type="text"
                              name="sip_number"
                              autoComplete="off"
                            />
                            {formik.touched.sip_number &&
                              formik.errors.sip_number && (
                                <span
                                  className="invalid-feedback"
                                  type="invalid"
                                >
                                  {formik.errors.sip_number}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="form-group mb-8">
                        <div className="row">
                          <div className="col-sm-3 d-flex justify-content-sm-end">
                            <label className="form-label fs-6 fw-medium text-gray-700 mt-sm-3 mt-0">
                              Jenis Kelamin
                            </label>
                          </div>
                          <div className="col-sm-8">
                            <div className="mt-sm-3 mt-0">
                              <div className="form-check form-check-solid form-check-inline me-10">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="gender"
                                  value="male"
                                  id="male-radio"
                                  checked={formik.values.gender === "male"}
                                  onChange={(event) => {
                                    event.currentTarget.checked &&
                                      formik.setFieldValue(
                                        "gender",
                                        event.currentTarget.value
                                      )
                                  }}
                                />
                                <label
                                  className="form-check-label text-gray-600"
                                  htmlFor="male-radio"
                                >
                                  Laki - laki
                                </label>
                              </div>
                              <div className="form-check form-check-solid form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="gender"
                                  id="female-radio"
                                  value="female"
                                  checked={formik.values.gender === "female"}
                                  onChange={(event) => {
                                    event.currentTarget.checked &&
                                      formik.setFieldValue(
                                        "gender",
                                        event.currentTarget.value
                                      )
                                  }}
                                />
                                <label
                                  className="form-check-label text-gray-600"
                                  htmlFor="female-radio"
                                >
                                  Perempuan
                                </label>
                              </div>
                            </div>
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
                          <div className="col-sm-3 d-flex justify-content-sm-end">
                            <label
                              htmlFor="email"
                              className="form-label fs-6 fw-medium text-gray-700 mt-sm-3 mt-0"
                            >
                              Alamat Email
                            </label>
                          </div>
                          <div className="col-sm-8">
                            <div className="d-flex">
                              <input
                                id="email"
                                {...formik.getFieldProps("email")}
                                className={clsx(
                                  "form-control form-control-solid me-4",
                                  {
                                    "is-invalid":
                                      formik.touched.email &&
                                      formik.errors.email,
                                  },
                                  {
                                    "is-valid":
                                      formik.touched.email &&
                                      !formik.errors.email,
                                  }
                                )}
                                type="text"
                                name="email"
                                autoComplete="off"
                                disabled={userId === "1"}
                              />
                              {formik.touched.email && formik.errors.email && (
                                <span
                                  className="invalid-feedback"
                                  type="invalid"
                                >
                                  {formik.errors.email}
                                </span>
                              )}
                              <OverlayTrigger
                                placement="left"
                                overlay={
                                  <Tooltip>
                                    Kirim link untuk reset password
                                  </Tooltip>
                                }
                              >
                                <ButtonLightStyled
                                  disabled={emailLoading}
                                  onClick={() => resendEmailVerif()}
                                  className="btn btn-icon btn-light-primary flex-shrink-0"
                                >
                                  <MessageIcon />
                                </ButtonLightStyled>
                              </OverlayTrigger>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-group mb-8">
                        <div className="row">
                          <div className="col-sm-3 d-flex justify-content-sm-end">
                            <label
                              htmlFor="role"
                              className="form-label fs-6 fw-medium text-gray-700 mt-sm-3 mt-0"
                            >
                              Role
                            </label>
                          </div>
                          <div className="col-sm-8">
                            {roleStatus === "success" && (
                              <Select
                                isDisabled={userId === "1"}
                                className={clsx(
                                  {
                                    "is-invalid":
                                      formik.touched.role && formik.errors.role,
                                  },
                                  {
                                    "is-valid":
                                      formik.touched.role &&
                                      !formik.errors.role,
                                  }
                                )}
                                name="role"
                                id="role"
                                value={{
                                  value: formik.values.role,
                                  label:
                                    roles.filter((role) => {
                                      return role.id === formik.values.role
                                    })?.[0]?.name ??
                                    (userId === "1" ? "Superuser" : "Select"),
                                }}
                                onBlur={() => formik.setFieldTouched("role")}
                                onChange={(option) =>
                                  formik.setFieldValue("role", option.value)
                                }
                                options={roles.map((role) => ({
                                  value: role.id,
                                  label: role.name,
                                }))}
                                styles={globalStyle}
                                noOptionsMessage={() => "Role tidak ditemukan"}
                                components={{
                                  IndicatorSeparator: "",
                                }}
                              />
                            )}
                            {formik.touched.role && formik.errors.role && (
                              <span className="invalid-feedback" type="invalid">
                                {formik.errors.role}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="form-group mb-8">
                        <div className="row">
                          <div className="col-sm-3 d-flex justify-content-sm-end">
                            <label
                              htmlFor="role"
                              className="form-label fs-6 fw-medium text-gray-700 mt-sm-3 mt-0"
                            >
                              Spesialis
                            </label>
                          </div>
                          <div className="col-sm-8">
                            {specialistStatus === "success" && (
                              <Select
                                className={clsx(
                                  {
                                    "is-invalid":
                                      formik.touched.specialist_id &&
                                      formik.errors.specialist_id,
                                  },
                                  {
                                    "is-valid":
                                      formik.touched.specialist_id &&
                                      !formik.errors.specialist_id,
                                  }
                                )}
                                name="specialist_id"
                                id="specialist_id"
                                value={{
                                  value: formik.values.specialist_id,
                                  label:
                                    specialists.filter((specialist) => {
                                      return (
                                        specialist.id ===
                                        formik.values.specialist_id
                                      )
                                    })?.[0]?.name ?? "Select",
                                }}
                                onBlur={() =>
                                  formik.setFieldTouched("specialist_id")
                                }
                                onChange={(option) =>
                                  formik.setFieldValue(
                                    "specialist_id",
                                    option.value
                                  )
                                }
                                options={specialists.map((specialist) => ({
                                  value: specialist.id,
                                  label: specialist.name,
                                }))}
                                styles={globalStyle}
                                noOptionsMessage={() =>
                                  "Spesialis tidak ditemukan"
                                }
                                components={{
                                  IndicatorSeparator: "",
                                }}
                              />
                            )}
                            {formik.touched.specialist_id &&
                              formik.errors.specialist_id && (
                                <span
                                  className="invalid-feedback"
                                  type="invalid"
                                >
                                  {formik.errors.specialist_id}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="form-group mb-8">
                        <div className="row">
                          <div className="col-sm-3 d-flex justify-content-sm-end">
                            <label className="form-label fs-6 fw-medium text-gray-700 mt-sm-3 mt-0">
                              Status
                            </label>
                          </div>
                          <div className="col-sm-8">
                            <div className="mt-sm-3 mt-0">
                              <div className="form-check form-check-solid form-check-inline me-10">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="blocked"
                                  value="0"
                                  checked={
                                    formik.values.blocked.toString() === "0"
                                  }
                                  id="active-radio"
                                  onChange={(event) => {
                                    event.currentTarget.checked &&
                                      formik.setFieldValue(
                                        "blocked",
                                        event.currentTarget.value
                                      )
                                  }}
                                  disabled={userId.toString() === "1"}
                                />
                                <label
                                  className="form-check-label text-gray-600"
                                  htmlFor="active-radio"
                                >
                                  Active
                                </label>
                              </div>
                              <div className="form-check form-check-solid form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="blocked"
                                  value="1"
                                  checked={
                                    formik.values.blocked.toString() === "1"
                                  }
                                  id="inactive-radio"
                                  onChange={(event) => {
                                    event.currentTarget.checked &&
                                      formik.setFieldValue(
                                        "blocked",
                                        event.currentTarget.value
                                      )
                                  }}
                                  disabled={userId.toString() === "1"}
                                />
                                <label
                                  className="form-check-label text-gray-600"
                                  htmlFor="inactive-radio"
                                >
                                  Inactive
                                </label>
                              </div>
                            </div>
                            {formik.touched.blocked && formik.errors.blocked && (
                              <span className="invalid-feedback" type="invalid">
                                {formik.errors.blocked}
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
                          disabled={formik.isSubmitting || !formik.isValid}
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
