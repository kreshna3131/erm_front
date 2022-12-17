import clsx from "clsx"
import React, { useMemo } from "react"

export default function InputTextArea({ formik, item: { name, label } }) {
  const maxCharacter = 255
  const remainingCharacter = useMemo(
    () => maxCharacter - formik.values[name]?.length,
    [maxCharacter, formik.values[name]?.length]
  )

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
          <textarea
            id={name}
            value={formik.values[name]}
            onBlur={() =>
              formik.setTouched({
                ...formik.touched,
                ...{
                  [name]: true,
                },
              })
            }
            onChange={(event) => {
              formik.setValues({
                ...formik.values,
                ...{
                  [name]: event.currentTarget.value.substring(0, maxCharacter),
                },
              })
            }}
            className={clsx(
              "form-control form-control-solid",
              {
                "is-invalid": formik.touched[name] && formik.errors[name],
              },
              {
                "is-valid": formik.touched[name] && !formik.errors[name],
              }
            )}
            rows={3}
            type="text"
            name={name}
            autoComplete="off"
          ></textarea>
          <p className="text-gray-600 my-4">
            Tersisa {remainingCharacter} dari {maxCharacter} karakter
          </p>
        </div>
      </div>
    </div>
  )
}
