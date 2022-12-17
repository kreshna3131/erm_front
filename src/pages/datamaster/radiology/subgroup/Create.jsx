import axios from "axios"
import clsx from "clsx"
import { useFormik } from "formik"
import { lowerSnake } from "helpers/string-helper"
import useDidMountEffect from "hooks/useDidMountEffect"
import React, { useState } from "react"
import { Form, FormControl, FormGroup, FormLabel } from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQuery, useQueryClient } from "react-query"
import * as Yup from "yup"
import FooterPaginate from "../../../../components/table/FooterPaginate"
import PrimaryLoader from "components/Loader"
import { useOutletContext } from "react-router"

// validasi create
const createSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Nama  minmal berisi 3 karakter")
    .max(255, "Nama  maksimum berisi 255 karakter")
    .required("Nama  harus diisi"),
  group_id: Yup.array().min(1).required("Kolom ini wajib untuk dipilih"),
})

// komponen utama create
export default function Create() {
  const [submitStatus, setSubmitStatus] = useState({})
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const [initialValues, setInitialValues] = useState({
    name: "",
    group_id: [],
  })
  const [disabledAction, setDisabledAction] = useState([])
  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
  })
  const { allPermissions } = useOutletContext()

  // mengambil data sub group listing
  const { data: groupData, status: groupStatus } = useQuery(
    ["master-radiology-group", filter],
    async (key) => {
      return axios
        .get("/master/radiology/group/listing", {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
    }
  )

  // method post untuk menambahkan data sub group
  const mutation = useMutation(
    async (data) => {
      setLoading(true)
      return axios
        .post("/master/radiology/tindakan/store", data)
        .then((res) => res.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("master-radiology-sub-group")
        setSubmitStatus({
          status: "success",
          message: "Data telah berhasil disimpan ke dalam basis data.",
        })
        setLoading(false)
        formik.setSubmitting(false)
        formik.resetForm()
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

  // konfigurasi formik
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true)
      setSubmitting(true)
      mutation.mutate({
        name: values.name,
        group: values.group_id,
      })
    },
  })

  // logic pengecekan chekbox
  const handleCheck = (isChecked, formik, action) => {
    if (isChecked) {
      formik.setFieldValue("group_id", [...formik.values.group_id, action.id])
    } else {
      const key = formik.values.group_id.indexOf(action.id)

      const actionIds = [...formik.values.group_id]
      formik.values.group_id.length && actionIds.splice(key, 1)
      formik.setFieldValue("group_id", actionIds)
    }
  }
  useDidMountEffect(() => {
    formik.setFieldTouched("group_id")
  }, [formik.values.group_id])
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
          }}
          confirmBtnText="OK mengerti"
        >
          <div className="text-gray-600 mb-5">{submitStatus?.message}</div>
        </SweetAlert>
      )}
      <form
        className="form w-100 mb-4"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="card">
          <div className="card-body p-7">
            <h1 className="text-dark">Tambah Tindakan</h1>
            <p className="text-gray-600 mb-8">
              Gunakan form di bawah untuk menambahkan data tindakan baru.
            </p>
            <FormGroup className="mb-8">
              <FormLabel
                htmlFor="create_name"
                className="form-label fs-6 fw-medium text-gray-700"
              >
                Nama
              </FormLabel>
              <FormControl
                id="create_name"
                {...formik.getFieldProps("name")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid": formik.touched.name && formik.errors.name,
                  },
                  {
                    "is-valid": formik.touched.name && !formik.errors.name,
                  }
                )}
                type="text"
                name="name"
                autoComplete="off"
              />
              {formik.touched.name && formik.errors.name && (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.name}
                </Form.Control.Feedback>
              )}
              {groupStatus === "loading" && (
                <PrimaryLoader className="min-h-400px" />
              )}
              {groupStatus === "success" && (
                <div className="mt-5 ">
                  <FormLabel
                    htmlFor="create_name"
                    className="form-label fs-6 fw-medium text-gray-700"
                  >
                    Tentukan Groupnya
                  </FormLabel>
                  {formik.touched.group_id && formik.errors.group_id && (
                    <p className="text-danger fs-8">
                      Group wajib untuk dipilih
                    </p>
                  )}
                  {groupData &&
                    groupData?.data.map((v, idx) => (
                      <>
                        <div className="form-check form-check-solid form-check-custom form-check-solid form-check-inline mt-5 mb-5">
                          <input
                            onChange={(event) =>
                              handleCheck(
                                event.currentTarget.checked,
                                formik,
                                v
                              )
                            }
                            onBlur={formik.getFieldProps("group_id").onBlur}
                            checked={formik.values.group_id.includes(v.id)}
                            type="checkbox"
                            id={v.id}
                            className="form-check-input text-gray-600 me-5"
                            disabled={disabledAction.includes(
                              lowerSnake(v.name)
                            )}
                          />
                          <label
                            className="cursor-pointer text-gray-600"
                            htmlFor={v.id}
                          >
                            {v.name}
                          </label>
                        </div>
                      </>
                    ))}
                  <FooterPaginate
                    data={groupData}
                    filterProp={[filter, setFilter]}
                  />
                </div>
              )}
            </FormGroup>
            <button
              type="submit"
              className="btn w-100 btn-primary mb-5"
              disabled={
                formik.isSubmitting ||
                !formik.isValid ||
                !allPermissions.includes("tambah sub group tindakan")
              }
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
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
