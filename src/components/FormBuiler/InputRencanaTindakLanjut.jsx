import clsx from "clsx"
import { lowerSnake } from "helpers/string-helper"
import useDidMountEffect from "hooks/useDidMountEffect"
import _ from "lodash"
import React, { useEffect, useState } from "react"
import { ValidateStyled } from "./InputRadio"

const inputData = [
  { label: "Riwayat jalan", childs: [] },
  {
    label: "Rawat inap",
    childs: [
      {
        label: "Ruang",
        name: "rencana_tindak_lanjut_rawat_inap_ruang",
      },
      {
        label: "Indikasi",
        name: "rencana_tindak_lanjut_rawat_inap_indikasi",
      },
      {
        label: "DPJP",
        name: "rencana_tindak_lanjut_rawat_inap_dpjp",
      },
    ],
  },
  {
    label: "Rujuk ke",
    childs: [
      {
        label: "RS",
        name: "rencana_tindak_lanjut_rujuk_ke_rs",
      },
      {
        label: "Dokter spesialis",
        name: "rencana_tindak_lanjut_rujuk_ke_dokter_spesialis",
      },
    ],
  },
  {
    label: "Konsul ke",
    childs: [
      {
        label: "Dokter spesialis",
        name: "rencana_tindak_lanjut_konsul_ke_dokter_spesialis",
      },
      {
        label: "Gizi",
        name: "rencana_tindak_lanjut_konsul_ke_dokter_gizi",
      },
      {
        label: "Lain-lain",
        name: "rencana_tindak_lanjut_konsul_ke_dokter_lain_lain",
      },
    ],
  },
]

/**
 * Menambahkan / mengurangi field validation di formik
 * @param {Object} formik
 * @param {Object} parentObject
 * @param {String} rules
 */
function useToggleField(formik, parentObject, rules) {
  useDidMountEffect(() => {
    if (formik.values.rencana_tindak_lanjut.value === parentObject.label) {
      parentObject.childs.forEach((childItem) => {
        formik.registerField(childItem.name, {
          validate(value) {
            let errorMessage
            if (!value && rules === "required") {
              errorMessage = childItem.name + " is required field"
            }
            return errorMessage
          },
        })
      })
    } else {
      parentObject.childs.forEach((childItem) => {
        formik.unregisterField(childItem.name)
      })
    }

    parentObject.childs.forEach((childItem) => {
      formik.setFieldValue(childItem.name, "")
      // formik.setFieldTouched(childItem.name)
    })
  }, [formik.values.rencana_tindak_lanjut.value])
}

export default function InputRencanaTindakLanjut({
  formik,
  item: { label, name, rules },
}) {
  useToggleField(formik, inputData[0], rules)
  useToggleField(formik, inputData[1], rules)
  useToggleField(formik, inputData[2], rules)
  useToggleField(formik, inputData[3], rules)

  const parentValue = formik.values[name]

  useDidMountEffect(() => {
    setTimeout(() => {
      if (![null, undefined].includes(parentValue?.childValue)) {
        Object.keys(parentValue.childValue).forEach((keyName) => {
          formik.setFieldValue(keyName, parentValue.childValue[keyName])
        })
      }
    }, 500)
  }, [formik.initialValues])

  return (
    <div className="row mb-4">
      <div className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4">
        {label}
      </div>
      <div className="col-sm-7">
        {inputData.map((item, key) => {
          return (
            <React.Fragment key={key}>
              <div className="form-check form-check-solid mb-8">
                <ValidateStyled
                  isInvalid={
                    formik.touched[name] &&
                    formik.errors[name] &&
                    parentValue.value?.toString() === item.label?.toString()
                  }
                  isValid={
                    formik.touched[name] &&
                    !formik.errors[name] &&
                    parentValue.value?.toString() === item.label?.toString()
                  }
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name={name}
                    id={`${name}_${lowerSnake(item.label)}`}
                    value={lowerSnake(item.label)}
                    onChange={() =>
                      formik.setFieldValue(name, {
                        value: item.label,
                        childValue: {},
                      })
                    }
                    onClick={() => formik.setFieldTouched(name)}
                    checked={
                      parentValue.value?.toString() === item.label?.toString()
                        ? true
                        : false
                    }
                  />
                  <label
                    className="form-check-label text-gray-600 me-4"
                    htmlFor={`${name}_${lowerSnake(item.label)}`}
                  >
                    {item.label}
                  </label>
                </ValidateStyled>
              </div>
              {item.label === parentValue.value && (
                <div className="ms-8">
                  {item.childs.map((childItem, key) => (
                    <div key={key} className="input-group mb-5">
                      <span className="input-group-text bg-gray-200 text-gray-600 border-0">
                        {childItem.label}
                      </span>
                      <input
                        id={lowerSnake(childItem.label)}
                        onChange={(event) => {
                          formik.setFieldValue(
                            childItem.name,
                            event.target.value
                          )
                          formik.setFieldValue(name, {
                            ...parentValue,
                            childValue: {
                              ...parentValue.childValue,
                              [childItem.name]: event.target.value,
                            },
                          })
                        }}
                        value={formik.values[childItem.name] ?? ""}
                        onBlur={() => formik.setFieldTouched(childItem.name)}
                        className={clsx(
                          "form-control form-control-solid",
                          {
                            "is-invalid":
                              formik.touched[childItem.name] &&
                              formik.errors[childItem.name],
                          },
                          {
                            "is-valid":
                              formik.touched[childItem.name] &&
                              !formik.errors[childItem.name],
                          }
                        )}
                        type="text"
                        autoComplete="off"
                      />
                    </div>
                  ))}
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
