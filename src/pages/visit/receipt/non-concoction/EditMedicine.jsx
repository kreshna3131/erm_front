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
import { useMutation, useQuery, useQueryClient } from "react-query"
import { Modal } from "react-bootstrap"
import { useNavigate, useOutletContext } from "react-router"
import { useEffect } from "react"
import _ from "lodash"
import Select from "react-select"
import AsyncSelect from "react-select/async"
import { globalStyle } from "helpers/react-select"
import { ReactComponent as AlertCircle } from "assets/icons/alert-circle.svg"
import { ReactComponent as CheckmarkCircle } from "assets/icons/checkmark-circle.svg"
import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"

defaultModules.set(PNotifyMobile, {})
defaults.delay = 2000
defaults.sticker = false

// skema Validasi
const createSchema = Yup.object().shape({
  medicine_name: Yup.string().required("Nama Obat  harus diisi"),
  medicine_unit: Yup.string().required("Satuan  harus diisi"),
  medicine_quantity: Yup.number().required("Quantity harus diisi"),
  medicine_suggestion_use: Yup.string().required("Anjuran Pakai  harus diisi"),
  medicine_use_time: Yup.array()
    .min(1)
    .required("Waktu Pakai wajib untuk dipilih"),
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

// komponen utama edit obat non racikan
export default function EditMedicine({ medicineId, query }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [loading, setLoading] = useState(false)
  const [initialValues, setInitialValues] = useState({
    medicine_name: "",
    medicine_unit: "",
    medicine_use_time: [],
    medicine_suggestion_use: "",
    medicine_quantity: "",
    medicine_id: "",
    medicine_note: "",
  })

  const [inputValue, setValue] = useState("")
  const [selectedValue, setSelectedValue] = useState("")

  // handle input change event
  const handleInputChange = (value) => {
    _.debounce((value) => {
      if (value.length > 2) {
        setValue(value)
      }
    }, 1000)
  }

  // handle selection
  const handleChange = (value) => {
    setSelectedValue(value)
  }

  // option obat
  const loadOptions = (inputValue) => {
    if (inputValue.length > 2) {
      return fetch(
        `${process.env.REACT_APP_API_SIMO_BASE_URL}/dat/obat?nama=${inputValue}`
      )
        .then((res) => res.json())
        .then((data) => (data.msg ? [] : data))
    }
  }

  // edit obat
  const { data, status } = useQuery(
    `visit-recipe-non-concoction-${medicineId}`,
    async (key) => {
      return axios
        .get(`/visit/recipe/non-concoction/${medicineId}/edit`)
        .then((res) => res.data)
    }
  )

  // set to Formik and state selected value
  useEffect(() => {
    if (status === "success") {
      setInitialValues({
        ...initialValues,
        medicine_use_time: data.medicine_use_time.split(",").map((val) => ({
          // return label dan value dan menghilangkan spasi supaya bisa di map di select isMulti
          label: val.replace(/^\s+|\s+$/gm, ""),
          value: val.replace(/^\s+|\s+$/gm, ""),
        })),
        medicine_quantity: data.medicine_quantity,
        medicine_suggestion_use: data.medicine_suggestion_use,
        medicine_note: data.medicine_note,
      })
      setSelectedValue({
        nama: data?.medicine_name,
        satuan: data?.medicine_unit,
        kode: data?.medicine_id,
      })
    }
  }, [data])

  // selectedValue to formik
  useEffect(() => {
    if (selectedValue) {
      const upperCaseFirstLetter = (string) =>
        `${string.slice(0, 1).toUpperCase()}${string.slice(1)}`

      const lowerCaseAllWordsExceptFirstLetters = (string) =>
        string.replaceAll(
          /\S*/g,
          (word) => `${word.slice(0, 1)}${word.slice(1).toLowerCase()}`
        )

      const uppercaseUnit = upperCaseFirstLetter(
        lowerCaseAllWordsExceptFirstLetters(selectedValue.satuan)
      )
      setInitialValues({
        ...initialValues,
        medicine_name: selectedValue.nama,
        medicine_unit: uppercaseUnit,
        medicine_id: selectedValue.kode,
      })
    }
  }, [selectedValue])

  // method patch untuk mengupdate obat
  const mutation = useMutation(
    async ({ data }) => {
      setLoading(true)
      return axios
        .post(`/visit/recipe/non-concoction/${medicineId}/update`, {
          ...{
            _method: "PATCH",
          },
          ...data,
        })
        .then((res) => res.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(query)

        success({
          text: "Berhasil disimpan",
        })
        setLoading(false)
        formik.setSubmitting(false)
        navigate(-1)
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
    validationSchema: createSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true)
      setSubmitting(true)
      mutation.mutate({
        data: {
          medicine_id: values.medicine_id,
          medicine_name: values.medicine_name,
          medicine_unit: values.medicine_unit,
          medicine_use_time: values.medicine_use_time.map((v) => v.value),
          medicine_suggestion_use: values.medicine_suggestion_use,
          medicine_quantity: values.medicine_quantity,
          medicine_note: values.medicine_note,
        },
      })
    },
  })

  return (
    <>
      <Modal size="md" show="true" animation={false}>
        <Modal.Header>
          <Modal.Title>Detail Obat</Modal.Title>
          <GrayCrossIcon
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </Modal.Header>

        <Modal.Body className="p-5">
          {selectedValue && (
            <form className="form w-100" onSubmit={formik.handleSubmit}>
              <div className="row justify-content-center">
                <div className="col">
                  <div
                    className={`row ${
                      selectedValue ? "align-items-start" : "align-items-center"
                    }  mb-8`}
                  >
                    <label
                      htmlFor="edit_medicine_name"
                      className={`col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4  mb-sm-0 ${
                        selectedValue ? "mt-3" : ""
                      }  `}
                    >
                      Nama Obat
                    </label>
                    <div className="col-sm-7">
                      <AsyncSelect
                        id="edit_medicine_name"
                        className={clsx(
                          {
                            "is-invalid":
                              formik.touched.medicine_name &&
                              formik.errors.medicine_name,
                          },
                          {
                            "is-valid":
                              formik.touched.medicine_name &&
                              !formik.errors.medicine_name,
                          }
                        )}
                        styles={{
                          ...globalStyle,
                          control: (styles, state) => ({
                            ...styles,
                            backgroundColor: "#F5F8FA",
                            padding: "5px",
                            borderRadius: "0.475rem",
                            border: state.isFocused ? 0 : 0,
                            boxShadow: state.isFocused ? 0 : 0,
                            maxHeight: "42px",
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
                        value={selectedValue}
                        getOptionLabel={(e) => e.nama}
                        getOptionValue={(e) => e}
                        loadOptions={loadOptions}
                        onInputChange={handleInputChange}
                        onChange={handleChange}
                      />

                      {formik.touched.medicine_name &&
                        formik.errors.medicine_name && (
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.medicine_name}
                          </Form.Control.Feedback>
                        )}

                      {selectedValue ? (
                        selectedValue.stockakhir !== 0 ? (
                          <div className="d-flex mt-1 align-items-center ">
                            <CheckmarkCircle className="me-2" />
                            <span className="text-primary">
                              Stock tersedia {selectedValue.stockakhir}
                            </span>
                          </div>
                        ) : (
                          <div className="d-flex mt-1 align-items-center  ">
                            <AlertCircle className="me-2 " />
                            <span className="text-danger">
                              Stock sudah habis
                            </span>
                          </div>
                        )
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div className="row align-items-center mb-8">
                    <label
                      htmlFor="edit_medicine_unit"
                      className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0"
                    >
                      Satuan
                    </label>
                    <div className="col-sm-5">
                      <input
                        disabled
                        id="edit_medicine_unit"
                        {...formik.getFieldProps("medicine_unit")}
                        className={clsx(
                          "form-control form-control-solid opacity-50 cursor-not-allowed ",
                          {
                            "is-invalid":
                              formik.touched.medicine_unit &&
                              formik.errors.medicine_unit,
                          },
                          {
                            "is-valid":
                              formik.touched.medicine_unit &&
                              !formik.errors.medicine_unit,
                          }
                        )}
                        type="text"
                        name="medicine_unit"
                        autoComplete="off"
                      />
                      {formik.touched.medicine_unit &&
                        formik.errors.medicine_unit && (
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.medicine_unit}
                          </Form.Control.Feedback>
                        )}
                    </div>
                  </div>
                  <div className="row align-items-center mb-8">
                    <label
                      htmlFor="edit_medicine_use_time"
                      className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0"
                    >
                      Waktu Pakai
                    </label>
                    <div className="col-sm-7">
                      <Select
                        className={clsx(
                          {
                            "is-invalid":
                              formik.touched.medicine_use_time &&
                              formik.errors.medicine_use_time,
                          },
                          {
                            "is-valid":
                              formik.touched.medicine_use_time &&
                              !formik.errors.medicine_use_time,
                          }
                        )}
                        options={optionList}
                        onBlur={() =>
                          formik.setFieldTouched("medicine_use_time")
                        }
                        value={formik.values.medicine_use_time}
                        isMulti
                        onChange={(option) => {
                          formik.setFieldValue("medicine_use_time", [...option])
                        }}
                        name="medicine_use_time"
                        id="medicine_use_time"
                        styles={{
                          ...globalStyle,
                          control: (styles, state) => ({
                            ...styles,
                            backgroundColor: "#F5F8FA",
                            padding: "5px",
                            borderRadius: "0.475rem",
                            border: state.isFocused ? 0 : 0,
                            boxShadow: state.isFocused ? 0 : 0,
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
                      {formik.touched.medicine_use_time &&
                        formik.errors.medicine_use_time && (
                          <Form.Control.Feedback type="invalid">
                            Waktu Pakai wajib untuk dipilih
                          </Form.Control.Feedback>
                        )}
                    </div>
                  </div>
                  <div className="row align-items-center mb-8">
                    <label
                      htmlFor="edit_medicine_suggestion_use"
                      className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0"
                    >
                      Anjuran Pakai
                    </label>
                    <div className="col-sm-7">
                      <input
                        id="edit_medicine_suggestion_use"
                        {...formik.getFieldProps("medicine_suggestion_use")}
                        className={clsx(
                          "form-control form-control-solid ",
                          {
                            "is-invalid":
                              formik.touched.medicine_suggestion_use &&
                              formik.errors.medicine_suggestion_use,
                          },
                          {
                            "is-valid":
                              formik.touched.medicine_suggestion_use &&
                              !formik.errors.medicine_suggestion_use,
                          }
                        )}
                        type="text"
                        name="medicine_suggestion_use"
                        autoComplete="off"
                      />
                      {formik.touched.medicine_suggestion_use &&
                        formik.errors.medicine_suggestion_use && (
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.medicine_suggestion_use}
                          </Form.Control.Feedback>
                        )}
                    </div>
                  </div>
                  <div className="row align-items-center mb-8">
                    <label
                      htmlFor="edit_medicine_quantity"
                      className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0"
                    >
                      Quantity
                    </label>
                    <div className="col-sm-7">
                      <input
                        id="edit_medicine_quantity"
                        {...formik.getFieldProps("medicine_quantity")}
                        className={clsx(
                          "form-control form-control-solid ",
                          {
                            "is-invalid":
                              formik.touched.medicine_quantity &&
                              formik.errors.medicine_quantity,
                          },
                          {
                            "is-valid":
                              formik.touched.medicine_quantity &&
                              !formik.errors.medicine_quantity,
                          }
                        )}
                        type="number"
                        name="medicine_quantity"
                        autoComplete="off"
                      />
                      {formik.touched.medicine_quantity &&
                        formik.errors.medicine_quantity && (
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.medicine_quantity}
                          </Form.Control.Feedback>
                        )}
                    </div>
                  </div>
                  <div className="row align-items-center mb-8">
                    <label
                      htmlFor="edit_medicine_note"
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
                              formik.touched.medicine_note &&
                              formik.errors.medicine_note,
                          },
                          {
                            "is-valid":
                              formik.touched.medicine_note &&
                              !formik.errors.medicine_note,
                          }
                        )}
                        onBlur={() =>
                          formik.setTouched({
                            ...formik.touched,
                            ...{
                              medicine_note: true,
                            },
                          })
                        }
                        value={{
                          label:
                            optionNote?.filter((data) => {
                              return data.value === formik.values.medicine_note
                            })?.[0]?.label ?? "Select",
                          value: formik.values.medicine_note,
                        }}
                        onChange={(option) => {
                          formik.setValues({
                            ...formik.values,
                            ...{
                              medicine_note: option.value,
                            },
                          })
                        }}
                        name="medicine_note"
                        id="medicine_note"
                        styles={globalStyle}
                        noOptionsMessage={() => "Keterangan tidak ditemukan"}
                        components={{
                          IndicatorSeparator: "",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <Button
                    type="button"
                    variant="light"
                    className="me-5"
                    onClick={() => navigate(-1)}
                  >
                    Batal
                  </Button>
                  {selectedValue && selectedValue.stockakhir === 0 ? (
                    <div
                      className={`btn  btn-primary 
                     opacity-50 cursor-not-allowed
                    `}
                    >
                      <span className="indicator-label fw-medium">Simpan</span>
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      variant="primary"
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
                    </Button>
                  )}
                </div>
              </div>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}
