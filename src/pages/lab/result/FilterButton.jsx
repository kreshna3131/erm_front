import "assets/css/flatpickr.css"
import BlueGlass from "assets/icons/blue-glass.png"
import { ReactComponent as Checklist } from "assets/icons/checklist.svg"
import { ReactComponent as Clock } from "assets/icons/clock.svg"
import { ReactComponent as CrossSign } from "assets/icons/cross-sign.svg"
import { ReactComponent as FilterIcon } from "assets/icons/filter.svg"
import { ReactComponent as GrayCross } from "assets/icons/gray-cross.svg"
import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"
import Menu from "assets/icons/menu.png"
import YellowPencil from "assets/icons/yellow-pencil.png"
import { ButtonLightStyled } from "components/Button"
import { globalStyle } from "helpers/react-select"
import useOnClickOutside from "hooks/useOnClickOutside"
import { DateTime } from "luxon"
import { CustomFlatpickrWrapper } from "pages/visit/FilterButton"
import { useRef, useState } from "react"
import { Overlay } from "react-bootstrap"
import Flatpickr from "react-flatpickr"
import Select from "react-select"

/**
 * Data input select status
 */
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
        <img src={YellowPencil} alt={YellowPencil} />
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
        <img src={BlueGlass} alt={BlueGlass} />
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

/**
 * Komponen utama tombol filter
 */
export default function FilterButton({ filterProps, labStatus }) {
  const [filter, setFilter] = filterProps
  const [localFilter, setLocalFilter] = useState({
    periode: [],
    status: "",
    is_read: "",
  })
  const [datePickerError, setDatePickerError] = useState(false)
  const [filterToastShow, setFilterToastShow] = useState(false)
  const overlayTarget = useRef()

  /** Logic close toast ketika klik diluar toast container */
  const overlayContainerRef = useRef()
  useOnClickOutside(overlayContainerRef, () => setFilterToastShow(false))

  return (
    <>
      <ButtonLightStyled
        ref={overlayTarget}
        className={`btn btn-light-primary ${filterToastShow ? "active" : ""}`}
        onClick={() => setFilterToastShow(!filterToastShow)}
      >
        <FilterIcon /> Filter
      </ButtonLightStyled>
      <Overlay
        ref={overlayContainerRef}
        target={overlayTarget.current}
        show={filterToastShow}
        placement="bottom-end"
      >
        <div
          className="card shadow-sm w-full w-sm-400px"
          style={{ zIndex: 999 }}
        >
          <div className="card-header align-items-center">
            <div className="card-title">Filter Options</div>
            <GrayCrossIcon
              type="button"
              onClick={() => setFilterToastShow(false)}
            ></GrayCrossIcon>
          </div>

          {labStatus === "loading" && (
            <div
              className="card-body d-flex flex-center"
              style={{ minHeight: "350px" }}
            >
              <p className="text-gray-600">Loading...</p>
            </div>
          )}
          {labStatus === "error" && (
            <div
              className="card-body d-flex flex-center"
              style={{ minHeight: "350px" }}
            >
              <p className="text-gray-600">Error...</p>
            </div>
          )}
          {labStatus === "success" && (
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
                      <label className="form-label" htmlFor="periode">
                        Periode
                      </label>
                      <CustomFlatpickrWrapper>
                        <Flatpickr
                          options={{
                            mode: "range",
                            enableTime: false,
                            dateFormat: "d/M/Y",
                            static: true,
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
                          <GrayCross />
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
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-light me-4"
                    onClick={() => {
                      setLocalFilter({
                        ...localFilter,
                        ...{
                          periode: [],
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
                    disabled={labStatus === "loading"}
                    onClick={() => {
                      setFilter({
                        ...filter,
                        ...localFilter,
                      })
                    }}
                  >
                    {labStatus !== "loading" && (
                      <span className="indicator-label fw-medium">
                        Terapkan
                      </span>
                    )}
                    {labStatus === "loading" && (
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
