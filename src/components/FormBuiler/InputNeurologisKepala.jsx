import { dynamicFormControlClass } from "helpers/formik-helper"
import useDidMountEffect from "hooks/useDidMountEffect"
import React, { useEffect } from "react"
import { registerField } from "./InputFungsional"
import { ValidateStyled } from "./InputRadio"

export default function InputNeurologisKepala({
  formik,
  item: { label, name },
}) {
  const inputData = [
    {
      info: "Refleks Cahaya",
      name: "neurologis_kepala_refleks_cahaya",
    },
    {
      info: "Refleks Koenea",
      name: "neurologis_kepala_refleks_kornea",
    },
    {
      info: "Nervi Cranialis (I-XII)",
      name: "neurologis_kepala_nervi_kranialis",
    },
  ]

  const inputDiameterPupil = [
    {
      info: "Diameter pupil kanan",
      name: "neurologis_kepala_diameter_pupil_kanan",
    },
    {
      info: "Diameter pupil kiri",
      name: "neurologis_kepala_diameter_pupil_kiri",
    },
  ]

  /** Mendaftarkan validasi ke formik */
  useEffect(() => {
    inputData.forEach((data) => {
      registerField(formik, data.name, "required")
    })
    inputDiameterPupil.forEach((data) => {
      registerField(formik, data.name, "required")
    })
    registerField(formik, "neurologis_kepala_ukuran_pupil", "required")
  }, [])

  /** Menyentuh inputan untuk mentrigger error */
  useDidMountEffect(() => {
    inputData.forEach((data) => {
      formik.setFieldTouched(data.name)
    })
    inputDiameterPupil.forEach((data) => {
      formik.setFieldTouched(data.name)
    })
    formik.setFieldTouched("neurologis_kepala_ukuran_pupil")
  }, [formik.isSubmitting])

  const parentValue = formik.values[name]

  useDidMountEffect(() => {
    setTimeout(() => {
      Object.keys(parentValue).forEach((keyName) => {
        formik.setFieldValue(keyName, parentValue[keyName])
      })
    }, 500)
  }, [formik.initialValues])

  useDidMountEffect(() => {
    formik.setFieldTouched("neurologis_kepala_ukuran_pupil")
  }, [formik.values?.neurologis_kepala_ukuran_pupil])

  return (
    <>
      <div className="row mb-4">
        <label className="form-label col-sm-5 text-start text-sm-end fs-6 fw-medium text-gray-700 mt-sm-3 mt-0">
          {label}
        </label>
        <div className="col-sm-6">
          <>
            {inputDiameterPupil.map((data, key) => {
              return (
                <div key={key} className="row mb-4">
                  <div className="col">
                    <div className="input-group">
                      <span className="input-group-text bg-gray-200 text-gray-600 border-0">
                        Diameter pupil kanan
                      </span>
                      <input
                        id={data.name}
                        onBlur={formik.getFieldProps(data.name).onBlur}
                        onChange={(event) => {
                          formik.setFieldValue(data.name, event.target.value)
                          formik.setFieldValue([name], {
                            ...formik.values[name],
                            [data.name]: event.target.value,
                          })
                        }}
                        value={formik.values[data.name] ?? ""}
                        className={dynamicFormControlClass(formik, data.name)}
                        min="0"
                        type="number"
                        name={data.name}
                        autoComplete="off"
                      />
                      <span className="input-group-text bg-gray-200 text-gray-600 border-0">
                        mm
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="row mt-8 mb-4">
              <div className="col">
                <ValidateStyled
                  isInvalid={
                    formik.touched["neurologis_kepala_ukuran_pupil"] &&
                    formik.errors["neurologis_kepala_ukuran_pupil"]
                  }
                  isValid={
                    formik.touched["neurologis_kepala_ukuran_pupil"] &&
                    !formik.errors["neurologis_kepala_ukuran_pupil"]
                  }
                >
                  <div className="form-check form-check-inline form-check-solid mb-4">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="neurologis_kepala_ukuran_pupil"
                      id="neurologis_kepala_ukuran_pupil_isokor"
                      value="isokor"
                      onChange={(event) => {
                        formik.setFieldValue(
                          "neurologis_kepala_ukuran_pupil",
                          event.target.value
                        )
                        formik.setFieldValue([name], {
                          ...formik.values[name],
                          neurologis_kepala_ukuran_pupil: event.target.value,
                        })
                      }}
                      checked={
                        formik.values[name][
                          "neurologis_kepala_ukuran_pupil"
                        ] === "isokor"
                          ? true
                          : false
                      }
                    />
                    <label
                      className="form-check-label text-gray-600"
                      htmlFor="neurologis_kepala_ukuran_pupil_isokor"
                    >
                      Isokor
                    </label>
                  </div>
                  <div className="form-check form-check-inline form-check-solid mb-4">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="neurologis_kepala_ukuran_pupil"
                      id="neurologis_kepala_ukuran_pupil_anisokor"
                      value="anisokor"
                      onChange={(event) => {
                        formik.setFieldValue(
                          "neurologis_kepala_ukuran_pupil",
                          event.target.value
                        )
                        formik.setFieldValue([name], {
                          ...formik.values[name],
                          neurologis_kepala_ukuran_pupil: event.target.value,
                        })
                      }}
                      checked={
                        formik.values[name][
                          "neurologis_kepala_ukuran_pupil"
                        ] === "anisokor"
                          ? true
                          : false
                      }
                    />
                    <label
                      className="form-check-label text-gray-600"
                      htmlFor="neurologis_kepala_ukuran_pupil_anisokor"
                    >
                      Anisokor
                    </label>
                  </div>
                </ValidateStyled>
              </div>
            </div>
            {inputData.map((data, key) => {
              return (
                <div key={key} className="row mb-4">
                  <div className="col">
                    <div className="input-group">
                      <span className="input-group-text bg-gray-200 text-gray-600 border-0">
                        {data.info}
                      </span>
                      <input
                        id={data.name}
                        onBlur={formik.getFieldProps(data.name).onBlur}
                        onChange={(event) => {
                          formik.setFieldValue(data.name, event.target.value)
                          formik.setFieldValue([name], {
                            ...formik.values[name],
                            [data.name]: event.target.value,
                          })
                        }}
                        value={formik.values[data.name] ?? ""}
                        className={dynamicFormControlClass(formik, data.name)}
                        type="string"
                        name={data.name}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        </div>
      </div>
    </>
  )
}
