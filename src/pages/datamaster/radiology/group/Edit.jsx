import React, { useState } from "react"
import * as Yup from "yup"
import { useFormik } from "formik"
import clsx from "clsx"
import axios from "axios"
import { FormControl, FormGroup, FormLabel, Button } from "react-bootstrap"
import { Form } from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQueryClient, useQuery } from "react-query"
import { Modal } from "react-bootstrap"
import { useNavigate, useOutletContext } from "react-router"
import { useEffect } from "react"
import useCheckPermission from "hooks/useCheckPermission"
import PrimaryLoader from "components/Loader"
import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"


// validation edit schema
const editSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Nama spesialis minmal berisi 3 karakter")
    .max(255, "Nama spesialis maksimum berisi 255 karakter")
    .required("Nama spesialis harus diisi"),
})

// komponen utama edit group
export default function Edit({ id }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({})
 const [initialValues, setInitialValues] = useState({
    name: "",
  }) 
  // const { user: loggedUser } = useOutletContext()
  // useCheckPermission(loggedUser, "ubah spesialis")

  // mengambil data edit group
  const { data, status } = useQuery(["master-radiology-group", id], async (key) => {
    return axios
      .get(`/master/radiology/group/${key.queryKey[1]}/edit`  )
      .then((res) => res.data)
  })
// setting data edit ke formik
  useEffect(() => {
    data && setInitialValues({ name: data.name })
  }, [data])

  // method untuk mengupdate group
  const mutation = useMutation(
    async ({ data, id }) => {
      setLoading(true)
      return axios
        .post(`/master/radiology/group/${id}/update` , data)
        .then((res) => res.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("master-radiology-group")
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

  // konfigurasi formik
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: editSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true)
      setSubmitting(true)
      mutation.mutate({
        id: id,
        data: {
          _method: "PATCH",
          name: values.name,
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
      <Modal show="true" animation={false} >
        <Modal.Header >
          <Modal.Title>Ubah Group</Modal.Title>
          <GrayCrossIcon
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </Modal.Header>

        <Modal.Body className="p-10">
          {status === "loading" && (
            <PrimaryLoader/>
          )}
          {status === "success" && (
            <form
              className="form w-100"
              onSubmit={formik.handleSubmit}
              noValidate
            >
              <FormGroup className="mb-8">
                <FormLabel
                  htmlFor="edit_name"
                  className="form-label fs-6 fw-medium text-gray-700 "
                >
                  Nama 
                </FormLabel>
                <FormControl
                  id="edit_name"
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
              </FormGroup>
              <div className="d-flex justify-content-center">
                <Button
                  type="button"
                  variant="light"
                  className="me-5"
                  onClick={() => navigate(-1)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
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
            </form>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}
