import { useNavigate } from "react-router"
import React, { useState, useMemo, useRef } from "react"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQuery, useQueryClient } from "react-query"
import axios from "axios"
import { globalStyle } from "helpers/react-select"
import Select from "react-select"
import _ from "lodash"
import { Button, Modal } from "react-bootstrap"
import { useFormik } from "formik"
import * as Yup from "yup"
import { ReactComponent as WarningExclamation } from "assets/icons/warning-exclamation.svg"
import { ReactComponent as Warning } from "assets/icons/warning.svg"

import clsx from "clsx"
import PrimaryLoader from "components/Loader"

// komponen utama delete group
export default function Delete({
  url,
  query,
  message,
  htmlMessage,
  successMessage,
  idProps,
}) {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({})
  const navigate = useNavigate()
  const [localFilter, setLocalFilter] = useState({
    periode: [],
    status: "",
    is_read: "",
    search: "",
  })
  const [initialValues, setInitialValues] = useState({
    newId: "",
  })

 
// mengambil data listing group
  const { data, status } = useQuery(
    ["master-radiology-group", localFilter],
    async (key) => {
      return axios
        .get("/master/radiology/group/listing", {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
    }
  )

  // logic membuat option 
  const dataSelect =
    data &&
    data?.data
      .filter((v) => v.id !== parseInt(idProps))
      .map((v) => ({
        label: v.name,
        value: v.id,
      }))

  // mendelagasikan untuk group lain sebelum dihapus 
  const mutation = useMutation(async (data) => {
    const group = { group: data.group }
    return axios.post(url, group).then((res) => res.data)
  })

  // konfigurasi formik
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      group: Yup.string().required("Group harus dipilih terlebih dahulu"),
    }),
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      mutation.mutate(values, {
        onSuccess: function () {
          queryClient.invalidateQueries(query)
          setTimeout(() => {
            setSubmitStatus({
              status: "success",
              message: successMessage,
            })
            setSubmitting(false)
          }, 500)
        },
        onError: function () {
          setSubmitStatus({
            status: "danger",
            message:
              "Maaf, sepertinya ada beberapa kesalahan yang terdeteksi, silakan coba lagi.",
          })
          setSubmitting(false)
        },
      })
    },
  })

  return (
    <>
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
        <Modal size="md"  show="true" animation={false}>
          <Modal.Body className="p-10">
            <div className="d-flex text-center flex-column justify-content-center">
              <div className="mb-10">
                <Warning  />
              </div>
              <div className="d-flex justify-content-center">

              <span className="text-gray-600 mb-10  " style={{ width:'300px' }}>
                Group ini mungkin memiliki data penting. Delegasikan ke group
                lain sebelum menghapus.
              </span>
              </div>

              <div className="d-flex justify-content-center">

              <form className="form w-60 " onSubmit={formik.handleSubmit}>
                {status === "loading" && (
                  <div
                    className="d-flex flex-center"
                    style={{ minHeight: "140px" }}
                  >
                    <PrimaryLoader/>
                  </div>
                )}
                <div className="form-group text-start" >
                  {status === "success" && (
                    <Select
                      options={dataSelect}
                      className={clsx(
                        {
                          "is-invalid":
                            formik.touched.group && formik.errors.group,
                        },
                        {
                          "is-valid":
                            formik.touched.group && !formik.errors.group,
                        }
                      )}
                      onBlur={() =>
                        formik.setTouched({
                          ...formik.touched,
                          ...{
                            group: true,
                          },
                        })
                      }
                      value={{
                        label:
                          dataSelect?.filter((data) => {
                            return data.value === formik.values.group
                          })?.[0]?.label ?? "Select",
                        value: formik.values.group,
                      }}
                      onChange={(option) => {
                        formik.setValues({
                          ...formik.values,
                          ...{
                            group: option.value,
                          },
                        })
                      }}
                      name="group"
                      id="group"
                      styles={globalStyle}
                      noOptionsMessage={() => "Group tidak ditemukan"}
                      components={{
                        IndicatorSeparator: "",
                      }}
                    />
                  )}
                  {formik.touched.group && formik.errors.group && (
                  <span className="invalid-feedback" type="invalid">
                    {formik.errors.group}
                  </span>
                )}
                </div>

                

                <div className="text-gray-600 fs-7 mt-10 ">{message}</div>
                <div className="d-flex justify-content-center mt-10">
                  <Button
                    type="submit"
                    variant="danger"
                    disabled={formik.isSubmitting || !formik.isValid}
                  >
                    {!loading && (
                      <span className="indicator-label fw-medium">
                        Ya, hapus
                      </span>
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
                  <Button
                    type="button"
                    variant="light"
                    className="ms-5"
                    onClick={() => navigate(-1)}
                  >
                    Tidak, Batalkan
                  </Button>
                </div>
              </form>
              </div>

            </div>
          </Modal.Body>
        </Modal>
      </>
    </>
  )
}

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
