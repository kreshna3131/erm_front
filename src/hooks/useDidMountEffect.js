import { useEffect, useRef } from "react"

/** Menjalankan fungsi [func] ketika dependency [deps] berubah */
const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false)

  useEffect(() => {
    if (didMount.current) func()
    else didMount.current = true
  }, deps)
}

export default useDidMountEffect
