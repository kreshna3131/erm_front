import clsx from "clsx"
import * as Yup from "yup"

/**
 * Create dynamic formik validation scheme
 * @param {Array<import("interfaces/attribute").attribute>} data
 */
export function createValidationScheme(data) {
  return new Promise((resolve) => {
    const validationScheme = {}
    const arrayData = Object.values(data)
    arrayData.map((itemGroup, key) => {
      itemGroup.map((item, jey) => {
        /** @type {import("interfaces/attribute").attribute} */
        const attribute = item
        const blackList = ["pernah_mondok", "fungsional", "thoraks"]

        if (!blackList.includes(attribute.name)) {
          if (attribute.rules === "required") {
            validationScheme[attribute.name] = Yup.mixed().required()
          } else {
            validationScheme[attribute.name] = Yup.mixed().nullable()
          }
        }

        if (jey === itemGroup.length - 1 && key === arrayData.length - 1) {
          resolve(Yup.object().shape(validationScheme))
        }
      })
    })
  })
}

/**
 * Create dynamic formik initialvalues
 * @param {Array<import("interfaces/attribute").attribute>} data
 */
export function createInitialValues(data) {
  return new Promise((resolve) => {
    const initalValues = {}
    data.map((item, key) => {
      /** @type {import("interfaces/attribute").attribute} */
      const attribute = item

      switch (attribute.type) {
        case "conditional_radio_prepend_number":
          initalValues[attribute.name + "_text"] = ""
          break
      }

      initalValues[attribute.name] = ""

      if (key === data.length - 1) {
        resolve(initalValues)
      }
    })
  })
}

/**
 * @param {Object} formik
 * @param {String} name
 * @returns
 */
export function dynamicFormControlClass(formik, name) {
  return clsx(
    "form-control form-control-solid",
    {
      "is-invalid": formik.touched[name] && formik.errors[name],
    },
    {
      "is-valid": formik.touched[name] && !formik.errors[name],
    }
  )
}
