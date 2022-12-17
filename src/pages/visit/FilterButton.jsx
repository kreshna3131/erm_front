import "assets/css/flatpickr.css"
import { ReactComponent as FilterIcon } from "assets/icons/filter.svg"
import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"
import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import { globalStyle } from "helpers/react-select"
import useOnClickOutside from "hooks/useOnClickOutside"
import { DateTime } from "luxon"
import { useRef, useState } from "react"
import { Overlay } from "react-bootstrap"
import Flatpickr from "react-flatpickr"
import { useQuery } from "react-query"
import Select from "react-select"
import styled from "styled-components"

/**
 * Kustom komponen flatpicker wrapper
 */
export const CustomFlatpickrWrapper = styled.div`
  position: relative;

  .flatpickr-wrapper {
    display: block;
  }

  .reset-button {
    position: absolute;
    right: 20px;
    top: 12px;
  }
`

/**
 * Skema value untuk input select status
 */
const statusSelectData = [
  {
    label: "Semua",
    value: "",
  },
  {
    label: "Sudah Dilayani",
    value: "done",
  },
  {
    label: "Belum Dilayani",
    value: "waiting",
  },
]

/**
 * Custom styling untuk input select status
 */
const statusStyle = {
  ...globalStyle,
  option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
    ...styles,
    fontSize: "1.1rem",
    color: isSelected ? "#FFFFFF" : "#3f4254",
    backgroundColor: isDisabled
      ? undefined
      : isSelected
      ? "#0D9A89"
      : isFocused
      ? "rgba(126,130,153,0.1)"
      : undefined,

    ":before": {
      content: `""`,
      display: "inline-block",
      marginRight: "10px",
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: isSelected
        ? "#ffffff"
        : data.value === ""
        ? "#A1A5B7"
        : data.value === "done"
        ? "#0D9A89"
        : "#CB003F",
    },

    ":active": {
      ...styles[":active"],
      backgroundColor: !isDisabled
        ? isSelected
          ? "#0D9A89"
          : "rgba(126,130,153,0.1)"
        : undefined,
    },
  }),
}

/**
 * Komponen utama filter button
 */
export default function FilterButton({ filterProps, visitStatus }) {
  const [filter, setFilter] = filterProps
  const [datePickerError, setDatePickerError] = useState(false)
  const [localFilter, setLocalFilter] = useState({
    dokter: "",
    unit: "",
    spesialis: "",
    ruang: "",
    periode: [],
    status: "",
  })
  const [overlayShow, setOverlayShow] = useState(false)
  const overlayTarget = useRef()

  /** Logic close toast ketika klik diluar toast container */
  const overlayContainerRef = useRef()
  useOnClickOutside(overlayContainerRef, () => setOverlayShow(false))

  /**
   * Mengambil data spesialis
   */
  const { data: spesialis, status: statusSpesialis } = useQuery(
    ["spesialis-as-filter"],
    async () => {
      return axios.get("user/list-specialist").then((res) => res.data)
    }
  )

  /**
   * Mengambil data dokter
   */
  const { data: dokter, status: dokterStatus } = useQuery(
    "dokter-as-filter",
    async () => {
      return fetch(
        `${process.env.REACT_APP_API_SIMO_BASE_URL}/ref/provider?status=0`
      )
        .then((res) => res.json())
        .then((data) => data)
    }
  )

  /**
   * Mengambil data unit
   */
  const { data: unit, status: unitStatus } = useQuery(
    "unit-as-filter",
    async () => {
      return fetch(
        `${process.env.REACT_APP_API_SIMO_BASE_URL}/ref/jenislayanan`
      )
        .then((res) => res.json())
        .then((data) => data)
    }
  )

  /**
   * Mengambil data ruang
   */
  const { data: ruang, status: ruangStatus } = useQuery(
    "ruang-as-filter",
    async () => {
      return fetch(
        `${process.env.REACT_APP_API_SIMO_BASE_URL}/ref/tempatlayanan`
      )
        .then((res) => res.json())
        .then((data) => data)
    }
  )

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
        ref={overlayContainerRef}
        target={overlayTarget.current}
        show={overlayShow}
        placement="bottom-end"
      >
        <div
          className="card shadow-sm w-full w-sm-650px"
          style={{ zIndex: 999 }}
        >
          <div className="card-header align-items-center">
            <div className="card-title">Filter Options</div>
            <GrayCrossIcon
              type="button"
              onClick={() => setOverlayShow(false)}
            />
          </div>
          {[dokterStatus, unitStatus, ruangStatus].includes("loading") && (
            <div
              className="card-body d-flex flex-center"
              style={{ minHeight: "350px" }}
            >
              <p className="text-gray-600">Loading...</p>
            </div>
          )}
          {[dokterStatus, unitStatus, ruangStatus].includes("error") && (
            <div
              className="card-body d-flex flex-center"
              style={{ minHeight: "350px" }}
            >
              <p className="text-gray-600">Error...</p>
            </div>
          )}
          {[dokterStatus, unitStatus, ruangStatus].every(
            (el) => el === "success"
          ) && (
            <div className="card-body">
              <form
                action=""
                method="post"
                onSubmit={(event) => {
                  event.preventDefault()
                }}
              >
                <div className="row mb-5">
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="form-label" htmlFor="dokter">
                        Dokter
                      </label>
                      <Select
                        options={dokter.map((dokter) => ({
                          value: dokter.kode,
                          label: dokter.nama,
                        }))}
                        value={{
                          label:
                            dokter.filter((dokter) => {
                              return dokter.kode === localFilter.dokter
                            })?.[0]?.nama ?? "Select",
                          value: localFilter.dokter,
                        }}
                        onChange={(option) => {
                          setLocalFilter({
                            ...localFilter,
                            ...{
                              dokter: option.value,
                            },
                          })
                        }}
                        name="dokter"
                        id="dokter"
                        styles={globalStyle}
                        noOptionsMessage={() => "Data tidak ditemukan"}
                        components={{
                          IndicatorSeparator: "",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="form-label" htmlFor="unit">
                        Unit
                      </label>
                      <Select
                        options={unit.map((unit) => ({
                          value: unit.kode,
                          label: unit.nama,
                        }))}
                        value={{
                          label:
                            unit.filter((unit) => {
                              return unit.kode === localFilter.unit
                            })?.[0]?.nama ?? "Select",
                          value: localFilter.unit,
                        }}
                        onChange={(option) => {
                          setLocalFilter({
                            ...localFilter,
                            ...{
                              unit: option.value,
                            },
                          })
                        }}
                        name="unit"
                        id="unit"
                        styles={globalStyle}
                        noOptionsMessage={() => "Data tidak ditemukan"}
                        components={{
                          IndicatorSeparator: "",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="form-label" htmlFor="spesialis">
                        Spesialis
                      </label>
                      {statusSpesialis === "success" && (
                        <Select
                          options={spesialis.map((spesialis) => ({
                            value: spesialis.name,
                            label: spesialis.name,
                          }))}
                          value={{
                            label:
                              spesialis.filter((spesialis) => {
                                return spesialis.name === localFilter.spesialis
                              })?.[0]?.name ?? "Select",
                            value: localFilter.spesialis,
                          }}
                          onChange={(option) => {
                            setLocalFilter({
                              ...localFilter,
                              ...{
                                spesialis: option.value,
                              },
                            })
                          }}
                          name="spesialis"
                          id="spesialis"
                          styles={globalStyle}
                          noOptionsMessage={() => "Data tidak ditemukan"}
                          components={{
                            IndicatorSeparator: "",
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="form-label" htmlFor="ruang">
                        Ruang
                      </label>
                      <Select
                        options={ruang.map((ruang) => ({
                          value: ruang.kode,
                          label: ruang.nama,
                        }))}
                        value={{
                          label:
                            ruang.filter((ruang) => {
                              return ruang.kode === localFilter.ruang
                            })?.[0]?.nama ?? "Select",
                          value: localFilter.ruang,
                        }}
                        onChange={(option) => {
                          setLocalFilter({
                            ...localFilter,
                            ...{
                              ruang: option.value,
                            },
                          })
                        }}
                        name="ruang"
                        id="ruang"
                        styles={globalStyle}
                        noOptionsMessage={() => "Data tidak ditemukan"}
                        components={{
                          IndicatorSeparator: "",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="form-label" htmlFor="periode">
                        Periode
                      </label>
                      <CustomFlatpickrWrapper>
                        <Flatpickr
                          options={{
                            mode: "range",
                            enableTime: false,
                            dateFormat: "d/M/Y",
                            maxDate: new Date(),
                            static: true,
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
                          className="reset-button"
                          onClick={() => {
                            setLocalFilter({
                              ...localFilter,
                              ...{
                                periode: "",
                              },
                            })
                          }}
                        >
                          <GrayCrossIcon />
                        </span>
                      </CustomFlatpickrWrapper>
                      <div
                        className={`invalid-feedback ${
                          datePickerError && "d-block"
                        }`}
                      >
                        Maksimal rentang waktu adalah 7 hari
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="form-label" htmlFor="unit">
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
                        styles={statusStyle}
                        noOptionsMessage={() => "Data tidak ditemukan"}
                        components={{
                          IndicatorSeparator: "",
                        }}
                      />
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
                          dokter: "",
                          unit: "",
                          spesialis: "",
                          ruang: "",
                          periode: "",
                          status: "",
                        },
                      })
                    }}
                  >
                    <span className="indicator-label fw-medium">Ulangi</span>
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={visitStatus === "loading"}
                    onClick={() => {
                      setFilter({
                        ...filter,
                        ...localFilter,
                      })
                    }}
                  >
                    {visitStatus !== "loading" && (
                      <span className="indicator-label fw-medium">
                        Terapkan
                      </span>
                    )}
                    {visitStatus === "loading" && (
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
