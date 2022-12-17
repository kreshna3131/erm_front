import clsx from "clsx"
import { useEffect } from "react"
import useDidMountEffect from "../../hooks/useDidMountEffect"
import { ValidateStyled } from "./InputRadio"

const parentName = "operasi_yang_pernah_dialami"

/**
 * Menambahkan / mengurangi field validation di formik
 * @param {Object} formik
 * @param {String} childName
 */
function useToggleField(formik, childName, rules) {
  useDidMountEffect(() => {
    if (formik.values[parentName]?.toString() === "1") {
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

    formik.setFieldTouched(childName)
  }, [formik.values[parentName]])
}

export default function InputPernahOperasi({
  formik,
  item: { label, items, rules },
}) {
  const parsedItems = JSON.parse(items)

  useEffect(() => {
    formik.registerField(parentName, {
      validate(value) {
        let errorMessage = `${parentName} is required field`
        if (value || value === 0) {
          errorMessage = ""
        }
        return errorMessage
      },
    })
  }, [formik.values[parentName]])

  useToggleField(formik, parentName + "_jenis", rules)
  useToggleField(formik, parentName + "_kapan", rules)
  useToggleField(formik, parentName + "_komplikasi", rules)

  return (
    <div className="mb-8">
      <div className="row">
        <div className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0">
          {label}
        </div>
        <div className="col-sm-7">
          <div className="d-flex align-items-center">
            {parsedItems.map((item, key) => (
              <ValidateStyled
                key={key}
                isInvalid={
                  formik.touched.parentName && formik.errors.parentName
                }
                isValid={formik.touched.parentName && !formik.errors.parentName}
              >
                <div
                  key={key}
                  className="form-check form-check-inline form-check-solid mb-0"
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name={parentName}
                    id={parentName + item.value}
                    value={item.value}
                    onChange={formik.getFieldProps(parentName).onChange}
                    onClick={formik.getFieldProps(parentName).onBlur}
                    checked={
                      formik.values[parentName]?.toString() ===
                      item.value?.toString()
                        ? true
                        : false
                    }
                  />
                  <label
                    className="form-check-label text-gray-600"
                    htmlFor={parentName + item.value}
                  >
                    {item.label}
                  </label>
                </div>
              </ValidateStyled>
            ))}
          </div>
        </div>
      </div>
      {formik.values[parentName]?.toString() === "1" && (
        <div className="row">
          <div className="col-sm-7 offset-sm-5">
            <div className="input-group mt-5">
              <span className="input-group-text bg-gray-200 text-gray-600 border-0">
                Jenis
              </span>
              <input
                id={parentName + "_jenis"}
                {...formik.getFieldProps(parentName + "_jenis")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched[parentName + "_jenis"] &&
                      formik.errors[parentName + "_jenis"],
                  },
                  {
                    "is-valid":
                      formik.touched[parentName + "_jenis"] &&
                      !formik.errors[parentName + "_jenis"],
                  }
                )}
                type="text"
                name={parentName + "_jenis"}
                autoComplete="off"
              />
            </div>
            <div className="input-group mt-5">
              <span className="input-group-text bg-gray-200 text-gray-600 border-0">
                Kapan
              </span>
              <input
                id={parentName + "_kapan"}
                {...formik.getFieldProps(parentName + "_kapan")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched[parentName + "_kapan"] &&
                      formik.errors[parentName + "_kapan"],
                  },
                  {
                    "is-valid":
                      formik.touched[parentName + "_kapan"] &&
                      !formik.errors[parentName + "_kapan"],
                  }
                )}
                type="text"
                name={parentName + "_kapan"}
                autoComplete="off"
              />
            </div>
            <div className="input-group mt-5">
              <span className="input-group-text bg-gray-200 text-gray-600 border-0">
                Komplikasi
              </span>
              <input
                id={parentName + "_komplikasi"}
                {...formik.getFieldProps(parentName + "_komplikasi")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched[parentName + "_komplikasi"] &&
                      formik.errors[parentName + "_komplikasi"],
                  },
                  {
                    "is-valid":
                      formik.touched[parentName + "_komplikasi"] &&
                      !formik.errors[parentName + "_komplikasi"],
                  }
                )}
                type="text"
                name={parentName + "_komplikasi"}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
