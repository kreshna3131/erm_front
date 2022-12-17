import axios from "axios"
import React, { useState } from "react"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQueryClient } from "react-query"
import { useNavigate } from "react-router"
import { useFormik } from "formik"
import clsx from "clsx"
import * as Yup from "yup"
import { Form } from "react-bootstrap"

/**
 * Komponen modal update yang reusable
 * @param {{
 * url: String
 * data: *
 * query: String
 * message: String
 * htmlMessage: String
 * successMessage: String
 * }}
 */

// validasi nota_number
const createSchema = Yup.object().shape({
  nota_number: Yup.string().required("Nomor nota harus diisi"),
})

export default function UpdateModalRecipe({
  url,
  data,
  query,
  message,
  htmlMessage,
  successMessage,
}) {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({})
  const navigate = useNavigate()
  const initialValues = { nota_number: "" }

  const mutation = useMutation(
    async ({ url, data, dataFormik }) => {
      setLoading(true)
      return axios
        .post(url, {
          ...{
            _method: "PATCH",
          },
          ...data,
          ...dataFormik,
        })
        .then((res) => res.data)
    },
    {
      onSuccess: () => {
        setTimeout(() => {
          queryClient.invalidateQueries(query)
          setSubmitStatus({
            status: "success",
            message: successMessage,
          })
        }, 500)
      },
      onError: () => {
        setLoading(false)
        setSubmitStatus({
          status: "danger",
          message:
            "Maaf, sepertinya ada beberapa kesalahan yang terdeteksi, silakan coba lagi.",
        })
      },
    }
  )

  // konfigurasi formik ketika status === 'done'
  const formik = useFormik({
    initialValues,
    validationSchema: createSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true)
      setSubmitting(true)
      mutation.mutate({
        url,
        data,
        dataFormik: {
          nota_number: values.nota_number,
        },
      })
    },
  })
  return (
    <>
      <SweetAlert
        warning
        title=""
        onConfirm={() =>
          data.status === "done"
            ? formik.submitForm()
            : mutation.mutate({ url, data })
        }
        confirmBtnText={loading ? "Please wait..." : "Ya, benar"}
        showCancel={true}
        onCancel={() => navigate(-1)}
        cancelBtnCssClass="text-gray-600"
        cancelBtnText="Tidak jadi"
        confirmBtnCssClass={`btn btn-danger me-5 ${
          loading || !formik.isValid ? "disabled" : ""
        } `}
        reverseButtons={true}
        customClass="p-10 rounded"
        openAnim={false}
        closeAnim={false}
        style={{
          width: "364px",
          minHeight: "322px",
        }}
      >
        {data.status === "done" ? (
          <>
          <p className="text-gray-700 mb-5"> Masukkan kode nota terlebih dahulu!</p>
          <form className="form w-60 text-start  ">
            <div className="row align-items-center  ">
              <div className="col-sm-4 d-flex bg-light-dark  rounded-start  " style={{ marginRight:'-12px',height:'42px' }}>
                <label
                  htmlFor="create_nota_number"
                  className="form-label fs-6 fw-medium text-gray-700 mt-3 "
                >
                  Kode Nota
                </label>
              </div>
              <div className="col-sm-8">
                <input
                  {...formik.getFieldProps("nota_number")}
                  className={clsx(
                    "form-control form-control-solid ",
                    {
                      "is-invalid":
                        formik.touched.nota_number && formik.errors.nota_number,
                    },
                    {
                      "is-valid":
                        formik.touched.nota_number &&
                        !formik.errors.nota_number,
                    }
                  )}
                  id="create_nota_number"
                  type="text"
                  name="nota_number"
                  autoComplete="off"
                />
                
              </div>
            </div>
            {formik.touched.nota_number && formik.errors.nota_number && (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.nota_number}
                  </Form.Control.Feedback>
                )}
          </form>
          </>

        ) : (
          <></>
        )}
        {message && <p className="text-gray-700 text-center fs-6 mt-7">{message}</p>}

        {htmlMessage && (
          <div dangerouslySetInnerHTML={{ __html: htmlMessage }} />
        )}
      </SweetAlert>
      <InfoAlert submitStatusState={[submitStatus, setSubmitStatus]} />
    </>
  )
}

/**
 * Komponen alert yang muncul setelah update berhasil dilakukan
 * @param {{
 * submitStatusState: Array
 * }}
 */
export function InfoAlert({ submitStatusState }) {
  const [submitStatus, setSubmitStatus] = submitStatusState
  const navigate = useNavigate()

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
            if (submitStatus.status === "success") {
              navigate(-1)
            } else {
              setSubmitStatus({})
            }
          }}
          confirmBtnText="OK mengerti"
        >
          <div className="text-gray-600 mb-5">{submitStatus?.message}</div>
        </SweetAlert>
      )}
    </>
  )
}
