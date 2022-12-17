import React, { useRef, useState } from "react"

import * as Yup from "yup"
import { useFormik } from "formik"
import clsx from "clsx"
import axios from "axios"
import { Button } from "react-bootstrap"
import { Form } from "react-bootstrap"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { Modal } from "react-bootstrap"
import { useNavigate, useOutletContext } from "react-router"
import { useEffect } from "react"
import _ from "lodash"
import AsyncSelect from "react-select/async"
import { globalStyle } from "helpers/react-select"
import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"
import SweetAlert from "react-bootstrap-sweetalert"
import useCheckPermission from "hooks/useCheckPermission"

// Skema Validasi
const createSchema = Yup.object().shape({
  diagnosa_name: Yup.string()
    .min(3, "Ketik minimal 3 huruf")
    .required("Diagnosa 9 harus diisi"),

})

// komponen utama edit diagnosa 10
export default function Edit({ diagnosaTenId, query }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({})

  const [initialValues, setInitialValues] = useState({
    diagnosa_name: "",
    diagnosa_kode: "",
    diagnosa_type: "",
    diagnosa_case: "",
    diagnosa_status: "",
  })

  const [inputValue, setValue] = useState("")
  const [selectedValue, setSelectedValue] = useState(null)

  const { user: loggedUser } = useOutletContext()
  useCheckPermission(loggedUser, "ubah icd 10")

  // handle input change event
  const handleInputChange = (value) => {
    _.debounce((value) => {
      if (value.length > 2) {
        setValue(value)
      }
    }, 1000)
  }

  // handle selection
  const handleChange = (value) => {
    setSelectedValue(value)
  }

  // untuk option diagnosa
  const loadOptions = (inputValue) => {
    if (inputValue.length > 2) {
      return axios
        .get(`/visit/icd-ten/listing-dropdown?search=${inputValue}`)
        .then((res) => res.data)
    }
  }


  const { data, status } = useQuery(
    `visit-icd-ten-${diagnosaTenId}-edit`,
    async (key) => {
      return axios
        .get(`/visit/icd-ten/${diagnosaTenId}/edit`)
        .then((res) => res.data)
    }
  )

  // set to Formik and state selected value

  useEffect(() => {
    if(status === "success") {
      setInitialValues({
        ...initialValues,
        diagnosa_type:data.diagnosis_type,
        diagnosa_case:data.case,
        diagnosa_status:data.status,

}
      )
      setSelectedValue({
        nama: data.name,
        kode: data.kode,
      })}
  }, [data])

    // set formik obat, stock dan satuan
    useEffect(() => {
      if (selectedValue) {
        setInitialValues({
          ...initialValues,
          diagnosa_name: selectedValue.nama,
          diagnosa_kode: selectedValue.kode,
        })
      }
    }, [selectedValue])


  // post hasil edit diagnosa 10
  const mutation = useMutation(
    async ({ data }) => {
      setLoading(true)
      return axios
      .post(`/visit/icd-ten/${diagnosaTenId}/update`, {
        ...{
          _method: "PATCH",
        },
        ...data,
      })
        .then((res) => res.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(query)

        setSubmitStatus({
          status: "success",
          message: "Data telah berhasil disimpan ke dalam basis data.",
        })
        setLoading(false)
        formik.setSubmitting(false)
      },
      onError: () => {
        setSubmitStatus({
          status: "danger",
          message:
            "Maaf, sepertinya ada beberapa kesalahan yang terdeteksi, silakan coba lagi.",
        })
        setLoading(false)
        formik.setSubmitting(false)
      },
    }
  )



  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: createSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true)
      setSubmitting(true)
      mutation.mutate({
        data: {
          name: values.diagnosa_name,
          kode: values.diagnosa_kode,
          diagnosis_type: values.diagnosa_type,
          case: values.diagnosa_case,
          status: values.diagnosa_status,

        },
      })
    },
  })


  return (
    <>
      {submitStatus?.status && (
        <SweetAlert
          title=""
          type={submitStatus.status}
          style={{
            minHeight: "322px",
            width: "364px",
            padding: "30px",
            borderRadius: "10px",
          }}
          onConfirm={() => {
            setSubmitStatus({})
            navigate(-1)
          }}
          confirmBtnText="OK mengerti"
        >
          <div className="text-gray-600 mb-5">{submitStatus?.message}</div>
        </SweetAlert>
      )}
      <Modal show="true" animation={false}>
        <Modal.Header>
          <Modal.Title>Detail Diagnosa 10</Modal.Title>
          <GrayCrossIcon
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </Modal.Header>

        <Modal.Body className="p-10">
          <form className="form w-100" onSubmit={formik.handleSubmit}>
            <div className="form-group mb-4">
              <label
                htmlFor="create_diagnosa_name"
                className="form-label fs-6 fw-medium text-gray-700"
              >
                Pilih Diagnosa
              </label>
              <AsyncSelect
                id="create_diagnosa_name"
                className={clsx(
                  {
                    "is-invalid":
                      formik.touched.diagnosa_name &&
                      formik.errors.diagnosa_name,
                  },
                  {
                    "is-valid":
                      formik.touched.diagnosa_name &&
                      !formik.errors.diagnosa_name,
                  }
                )}
                styles={{
                  ...globalStyle,
                  control: (styles, state) => ({
                    ...styles,
                    backgroundColor: "#F5F8FA",
                    padding: "5px",
                    borderRadius: "0.475rem",
                    border: state.isFocused ? 0 : 0,
                    boxShadow: state.isFocused ? 0 : 0,
                    maxHeight: "42px",
                    content: `""`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "85% center",
                    backgroundSize:
                      "calc(0.75em + 0.75rem) calc(0.75em + 0.75rem)",

                    "&:hover": {
                      border: state.isFocused ? 0 : 0,
                    },
                  }),
                }}
                value={selectedValue}
                getOptionLabel={(e) => {
                  return (
                    <div>
                      {e.kode} - {e.nama}
                    </div>
                  )
                }}
                getOptionValue={(e) => e}
                loadOptions={loadOptions}
                onInputChange={handleInputChange}
                onChange={handleChange}
              />
              {formik.touched.diagnosa_name && formik.errors.diagnosa_name && (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.diagnosa_name}
                </Form.Control.Feedback>
              )}
            </div>
            <div className="form-group mb-4">
              <label
                htmlFor="create_diagnosa_type"
                className="form-label fs-6 fw-medium text-gray-700"
              >
                Jenis Diagnosa
              </label>
              <div className="mt-sm-3 mt-0">
                <div className="form-check form-check-solid form-check-inline me-10">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="diagnosa_type"
                    value="Diagnosa Primer"
                    id="diagnosa-primer-radio"
                    checked={formik.values.diagnosa_type === "Diagnosa Primer"}
                    onChange={(event) => {
                      event.currentTarget.checked &&
                        formik.setFieldValue(
                          "diagnosa_type",
                          event.currentTarget.value
                        )
                    }}
                  />
                  <label
                    className="form-check-label text-gray-600"
                    htmlFor="diagnosa-primer-radio"
                  >
                    Diagnosa Primer
                  </label>
                </div>
                <div className="form-check form-check-solid form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="diagnosa_type"
                    id="diagnosa-sekunder-radio"
                    value="Diagnosa Sekunder"
                    checked={formik.values.diagnosa_type === "Diagnosa Sekunder"}

                    onChange={(event) => {
                      event.currentTarget.checked &&
                        formik.setFieldValue(
                          "diagnosa_type",
                          event.currentTarget.value
                        )
                    }}
                  />
                  <label
                    className="form-check-label text-gray-600"
                    htmlFor="diagnosa-sekunder-radio"
                  >
                    Diagnosa Sekunder
                  </label>
                </div>
              </div>
              {formik.touched.diagnosa_type && formik.errors.diagnosa_type && (
                <span className="invalid-feedback" type="invalid">
                  {formik.errors.diagnosa_type}
                </span>
              )}
            </div>
            <div className="form-group mb-4">
              <label
                htmlFor="create_diagnosa_case"
                className="form-label fs-6 fw-medium text-gray-700"
              >
                Kasus
              </label>
              <div className="mt-sm-3 mt-0">
                <div className="form-check form-check-solid form-check-inline me-10">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="diagnosa_case"
                    value="Baru"
                    id="diagnosa-old-radio"
                    checked={formik.values.diagnosa_case === "Baru"}

                    onChange={(event) => {
                      event.currentTarget.checked &&
                        formik.setFieldValue(
                          "diagnosa_case",
                          event.currentTarget.value
                        )
                    }}
                  />
                  <label
                    className="form-check-label text-gray-600"
                    htmlFor="diagnosa-old-radio"
                  >
                    Baru
                  </label>
                </div>
                <div className="form-check form-check-solid form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="diagnosa_case"
                    id="diagnosa-new-radio"
                    value="Lama"
                    checked={formik.values.diagnosa_case === "Lama"}

                    onChange={(event) => {
                      event.currentTarget.checked &&
                        formik.setFieldValue(
                          "diagnosa_case",
                          event.currentTarget.value
                        )
                    }}
                  />
                  <label
                    className="form-check-label text-gray-600"
                    htmlFor="diagnosa-new-radio"
                  >
                    Lama
                  </label>
                </div>
              </div>
              {formik.touched.diagnosa_case && formik.errors.diagnosa_case && (
                <span className="invalid-feedback" type="invalid">
                  {formik.errors.diagnosa_case}
                </span>
              )}
            </div>

            <div className="form-group mb-4">
              <label
                htmlFor="create_diagnosa_status"
                className="form-label fs-6 fw-medium text-gray-700"
              >
                Status diagnosa
              </label>
              <div className="mt-sm-3 mt-0">
                <div className="form-check form-check-solid form-check-inline me-10">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="diagnosa_status"
                    value="Diagnosa Awal"
                    id="diagnosa-first-radio"
                    checked={formik.values.diagnosa_status === "Diagnosa Awal"}

                    onChange={(event) => {
                      event.currentTarget.checked &&
                        formik.setFieldValue(
                          "diagnosa_status",
                          event.currentTarget.value
                        )
                    }}
                  />
                  <label
                    className="form-check-label text-gray-600"
                    htmlFor="diagnosa-first-radio"
                  >
                    Diagnosa Awal
                  </label>
                </div>
                <div className="form-check form-check-solid form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="diagnosa_status"
                    id="diagnosa-last-radio"
                    value="Diagnosa Akhir"
                    checked={formik.values.diagnosa_status === "Diagnosa Akhir"}

                    onChange={(event) => {
                      event.currentTarget.checked &&
                        formik.setFieldValue(
                          "diagnosa_status",
                          event.currentTarget.value
                        )
                    }}
                  />
                  <label
                    className="form-check-label text-gray-600"
                    htmlFor="diagnosa-last-radio"
                  >
                    Diagnosa Akhir
                  </label>
                </div>
              </div>
              {formik.touched.diagnosa_status && formik.errors.diagnosa_status && (
                <span className="invalid-feedback" type="invalid">
                  {formik.errors.diagnosa_status}
                </span>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-center w-100">
            <Button
              type="button"
              variant="light"
              className="me-5"
              onClick={() => navigate(-1)}
            >
              Batal
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={() => formik.submitForm()}
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {!loading && (
                <span className="indicator-label fw-medium">Simpan</span>
              )}
              {loading && (
                <span
                  className="indicator-progress"
                  style={{ display: "block" }}
                >
                  Please wait...
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}
