import { useEffect } from "react"

/**
 * Mengecek apakah user memiliki permission tertentu
 * @param {*} user
 * @param {*} permission
 */
export default function useCheckPermission(user, permission) {
  useEffect(() => {
    if (user?.roles.length) {
      const permissions = user.roles[0].permissions

      if (!permissions.some((e) => e.name === permission)) {
        window.location.href = "/forbidden"
      }
    }
  }, [user])
}
