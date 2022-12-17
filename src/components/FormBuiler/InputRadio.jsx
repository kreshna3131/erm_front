import { lowerSnake } from "helpers/string-helper"
import React from "react"
import styled from "styled-components"

export const ValidateStyled = styled.div`
  display: inline;
  position: relative;

  &:after {
    content: "";
    height: 20px;
    width: 20px;
    position: absolute;
    background-image: ${(props) =>
      props.isInvalid
        ? `url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23CB003F%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23CB003F%27 stroke=%27none%27/%3e%3c/svg%3e");`
        : props.isValid
        ? `url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 8 8%27%3e%3cpath fill=%27%2375C44C%27 d=%27M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z%27/%3e%3c/svg%3e");`
        : `none;`}
    background-repeat: no-repeat;
    background-position: center;
    background-size: 20px 20px;
  }
`

export default function InputRadio({ formik, item: { label, name, items } }) {
  const parsedItems = JSON.parse(items)

  return (
    <div className="row mb-4">
      <div className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4">
        {label}
      </div>
      <div className="col-sm-7">
        <ValidateStyled
          isInvalid={formik.touched[name] && formik.errors[name]}
          isValid={formik.touched[name] && !formik.errors[name]}
        >
          {parsedItems.map((item, key) => (
            <>
              <div
                key={key}
                className="form-check form-check-inline form-check-solid mb-4"
              >
                <input
                  className="form-check-input"
                  type="radio"
                  name={name}
                  id={`${name}_${lowerSnake(item.value)}`}
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
                  htmlFor={`${name}_${lowerSnake(item.value)}`}
                >
                  {item.label}
                </label>
              </div>
            </>
          ))}
        </ValidateStyled>
      </div>
    </div>
  )
}
