import clsx from "clsx"
import React from "react"
import Flatpickr from "react-flatpickr"
import "../../assets/css/flatpickr.css"
import { Indonesian } from "flatpickr/dist/l10n/id"

export default function InputDate({ formik, item: { name, label } }) {
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
          <Flatpickr
            options={{
              mode: "single",
              enableTime: false,
              dateFormat: "d/M/Y",
              maxDate: new Date(),
              locale: Indonesian,
              onChange: function (selectedDates, dateStr, instance) {
                formik.setValues({
                  ...formik.values,
                  ...{
                    [name]: selectedDates[0],
                  },
                })
                instance.setDate(selectedDates[0])
              },
              onClose: (date) => {
                if (date.length === 0) {
                  formik.setTouched({
                    ...formik.touched,
                    ...{
                      [name]: true,
                    },
                  })
                }
              },
            }}
            value={formik.values[name]}
            name={name}
            className={clsx(
              "form-control form-control-solid",
              {
                "is-invalid": formik.touched[name] && formik.errors[name],
              },
              {
                "is-valid": formik.touched[name] && !formik.errors[name],
              }
            )}
          />
        </div>
      </div>
    </div>
  )
}
