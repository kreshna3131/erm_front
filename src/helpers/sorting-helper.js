export function sortString({ data, dir, column }) {
  if (dir === "asc") {
    return data.sort((a, b) => (a[column] > b[column] ? 1 : -1))
  }

  if (dir === "desc") {
    return data.sort((a, b) => (a[column] > b[column] ? -1 : 1))
  }

  return data
}

export function sortNumeric({ data, dir, column }) {
  if (dir === "asc") {
    return data.sort((a, b) => a[column] - b[column])
  }

  if (dir === "desc") {
    return data.sort((a, b) => b[column] - a[column])
  }

  return data
}

export function findInValues(arr, value) {
  value = String(value).toLowerCase()
  return arr.filter((o) =>
    Object.entries(o).some((entry) =>
      String(entry[1]).toLowerCase().includes(value)
    )
  )
}
