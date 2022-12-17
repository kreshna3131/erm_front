/**
 * Menterjemahkan status ke varian warna
 * @param {import("interfaces/laboratorium").Status} status
 * @returns
 */
export function variantStatus(status) {
  switch (status) {
    case "waiting":
      return "danger"

    case "progress":
      return "warning"

    case "done":
      return "primary"

    default:
      return "light"
  }
}

/**
 * Menterjemahkan status
 * @param {import("interfaces/laboratorium").Status} status
 * @returns
 */
export function localeStatus(status) {
  switch (status) {
    case "waiting":
      return "Menunggu"

    case "fixing":
      return "Perbaikan"

    case "progress":
      return "Proses"

    case "done":
      return "Selesai"

    case "cancel":
      return "Batalkan"

    default:
      return ""
  }
}

/**
 * Pencarian data nested filter
 */
export function nestedFilter(array, search, childName = "childs") {
  const filteredArray = array.filter((item) => {
    if (item.hasOwnProperty(childName) && item[childName].length) {
      item[childName] = nestedFilter(item[childName], search)
    }

    if (item.hasOwnProperty(childName) && item[childName].length) {
      return true
    }

    return item.name.toLowerCase().includes(search.toLowerCase())
  })

  return filteredArray
}
