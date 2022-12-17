export function getQueryParameter(url) {
  try {
    return new Proxy(new URLSearchParams(new URL(url).search), {
      get: (searchParams, prop) => searchParams.get(prop),
    })
  } catch (error) {
    console.log(error)
    return "#"
  }
}
