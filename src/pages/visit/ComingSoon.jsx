import React from "react"
import { ReactComponent as Forbidden } from "../../assets/icons/forbidden.svg"

/**
 * Komponen utama halaman coming Soon
 */
export default function ComingSoon() {
  return (
    <div className="d-flex flex-column align-items-center h-500px">
      <Forbidden />
      <h1>Coming Soon</h1>
      <p className="text-center text-gray-600 w-md-50">
        Masih dalam tahap pengembangan
      </p>
    </div>
  )
}
