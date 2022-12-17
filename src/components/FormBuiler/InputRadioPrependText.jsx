import clsx from "clsx"
import React, { useEffect } from "react"
import { ValidateStyled } from "./InputRadio"

export default function InputRadioPrependText({
  formik,
  item: { label, name, items, info, rules },
}) {
  const parsedItems = JSON.parse(items)

  useEffect(() => {
    if (formik.values[name]?.toString() === "1") {
      formik.registerField(name + "_text", {
        validate(value) {
          let errorMessage
          if (!value && rules === "required") {
            errorMessage = name + " is required field"
          }
          return errorMessage
        },
      })
    } else {
      formik.unregisterField(name + "_text")
    }

    // formik.setFieldTouched(name + "_text")
  }, [formik.values[name]])

  return (
    <div className="row mb-8">
      <div className="col-sm-5 form-label fs-6 text-sm-end fw-medium text-gray-700 mb-4 mb-sm-0">
        {label}
      </div>
      <div className="col-sm-7">
        <div className="d-flex align-items-center">
          {parsedItems.map((item, key) => (
            <ValidateStyled
              key={key}
              isInvalid={formik.touched[name] && formik.errors[name]}
              isValid={formik.touched[name] && !formik.errors[name]}
            >
              <div
                key={key}
                className="form-check form-check-inline form-check-solid mb-0"
              >
                <input
                  className="form-check-input"
                  type="radio"
                  name={name}
                  id={name + item.value}
                  value={item.value}
                  onChange={formik.getFieldProps(name).onChange}
                  onClick={formik.getFieldProps(name).onBlur}
                  checked={
                    formik.values[name]?.toString() === item.value?.toString()
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label text-gray-600"
                  htmlFor={name + item.value}
                >
                  {item.label}
                </label>
              </div>
            </ValidateStyled>
          ))}
        </div>
        {formik.values[name]?.toString() === "1" && (
          <div className="input-group mt-5">
            <span className="input-group-text bg-gray-200 text-gray-600 border-0">
              {info}
            </span>
            <input
              id={name + "_text"}
              {...formik.getFieldProps(name + "_text")}
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid":
                    formik.touched[name + "_text"] &&
                    formik.errors[name + "_text"],
                },
                {
                  "is-valid":
                    formik.touched[name + "_text"] &&
                    !formik.errors[name + "_text"],
                }
              )}
              type="text"
              name={name + "_text"}
              autoComplete="off"
            />
          </div>
        )}
      </div>
    </div>
  )
}
