import React, { useState, useEffect } from "react"
import clsx from "clsx"
import useDidMountEffect from "../../hooks/useDidMountEffect"
import { lowerSnake } from "../../helpers/string-helper"

const inputData = {
  label: "",
  name: "analisa_keperawatan",
  items: [
    {
      label: "Bersihan jalan nafas tidak efektif",
      value: "Bersihan jalan nafas tidak efektif",
    },
    {
      label: "Gangguan rasa nyaman",
      value: "Gangguan rasa nyaman",
      text: "",
    },
    {
      label: "Nyeri",
      value: "Nyeri",
    },
    {
      label: "Penurunan curah Jantung",
      value: "Penurunan curah Jantung",
    },
    {
      label: "Kerusakan pertukaran gas",
      value: "Kerusakan pertukaran gas",
    },
    {
      label: "Intoleransi aktivitas",
      value: "Intoleransi aktivitas",
    },
    {
      label:
        "Perubahan perfusi jaringan jantung paru / jaringan otak / perifer",
      value:
        "Perubahan perfusi jaringan jantung paru / jaringan otak / perifer",
    },
    {
      label: "Pola nafas tidak efektif",
      value: "Pola nafas tidak efektif",
    },
    {
      label: "Resiko cidera",
      value: "Resiko cidera",
    },
    {
      label: "Kelebihan / Kurang volume cairan",
      value: "Kelebihan / Kurang volume cairan",
    },
    {
      label: "Gangguan mobilitas fisik",
      value: "Gangguan mobilitas fisik",
    },
    {
      label: "Konstipasi / diare",
      value: "Konstipasi / diare",
    },
    {
      label: "Perubahan nutrisi kurang / lebih kebutuhan",
      value: "Perubahan nutrisi kurang / lebih kebutuhan",
    },
    {
      label: "Resiko infeksi / sepsis",
      value: "Resiko infeksi / sepsis",
    },
    {
      label: "Resiko jatuh",
      value: "Resiko jatuh",
    },
    {
      label: "Keseimbangan cairan & elektrolit",
      value: "Keseimbangan cairan & elektrolit",
    },
    {
      label: "Gangguan integritas kulit / jaringan",
      value: "Gangguan integritas kulit / jaringan",
    },
    {
      label: "Cemas",
      value: "Cemas",
    },
    {
      label: "Menyusui kurang efektif",
      value: "Menyusui kurang efektif",
    },
    {
      label: "Gangguan tumbuh kembang",
      value: "Gangguan tumbuh kembang",
    },
    {
      label: "Hipertermi / hipotermi",
      value: "Hipertermi / hipotermi",
    },
    {
      label: "Gangguan komunikasi verbal",
      value: "Gangguan komunikasi verbal",
    },
    {
      label: "Gangguan pola tidur",
      value: "Gangguan pola tidur",
    },
    {
      label: "Lain lain",
      value: "Lain lain",
      text: "",
    },
  ],
}

const { name } = inputData

const uniqueLabel = ["Gangguan rasa nyaman", "Lain lain"]

/**
 * Register / unregister field text
 */
function toggleRegisterInputText({ formik, condition, fieldName }) {
  if (condition) {
    formik.unregisterField(fieldName)
  } else {
    formik.registerField(fieldName, {
      validate() {
        return fieldName + " is required field"
      },
    })
  }
}

export default function InputAnalisaKeperawatan({ formik }) {
  const [finalValue, setFinalValue] = useState([])

  useDidMountEffect(() => {
    formik.setFieldValue("analisa_keperawatan", JSON.stringify(finalValue))
  }, [finalValue])

  useEffect(() => {
    try {
      const parsedJSON = JSON.parse(formik.values.analisa_keperawatan)
      setFinalValue(parsedJSON)
    } catch (error) {
      setFinalValue([])
    }
  }, [])

  useDidMountEffect(() => {
    if (formik.isValidating) {
      formik.registerField("analisa_keperawatan", {
        validate(value) {
          let errorMessage
          if (!value || value === "[]") {
            errorMessage = "analisa_keperawatan is required field"
          }
          return errorMessage
        },
      })
    }
  }, [formik.isValidating])

  return (
    <div className="row">
      {inputData.items.map((item, key) => (
        <div key={key} className="col-md-4">
          <div
            key={key}
            className="form-check form-check-inline form-check-solid mb-8"
          >
            <input
              className="form-check-input"
              type="checkbox"
              name={name}
              id={name + item.value}
              value={item.value}
              onChange={(event) => {
                const fieldName = lowerSnake(
                  `${name}_${lowerSnake(item.label)}_text`
                )
                if (event.target.checked) {
                  if (uniqueLabel.includes(event.target.value)) {
                    setFinalValue(
                      finalValue.concat([
                        { value: event.target.value, text: "" },
                      ])
                    )
                    const condition = false
                    toggleRegisterInputText({ condition, fieldName, formik })
                  } else {
                    setFinalValue(
                      finalValue.concat([{ value: event.target.value }])
                    )
                  }
                } else {
                  const condition = true
                  toggleRegisterInputText({ condition, fieldName, formik })

                  setFinalValue(
                    finalValue.filter(
                      (data) => data.value !== event.target.value
                    )
                  )
                }
              }}
              onClick={formik.getFieldProps(name).onBlur}
              checked={
                finalValue.filter((data) => data.value === item.value).length
              }
            />
            <label
              className="form-check-label text-gray-600"
              htmlFor={name + item.value}
            >
              {item.label}
            </label>
          </div>
          {uniqueLabel.includes(item.value) &&
            finalValue.find((data) => data.value === item.value) && (
              <input
                id={name}
                value={finalValue.find((i) => i.value === item.value).text}
                onChange={(event) => {
                  const condition = event.target.value ? true : false
                  const fieldName = lowerSnake(
                    `${name}_${lowerSnake(item.label)}_text`
                  )
                  toggleRegisterInputText({ condition, fieldName, formik })
                  setFinalValue(
                    [{ value: item.value, text: event.target.value }].concat(
                      finalValue.filter((data) => data.value !== item.value)
                    )
                  )
                }}
                className={clsx(
                  "form-control form-control-solid mb-8",
                  {
                    "is-invalid":
                      finalValue.find((data) => data.value === item.value)
                        .text === "",
                  },
                  {
                    "is-valid":
                      finalValue.find((data) => data.value === item.value)
                        .text !== "",
                  }
                )}
                type="text"
                name={name}
                autoComplete="off"
              />
            )}
        </div>
      ))}
    </div>
  )
}
