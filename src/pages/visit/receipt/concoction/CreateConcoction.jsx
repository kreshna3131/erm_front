import React, { useState } from "react"
import { defaultModules, defaults, error, success } from "@pnotify/core"
import "@pnotify/core/dist/PNotify.css"
import * as PNotifyMobile from "@pnotify/mobile"
import "@pnotify/mobile/dist/PNotifyMobile.css"
import "assets/css/custom-pnotify.css"
import * as Yup from "yup"
import { useFormik } from "formik"
import clsx from "clsx"
import axios from "axios"
import { Button } from "react-bootstrap"
import { Form } from "react-bootstrap"
import { useMutation, useQueryClient } from "react-query"
import { Modal } from "react-bootstrap"
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router"
import { useEffect } from "react"
import Select from "react-select"
import { globalStyle } from "helpers/react-select"
import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"

defaultModules.set(PNotifyMobile, {})
defaults.delay = 2000
defaults.sticker = false

// validasi Tambah Racikan
const createSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Nama Racikan  minimal berisi 3 karakter")
    .max(255, "Nama Racikan  maksimum berisi 255 karakter")
    .required("Nama Racikan  harus diisi"),
  total: Yup.number().required("Jumlah harus diisi"),
  suggestion_use: Yup.string().required("Anjuran Pakai  harus diisi"),
  use_time: Yup.array().min(1).required("Waktu Pakai wajib untuk dipilih"),
})

// option waktu pakai
const optionList = [
  { value: "Pagi", label: "Pagi" },
  { value: "Siang", label: "Siang" },
  { value: "Sore", label: "Sore" },
  { value: "Malam", label: "Malam" },
]

// option keterangan
const optionNote = [
  { value: "ac", label: "ac" },
  { value: "dc", label: "dc" },
  { value: "pc", label: "pc" },
  { value: "sue", label: "sue" },
  { value: "prn", label: "prn" },
  { value: "simm", label: "simm" },
]

// komponen utama tambah racikan
export default function CreateConcoction({ receiptId, query }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [concoctionId, setConcoctionId] = useState("")

  const initialValues = {
    name: "",
    total: "",
    use_time: "[]",
    suggestion_use: "",
    note: "",
  }
  const { id: visitId } = useParams()
  const location = useLocation()

  // method post untuk tambah racikan
  const mutation = useMutation(
    async ({ data, id }) => {
      setLoading(true)
      return axios
        .post(`/visit/recipe/${id}/concoction/store`, data)
        .then((res) => setConcoctionId(res.data.id))
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(query)

        success({
          text: "Berhasil disimpan",
        })
        setLoading(false)
        formik.setSubmitting(false)
      },
      onError: () => {
        error({
          text: "Gagal disimpan",
        })

        setLoading(false)
        formik.setSubmitting(false)
        navigate(-1)
      },
    }
  )

  // konfigurasi formik
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: createSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true)
      setSubmitting(true)
      mutation.mutate({
        id: receiptId,
        data: {
          name: values.name,
          total: values.total,
          use_time: values.use_time.map((v) => v.value),
          suggestion_use: values.suggestion_use,
          note: values.note,
        },
      })
    },
  })

  // pengaturan route pharmacy and recipe
  useEffect(() => {
    if (concoctionId) {
      if (location.pathname.includes("pharmacy")) {
        navigate(
          `/pharmacy/request/${visitId}/receipt/${receiptId}/concoction/${concoctionId}`
        )
      } else {
        navigate(
          `/visit/${visitId}/receipt/${receiptId}/concoction/${concoctionId}`
        )
      }
    }
  }, [concoctionId])

  return (
    <>
      <Modal size="md" show="true" animation={false}>
        <Modal.Header>
          <Modal.Title>Tambah Obat</Modal.Title>
          <GrayCrossIcon
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </Modal.Header>

        <Modal.Body className="p-10">
          <form className="form w-100" onSubmit={formik.handleSubmit}>
            <div className="row justify-content-center">
              <div className="col">
                <div className="row align-items-center mb-8">
                  <label
                    htmlFor="create_name"
                    className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0"
                  >
                    Tambah Racikan
                  </label>
                  <div className="col-sm-7">
                    <input
                      id="create_name"
                      {...formik.getFieldProps("name")}
                      className={clsx(
                        "form-control form-control-solid ",
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
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.name}
                      </Form.Control.Feedback>
                    )}
                  </div>
                </div>
                <div className="row align-items-center mb-8">
                  <label
                    htmlFor="create_total"
                    className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0"
                  >
                    Jumlah Racikan
                  </label>
                  <div className="col-sm-5">
                    <input
                      id="create_total"
                      {...formik.getFieldProps("total")}
                      className={clsx(
                        "form-control form-control-solid ",
                        {
                          "is-invalid":
                            formik.touched.total && formik.errors.total,
                        },
                        {
                          "is-valid":
                            formik.touched.total && !formik.errors.total,
                        }
                      )}
                      type="number"
                      name="total"
                      autoComplete="off"
                    />
                    {formik.touched.total && formik.errors.total && (
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.total}
                      </Form.Control.Feedback>
                    )}
                  </div>
                </div>
                <div className="row align-items-center mb-8">
                  <label
                    htmlFor="create_use_time"
                    className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0"
                  >
                    Waktu Pakai
                  </label>
                  <div className="col-sm-7">
                    <Select
                      className={clsx(
                        {
                          "is-invalid":
                            formik.touched.use_time && formik.errors.use_time,
                        },
                        {
                          "is-valid":
                            formik.touched.use_time && !formik.errors.use_time,
                        }
                      )}
                      options={optionList}
                      onBlur={() => formik.setFieldTouched("use_time")}
                      value={formik.values.use_time}
                      isMulti
                      onChange={(option) => {
                        formik.setFieldValue("use_time", [...option])
                      }}
                      name="use_time"
                      id="use_time"
                      styles={{
                        ...globalStyle,
                        control: (styles, state) => ({
                          ...styles,
                          backgroundColor: "#F5F8FA",
                          padding: "5px",
                          borderRadius: "0.475rem",
                          border: state.isFocused ? 0 : 0,
                          boxShadow: state.isFocused ? 0 : 0,
                          content: `""`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "85% center",
                          backgroundSize:
                            "calc(0.75em + 0.75rem) calc(0.75em + 0.75rem)",

                          "&:hover": {
                            border: state.isFocused ? 0 : 0,
                          },
                        }),
                      }}
                      noOptionsMessage={() => "Data tidak ditemukan"}
                      components={{
                        IndicatorSeparator: "",
                      }}
                    />
                    {formik.touched.use_time && formik.errors.use_time && (
                      <Form.Control.Feedback type="invalid">
                        Waktu Pakai wajib untuk dipilih
                      </Form.Control.Feedback>
                    )}
                  </div>
                </div>
                <div className="row align-items-center mb-8">
                  <label
                    htmlFor="create_suggestion_use"
                    className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0"
                  >
                    Anjuran Pakai
                  </label>
                  <div className="col-sm-7">
                    <input
                      id="create_suggestion_use"
                      {...formik.getFieldProps("suggestion_use")}
                      className={clsx(
                        "form-control form-control-solid ",
                        {
                          "is-invalid":
                            formik.touched.suggestion_use &&
                            formik.errors.suggestion_use,
                        },
                        {
                          "is-valid":
                            formik.touched.suggestion_use &&
                            !formik.errors.suggestion_use,
                        }
                      )}
                      type="text"
                      name="suggestion_use"
                      autoComplete="off"
                    />
                    {formik.touched.suggestion_use &&
                      formik.errors.suggestion_use && (
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.suggestion_use}
                        </Form.Control.Feedback>
                      )}
                  </div>
                </div>
                <div className="row align-items-center mb-8">
                  <label
                    htmlFor="create_note"
                    className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0"
                  >
                    Keterangan
                  </label>
                  <div className="col-sm-7">
                    <Select
                      options={optionNote}
                      className={clsx(
                        {
                          "is-invalid":
                            formik.touched.note && formik.errors.note,
                        },
                        {
                          "is-valid":
                            formik.touched.note && !formik.errors.note,
                        }
                      )}
                      onBlur={() =>
                        formik.setTouched({
                          ...formik.touched,
                          ...{
                            note: true,
                          },
                        })
                      }
                      value={{
                        label:
                          optionNote?.filter((data) => {
                            return data.value === formik.values.note
                          })?.[0]?.label ?? "Select",
                        value: formik.values.note,
                      }}
                      onChange={(option) => {
                        formik.setValues({
                          ...formik.values,
                          ...{
                            note: option.value,
                          },
                        })
                      }}
                      name="note"
                      id="note"
                      styles={globalStyle}
                      noOptionsMessage={() => "Keterangan tidak ditemukan"}
                      components={{
                        IndicatorSeparator: "",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center my-5">
                <Button
                  type="button"
                  variant="light"
                  className="me-5"
                  onClick={() => navigate(-1)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={formik.isSubmitting || !formik.isValid}
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
                </Button>
              </div>
            </div>
          </form>

          {/* )} */}
        </Modal.Body>
      </Modal>
    </>
  )
}
