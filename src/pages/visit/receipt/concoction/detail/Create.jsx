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
import { useNavigate, useOutletContext } from "react-router"
import { useEffect } from "react"
import _ from "lodash"

import AsyncSelect from "react-select/async"
import { globalStyle } from "helpers/react-select"

import { ReactComponent as AlertCircle } from "assets/icons/alert-circle.svg"
import { ReactComponent as CheckmarkCircle } from "assets/icons/checkmark-circle.svg"
import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"

defaultModules.set(PNotifyMobile, {})
defaults.delay = 2000
defaults.sticker = false

const createSchema = Yup.object().shape({
  name: Yup.string().required("Nama Obat  harus diisi"),
  unit: Yup.string().required("Satuan  harus diisi"),

  strength: Yup.string().required("Kekuatan  harus diisi"),
  dose: Yup.string().required("Dosis  harus diisi"),
})

export default function Create({
  recipeQuery,
  receiptId,
  concoctionId,
  query,
}) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [initialValues, setInitialValues] = useState({
    name: "",
    unit: "",
    strength: "",
    dose: "",
    medicine_id: "",
  })

  const [inputValue, setValue] = useState("alb")
  const [selectedValue, setSelectedValue] = useState(null)

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

  const loadOptions = (inputValue) => {
    if (inputValue.length > 2) {
      return fetch(
        `${process.env.REACT_APP_API_SIMO_BASE_URL}/dat/obat?nama=${inputValue}`
      )
        .then((res) => res.json())
        .then((data) => (data.msg ? [] : data))
    }
  }
  const mutation = useMutation(
    async (data) => {
      setLoading(true)
      return axios
        .post(
          `/visit/recipe/${receiptId}/concoction/${concoctionId}/store`,
          data
        )
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

  // memasukkan isi state selected value ke formik nama obat, satuan, dan stock
  useEffect(() => {
    if (selectedValue) {
      // mengganti satuan obat dari Uppercase ke huruf pertama saja yang besar
      const upperCaseFirstLetter = (string) =>
        `${string.slice(0, 1).toUpperCase()}${string.slice(1)}`

      const lowerCaseAllWordsExceptFirstLetters = (string) =>
        string.replaceAll(
          /\S*/g,
          (word) => `${word.slice(0, 1)}${word.slice(1).toLowerCase()}`
        )

      const uppercaseUnit = upperCaseFirstLetter(
        lowerCaseAllWordsExceptFirstLetters(selectedValue?.satuan)
      )
      setInitialValues({
        ...initialValues,
        name: selectedValue.nama,
        unit: uppercaseUnit,
        id: selectedValue.kode,
      })
    }
  }, [selectedValue])

  // konfigurasi formik
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: createSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true)
      setSubmitting(true)
      mutation.mutate({
        name: values.name,
        unit: values.unit,
        strength: values.strength,
        dose: values.dose,
        medicine_id: values.id,
      })
    },
  })

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

        <Modal.Body className="p-5">
          <form className="form w-100" onSubmit={formik.handleSubmit}>
            <div className="row justify-content-center">
              <div className="col">
                <div
                  className={`row ${
                    selectedValue ? "align-items-start" : "align-items-center"
                  }  mb-8`}
                >
                  <label
                    htmlFor="create_medicine_name"
                    className={`col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4  mb-sm-0 ${
                      selectedValue ? "mt-3" : ""
                    }  `}
                  >
                    Nama Obat
                  </label>
                  <div className="col-sm-7">
                    <AsyncSelect
                      id="create_name"
                      className={clsx(
                        {
                          "is-invalid":
                            formik.touched.name && formik.errors.name,
                        },
                        {
                          "is-valid":
                            formik.touched.name && !formik.errors.name,
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

                    {formik.touched.name && formik.errors.name && (
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.name}
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
                          <span className="text-danger">Stock sudah habis</span>
                        </div>
                      )
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="row align-items-center mb-8">
                  <label
                    htmlFor="create_unit"
                    className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0"
                  >
                    Satuan
                  </label>
                  <div className="col-sm-5">
                    <input
                      disabled
                      id="create_unit"
                      {...formik.getFieldProps("unit")}
                      className={clsx(
                        "form-control form-control-solid opacity-50 cursor-not-allowed ",
                        {
                          "is-invalid":
                            formik.touched.unit && formik.errors.unit,
                        },
                        {
                          "is-valid":
                            formik.touched.unit && !formik.errors.unit,
                        }
                      )}
                      type="text"
                      name="unit"
                      autoComplete="off"
                    />
                    {formik.touched.unit && formik.errors.unit && (
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.unit}
                      </Form.Control.Feedback>
                    )}
                  </div>
                </div>

                <div className="row align-items-center mb-8">
                  <label
                    htmlFor="create_strength"
                    className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0"
                  >
                    Kekuatan
                  </label>
                  <div className="col-sm-7">
                    <input
                      id="create_strength"
                      {...formik.getFieldProps("strength")}
                      className={clsx(
                        "form-control form-control-solid ",
                        {
                          "is-invalid":
                            formik.touched.strength && formik.errors.strength,
                        },
                        {
                          "is-valid":
                            formik.touched.strength && !formik.errors.strength,
                        }
                      )}
                      type="text"
                      name="strength"
                      autoComplete="off"
                    />
                    {formik.touched.strength && formik.errors.strength && (
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.strength}
                      </Form.Control.Feedback>
                    )}
                  </div>
                </div>
                <div className="row align-items-center mb-8">
                  <label
                    htmlFor="create_dose"
                    className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0"
                  >
                    Dosis
                  </label>
                  <div className="col-sm-5">
                    <input
                      id="create_dose"
                      {...formik.getFieldProps("dose")}
                      className={clsx(
                        "form-control form-control-solid ",
                        {
                          "is-invalid":
                            formik.touched.dose && formik.errors.dose,
                        },
                        {
                          "is-valid":
                            formik.touched.dose && !formik.errors.dose,
                        }
                      )}
                      type="text"
                      name="dose"
                      autoComplete="off"
                    />
                    {formik.touched.dose && formik.errors.dose && (
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.dose}
                      </Form.Control.Feedback>
                    )}
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
                )}
              </div>
            </div>
          </form>

          {/* )} */}
        </Modal.Body>
      </Modal>
    </>
  )
}
