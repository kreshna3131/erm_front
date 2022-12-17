import clsx from "clsx"
import React from "react"

export default function InputNumber({ formik, item: { name, label } }) {
  return (
    <div className="form-group mb-8">
      <div className="row">
        <div className="col-sm-5 d-flex justify-content-sm-end">
          <label
            htmlFor={name}
            className="form-label fs-6 fw-medium text-gray-700 mt-sm-3 mt-0"
          >
            {label}
          </label>
        </div>
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
            type="number"
            min={0}
            name={name}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  )
}
