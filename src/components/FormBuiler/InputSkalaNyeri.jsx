import React, { useEffect } from "react"
import useDidMountEffect from "../../hooks/useDidMountEffect"
import { ValidateStyled } from "./InputRadio"
import WongBaker from "../../assets/images/wong_baker.png"

export default function InputSkalaNyeri({ formik, item: { rules } }) {
  useEffect(() => {
    formik.registerField("nyeri", {
      validate(value) {
        let errorMessage
        if (!value && rules === "required") {
          errorMessage = "nyeri is required field"
        }
        return errorMessage
      },
    })

    formik.registerField("nyeri_pilihan", {
      validate(value) {
        let errorMessage
        if (!value && rules === "required") {
          errorMessage = "nyeri_pilihan is required field"
        }
        return errorMessage
      },
    })
  }, [])

  useDidMountEffect(() => {
    formik.setFieldValue("nyeri_pilihan", "")
    setTimeout(() => {
      formik.setFieldTouched("nyeri_pilihan")
    }, 500)
  }, [formik.values.nyeri])

  return (
    <div className="row mb-4">
      <div className="col-sm-5 text-start text-sm-end form-label fs-6 fw-medium text-gray-700 mb-4 mb-sm-0">
        Berapa lama dan skala nyeri
      </div>
      <div className="col-sm-7">
        {formik.errors.nyeri && formik.touched.nyeri && (
          <p className="text-danger" role="alert">
            Kolom ini wajib untuk di pilih
          </p>
        )}
        <div className="form-check form-check-solid mb-6">
          <input
            className="form-check-input"
            type="radio"
            name="nyeri"
            id="nyeri_0"
            value="0 - < 1 bulan (nips)"
            onChange={formik.getFieldProps("nyeri").onChange}
            onClick={formik.getFieldProps("nyeri").onBlur}
            checked={
              formik.values.nyeri?.toString() === "0 - < 1 bulan (nips)"
                ? true
                : false
            }
          />
          <label className="form-check-label text-gray-600" htmlFor="nyeri_0">
            {"0 - < 1 bulan (NIPS)"}
          </label>
        </div>
        {formik.values.nyeri === "0 - < 1 bulan (nips)" && (
          <>
            <ValidateStyled
              className="d-block ps-10"
              isInvalid={
                formik.touched.nyeri_pilihan && formik.errors.nyeri_pilihan
              }
              isValid={
                formik.touched.nyeri_pilihan && !formik.errors.nyeri_pilihan
              }
            >
              <div className="form-check form-check-inline form-check-solid mb-6">
                <input
                  className="form-check-input"
                  type="radio"
                  name="nyeri_pilihan"
                  id="nyeri_pilihan_0"
                  value="0 (Tidak Nyeri)"
                  onChange={formik.getFieldProps("nyeri_pilihan").onChange}
                  onBlur={formik.getFieldProps("nyeri_pilihan").onBlur}
                  checked={
                    formik.values.nyeri_pilihan?.toString() ===
                    "0 (Tidak Nyeri)"
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label text-gray-600"
                  htmlFor="nyeri_pilihan_0"
                >
                  {"0 (Tidak Nyeri)"}
                </label>
              </div>
              <div className="form-check form-check-inline form-check-solid mb-6">
                <input
                  className="form-check-input"
                  type="radio"
                  name="nyeri_pilihan"
                  id="nyeri_pilihan_1"
                  value="1 - 2 (Ringan)"
                  onChange={formik.getFieldProps("nyeri_pilihan").onChange}
                  onBlur={formik.getFieldProps("nyeri_pilihan").onBlur}
                  checked={
                    formik.values.nyeri_pilihan?.toString() === "1 - 2 (Ringan)"
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label text-gray-600"
                  htmlFor="nyeri_pilihan_1"
                >
                  {"1 - 2 (Ringan)"}
                </label>
              </div>
              <div className="form-check form-check-inline form-check-solid mb-6">
                <input
                  className="form-check-input"
                  type="radio"
                  name="nyeri_pilihan"
                  id="nyeri_pilihan_2"
                  value="3 - 4 (Sedang)"
                  onChange={formik.getFieldProps("nyeri_pilihan").onChange}
                  onBlur={formik.getFieldProps("nyeri_pilihan").onBlur}
                  checked={
                    formik.values.nyeri_pilihan?.toString() === "3 - 4 (Sedang)"
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label text-gray-600"
                  htmlFor="nyeri_pilihan_2"
                >
                  {"3 - 4 (Sedang)"}
                </label>
              </div>
              <div className="form-check form-check-inline form-check-solid mb-6">
                <input
                  className="form-check-input"
                  type="radio"
                  name="nyeri_pilihan"
                  id="nyeri_pilihan_3"
                  value="> 4 (Berat)"
                  onChange={formik.getFieldProps("nyeri_pilihan").onChange}
                  onBlur={formik.getFieldProps("nyeri_pilihan").onBlur}
                  checked={
                    formik.values.nyeri_pilihan?.toString() === "> 4 (Berat)"
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label text-gray-600"
                  htmlFor="nyeri_pilihan_3"
                >
                  {"> 4 (Berat)"}
                </label>
              </div>
            </ValidateStyled>
          </>
        )}
        <div className="form-check form-check-solid mb-6">
          <input
            className="form-check-input"
            type="radio"
            name="nyeri"
            id="nyeri_1"
            value="1 bulan - 3 tahun (flacc pain scale)"
            onChange={formik.getFieldProps("nyeri").onChange}
            onClick={formik.getFieldProps("nyeri").onBlur}
            checked={
              formik.values.nyeri?.toString() ===
              "1 bulan - 3 tahun (flacc pain scale)"
                ? true
                : false
            }
          />
          <label className="form-check-label text-gray-600" htmlFor="nyeri_1">
            {"1 bulan - 3 tahun (FLACC PAIN SCALE)"}
          </label>
        </div>
        {formik.values.nyeri === "1 bulan - 3 tahun (flacc pain scale)" && (
          <>
            <ValidateStyled
              className="d-block ps-10"
              isInvalid={
                formik.touched.nyeri_pilihan && formik.errors.nyeri_pilihan
              }
              isValid={
                formik.touched.nyeri_pilihan && !formik.errors.nyeri_pilihan
              }
            >
              <div className="form-check form-check-inline form-check-solid mb-6">
                <input
                  className="form-check-input"
                  type="radio"
                  name="nyeri_pilihan"
                  id="nyeri_pilihan_4"
                  value="0 (Tidak Nyeri)"
                  onChange={formik.getFieldProps("nyeri_pilihan").onChange}
                  onBlur={formik.getFieldProps("nyeri_pilihan").onBlur}
                  checked={
                    formik.values.nyeri_pilihan?.toString() ===
                    "0 (Tidak Nyeri)"
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label text-gray-600"
                  htmlFor="nyeri_pilihan_4"
                >
                  {"0 (Tidak Nyeri)"}
                </label>
              </div>
              <div className="form-check form-check-inline form-check-solid mb-6">
                <input
                  className="form-check-input"
                  type="radio"
                  name="nyeri_pilihan"
                  id="nyeri_pilihan_5"
                  value="1 - 3 (Ringan)"
                  onChange={formik.getFieldProps("nyeri_pilihan").onChange}
                  onBlur={formik.getFieldProps("nyeri_pilihan").onBlur}
                  checked={
                    formik.values.nyeri_pilihan?.toString() === "1 - 3 (Ringan)"
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label text-gray-600"
                  htmlFor="nyeri_pilihan_5"
                >
                  {"1 - 3 (Ringan)"}
                </label>
              </div>
              <div className="form-check form-check-inline form-check-solid mb-6">
                <input
                  className="form-check-input"
                  type="radio"
                  name="nyeri_pilihan"
                  id="nyeri_pilihan_2"
                  value="4 - 6 (Sedang)"
                  onChange={formik.getFieldProps("nyeri_pilihan").onChange}
                  onBlur={formik.getFieldProps("nyeri_pilihan").onBlur}
                  checked={
                    formik.values.nyeri_pilihan?.toString() === "4 - 6 (Sedang)"
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label text-gray-600"
                  htmlFor="nyeri_pilihan_2"
                >
                  {"4 - 6 (Sedang)"}
                </label>
              </div>
              <div className="form-check form-check-inline form-check-solid mb-6">
                <input
                  className="form-check-input"
                  type="radio"
                  name="nyeri_pilihan"
                  id="nyeri_pilihan_3"
                  value="7 - 10 (Berat)"
                  onChange={formik.getFieldProps("nyeri_pilihan").onChange}
                  onBlur={formik.getFieldProps("nyeri_pilihan").onBlur}
                  checked={
                    formik.values.nyeri_pilihan?.toString() === "7 - 10 (Berat)"
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label text-gray-600"
                  htmlFor="nyeri_pilihan_3"
                >
                  {"7 - 10 (Berat)"}
                </label>
              </div>
            </ValidateStyled>
          </>
        )}
        <div className="form-check form-check-solid mb-6">
          <input
            className="form-check-input"
            type="radio"
            name="nyeri"
            id="nyeri_2"
            value="confort scale"
            onChange={formik.getFieldProps("nyeri").onChange}
            onClick={formik.getFieldProps("nyeri").onBlur}
            checked={
              formik.values.nyeri?.toString() === "confort scale" ? true : false
            }
          />
          <label className="form-check-label text-gray-600" htmlFor="nyeri_2">
            {"Confort Scale"}
          </label>
        </div>
        {formik.values.nyeri === "confort scale" && (
          <>
            <ValidateStyled
              className="d-block ps-10"
              isInvalid={
                formik.touched.nyeri_pilihan && formik.errors.nyeri_pilihan
              }
              isValid={
                formik.touched.nyeri_pilihan && !formik.errors.nyeri_pilihan
              }
            >
              <div className="form-check form-check-inline form-check-solid mb-6">
                <input
                  className="form-check-input"
                  type="radio"
                  name="nyeri_pilihan"
                  id="nyeri_pilihan_9"
                  value="9 - 18 (Nyeri Terkontrol)"
                  onChange={formik.getFieldProps("nyeri_pilihan").onChange}
                  onBlur={formik.getFieldProps("nyeri_pilihan").onBlur}
                  checked={
                    formik.values.nyeri_pilihan?.toString() ===
                    "9 - 18 (Nyeri Terkontrol)"
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label text-gray-600"
                  htmlFor="nyeri_pilihan_9"
                >
                  {"9 - 18 (Nyeri Terkontrol)"}
                </label>
              </div>
              <div className="form-check form-check-inline form-check-solid mb-6">
                <input
                  className="form-check-input"
                  type="radio"
                  name="nyeri_pilihan"
                  id="nyeri_pilihan_10"
                  value="19 - 26 (Ringan)"
                  onChange={formik.getFieldProps("nyeri_pilihan").onChange}
                  onBlur={formik.getFieldProps("nyeri_pilihan").onBlur}
                  checked={
                    formik.values.nyeri_pilihan?.toString() ===
                    "19 - 26 (Ringan)"
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label text-gray-600"
                  htmlFor="nyeri_pilihan_10"
                >
                  {"19 - 26 (Ringan)"}
                </label>
              </div>
              <div className="form-check form-check-inline form-check-solid mb-6">
                <input
                  className="form-check-input"
                  type="radio"
                  name="nyeri_pilihan"
                  id="nyeri_pilihan_11"
                  value="27 - 35 (Sedang)"
                  onChange={formik.getFieldProps("nyeri_pilihan").onChange}
                  onBlur={formik.getFieldProps("nyeri_pilihan").onBlur}
                  checked={
                    formik.values.nyeri_pilihan?.toString() ===
                    "27 - 35 (Sedang)"
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label text-gray-600"
                  htmlFor="nyeri_pilihan_11"
                >
                  {"27 - 35 (Sedang)"}
                </label>
              </div>
              <div className="form-check form-check-inline form-check-solid mb-6">
                <input
                  className="form-check-input"
                  type="radio"
                  name="nyeri_pilihan"
                  id="nyeri_pilihan_12"
                  value="> 35 (Berat)"
                  onChange={formik.getFieldProps("nyeri_pilihan").onChange}
                  onBlur={formik.getFieldProps("nyeri_pilihan").onBlur}
                  checked={
                    formik.values.nyeri_pilihan?.toString() === "> 35 (Berat)"
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label text-gray-600"
                  htmlFor="nyeri_pilihan_12"
                >
                  {"> 35 (Berat)"}
                </label>
              </div>
            </ValidateStyled>
          </>
        )}
        <div className="form-check form-check-solid mb-6">
          <input
            className="form-check-input"
            type="radio"
            name="nyeri"
            id="nyeri_3"
            value="lebih dari 3 tahun (wong baker`s combined numeric scale)"
            onChange={formik.getFieldProps("nyeri").onChange}
            onClick={formik.getFieldProps("nyeri").onBlur}
            checked={
              formik.values.nyeri?.toString() ===
              "lebih dari 3 tahun (wong baker`s combined numeric scale)"
                ? true
                : false
            }
          />
          <label className="form-check-label text-gray-600" htmlFor="nyeri_3">
            {"Lebih dari 3 tahun (Wong Baker`s Combined Numeric Scale)"}
          </label>
        </div>
        {formik.values.nyeri ===
          "lebih dari 3 tahun (wong baker`s combined numeric scale)" && (
          <>
            <img src={WongBaker} className="mb-8 ps-10" />
            <ValidateStyled
              className="d-block ps-10"
              isInvalid={
                formik.touched.nyeri_pilihan && formik.errors.nyeri_pilihan
              }
              isValid={
                formik.touched.nyeri_pilihan && !formik.errors.nyeri_pilihan
              }
            >
              <div className="form-check form-check-inline form-check-solid mb-6">
                <input
                  className="form-check-input"
                  type="radio"
                  name="nyeri_pilihan"
                  id="nyeri_pilihan_13"
                  value="0 (Tidak Nyeri)"
                  onChange={formik.getFieldProps("nyeri_pilihan").onChange}
                  onBlur={formik.getFieldProps("nyeri_pilihan").onBlur}
                  checked={
                    formik.values.nyeri_pilihan?.toString() ===
                    "0 (Tidak Nyeri)"
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label text-gray-600"
                  htmlFor="nyeri_pilihan_13"
                >
                  {"0 (Tidak Nyeri)"}
                </label>
              </div>
              <div className="form-check form-check-inline form-check-solid mb-6">
                <input
                  className="form-check-input"
                  type="radio"
                  name="nyeri_pilihan"
                  id="nyeri_pilihan_1"
                  value="1 - 3 (Ringan)"
                  onChange={formik.getFieldProps("nyeri_pilihan").onChange}
                  onBlur={formik.getFieldProps("nyeri_pilihan").onBlur}
                  checked={
                    formik.values.nyeri_pilihan?.toString() === "1 - 3 (Ringan)"
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label text-gray-600"
                  htmlFor="nyeri_pilihan_1"
                >
                  {"1 - 3 (Ringan)"}
                </label>
              </div>
              <div className="form-check form-check-inline form-check-solid mb-6">
                <input
                  className="form-check-input"
                  type="radio"
                  name="nyeri_pilihan"
                  id="nyeri_pilihan_2"
                  value="4 - 6 (Sedang)"
                  onChange={formik.getFieldProps("nyeri_pilihan").onChange}
                  onBlur={formik.getFieldProps("nyeri_pilihan").onBlur}
                  checked={
                    formik.values.nyeri_pilihan?.toString() === "4 - 6 (Sedang)"
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label text-gray-600"
                  htmlFor="nyeri_pilihan_2"
                >
                  {"4 - 6 (Sedang)"}
                </label>
              </div>
              <div className="form-check form-check-inline form-check-solid mb-6">
                <input
                  className="form-check-input"
                  type="radio"
                  name="nyeri_pilihan"
                  id="nyeri_pilihan_3"
                  value="7 - 10 (Berat)"
                  onChange={formik.getFieldProps("nyeri_pilihan").onChange}
                  onBlur={formik.getFieldProps("nyeri_pilihan").onBlur}
                  checked={
                    formik.values.nyeri_pilihan?.toString() === "7 - 10 (Berat)"
                      ? true
                      : false
                  }
                />
                <label
                  className="form-check-label text-gray-600"
                  htmlFor="nyeri_pilihan_3"
                >
                  {"7 - 10 (Berat)"}
                </label>
              </div>
            </ValidateStyled>
          </>
        )}
      </div>
    </div>
  )
}
