import React, { useState } from "react"
import { Outlet } from "react-router"
import Logo from "../../assets/logos/auth.svg"

/**
 * Komponen utama layout
 */
export function Layout() {
  const [info, setInfo] = useState(null)

  return (
    <>
      <div className="d-flex justify-content-center my-10 px-10 sm:px-0">
        <img className="img-fluid" src={Logo} alt="logo" />
      </div>
      <div className="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed">
        <div className="d-flex flex-center flex-column flex-column-fluid px-10 pb-lg-20">
          <div className="w-100 w-sm-500px bg-white rounded-4 shadow p-10 p-lg-15 mx-auto">
            <Outlet context={[info, setInfo]} />
          </div>
        </div>
      </div>
    </>
  )
}
