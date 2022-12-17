import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"
import axios from "axios"
import clsx from "clsx"
import PrimaryLoader from "components/Loader"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
} from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useOutletContext } from "react-router"
import useCheckPermission from "../../hooks/useCheckPermission"
import { validationScheme } from "./Create"

/**
 * Komponen utama halaman edit spesialis
 */
export default function Edit({ id }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({})
  const [initialValues, setInitialValues] = useState({
    name: "",
  })
  const { user: loggedUser } = useOutletContext()
  useCheckPermission(loggedUser, "ubah spesialis")

  const { data, status } = useQuery(["specialist", id], async (key) => {
    return axios
      .get("/specialist/edit/" + key.queryKey[1])
      .then((res) => res.data)
  })

  useEffect(() => {
    data && setInitialValues({ name: data.name })
  }, [data])

  const mutation = useMutation(
    async ({ data, id }) => {
      setLoading(true)
      return axios
        .post("/specialist/update/" + id, data)
        .then((res) => res.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("specialist")
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
    validationSchema: validationScheme,
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
      <Modal show="true" animation={false}>
        <Modal.Header>
          <Modal.Title as="h3">Ubah Spesialis</Modal.Title>
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
                  htmlFor="create_name"
                  className="form-label fs-6 fw-medium text-gray-700"
                >
                  Nama Spesialis
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
