import React from "react"
import { ReactComponent as DangerIcon } from "assets/icons/danger.svg"

/**
 * Komponen utama loader
 * @param {{className: String}}
 */
export default function PrimaryLoader({ className }) {
  return (
    <div className={`d-flex flex-center flex-column ${className}`}>
      <div
        className="spinner-border text-primary mb-5"
        style={{ width: "5rem", height: "5rem", borderWidth: "5px" }}
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
      <p className="text-gray-700">Loading...</p>
    </div>
  )
}

/**
 * Komponen pesan error
 * @param {{className: String}}
 */
export function ErrorMessage({ className }) {
  return (
    <div className={`d-flex flex-center flex-column ${className}`}>
      <DangerIcon className="mb-5" />
      <p className="text-gray-700">
        Something went wrong. Please try again later...
      </p>
    </div>
  )
}
