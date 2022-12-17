import React, { useMemo } from "react"

/**
 * Komponen untuk menampilkan limit pada textarea
 * @param {{
 * currentCharacter: String
 * maxCharacter: Number | 255
 * }}
 * @returns
 */
export function TextareaLimit({ currentCharacter, maxCharacter = 255 }) {
  const remainingCharacter = useMemo(
    () => maxCharacter - currentCharacter?.length,
    [maxCharacter, currentCharacter?.length]
  )

  return (
    <p className="text-gray-600 mt-4 mb-0">
      Tersisa {remainingCharacter} dari {maxCharacter} karakter
    </p>
  )
}
