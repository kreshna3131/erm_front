import { DateTime } from "luxon"

function encryptString(key, data) {
  const encryptMethod = "AES-256-CBC"
  const keyHash = hex2bin(hash("SHA256", key))
  const iv = substr(hex2bin(hash("SHA256", key)), 0, 16)
}
