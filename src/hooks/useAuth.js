import { useEffect, useState } from "react"

/**
 * Mengauthentikasi user
 */
export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const authData = localStorage.getItem("auth-data")
  const token = JSON.parse(authData)?.token

  useEffect(() => {
    if (authData) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [isAuthenticated, authData])

  return { isAuthenticated, token }
}

/**
 * Menyimpan kredensial user pada localstorage
 * @param {String} token
 */
export function setClientCredential(token) {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(
        "auth-data",
        JSON.stringify({
          token: token,
        })
      )

      resolve(token)
    } catch (error) {
      reject("Something went wrong")
    }
  })
}

/**
 * Menghapus kredensial user pada localstorage
 */
export function unsetClientCredential() {
  return new Promise((resolve, reject) => {
    try {
      localStorage.removeItem("auth-data")
      localStorage.removeItem("isLogin")
      resolve("Auth data has been removed")
    } catch (error) {
      reject("Something went wrong")
    }
  })
}
