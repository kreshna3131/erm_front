import clsx from "clsx"
import React from "react"

export default function InputAppendNumber({
  formik,
  item: { name, label, info },
}) {
  return (
    <div className="row align-items-center mb-8">
      <label
        htmlFor={name}
        className="form-label col-sm-5 text-start text-sm-end fs-6 fw-medium text-gray-700 mt-sm-3 mt-0"
      >
        {label}
      </label>
      <div className="col-sm-7">
        <div className="input-group">
          <input
            id={name}
            {...formik.getFieldProps(name)}
            className={clsx(
              "form-control form-control-solid",
              {
                "is-invalid": formik.touched[name] && formik.errors[name],
              },
              {
                "is-valid": formik.touched[name] && !formik.errors[name],
              }
            )}
            type="number"
            min={0}
            name={name}
            autoComplete="off"
          />
          <span className="input-group-text bg-gray-200 text-gray-600 border-0">
            {info}
          </span>
        </div>
      </div>
    </div>
  )
}
