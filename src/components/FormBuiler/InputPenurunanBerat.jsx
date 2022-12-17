import React, { useEffect, useState } from "react"
import useDidMountEffect from "../../hooks/useDidMountEffect"

/**
 * @type {{
 * label: String,
 * name: String,
 * items: [
 *  {label: String, value: String}
 * ]
 * }}
 */
const inputPenurunanBerat = {
  label: "Apakah pasien mengalami penurunan BB dalam 6 bulan terakhir?",
  name: "nutrisional_dewasa_penurunan_bb",
  items: [
    {
      label: "a. Tidak ada penurunan (Score 0)",
      value: "tidak ada",
    },
    {
      label: "b. Tidak yakin / tidak tau / baju terasa longgar (Score 2)",
      value: "tidak yakin",
    },
    {
      label: "c. Jika ya, berapa penurunan BB tersebut? pilih salah satu :",
      value: "ya",
    },
  ],
}

const inputPilihanPenurunanBerat = {
  label: "",
  name: "nutrisional_dewasa_penurunan_bb_pilihan",
  items: [
    {
      label: "1 - 5 kg (Score 1)",
      value: "1 - 5 kg (Score 1)",
    },
    {
      label: "6 - 8 kg (Score 2)",
      value: "6 - 8 kg (Score 2)",
    },
    {
      label: "11 - 15 kg (Score 3)",
      value: "11 - 15 kg (Score 3)",
    },
    {
      label: "> 15 kg (Score 4)",
      value: "> 15 kg (Score 4)",
    },
  ],
}

const inputSkorPenurunanBerat = {
  name: "nutrisional_dewasa_penurunan_bb_total_skor",
}

function calculateResult(formik) {
  let total = 0
  switch (formik.values[inputPenurunanBerat.name]) {
    case "tidak yakin":
      return total + 2

    case "ya":
      switch (formik.values[inputPilihanPenurunanBerat.name]) {
        case "1 - 5 kg (Score 1)":
          return total + 1

        case "6 - 8 kg (Score 2)":
          return total + 2

        case "11 - 15 kg (Score 3)":
          return total + 3

        case "> 15 kg (Score 4)":
          return total + 4
      }

    default:
      return total
  }
}

export default function InputPenurunanBerat({ formik }) {
  const [total, setTotal] = useState(null)

  useDidMountEffect(() => {
    const result = calculateResult(formik)
    formik.setFieldValue(inputSkorPenurunanBerat.name, result)
    setTotal(result)
  }, [
    formik.values[inputPenurunanBerat.name],
    formik.values[inputPilihanPenurunanBerat.name],
  ])

  useEffect(() => {
    setTotal(formik.values[inputSkorPenurunanBerat.name])
  }, [])

  useDidMountEffect(() => {
    setTimeout(() => {
      formik.setFieldTouched(inputPilihanPenurunanBerat.name)
    }, 500)
  }, [formik.values[inputPenurunanBerat.name]])

  return (
    <>
      <div className="row">
        <div className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0">
          {inputPenurunanBerat.label}
        </div>
        <div className="col-sm-7">
          {formik.errors[inputPenurunanBerat.name] &&
            formik.touched[inputPenurunanBerat.name] && (
              <p className="text-danger" role="alert">
                Kolom ini wajib untuk di pilih
              </p>
            )}
          {inputPenurunanBerat.items.map((item, key) => (
            <div key={key} className="form-check form-check-solid mb-6">
              <input
                className="form-check-input"
                type="radio"
                name={inputPenurunanBerat.name}
                id={inputPenurunanBerat.name + key}
                value={item.value}
                onChange={
                  formik.getFieldProps(inputPenurunanBerat.name).onChange
                }
                onClick={formik.getFieldProps(inputPenurunanBerat.name).onBlur}
                checked={
                  formik.values?.[inputPenurunanBerat.name]?.toString() ===
                  item.value?.toString()
                    ? true
                    : false
                }
              />
              <label
                className="form-check-label text-gray-600"
                htmlFor={inputPenurunanBerat.name + key}
              >
                {item.label}
              </label>
            </div>
          ))}
          {formik.values[inputPenurunanBerat.name] === "ya" && (
            <div className="ps-10">
              {formik.errors[inputPilihanPenurunanBerat.name] &&
                formik.touched[inputPilihanPenurunanBerat.name] && (
                  <p className="text-danger" role="alert">
                    Kolom ini wajib untuk di pilih
                  </p>
                )}
              {inputPilihanPenurunanBerat.items.map((item, key) => (
                <div key={key} className="form-check form-check-solid mb-6">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={inputPilihanPenurunanBerat.name}
                    id={inputPilihanPenurunanBerat.name + key}
                    value={item.value}
                    onChange={
                      formik.getFieldProps(inputPilihanPenurunanBerat.name)
                        .onChange
                    }
                    onClick={
                      formik.getFieldProps(inputPilihanPenurunanBerat.name)
                        .onBlur
                    }
                    checked={
                      formik.values?.[
                        inputPilihanPenurunanBerat.name
                      ]?.toString() === item.value?.toString()
                        ? true
                        : false
                    }
                  />
                  <label
                    className="form-check-label text-gray-600"
                    htmlFor={inputPilihanPenurunanBerat.name + key}
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {total !== "" && (
        <div className="row mb-8">
          <div className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0">
            {inputPilihanPenurunanBerat.label}
          </div>
          <div className="col-sm-7">
            <div className="p-8 h-100px w-350px bg-light-primary rounded">
              <h1 className="text-primary mb-0">{total}</h1>
              <p className="text-gray-600">Total score</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
