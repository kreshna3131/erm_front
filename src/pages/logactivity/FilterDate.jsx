import "../../assets/css/flatpickr.css"
import { DateTime } from "luxon"
import React, { useEffect, useState } from "react"
import Flatpickr from "react-flatpickr"
import { ReactComponent as GrayCross } from "../../assets/icons/gray-cross.svg"

// komponen utama filter date
export default function FilterDate({ filterProps }) {
  const [filter, setFilter] = filterProps
  const [datePickerError, setDatePickerError] = useState(false)
  const [localFilter, setLocalFilter] = useState({
    periode: [],
  })

  // pengecekan local filter ada isinya atau tidak
  useEffect(() => {
    if (localFilter.periode.length > 1) {
      setFilter({
        ...filter,
        ...localFilter,
      })
    }
    if (localFilter.periode === "") {
      setFilter({
        ...filter,
        ...localFilter,
      })
      setDatePickerError(false)
    }
  }, [localFilter])

  return (
    <div
      className="d-grid align-items-center position-relative my-1 me-5"
      style={{ height: "45px" }}
    >
      <Flatpickr
        options={{
          mode: "range",
          enableTime: false,
          dateFormat: "d/M/Y",
          maxDate: new Date(),
          onChange: function (selectedDates, dateStr, instance) {
            if (selectedDates.length > 1) {
              const startDate = DateTime.fromISO(selectedDates[0].toISOString())
              const endDate =
                selectedDates.length > 1
                  ? DateTime.fromISO(selectedDates[1].toISOString())
                  : DateTime.local()
              const range = endDate.diff(startDate, "days").toFormat("d")
              const maxRange = 7

              if (parseInt(range) > maxRange) {
                instance.clear()
                setDatePickerError(true)
              } else {
                setDatePickerError(false)
              }
            }
          },
        }}
        value={localFilter.periode}
        className="form-control form-control-solid"
        placeholder="Rentang waktu"
        data-enable-time
        onChange={(date) => {
          setLocalFilter({
            ...localFilter,
            ...{
              periode: date,
            },
          })
        }}
      />
      <span
        role="button"
        className="position-absolute"
        style={{ right: "15px", top: "10px" }}
        onClick={() => {
          setLocalFilter({
            ...localFilter,
            ...{
              periode: "",
            },
          })
        }}
      >
        <GrayCross />
      </span>

      <div className={`invalid-feedback ${datePickerError && "d-block"}`}>
        Maksimal rentang waktu adalah 7 hari
      </div>
    </div>
  )
}
