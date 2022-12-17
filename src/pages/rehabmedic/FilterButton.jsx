import "assets/css/flatpickr.css"
import { DateTime } from "luxon"
import React, { useState } from "react"
import { Overlay } from "react-bootstrap"
import Flatpickr from "react-flatpickr"
import Select from "react-select"
import { ReactComponent as FilterIcon } from "assets/icons/filter.svg"
import { ReactComponent as GrayCross } from "assets/icons/gray-cross.svg"
import { ReactComponent as Clock } from "assets/icons/clock.svg"
import { ReactComponent as Checklist } from "assets/icons/checklist.svg"
import { ReactComponent as CrossSign } from "assets/icons/cross-sign.svg"
import { ReactComponent as BlueGlass } from "assets/icons/blue-glass.svg"
import { ReactComponent as WarningPencil } from "assets/icons/warning-pencil.svg"
import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"

import Menu from "assets/icons/menu.png"

import { ButtonLightStyled } from "components/Button"
import { globalStyle } from "helpers/react-select"
import { useRef } from "react"
import useOnClickOutside from "hooks/useOnClickOutside"

// listing option status
const statusSelectData = [
  {
    label: (
      <div className="d-flex align-middle">
        <img src={Menu} alt={Menu} />
        <span
          className="ms-2 text-gray-700 "
          style={{ fontSize: "14px", marginTop: "2px" }}
        >
          Semua
        </span>
      </div>
    ),
    value: "",
  },
  {
    label: (
      <div className="d-flex align-middle">
        <Clock />

        <span
          className="ms-2 text-gray-700 "
          style={{ fontSize: "14px", marginTop: "2px" }}
        >
          Menunggu
        </span>
      </div>
    ),
    value: "waiting",
  },
  {
    label: (
      <div className="d-flex align-middle">
        <WarningPencil />
        <span
          className="ms-2 text-gray-700 "
          style={{ fontSize: "14px", marginTop: "2px" }}
        >
          Perbaikan
        </span>
      </div>
    ),
    value: "fixing",
  },
  {
    label: (
      <div className="d-flex align-middle">
        <BlueGlass />

        <span
          className="ms-2 text-gray-700 "
          style={{ fontSize: "14px", marginTop: "2px" }}
        >
          Proses
        </span>
      </div>
    ),
    value: "progress",
  },
  {
    label: (
      <div className="d-flex align-middle">
        <Checklist />
        <span
          className="ms-2 text-gray-700 "
          style={{ fontSize: "14px", marginTop: "2px" }}
        >
          Selesai
        </span>
      </div>
    ),
    value: "done",
  },
  {
    label: (
      <div className="d-flex align-middle">
        <CrossSign />
        <span
          className="ms-2 text-gray-700 "
          style={{ fontSize: "14px", marginTop: "2px" }}
        >
          Batalkan
        </span>
      </div>
    ),
    value: "cancel",
  },
]

// listing option dibaca
const statusIsRead = [
  {
    label: (
      <span className="text-gray-700" style={{ fontSize: "14px" }}>
        Semua
      </span>
    ),
    value: "",
  },
  {
    label: (
      <span className="text-gray-700" style={{ fontSize: "14px" }}>
        Belum Dibaca
      </span>
    ),
    value: 0,
  },
  {
    label: (
      <span className="text-gray-700" style={{ fontSize: "14px" }}>
        Sudah Dibaca
      </span>
    ),
    value: 1,
  },
]

// komponen utama filter
export default function FilterButton({ filterProps, rehabStatus }) {
  const [filter, setFilter] = filterProps
  const [datePickerError, setDatePickerError] = useState(false)
  const [localFilter, setLocalFilter] = useState({
    periode: [],
    status: "",
    is_read: "",
  })
  const [overlayShow, setOverlayShow] = useState(false)
  const overlayTarget = useRef()
  const overlayContainer = useRef()
  useOnClickOutside(overlayContainer, () => setOverlayShow(false))

  return (
    <>
      <ButtonLightStyled
        ref={overlayTarget}
        className={`btn btn-light-primary ${overlayShow ? "active" : ""}`}
        onClick={() => setOverlayShow(!overlayShow)}
      >
        <FilterIcon /> Filter
      </ButtonLightStyled>
      <Overlay
        ref={overlayContainer}
        show={overlayShow}
        placement="bottom-end"
        target={overlayTarget.current}
      >
        <div
          className="card shadow-sm w-full w-sm-400px"
          style={{ zIndex: 999 }}
        >
          <div className="card-header align-items-center">
            <div className="card-title">Filter Options</div>
            <GrayCross
              className="cursor-pointer"
              onClick={() => setOverlayShow(false)}
            ></GrayCross>
          </div>
          {rehabStatus === "loading" && (
            <div
              className="card-body d-flex flex-center"
              style={{ minHeight: "350px" }}
            >
              <p className="text-gray-600">Loading...</p>
            </div>
          )}
          {rehabStatus === "error" && (
            <div
              className="card-body d-flex flex-center"
              style={{ minHeight: "350px" }}
            >
              <p className="text-gray-600">Error...</p>
            </div>
          )}
          {rehabStatus === "success" && (
            <div className="card-body">
              <form
                action=""
                method="post"
                onSubmit={(event) => {
                  event.preventDefault()
                }}
              >
                <div className="row mb-5">
                  <div className="col-md-12">
                    <div className="form-group mb-4">
                      <label className="form-label" htmlFor="status">
                        Status
                      </label>
                      <Select
                        options={statusSelectData}
                        value={{
                          label:
                            statusSelectData.filter((status) => {
                              return status.value === localFilter.status
                            })?.[0]?.label ?? "Select",
                          value: localFilter.status,
                        }}
                        onChange={(option) => {
                          setLocalFilter({
                            ...localFilter,
                            ...{
                              status: option.value,
                            },
                          })
                        }}
                        name="status"
                        id="status"
                        styles={{
                          ...globalStyle,
                          option: (
                            styles,
                            { data, isDisabled, isFocused, isSelected }
                          ) => ({
                            ...styles,
                            backgroundColor: isDisabled
                              ? undefined
                              : isSelected
                              ? "#F5F8FA"
                              : isFocused
                              ? "rgba(126,130,153,0.1)"
                              : undefined,

                            ":active": {
                              ...styles[":active"],
                              backgroundColor: !isDisabled
                                ? isSelected
                                  ? "#F5F8FA"
                                  : "rgba(126,130,153,0.1)"
                                : undefined,
                            },
                          }),
                        }}
                        noOptionsMessage={() => "Data tidak ditemukan"}
                        components={{
                          IndicatorSeparator: "",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group mb-4">
                      <label className="form-label" htmlFor="is_read">
                        Status Komentar
                      </label>
                      <Select
                        options={statusIsRead}
                        value={{
                          label:
                            statusIsRead.filter((is_read) => {
                              return is_read.value === localFilter.is_read
                            })?.[0]?.label ?? "Select",
                          value: localFilter.is_read,
                        }}
                        onChange={(option) => {
                          setLocalFilter({
                            ...localFilter,
                            ...{
                              is_read: option.value,
                            },
                          })
                        }}
                        name="is_read"
                        id="is_read"
                        styles={{
                          ...globalStyle,
                          option: (
                            styles,
                            { data, isDisabled, isFocused, isSelected }
                          ) => ({
                            ...styles,
                            backgroundColor: isDisabled
                              ? undefined
                              : isSelected
                              ? "#F5F8FA"
                              : isFocused
                              ? "rgba(126,130,153,0.1)"
                              : undefined,

                            ":active": {
                              ...styles[":active"],
                              backgroundColor: !isDisabled
                                ? isSelected
                                  ? "#F5F8FA"
                                  : "rgba(126,130,153,0.1)"
                                : undefined,
                            },
                          }),
                        }}
                        noOptionsMessage={() => "Data tidak ditemukan"}
                        components={{
                          IndicatorSeparator: "",
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-md-12 position-relative">
                    <div className="form-group mb-4">
                      <label className="form-label " htmlFor="periode">
                        Periode
                      </label>
                      <Flatpickr
                        options={{
                          mode: "range",
                          enableTime: false,
                          dateFormat: "d/M/Y",
                          maxDate: new Date(),
                          onChange: function (
                            selectedDates,
                            dateStr,
                            instance
                          ) {
                            if (selectedDates.length > 1) {
                              const startDate = DateTime.fromISO(
                                selectedDates[0].toISOString()
                              )
                              const endDate =
                                selectedDates.length > 1
                                  ? DateTime.fromISO(
                                      selectedDates[1].toISOString()
                                    )
                                  : DateTime.local()
                              const range = endDate
                                .diff(startDate, "days")
                                .toFormat("d")
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
                        style={{ right: "20px", top: "40px" }}
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
                      <div
                        className={`invalid-feedback ${
                          datePickerError && "d-block"
                        }`}
                      >
                        Maksimal rentang waktu adalah 7 hari
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-light me-4"
                    onClick={() => {
                      setLocalFilter({
                        ...localFilter,
                        ...{
                          periode: "",
                          status: "",
                          is_read: "",
                        },
                      })
                    }}
                  >
                    <span className="indicator-label fw-medium">Ulangi</span>
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={rehabStatus === "loading"}
                    onClick={() => {
                      setFilter({
                        ...filter,
                        ...localFilter,
                      })
                    }}
                  >
                    {rehabStatus !== "loading" && (
                      <span className="indicator-label fw-medium">
                        Terapkan
                      </span>
                    )}
                    {rehabStatus === "loading" && (
                      <span
                        className="indicator-progress"
                        style={{ display: "block" }}
                      >
                        Please wait...
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </Overlay>
    </>
  )
}
