import clsx from "clsx"
import React from "react"

export default function InputText({ formik, item: { name, label } }) {
  return (
    <div className="row align-items-center mb-8">
      <label
        htmlFor={name}
        className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0"
      >
        {label}
      </label>
      <div className="col-sm-7">
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
          type="text"
          name={name}
          autoComplete="off"
        />
      </div>
    </div>
  )
}
