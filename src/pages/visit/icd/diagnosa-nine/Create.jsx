import React, { useRef, useState } from "react"
import * as Yup from "yup"
import { useFormik } from "formik"
import clsx from "clsx"
import axios from "axios"
import { Button } from "react-bootstrap"
import { Form } from "react-bootstrap"
import { useMutation,  useQueryClient } from "react-query"
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
  diagnosa_nine: Yup.string().min(3,"Ketik minimal 3 huruf").required("Diagnosa 9 harus diisi"),
 
})



// komponen utama membuat obat di diagnosa 9
export default function Create({ visitId, query }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({})

  const [initialValues, setInitialValues] = useState({
   diagnosa_nine:'',
   kode:''
  })

  const [inputValue, setValue] = useState("")
  const [selectedValue, setSelectedValue] = useState(null)

  const { user: loggedUser } = useOutletContext()
  useCheckPermission(loggedUser, "tambah icd 9")

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
      return axios.get(`/visit/icd-nine/listing-dropdown?search=${inputValue}`)
        .then((res) =>  res.data)
    }
  }

  
  

  // post 
  const mutation = useMutation(
    async ({ data, id }) => {
      setLoading(true)
      return axios
        .post(`/visit/${id}/icd-nine/store`, data)
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

  // set formik dari state selected Value
  useEffect(() => {
    if (selectedValue) {    
      setInitialValues({
        diagnosa_nine: selectedValue.nama,
        kode: selectedValue.kode,
      })
    }
  }, [selectedValue])

  // konfigurasi formik
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,

    validationSchema: createSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true)
      setSubmitting(true)
      mutation.mutate({
        id: visitId,
        data: {
          name: values.diagnosa_nine,
          kode: values.kode,

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
          <Modal.Title>Tambah Diagnosa 9</Modal.Title>
          <GrayCrossIcon
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </Modal.Header>

        <Modal.Body className="p-10">
          <form className="form w-100" onSubmit={formik.handleSubmit}>
            <label
              htmlFor="create_diagnosa_nine"
              className="form-label fs-6 fw-medium text-gray-700"
            >
              Pilih Diagnosa
            </label>
            <AsyncSelect
                      id="create_diagnosa_nine"
                      className={clsx(
                        
                        {
                          "is-invalid":
                            formik.touched.diagnosa_nine &&
                            formik.errors.diagnosa_nine,
                        },
                        {
                          "is-valid":
                            formik.touched.diagnosa_nine &&
                            !formik.errors.diagnosa_nine,
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
                        return(
                          <div>{e.kode} - {e.nama}</div>
                        )
                      }}
                      getOptionValue={(e) => e}
                      loadOptions={loadOptions}
                      onInputChange={handleInputChange}
                      onChange={handleChange}
                    />
            {formik.touched.diagnosa_nine && formik.errors.diagnosa_nine && (
              <Form.Control.Feedback type="invalid">
                {formik.errors.diagnosa_nine}
              </Form.Control.Feedback>
            )}
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
