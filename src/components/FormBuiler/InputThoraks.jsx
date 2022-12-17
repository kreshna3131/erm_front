import clsx from "clsx"
import { upperFirst } from "lodash"
import React, { useEffect } from "react"

const inputNames = ["cor", "pulmo"]

export default function InputThoraks({ formik, item: { name, label, rules } }) {
  useEffect(() => {
    return inputNames.map((item) => {
      formik.registerField(`${name}_${item}`, {
        validate(value) {
          let errorMessage
          if (!value && rules === "required") {
            errorMessage = `${name}_${item}` + " is required field"
          }
          return errorMessage
        },
      })
    })
  }, [])

  return (
    <div className="row mb-4">
      <label
        htmlFor={name}
        className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mt-sm-4 mb-4 mb-sm-0"
      >
        {label}
      </label>
      <div className="col-sm-7">
        {inputNames.map((item, key) => (
          <div key={key} className="input-group mb-5">
            <span className="input-group-text bg-gray-200 text-gray-600 border-0">
              {upperFirst(item)}
            </span>
            <input
              id={`${name}_${item}`}
              {...formik.getFieldProps(`${name}_${item}`)}
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid":
                    formik.touched[`${name}_${item}`] &&
                    formik.errors[`${name}_${item}`],
                },
                {
                  "is-valid":
                    formik.touched[`${name}_${item}`] &&
                    !formik.errors[`${name}_${item}`],
                }
              )}
              type="text"
              name={`${name}_${item}`}
              autoComplete="off"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
