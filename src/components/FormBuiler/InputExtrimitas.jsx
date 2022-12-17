import { dynamicFormControlClass } from "helpers/formik-helper"
import useDidMountEffect from "hooks/useDidMountEffect"
import React, { useEffect } from "react"
import styled from "styled-components"
import NeurologisExtrimitas from "../../assets/images/neurologis_extrimitas.png"
import { registerField } from "./InputFungsional"
import { ValidateStyled as BaseValidateStyled } from "./InputRadio"

const ValidateStyled = styled(BaseValidateStyled)`
  :after {
    top: 10px;
    left: 40%;
  }
`

export default function InputExtrimitas({ formik, item: { name } }) {
  const inputExtrimitasSyarafGerak = {
    label: "Extrimitas syaraf gerak",
    inputs: [
      {
        name: "extrimitas_syaraf_gerak_I",
        info: "I",
      },
      {
        name: "extrimitas_syaraf_gerak_II",
        info: "II",
      },
      {
        name: "extrimitas_syaraf_gerak_III",
        info: "III",
      },
      {
        name: "extrimitas_syaraf_gerak_IV",
        info: "IV",
      },
    ],
  }

  const inputExtrimitasRefleksFisiologi = {
    label: "Extrimitas refleks fisiologi",
    inputs: [
      {
        name: "extrimitas_refleks_fisiologi_I",
        info: "I",
      },
      {
        name: "extrimitas_refleks_fisiologi_II",
        info: "II",
      },
      {
        name: "extrimitas_refleks_fisiologi_III",
        info: "III",
      },
      {
        name: "extrimitas_refleks_fisiologi_IV",
        info: "IV",
      },
    ],
  }

  const inputExtrimitasKekuatanMotorik = {
    label: "Extrimitas kekuatan motorik",
    inputs: [
      {
        name: "extrimitas_kekuatan_motorik_I",
        info: "I",
      },
      {
        name: "extrimitas_kekuatan_motorik_II",
        info: "II",
      },
      {
        name: "extrimitas_kekuatan_motorik_III",
        info: "III",
      },
      {
        name: "extrimitas_kekuatan_motorik_IV",
        info: "IV",
      },
    ],
  }

  const inputExtrimitasRefleksPatologi = {
    label: "Extrimitas refleks patologi",
    inputs: [
      {
        name: "extrimitas_refleks_patologi_I",
        info: "I",
      },
      {
        name: "extrimitas_refleks_patologi_II",
        info: "II",
      },
      {
        name: "extrimitas_refleks_patologi_III",
        info: "III",
      },
      {
        name: "extrimitas_refleks_patologi_IV",
        info: "IV",
      },
    ],
  }

  /** Mendaftarkan validasi ke formik */
  useEffect(() => {
    inputExtrimitasSyarafGerak.inputs.forEach((data) => {
      registerField(formik, data.name + "_tanda", "required")
    })
    inputExtrimitasRefleksFisiologi.inputs.forEach((data) => {
      registerField(formik, data.name, "required")
    })
    inputExtrimitasKekuatanMotorik.inputs.forEach((data) => {
      registerField(formik, data.name, "required")
    })
    inputExtrimitasRefleksPatologi.inputs.forEach((data) => {
      registerField(formik, data.name, "required")
    })
  }, [])

  /** Menyentuh inputan untuk mentrigger error */
  useDidMountEffect(() => {
    inputExtrimitasSyarafGerak.inputs.forEach((data) => {
      formik.setFieldTouched(data.name + "_tanda")
      formik.setFieldTouched(data.name + "_plus")
      formik.setFieldTouched(data.name + "_minus")
    })
    inputExtrimitasRefleksFisiologi.inputs.forEach((data) => {
      formik.setFieldTouched(data.name)
    })
    inputExtrimitasKekuatanMotorik.inputs.forEach((data) => {
      formik.setFieldTouched(data.name)
    })
    inputExtrimitasRefleksPatologi.inputs.forEach((data) => {
      formik.setFieldTouched(data.name)
    })
  }, [formik.isSubmitting])

  const parentValue = formik.values[name]

  useDidMountEffect(() => {
    setTimeout(() => {
      Object.keys(parentValue).forEach((keyName) => {
        formik.setFieldValue(keyName, parentValue[keyName])
      })
    }, 500)
  }, [formik.initialValues])

  return (
    <>
      <div className="row mb-8">
        <div className="col-sm-5 d-flex flex-column">
          <label className="form-label fs-5 fw-semi-bold text-gray-700 mt-0 mb-10">
            {inputExtrimitasSyarafGerak.label}
          </label>
          <div className="d-flex flex-center">
            <img src={NeurologisExtrimitas} alt="neurologis_extrimitas" />
          </div>
        </div>
        <div className="col-sm-6">
          {inputExtrimitasSyarafGerak.inputs.map((data, key) => {
            return (
              <React.Fragment key={key}>
                <ValidateStyled
                  isInvalid={
                    formik.touched[data.name + "_tanda"] &&
                    formik.errors[data.name + "_tanda"]
                  }
                  isValid={
                    formik.touched[data.name + "_tanda"] &&
                    !formik.errors[data.name + "_tanda"]
                  }
                >
                  <div className="d-flex align-items-center mb-4">
                    <div className="btn bg-gray-200 text-gray-600 btn-icon flex-shrinks-0 me-6">
                      {data.info}
                    </div>
                    <div>
                      <div className="form-check form-check-inline form-check-solid my-3">
                        <input
                          className="form-check-input"
                          name={data.name + "_tanda"}
                          id={data.name + "_plus"}
                          type="radio"
                          checked={
                            formik.values[name][data.name + "_tanda"] === "plus"
                          }
                          onChange={() => {
                            formik.setFieldValue(name, {
                              ...formik.values[name],
                              [data.name + "_tanda"]: "plus",
                            })
                            formik.setFieldValue(data.name + "_tanda", "plus")
                            setTimeout(
                              () =>
                                formik.setFieldTouched(data.name + "_tanda"),
                              500
                            )
                          }}
                        />
                        <label
                          htmlFor={data.name + "_plus"}
                          className="form-check-label text-gray-600"
                        >
                          Plus
                        </label>
                      </div>
                      <div className="form-check form-check-inline form-check-solid my-3">
                        <input
                          className="form-check-input"
                          name={data.name + "_tanda"}
                          id={data.name + "_minus"}
                          type="radio"
                          checked={
                            formik.values[name][data.name + "_tanda"] ===
                            "minus"
                          }
                          onChange={() => {
                            formik.setFieldValue(name, {
                              ...formik.values[name],
                              [data.name + "_tanda"]: "minus",
                            })
                            formik.setFieldValue(data.name + "_tanda", "minus")
                            setTimeout(
                              () =>
                                formik.setFieldTouched(data.name + "_tanda"),
                              500
                            )
                          }}
                        />
                        <label
                          htmlFor={data.name + "_minus"}
                          className="form-check-label text-gray-600"
                        >
                          Minus
                        </label>
                      </div>
                    </div>
                  </div>
                </ValidateStyled>
                <div className="row mb-4">
                  {formik.values[name][data.name + "_tanda"] === "plus" && (
                    <>
                      {formik.unregisterField(data.name + "_minus")}
                      {registerField(formik, data.name + "_plus", "required")}
                      <div className="col">
                        <div className="input-group">
                          <span className="input-group-text bg-gray-200 text-gray-600 border-0">
                            Plus
                          </span>
                          <input
                            id={data.name + "_plus"}
                            onBlur={
                              formik.getFieldProps(data.name + "_plus").onBlur
                            }
                            onChange={(event) => {
                              formik.setFieldValue(
                                data.name + "_plus",
                                event.target.value
                              )
                              formik.setFieldValue(name, {
                                ...formik.values[name],
                                [data.name + "_plus"]: event.target.value,
                              })
                            }}
                            className={dynamicFormControlClass(
                              formik,
                              data.name + "_plus"
                            )}
                            type="string"
                            value={
                              formik.values[name][data.name + "_plus"] ?? ""
                            }
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {formik.values[name][data.name + "_tanda"] === "minus" && (
                    <>
                      {formik.unregisterField(data.name + "_plus")}
                      {registerField(formik, data.name + "_minus", "required")}
                      <div className="col">
                        <div className="input-group">
                          <span className="input-group-text bg-gray-200 text-gray-600 border-0">
                            Minus
                          </span>
                          <input
                            id={data.name + "_minus"}
                            onBlur={
                              formik.getFieldProps(data.name + "_minus").onBlur
                            }
                            onChange={(event) => {
                              formik.setFieldValue(
                                data.name + "_minus",
                                event.target.value
                              )
                              formik.setFieldValue(name, {
                                ...formik.values[name],
                                [data.name + "_minus"]: event.target.value,
                              })
                            }}
                            className={dynamicFormControlClass(
                              formik,
                              data.name + "_minus"
                            )}
                            type="string"
                            value={
                              formik.values[name][data.name + "_minus"] ?? ""
                            }
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </div>
      <div className="row mb-8">
        <div className="col-sm-5 d-flex flex-column">
          <label className="form-label fs-5 fw-semi-bold text-gray-700 mt-0 mb-10">
            {inputExtrimitasRefleksFisiologi.label}
          </label>
          <div className="d-flex flex-center">
            <img src={NeurologisExtrimitas} alt="neurologis_extrimitas" />
          </div>
        </div>
        <div className="col-sm-6">
          {inputExtrimitasRefleksFisiologi.inputs.map((data, key) => {
            return (
              <React.Fragment key={key}>
                <ValidateStyled
                  isInvalid={
                    formik.touched[data.name] && formik.errors[data.name]
                  }
                  isValid={
                    formik.touched[data.name] && !formik.errors[data.name]
                  }
                >
                  <div className="d-flex align-items-center mb-4">
                    <div className="btn bg-gray-200 text-gray-600 btn-icon flex-shrinks-0 me-6">
                      {data.info}
                    </div>
                    <div>
                      <div className="form-check form-check-inline form-check-solid my-3">
                        <input
                          className="form-check-input"
                          name={data.name}
                          id={data.name + "_plus"}
                          type="radio"
                          checked={formik.values[name][data.name] === "plus"}
                          onChange={() => {
                            formik.setFieldValue(name, {
                              ...formik.values[name],
                              [data.name]: "plus",
                            })
                            formik.setFieldValue(data.name, "plus")
                            setTimeout(
                              () => formik.setFieldTouched(data.name),
                              500
                            )
                          }}
                        />
                        <label
                          htmlFor={data.name + "_plus"}
                          className="form-check-label text-gray-600"
                        >
                          Plus
                        </label>
                      </div>
                      <div className="form-check form-check-inline form-check-solid my-3">
                        <input
                          className="form-check-input"
                          name={data.name}
                          id={data.name + "_minus"}
                          type="radio"
                          checked={formik.values[name][data.name] === "minus"}
                          onChange={() => {
                            formik.setFieldValue(name, {
                              ...formik.values[name],
                              [data.name]: "minus",
                            })
                            formik.setFieldValue(data.name, "minus")
                            setTimeout(
                              () => formik.setFieldTouched(data.name),
                              500
                            )
                          }}
                        />
                        <label
                          htmlFor={data.name + "_minus"}
                          className="form-check-label text-gray-600"
                        >
                          Minus
                        </label>
                      </div>
                    </div>
                  </div>
                </ValidateStyled>
              </React.Fragment>
            )
          })}
        </div>
      </div>
      <div className="row mb-8">
        <div className="col-sm-5 d-flex flex-column">
          <label className="form-label fs-5 fw-semi-bold text-gray-700 mt-0 mb-10">
            {inputExtrimitasKekuatanMotorik.label}
          </label>
          <div className="d-flex flex-center">
            <img src={NeurologisExtrimitas} alt="neurologis_extrimitas" />
          </div>
        </div>
        <div className="col-sm-6">
          {inputExtrimitasKekuatanMotorik.inputs.map((data, key) => {
            return (
              <React.Fragment key={key}>
                <ValidateStyled
                  isInvalid={
                    formik.touched[data.name] && formik.errors[data.name]
                  }
                  isValid={
                    formik.touched[data.name] && !formik.errors[data.name]
                  }
                >
                  <div className="d-flex align-items-center mb-4">
                    <div className="btn bg-gray-200 text-gray-600 btn-icon flex-shrinks-0 me-6">
                      {data.info}
                    </div>
                    <div>
                      <div className="form-check form-check-inline form-check-solid my-3">
                        <input
                          className="form-check-input"
                          name={data.name}
                          id={data.name + "_plus"}
                          type="radio"
                          checked={formik.values[name][data.name] === "plus"}
                          onChange={() => {
                            formik.setFieldValue(name, {
                              ...formik.values[name],
                              [data.name]: "plus",
                            })
                            formik.setFieldValue(data.name, "plus")
                            setTimeout(
                              () => formik.setFieldTouched(data.name),
                              500
                            )
                          }}
                        />
                        <label
                          htmlFor={data.name + "_plus"}
                          className="form-check-label text-gray-600"
                        >
                          Plus
                        </label>
                      </div>
                      <div className="form-check form-check-inline form-check-solid my-3">
                        <input
                          className="form-check-input"
                          name={data.name}
                          id={data.name + "_minus"}
                          type="radio"
                          checked={formik.values[name][data.name] === "minus"}
                          onChange={() => {
                            formik.setFieldValue(name, {
                              ...formik.values[name],
                              [data.name]: "minus",
                            })
                            formik.setFieldValue(data.name, "minus")
                            setTimeout(
                              () => formik.setFieldTouched(data.name),
                              500
                            )
                          }}
                        />
                        <label
                          htmlFor={data.name + "_minus"}
                          className="form-check-label text-gray-600"
                        >
                          Minus
                        </label>
                      </div>
                    </div>
                  </div>
                </ValidateStyled>
              </React.Fragment>
            )
          })}
        </div>
      </div>
      <div className="row mb-8">
        <div className="col-sm-5 d-flex flex-column">
          <label className="form-label fs-5 fw-semi-bold text-gray-700 mt-0 mb-10">
            {inputExtrimitasRefleksPatologi.label}
          </label>
          <div className="d-flex flex-center">
            <img src={NeurologisExtrimitas} alt="neurologis_extrimitas" />
          </div>
        </div>
        <div className="col-sm-6">
          {inputExtrimitasRefleksPatologi.inputs.map((data, key) => {
            return (
              <React.Fragment key={key}>
                <div className="col mb-4">
                  <div className="input-group">
                    <span className="input-group-text bg-gray-200 w-50px flex flex-center text-gray-600 border-0">
                      {data.info}
                    </span>
                    <input
                      id={data.name}
                      onBlur={formik.getFieldProps(data.name).onBlur}
                      onChange={(event) => {
                        formik.setFieldValue(data.name, event.target.value)
                        formik.setFieldValue(name, {
                          ...formik.values[name],
                          [data.name]: event.target.value,
                        })
                      }}
                      className={dynamicFormControlClass(formik, data.name)}
                      type="number"
                      value={formik.values[name][data.name] ?? ""}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </>
  )
}
