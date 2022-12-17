import React, { useState, useEffect } from "react"
import { useFormik } from "formik"
import CondionalInput from "./ConditionalInput"

const formStructure = [
  {
    type: "text",
    name: "name",
    label: "Nama",
    items: "",
  },
  {
    type: "radio",
    name: "gender",
    label: "Jenis Kelamin",
    items: '[{"label": "Ya", "value": "1"}, {"label": "Tidak", "value": "0"}]',
  },
]

export default function DynamicForm({ url }) {
  const [initalValues, setinitalValues] = useState({
    name: "",
    gender: "",
  })
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initalValues,
  })

  useEffect(() => {
    setTimeout(() => {
      setinitalValues({
        ...initalValues,
        ...{
          name: "Helo",
          gender: "0",
        },
      })
    }, 1000)
  }, [])

  return (
    <div className="container">
      <form action="">
        {formStructure.map((item, key) => (
          <CondionalInput key={key} item={item} formik={formik} />
        ))}
      </form>
    </div>
  )
}
