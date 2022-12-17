import { ReactComponent as PrimaryArrowLeftIcon } from "assets/icons/primary-arrow-left.svg"
import { ReactComponent as WarningQuestionMarkIcon } from "assets/icons/warning-question-mark.svg"
import axios from "axios"
import clsx from "clsx"
import { ButtonLightStyled } from "components/Button"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import { useFormik } from "formik"
import useBreadcrumb from "hooks/useBreadcrumb"
import useDidMountEffect from "hooks/useDidMountEffect"
import { useEffect, useState } from "react"
import { OverlayTrigger, Popover } from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useParams } from "react-router"
import * as Yup from "yup"

export const validationSchema = Yup.object().shape({
  templates: Yup.array().min(1).required("Kolom ini harus diisi"),
})

export default function Create() {
  const { id: visitId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [submitStatus, setSubmitStatus] = useState({
    status: "",
    message: "",
  })
  const [initialValues, setInitialValues] = useState({
    templates: [],
  })

  /**
   * Update skema menu breadcrumb
   */
  const [breadCrumbJson, setBreadCrumbJson] = useState({
    title: "Home",
    items: [],
  })
  useEffect(() => {
    if (visitId) {
      setBreadCrumbJson({
        title: "Kunjungan",
        items: [
          { text: "Kunjungan", path: "/visit" },
          {
            text: "Pelayanan",
            path: `/visit/${visitId}/soap`,
          },
          {
            text: "SOAP",
            path: `/visit/${visitId}/soap`,
          },
          {
            text: "Tambah SOAP",
            path: null,
          },
        ],
      })
    }
  }, [visitId])
  useBreadcrumb(breadCrumbJson)

  /**
   * Mengambil data list template asesmen
   */
  const { data: templateData, status: templateStatus } = useQuery(
    `visit-${visitId}-soap-list-template`,
    async () =>
      axios.get(`/visit/${visitId}/soap/list-template`).then((res) => res.data)
  )

  /**
   * Mengupdate initial data untuk formik
   */
  useEffect(() => {
    if (templateData) {
      setInitialValues({
        templates: templateData
          .map((item) => {
            if (item.required === "true") {
              return {
                id: item.id,
                is_new: item.is_new,
              }
            }
          })
          .filter((item) => item !== undefined),
      })
    }
  }, [templateData])

  /**
   * Membuat template
   */
  const { mutate } = useMutation((data) =>
    axios.post(`/visit/${visitId}/soap/store`, data).then((res) => res.data)
  )

  /**
   * Konfigurasi formik tambah asesmen
   */
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true)
      mutate(values, {
        onSuccess: async () => {
          await queryClient.refetchQueries(`visit-${visitId}-soap`)
          setSubmitStatus({
            status: "success",
            message: "Data telah berhasil disimpan ke dalam basis data.",
          })
          setSubmitting(false)
        },
        onError: () => {
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

  /**
   * Mentrigger formik touched pada kolom template
   */
  useDidMountEffect(() => {
    formik.setFieldTouched("templates")
  }, [formik.values.templates])

  return (
    <>
      <Toolbar formik={formik} />
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
            if (submitStatus?.status === "success") {
              navigate(-1)
              queryClient.invalidateQueries(
                `visit-${visitId}-soap-list-template`
              )
            } else {
              setSubmitStatus({})
            }
          }}
          confirmBtnText="OK mengerti"
        >
          <div className="text-gray-600 mb-5">{submitStatus?.message}</div>
        </SweetAlert>
      )}
      <div className="post d-flex flex-column-fluid pt-5 pt-lg-15" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                {templateStatus === "loading" && (
                  <PrimaryLoader className="min-h-300px" />
                )}
                {templateStatus === "error" && (
                  <ErrorMessage className="min-h-300px" />
                )}
                {templateStatus === "success" && (
                  <>
                    {formik.touched.templates && formik.errors.templates && (
                      <div className="alert bg-light-danger text-danger">
                        Saat menambahkan SOAP baru setidaknya ada minimal 1
                        assesmen yang Anda pilih.
                      </div>
                    )}
                    <table className="table" style={{ minWidth: "1000px" }}>
                      <tbody>
                        {!templateData.length ? (
                          <tr>
                            <td colSpan={2}>
                              <center className="text-gray-700">
                                Belum ada data yang dapat ditampilkan
                              </center>
                            </td>
                          </tr>
                        ) : (
                          templateData.map((template, key) => (
                            <tr
                              className={clsx({
                                "h-50px": true,
                                "bg-light-primary":
                                  formik.values.templates.some(
                                    (item) =>
                                      item?.id?.toString() ===
                                      template.id.toString()
                                  ),
                              })}
                              key={key}
                            >
                              <td className="align-middle" width={40}>
                                <div className="form-check form-check-inline form-check-solid ps-10">
                                  <input
                                    type="checkbox"
                                    className="form-check-input me-5"
                                    name={`template_${template.id}`}
                                    id={`template_${template.id}`}
                                    value={template.id}
                                    disabled={template.required === "true"}
                                    checked={
                                      formik.values.templates.filter(
                                        (item) =>
                                          item?.id?.toString() ===
                                          template?.id?.toString()
                                      ).length
                                    }
                                    onChange={(event) => {
                                      if (
                                        formik.values.templates.some(
                                          (item) =>
                                            item?.id?.toString() ===
                                            template?.id?.toString()
                                        )
                                      ) {
                                        formik.setFieldValue("templates", [
                                          ...formik.values.templates.filter(
                                            (item) =>
                                              item?.id?.toString() !==
                                              template?.id?.toString()
                                          ),
                                        ])
                                      } else {
                                        formik.setFieldValue("templates", [
                                          ...formik.values.templates,
                                          {
                                            id: event.target.value,
                                            is_new: "1",
                                          },
                                        ])
                                      }
                                    }}
                                  />
                                  <label
                                    className="form-check-label text-gray-700"
                                    htmlFor={`template_${template.id}`}
                                  >
                                    {template.type}
                                  </label>
                                </div>
                              </td>
                              <td className="align-middle" width={60}>
                                <div className="form-check form-check-inline form-check-solid pe-10">
                                  <input
                                    className="form-check-input"
                                    disabled={
                                      !formik.values.templates.filter(
                                        (item) =>
                                          item?.id?.toString() ===
                                          template?.id?.toString()
                                      ).length
                                    }
                                    type="radio"
                                    name={`action_${template.id}`}
                                    id={`action_new_${template.id}`}
                                    checked={formik.values.templates.some(
                                      (item) =>
                                        item?.id?.toString() ===
                                          template?.id?.toString() &&
                                        item.is_new === "1"
                                    )}
                                    onChange={() => {
                                      formik.setFieldValue("templates", [
                                        ...formik.values.templates.filter(
                                          (item) =>
                                            item?.id?.toString() !==
                                            template?.id?.toString()
                                        ),
                                        {
                                          id: template?.id?.toString(),
                                          is_new: "1",
                                        },
                                      ])
                                    }}
                                  />
                                  <label
                                    className="form-check-label text-gray-600"
                                    htmlFor={`action_new_${template.id}`}
                                  >
                                    Buat baru
                                  </label>
                                </div>
                                <div className="form-check form-check-inline form-check-solid">
                                  <input
                                    className="form-check-input"
                                    disabled={
                                      !formik.values.templates.filter(
                                        (item) =>
                                          item?.id?.toString() ===
                                          template?.id?.toString()
                                      ).length || template.is_new === "1"
                                    }
                                    type="radio"
                                    name={`action_${template.id}`}
                                    id={`action_duplicate_${template.id}`}
                                    checked={formik.values.templates.some(
                                      (item) =>
                                        item?.id?.toString() ===
                                          template?.id?.toString() &&
                                        item.is_new === "0"
                                    )}
                                    onChange={() => {
                                      formik.setFieldValue("templates", [
                                        ...formik.values.templates.filter(
                                          (item) =>
                                            item?.id?.toString() !==
                                            template?.id?.toString()
                                        ),
                                        {
                                          id: template?.id?.toString(),
                                          is_new: "0",
                                        },
                                      ])
                                    }}
                                  />
                                  <label
                                    className="form-check-label text-gray-600"
                                    htmlFor={`action_duplicate_${template.id}`}
                                  >
                                    Duplikasi dari assesmen sebelumnya
                                  </label>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-5">
            <button
              className="btn btn-light-primary me-5"
              onClick={() => navigate(-1)}
            >
              Batal
            </button>
            <button
              className="btn btn-primary"
              onClick={() => formik.submitForm()}
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {!formik.isSubmitting && (
                <span className="indicator-label fw-medium">Buat</span>
              )}
              {formik.isSubmitting && (
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
      </div>
    </>
  )
}

/**
 * Komponen toolbar tambah SOAP
 */
export function Toolbar({ formik }) {
  const navigate = useNavigate()
  return (
    <div className="toolbar mt-n3 mt-lg-0">
      <div className="container-fluid">
        <div className="row justify-content-between">
          <div className="col-md-9 d-flex flex-wrap align-items-center mb-md-0">
            <ButtonLightStyled
              onClick={() => navigate(-1)}
              className="btn btn-icon btn-light-primary flex-shrink-0 me-8"
            >
              <PrimaryArrowLeftIcon />
            </ButtonLightStyled>
            <div className="overflow-hidden">
              <h1 className="fs-3 mb-0 me-4 text-truncate">Tambah SOAP</h1>
            </div>
            <OverlayTrigger
              placement="right"
              overlay={
                <Popover className="shadow-sm w-300px" style={{ zIndex: 9999 }}>
                  <Popover.Body>
                    <div className="text-center">
                      Saat menambahkan SOAP baru setidaknya ada minimal 1
                      assesmen yang Anda pilih.
                    </div>
                  </Popover.Body>
                </Popover>
              }
            >
              <WarningQuestionMarkIcon />
            </OverlayTrigger>
          </div>
          <div className="col-md-3 d-flex justify-content-md-end align-items-start my-1">
            <button
              className="btn btn-primary"
              onClick={() => formik.submitForm()}
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {!formik.isSubmitting && (
                <span className="indicator-label fw-medium">Buat</span>
              )}
              {formik.isSubmitting && (
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
      </div>
    </div>
  )
}
