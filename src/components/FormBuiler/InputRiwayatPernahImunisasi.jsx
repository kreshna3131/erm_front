import { lowerSnake } from "helpers/string-helper"
import useDidMountEffect from "hooks/useDidMountEffect"
import React, { useState } from "react"
import { useEffect } from "react"
import styled from "styled-components"

const CheckboxWrapper = styled.div`
  margin-bottom: 2rem;
  min-width: 20%;

  @media (max-width: 640px) {
    min-width: 50%;
  }

  @media (max-width: 360px) {
    min-width: 100%;
  }
`

export default function InputRiwayatImunisasi({ formik }) {
  const data = [
    {
      label: "Hep BI",
      value: "Hep BI",
    },
    {
      label: "Hep BII",
      value: "Hep BII",
    },
    {
      label: "Hep BIII",
      value: "Hep BIII",
    },
    {
      label: "Hep BIV",
      value: "Hep BIV",
    },
    {
      label: "Hep BV",
      value: "Hep BV",
    },
    {
      label: "DPT I",
      value: "DPT I",
    },
    {
      label: "DPT II",
      value: "DPT II",
    },
    {
      label: "DPT III",
      value: "DPT III",
    },
    {
      label: "MMR",
      value: "MMR",
    },
    {
      label: "Campak",
      value: "Campak",
    },
    {
      label: "BCG",
      value: "BCG",
    },
    {
      label: "BCG I",
      value: "BCG I",
    },
    {
      label: "BCG II",
      value: "BCG II",
    },
    {
      label: "Boster I",
      value: "Boster I",
    },
    {
      label: "Boster II",
      value: "Boster II",
    },
    {
      label: "Boster III",
      value: "Boster III",
    },
    {
      label: "Variix",
      value: "Variix",
    },
    {
      label: "Polio I",
      value: "Polio I",
    },
    {
      label: "Polio II",
      value: "Polio II",
    },
    {
      label: "Polio III",
      value: "Polio III",
    },
    {
      label: "HiB I",
      value: "HiB I",
    },
    {
      label: "HiB II",
      value: "HiB II",
    },
    {
      label: "HiB III",
      value: "HiB III",
    },
    {
      label: "HiB IV",
      value: "HiB IV",
    },
    {
      label: "HiB V",
      value: "HiB V",
    },
  ]

  const [parsedValue, setParsedValue] = useState([])

  useEffect(() => {
    if (["", null, undefined].includes(formik.values.riwayat_imunisasi)) {
      setParsedValue([])
    } else {
      setParsedValue(JSON.parse(formik.values.riwayat_imunisasi))
    }
  }, [])

  useDidMountEffect(() => {
    formik.setFieldValue("riwayat_imunisasi", parsedValue)
  }, [parsedValue])

  return (
    <div className="px-10">
      <h3 className="mb-8 text-gray-700">Riwayat imunisasi</h3>
      <div className="d-flex flex-wrap w-100">
        {data.map((item, key) => (
          <CheckboxWrapper key={key}>
            <div className="form-check form-check-solid">
              <input
                checked={parsedValue.some(
                  (parsedItem) =>
                    parsedItem?.toString() === item.value?.toString()
                )}
                onChange={(event) => {
                  if (event.target.checked) {
                    setParsedValue([...parsedValue, event.target.value])
                  } else {
                    setParsedValue(
                      [...parsedValue].filter(
                        (parsedItem) =>
                          parsedItem?.toString() !== item.value?.toString()
                      )
                    )
                  }
                }}
                onBlur={formik.getFieldProps("riwayat_imunisasi").onBlur}
                className="form-check-input"
                type="checkbox"
                value={item.value}
                id={lowerSnake(item.label)}
              />
              <label
                className="form-check-label text-gray-600"
                htmlFor={lowerSnake(item.label)}
              >
                {item.label}
              </label>
            </div>
          </CheckboxWrapper>
        ))}
      </div>
    </div>
  )
}
