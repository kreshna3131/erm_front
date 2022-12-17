import { useEffect } from "react"
import { useOutletContext } from "react-router"

/**
 * Update menu breadcrum
 * @param {breadcrumbType} breadcrumb
 */
export default function useBreadcrumb(breadcrumb) {
  const { setBreadCrumb } = useOutletContext()

  useEffect(() => setBreadCrumb(breadcrumb), [breadcrumb])
}

const breadcrumbType = {
  title: "",
  items: [],
}
