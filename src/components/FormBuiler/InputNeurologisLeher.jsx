import { dynamicFormControlClass } from "helpers/formik-helper"
import useDidMountEffect from "hooks/useDidMountEffect"
import React, { useEffect } from "react"
import { registerField } from "./InputFungsional"

export default function InputNeurologisLeher({
  formik,
  item: { label, name },
}) {
  const inputData = [
    {
      info: "Kaku Kuduk",
      name: "neurologis_leher_kaku_kuduk",
    },
    {
      info: "Meningeal Sign",
      name: "neurologis_leher_meningeal_sign",
    },
    {
      info: "Brudzinski",
      name: "neurologis_leher_brudzinski",
    },
    {
      info: "Dolls eye phenomen",
      name: "neurologis_leher_dolls_eye_phenomen",
    },
  ]

  /** Mendaftarkan validasi ke formik */
  useEffect(() => {
    inputData.forEach((data) => {
      registerField(formik, data.name, "required")
    })
  }, [])

  /** Menyentuh inputan untuk mentrigger error */
  useDidMountEffect(() => {
    inputData.forEach((data) => {
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
      <div className="row mb-4">
        <label className="form-label col-sm-5 text-start text-sm-end fs-6 fw-medium text-gray-700 mt-sm-3 mt-0">
          {label}
        </label>
        <div className="col-sm-6">
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
                        formik.setFieldValue("neurologis_leher", {
                          ...formik.values.neurologis_leher,
                          [data.name]: event.target.value,
                        })
                      }}
                      className={dynamicFormControlClass(formik, data.name)}
                      type="string"
                      name={data.name}
                      value={formik.values[data.name] ?? ""}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
