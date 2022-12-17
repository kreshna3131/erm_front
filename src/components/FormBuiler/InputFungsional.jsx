import React, { useEffect, useState } from "react"
import useDidMountEffect from "../../hooks/useDidMountEffect"

/**
 * Data kolom radio
 * @type {Array}
 */
const datas = [
  {
    label: "Makan (Feeding)",
    name: "fungsional_makan",
    items: [
      {
        label: "0 (Tidak Mampu)",
        value: "0 = tidak mampu",
      },
      {
        label: "1 (Butuh bantuan memotong, mengoles mentega, dan lain lain)",
        value: "1 = butuh bantuan memotong, mengoles mentega dll",
      },
      {
        label: "2 (Mandiri)",
        value: "2 = mandiri",
      },
    ],
  },
  {
    label: "Mandi (Bathing)",
    name: "fungsional_mandi",
    items: [
      {
        label: "0 (Tergantung orang lain)",
        value: "0 = tergantung orang lain",
      },
      {
        label: "1 (Mandiri)",
        value: "1 = mandiri",
      },
    ],
  },
  {
    label: "Perawatan diri (Grooming)",
    name: "fungsional_grooming",
    items: [
      {
        label: "0 (Membutuhkan bantuan orang lain)",
        value: "0 = membutuhkan bantuan orang lain",
      },
      {
        label: "1 (Mandiri dalam perawatan muka, rambut, gigi dan bercukur)",
        value: "1 = mandiri dalam perawatan muka, rambut, gigi dan bercukur",
      },
    ],
  },
  {
    label: "Berpakaian (Dressing)",
    name: "fungsional_dressing",
    items: [
      {
        label: "0 (Tergantung orang lain)",
        value: "0 = tergantung orang lain",
      },
      {
        label: "1 (Sebagian dibantu misal mengancing baju)",
        value: "1 = sebagian dibantu (misal mengancing baju)",
      },
      {
        label: "2 (Mandiri)",
        value: "2 = mandiri",
      },
    ],
  },
  {
    label: "Buang air kecil (Bowel)",
    name: "fungsional_bowel",
    items: [
      {
        label: "0 (Inkontinensia atau pakai kateter dan tidak terkontrol)",
        value: "0 = inkontinensia atau pakai kateter dan tidak terkontrol",
      },
      {
        label: "1 (Kadang inkontinensia maksimal 1 x 24 jam)",
        value: "1 = kadang inkontinensia (maks, 1x24 jam)",
      },
      {
        label: "2 (Kontinensia teratur untuk lebih dari 7 hari)",
        value: "2 = kontinensia (teratur untuk lebih dari 7 hari)",
      },
    ],
  },
  {
    label: "Buang air besar (Bladder)",
    name: "fungsional_bladder",
    items: [
      {
        label: "0 (Inkontinensia tidak teratur atau perlu enema)",
        value: "0 = inkontinensia (tidak teratur atau perlu enema)",
      },
      {
        label: "1 (Kadang inkontinensia sekali seminggu)",
        value: "1 = kadang inkontinensia (sekali seminggu)",
      },
      {
        label: "2 (Kontinensia teratur)",
        value: "2 = kontinensia (teratur)",
      },
    ],
  },
  {
    label: "Penggunaan toilet",
    name: "fungsional_penggunaan_toilet",
    items: [
      {
        label: "0 (Tergantung bantuan orang lain)",
        value: "0 = tergantung bantuan orang lain",
      },
      {
        label:
          "1 (Membutuhkan bantuan, tapi dapat melakukan beberapa hal sendiri)",
        value:
          "1 = membutuhkan bantuan, tapi dapat melakukan beberapa hal sendiri",
      },
      {
        label: "2 (Mandiri)",
        value: "2 = mandiri",
      },
    ],
  },
  {
    label: "Transfer",
    name: "fungsional_transfer",
    items: [
      {
        label: "0 (Tidak mampu)",
        value: "0 = tidak mampu",
      },
      {
        label: "1 (Butuh bantuan untuk bisa duduk 2 orang)",
        value: "1 = butuh bantuan untuk bisa duduk (2 orang)",
      },
      {
        label: "2 (Bantuan kecil 1 orang)",
        value: "2 = bantuan kecil (1 orang)",
      },
      {
        label: "3 (Mandiri)",
        value: "3 = mandiri",
      },
    ],
  },
  {
    label: "Mobilitas",
    name: "fungsional_mobilitas",
    items: [
      {
        label: "0 (Immobile tidak mampu)",
        value: "0 = immobile (tidak mampu)",
      },
      {
        label: "1 (Menggunakan kursi roda)",
        value: "1 = menggunakan kursi roda",
      },
      {
        label: "2 (Berjalan dengan bantuan orang lain)",
        value: "2 = berjalan dengan bantuan orang lain",
      },
      {
        label: "3 (Mandiri meskipun menggunakan alat bantu seperti tongkat)",
        value: "3 = mandiri (meskipun menggunakan alat bantu seperti tongkat)",
      },
    ],
  },
  {
    label: "Naik turun tangga",
    name: "fungsional_naik_turun_tangga",
    items: [
      {
        label: "0 (Tidak mampu)",
        value: "0 = tidak mampu",
      },
      {
        label: "1 (Membutuhkan bantuan atau alat bantu)",
        value: "1 = membutuhkan bantuan (atau alat bantu)",
      },
      {
        label: "2 (Mandiri)",
        value: "2 = mandiri",
      },
    ],
  },
]

/**
 * Mendaftarkan input field ke formik
 * @param {Object} formik
 * @param {string} name
 */
export function registerField(formik, name, rules) {
  formik.registerField(name, {
    validate(value) {
      let errorMessage
      if (!value && rules === "required") {
        errorMessage = name + " is required field"
      }
      return errorMessage
    },
  })
}

/**
 * Mengkalkulasi hasil asesmen fungsional
 * @param {Object} formik
 * @returns {Number}
 */
function calculateResult(formik) {
  const fungsionalInput = [
    "fungsional_bladder",
    "fungsional_bowel",
    "fungsional_dressing",
    "fungsional_grooming",
    "fungsional_makan",
    "fungsional_mandi",
    "fungsional_mobilitas",
    "fungsional_naik_turun_tangga",
    "fungsional_penggunaan_toilet",
    "fungsional_transfer",
  ]

  let loop = 0
  let total = 0

  fungsionalInput.map((input) => {
    loop++
    const parsedValue = parseInt(formik.values[input].substring(0, 1))
    if (!isNaN(parsedValue)) {
      total = total + parsedValue
    }
  })

  if (loop === fungsionalInput.length) {
    return total
  }
}

/**
 * Convert total result to final result message
 * @param {Number} total
 * @returns {{total: String, value: String, message: String}}
 */
function getResult(total) {
  if (0 <= total && total <= 4) {
    return {
      total: "0 - 4",
      value: "0-4 : ketergantungan total",
      message: "Ketergantungan Total",
    }
  }

  if (5 <= total && total <= 8) {
    return {
      total: "5 - 8",
      value: "5-8 : ketergantungan berat",
      message: "Ketergantungan Berat",
    }
  }

  if (9 <= total && total <= 11) {
    return {
      total: "9 - 11",
      value: "9-11 : ketergantungan sedang",
      message: "Ketergantungan Sedang",
    }
  }

  if (12 <= total && total <= 19) {
    return {
      total: "12 - 19",
      value: "12-19 : ketergantungan ringan",
      message: "Ketergantungan Ringan",
    }
  }

  return {
    total: "20",
    value: "20 : mandiri",
    message: "Mandiri",
  }
}

export default function FungsionalInput({ formik, item: { rules } }) {
  const [total, setTotal] = useState(null)
  const [result, setResult] = useState({
    total: "",
    value: "",
    message: "",
  })

  useDidMountEffect(() => {
    setTotal(calculateResult(formik))
  }, [
    formik.values.fungsional_bladder,
    formik.values.fungsional_bowel,
    formik.values.fungsional_dressing,
    formik.values.fungsional_grooming,
    formik.values.fungsional_makan,
    formik.values.fungsional_mandi,
    formik.values.fungsional_mobilitas,
    formik.values.fungsional_naik_turun_tangga,
    formik.values.fungsional_penggunaan_toilet,
    formik.values.fungsional_transfer,
  ])

  useDidMountEffect(() => {
    const result = getResult(total)
    if (!isNaN(total)) {
      formik.setFieldValue("fungsional_hasil", result.value)
    }
    setResult(result)
  }, [total])

  useEffect(() => {
    const arrayHasil = formik.values.fungsional_hasil.split(" :")
    setTotal(parseInt(arrayHasil[0]))
  }, [])

  return (
    <>
      {datas.map((data, key) => {
        const { label, name, items } = data
        registerField(formik, name, rules)
        return (
          <div key={key} className="row mb-4">
            <div className="col-sm-5 form-label text-sm-end fs-6 fw-medium text-gray-700 mb-4 mb-sm-0">
              {label}
            </div>
            <div className="col-sm-7">
              {formik.errors[name] && formik.touched[name] && (
                <div
                  className="alert text-danger p-0 bg-transparent"
                  role="alert"
                >
                  Kolom ini wajib untuk di pilih
                </div>
              )}
              {items.map((item, jey) => {
                return (
                  <div
                    key={key + jey}
                    className="form-check form-check-solid mb-6"
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name={name}
                      id={name + item.value}
                      value={item.value}
                      onChange={formik.getFieldProps(name).onChange}
                      onClick={formik.getFieldProps(name).onBlur}
                      checked={
                        formik.values[name]?.toString() ===
                        item.value?.toString()
                          ? true
                          : false
                      }
                    />
                    <label
                      className="form-check-label text-gray-600"
                      htmlFor={name + item.value}
                    >
                      {item.label}
                    </label>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      {Number.isInteger(total) && (
        <div className="row mb-12">
          <div className="col-sm-5 form-label text-sm-end fs-6 fw-medium text-gray-700 mb-4 mb-sm-0">
            Implementasi Hasil
          </div>
          <div className="col-sm-7">
            <div className="p-8 h-100px w-350px bg-light-primary rounded">
              <h1 className="text-primary mb-0">{result.total}</h1>
              <p className="text-gray-600">{result.message}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
