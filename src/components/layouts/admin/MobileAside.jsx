import useOnClickOutside from "hooks/useOnClickOutside"
import React, { useRef } from "react"

/**
 * Komponen menu sidebar untuk mobile
 * @param {{
 * children: React.ReactNode
 * activeMobileMenuProp: Array
 * }}
 */
export default function MobileAside({ children, activeMobileMenuProp }) {
  const [activeMobileMenu, setActiveMobileMenu] = activeMobileMenuProp
  const asideMobile = useRef()
  useOnClickOutside(asideMobile, () => setActiveMobileMenu(false))
  return (
    <>
      <div
        ref={asideMobile}
        id="kt_aside"
        className={`aside aside-dark aside-hoverable drawer drawer-start pt-5 ${
          activeMobileMenu === true ? "drawer-on" : ""
        }`}
      >
        {children}
      </div>
    </>
  )
}
