import axios from "axios"
import clsx from "clsx"
import { useFormik } from "formik"
import React, { useEffect, useState } from "react"
import { Form } from "react-bootstrap"
import { useMutation, useQueryClient } from "react-query"
import { useOutletContext, useParams } from "react-router"
import * as Yup from "yup"
import { globalStyle } from "helpers/react-select"
import Select from "react-select"
import { defaultModules, defaults, error, success } from "@pnotify/core"
import "@pnotify/core/dist/PNotify.css"
import * as PNotifyMobile from "@pnotify/mobile"
import "@pnotify/mobile/dist/PNotifyMobile.css"
import "assets/css/custom-pnotify.css"

defaultModules.set(PNotifyMobile, {})
defaults.delay = 2000
defaults.sticker = false

// Skema Validasi
const editSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Nama  minimal berisi 3 karakter")
    .max(255, "Nama  maksimum berisi 255 karakter")
    .required("Nama  harus diisi"),
  total: Yup.number().required("Jumlah harus diisi"),
  suggestion_use: Yup.string().required("Anjuran Pakai  harus diisi"),
  use_time: Yup.array().min(1).required("Waktu Pakai wajib untuk dipilih"),
})

// Option waktu pakai
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

// komponen utama edit racikan
export default function Edit({ data, status, recipeQuery }) {
  const [loading, setLoading] = useState(false)

  const queryClient = useQueryClient()
  const {
    receiptId,

    concoctionId,
  } = useParams()
  const [initialValues, setInitialValues] = useState({
    name: "",
    total: "",
    use_time: "",
    suggestion_use: "",
    note: "",
  })

  // set edit data to formik
  useEffect(() => {
    data &&
      setInitialValues({
        use_time: data.use_time.split(",").map((val) => ({
          //return label dan value serta menghilangkan spasi yang kelebihan supaya bisa di map dengan benar di select multi
          label: val.replace(/^\s+|\s+$/gm, ""),
          value: val.replace(/^\s+|\s+$/gm, ""),
        })),

        name: data.name,
        total: data.total,
        suggestion_use: data.suggestion_use,
        note: data.note,
      })
  }, [data])

  const mutation = useMutation(
    async (data) => {
      setLoading(true)
      return axios
        .post(`/visit/recipe/${receiptId}/concoction/${concoctionId}/update`, {
          ...{
            _method: "PATCH",
          },
          ...data,
        })
        .then((res) => res.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          `visit-recipe-${receiptId}-concoction-${concoctionId}`
        )
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
      },
    }
  )

  // konfigurasi formik
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,

    validationSchema: editSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true)
      setSubmitting(true)
      mutation.mutate({
        name: values.name,
        total: values.total,
        use_time: values.use_time.map((v) => v.value),
        suggestion_use: values.suggestion_use,
        note: values.note,
      })
    },
  })

  return (
    <>
      <form
        className="form w-100 mb-4"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="card">
          <div className="card-body p-7">
            {status === "loading" && (
              <div
                className="d-flex flex-center"
                style={{ minHeight: "140px" }}
              >
                <span className="text-gray-600">Loading...</span>
              </div>
            )}

            {status === "success" && (
              <>
                <div className="my-5">
                  <label
                    htmlFor="edit_name"
                    className="form-label fs-6 fw-medium text-gray-700"
                  >
                    Nama Racikan
                  </label>
                  <input
                    disabled={["cancel"].includes(recipeQuery?.data?.status)}
                    id="edit_name"
                    {...formik.getFieldProps("name")}
                    className={`${clsx(
                      "form-control form-control-solid",
                      {
                        "is-invalid": formik.touched.name && formik.errors.name,
                      },
                      {
                        "is-valid": formik.touched.name && !formik.errors.name,
                      }
                    )} ${
                      ["cancel"].includes(recipeQuery?.data?.status)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
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
                <div className="my-5">
                  <label
                    htmlFor="edit_total"
                    className="form-label fs-6 fw-medium text-gray-700"
                  >
                    Jumlah Racikan
                  </label>
                  <input
                    id="edit_total"
                    {...formik.getFieldProps("total")}
                    className={clsx(
                      "form-control form-control-solid",
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
                <div className="my-5">
                  <label
                    htmlFor="edit_use_time"
                    className="form-label fs-6 fw-medium text-gray-700"
                  >
                    Waktu Pakai
                  </label>
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
                <div className="my-5">
                  <label
                    htmlFor="edit_suggestion_use"
                    className="form-label fs-6 fw-medium text-gray-700"
                  >
                    Anjuran Pakai
                  </label>
                  <input
                    id="edit_suggestion_use"
                    {...formik.getFieldProps("suggestion_use")}
                    className={clsx(
                      "form-control form-control-solid",
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
                <div className="my-5">
                  <label
                    htmlFor="edit_note"
                    className="form-label fs-6 fw-medium text-gray-700"
                  >
                    Keterangan
                  </label>

                  <Select
                    options={optionNote}
                    className={clsx(
                      {
                        "is-invalid": formik.touched.note && formik.errors.note,
                      },
                      {
                        "is-valid": formik.touched.note && !formik.errors.note,
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
              </>
            )}
            {["cancel"].includes(recipeQuery?.data?.status) ? (
              <div
                className={`btn w-100 btn-primary mb-5 ${
                  ["cancel"].includes(recipeQuery?.data?.status)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <span className="indicator-label fw-medium">Simpan</span>
              </div>
            ) : (
              <button
                type="submit"
                className="btn w-100 btn-primary mb-5"
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
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  )
}
