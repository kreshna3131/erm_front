import "assets/css/flatpickr.css"
import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"
import clsx from "clsx"
import { Indonesian } from "flatpickr/dist/l10n/id"
import { useEffect } from "react"
import Flatpickr from "react-flatpickr"
import { useQuery } from "react-query"
import Select from "react-select"
import { globalStyle } from "../../helpers/react-select"
import useDidMountEffect from "../../hooks/useDidMountEffect"
import { dateBackground } from "./InputDropDown"
import { ValidateStyled } from "./InputRadio"

/**
 * Menambahkan / mengurangi field validation di formik
 * @param {Object} formik
 * @param {String} childName
 */
function useToggleField(formik, childName, rules) {
  useDidMountEffect(() => {
    if (formik.values.pernah_dirawat_simo?.toString() === "1") {
      formik.registerField(childName, {
        validate(value) {
          let errorMessage
          if (!value && rules === "required") {
            errorMessage = childName + " is required field"
          }
          return errorMessage
        },
      })
    } else {
      formik.unregisterField(childName)
    }

    // formik.setFieldValue(childName, "")
    formik.setFieldTouched(childName)
  }, [formik.values.pernah_dirawat_simo])
}

export default function InputPernahMondok({
  formik,
  item: { label, items, rules },
}) {
  const parsedItems = JSON.parse(items)

  const { data: ruangData, status: ruangStatus } = useQuery(
    "ruang-as-filter",
    async () => {
      return fetch(
        `${process.env.REACT_APP_API_SIMO_BASE_URL}/ref/tempatlayanan`
      )
        .then((res) => res.json())
        .then((data) => data)
    }
  )

  useEffect(() => {
    formik.registerField("pernah_dirawat_simo", {
      validate(value) {
        let errorMessage = "pernah_dirawat_simo is required field"
        if (value || value === 0) {
          errorMessage = ""
        }
        return errorMessage
      },
    })
  }, [formik.values.pernah_dirawat_simo])

  useToggleField(formik, "inap_ke_simo", rules)
  useToggleField(formik, "terakhir_dirawat_simo", rules)
  useToggleField(formik, "terakhir_dirawat_diruang_simo", rules)

  return (
    <>
      <div className="row mb-8">
        <div className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0">
          {label}
        </div>
        <div className="col-sm-7">
          <div className="d-flex align-items-center">
            {parsedItems.map((item, key) => (
              <ValidateStyled
                key={key}
                isInvalid={
                  formik.touched.pernah_dirawat_simo &&
                  formik.errors.pernah_dirawat_simo
                }
                isValid={
                  formik.touched.pernah_dirawat_simo &&
                  !formik.errors.pernah_dirawat_simo
                }
              >
                <div
                  key={key}
                  className="form-check form-check-inline form-check-solid mb-0"
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name="pernah_dirawat_simo"
                    id={"pernah_dirawat_simo" + item.value}
                    value={item.value}
                    onChange={
                      formik.getFieldProps("pernah_dirawat_simo").onChange
                    }
                    onClick={formik.getFieldProps("pernah_dirawat_simo").onBlur}
                    checked={
                      formik.values.pernah_dirawat_simo?.toString() ===
                      item.value?.toString()
                        ? true
                        : false
                    }
                  />
                  <label
                    className="form-check-label text-gray-600"
                    htmlFor={"pernah_dirawat_simo" + item.value}
                  >
                    {item.label}
                  </label>
                </div>
              </ValidateStyled>
            ))}
          </div>
        </div>
      </div>
      {formik.values.pernah_dirawat_simo?.toString() === "1" && (
        <div className="mb-8">
          <div className="row align-items-center mb-4">
            <label className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0">
              Mondok di RSUD Simo yang ke
            </label>
            <div className="col-sm-4">
              <input
                {...formik.getFieldProps("inap_ke_simo")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.inap_ke_simo && formik.errors.inap_ke_simo,
                  },
                  {
                    "is-valid":
                      formik.touched.inap_ke_simo &&
                      !formik.errors.inap_ke_simo,
                  }
                )}
                type="number"
                min={0}
                name="inap_ke_simo"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="row align-items-center mb-4">
            <label
              className="col-sm-5 text-gray-700 text-sm-end form-label"
              htmlFor="ruang"
            >
              Dirawat terakhir tanggal
            </label>
            <div className="col-sm-5 position-relative">
              <Flatpickr
                options={{
                  mode: "single",
                  enableTime: false,
                  dateFormat: "d/M/Y",
                  maxDate: new Date(),
                  locale: Indonesian,
                }}
                value={formik.values.terakhir_dirawat_simo}
                onChange={(value) => {
                  formik.setValues({
                    ...formik.values,
                    terakhir_dirawat_simo: value[0],
                  })
                  formik.setFieldTouched("terakhir_dirawat_simo")
                }}
                onClose={() => {
                  formik.setFieldTouched("terakhir_dirawat_simo")
                }}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.terakhir_dirawat_simo &&
                      formik.errors.terakhir_dirawat_simo,
                  },
                  {
                    "is-valid":
                      formik.touched.terakhir_dirawat_simo &&
                      !formik.errors.terakhir_dirawat_simo,
                  }
                )}
                data-enable-time
              />
              <span
                role="button"
                className="position-absolute"
                style={{ right: "50px", top: "10px" }}
                onClick={() => {
                  formik.setValues({
                    ...formik.values,
                    terakhir_dirawat_simo: "",
                  })
                }}
              >
                <GrayCrossIcon />
              </span>
            </div>
          </div>
          <div className="row align-items-center mb-4">
            <label
              className="col-sm-5 text-gray-700 text-sm-end form-label"
              htmlFor="ruang"
            >
              Dirawat terakhir di ruang
            </label>
            <div className="col-sm-5">
              {ruangStatus !== "success" && (
                <Select
                  isLoading={true}
                  styles={{
                    ...globalStyle,
                  }}
                />
              )}
              {ruangStatus === "success" && (
                <Select
                  options={ruangData?.map((ruang) => ({
                    value: ruang.nama,
                    label: ruang.nama,
                  }))}
                  onChange={(option) =>
                    formik.setFieldValue(
                      "terakhir_dirawat_diruang_simo",
                      option.value
                    )
                  }
                  value={{
                    label:
                      ruangData?.filter((ruang) => {
                        return (
                          ruang.nama?.toString() ===
                          formik.values.terakhir_dirawat_diruang_simo?.toString()
                        )
                      })?.[0]?.nama ?? "Select",
                    value: formik.values.terakhir_dirawat_diruang_simo,
                  }}
                  onMenuClose={() =>
                    formik.setFieldTouched("terakhir_dirawat_diruang_simo")
                  }
                  name="ruang"
                  id="ruang"
                  styles={{
                    ...globalStyle,
                    control: (styles, state) => ({
                      ...styles,
                      backgroundColor: "#F5F8FA",
                      padding: "5px",
                      borderRadius: "0.475rem",
                      border: state.isFocused ? 0 : 0,
                      boxShadow: state.isFocused ? 0 : 0,
                      padding: "4px",
                      maxHeight: "42px",
                      content: `""`,
                      backgroundImage: dateBackground(
                        formik,
                        "terakhir_dirawat_diruang_simo"
                      ),
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "85% center",
                      backgroundSize:
                        "calc(0.75em + 0.75rem) calc(0.75em + 0.75rem)",
                      fontWeight: "500",

                      "&:hover": {
                        border: state.isFocused ? 0 : 0,
                      },
                    }),
                  }}
                  noOptionsMessage={() => "Data tidak ditemukan"}
                  components={{
                    IndicatorSeparator: "",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
