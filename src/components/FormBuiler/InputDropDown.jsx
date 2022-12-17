import clsx from "clsx"
import { globalStyle } from "helpers/react-select"
import React from "react"
import Select from "react-select"

/**
 * Background dinamik untuk react select validation
 * @param {String} formik
 * @returns {String}
 */
export function dateBackground(formik, name) {
  if (formik.errors[name] && formik.touched[name]) {
    return `url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23cb003f%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23cb003f%27 stroke=%27none%27/%3e%3c/svg%3e")`
  }

  if (!formik.errors[name] && formik.touched[name]) {
    return `url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 8 8%27%3e%3cpath fill=%27%2375c44c%27 d=%27M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z%27/%3e%3c/svg%3e")`
  }

  return "none"
}

export default function InputDropDown({
  formik,
  item: { name, label, items },
}) {
  const parsedItems = JSON.parse(items)

  return (
    <div className="row align-items-center mb-8">
      <label
        htmlFor={name}
        className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0"
      >
        {label}
      </label>
      <div className="col-sm-7">
        <Select
          className={clsx(
            {
              "is-invalid": formik.touched[name] && formik.errors[name],
            },
            {
              "is-valid": formik.touched[name] && !formik.errors[name],
            }
          )}
          options={parsedItems}
          onBlur={() => formik.setFieldTouched(name)}
          value={{
            label:
              parsedItems.filter((item) => {
                return item.value === formik.values[name]
              })?.[0]?.label ?? "Select",
            value: formik.values[name],
          }}
          onChange={(option) => {
            formik.setFieldValue(name, option.value)
          }}
          name="status"
          id="status"
          styles={{
            ...globalStyle,
            control: (styles, state) => ({
              ...styles,
              backgroundColor: "#F5F8FA",
              padding: "5px",
              borderRadius: "0.475rem",
              border: state.isFocused ? 0 : 0,
              boxShadow: state.isFocused ? 0 : 0,
              padding: "4px",
              maxHeight: "42px",
              content: `""`,
              backgroundImage: dateBackground(formik, name),
              backgroundRepeat: "no-repeat",
              backgroundPosition: "85% center",
              backgroundSize: "calc(0.75em + 0.75rem) calc(0.75em + 0.75rem)",

              "&:hover": {
                border: state.isFocused ? 0 : 0,
              },
            }),
          }}
          noOptionsMessage={() => "Data tidak ditemukan"}
          components={{
            IndicatorSeparator: "",
          }}
        />
      </div>
    </div>
  )
}
