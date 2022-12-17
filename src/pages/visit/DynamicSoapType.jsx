import React from "react"
import { useParams } from "react-router"
import Soap from "pages/visit/soap/Index"
import Laboratory from "pages/visit/laboratory/Index"
import Radiology from "pages/visit/radiology/Index"
import Receipt from "pages/visit/receipt/Index"
import Rehab from "pages/visit/rehab/Index"

/**
 * Komponen utama Dynamic Soap
 */
export default function DynamicSoapType() {
  const { type } = useParams()
  return (
    <>
      {type === "soap" && <Soap />}
      {type === "laboratory" && <Laboratory />}
      {type === "radiology" && <Radiology />}
      {type === "receipt" && <Receipt />}
      {type === "rehab" && <Rehab />}
    </>
  )
}
