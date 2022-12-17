import { useEffect } from "react"
import { useOutletContext } from "react-router"

/**
 * Mengupdate sidebar manu yang aktif
 * @param {string} menu
 */
export default function useSidebarActiveMenu(menu) {
  const { setActiveMenu } = useOutletContext()

  useEffect(() => {
    setActiveMenu(menu)
  }, [])
}

/**
 * Mengupdate sidebar accordion menu yang terbuka
 * @param {string|Array<String>} menu
 */
export function useOpenAccordionMenu(menu) {
  const { setOpenAccordion } = useOutletContext()

  useEffect(() => {
    if (Array.isArray(menu)) {
      setOpenAccordion([...menu])
    } else {
      setOpenAccordion([menu])
    }
  }, [])
}
