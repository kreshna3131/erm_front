import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"
import axios from "axios"
import clsx from "clsx"
import PrimaryLoader from "components/Loader"
import { useFormik } from "formik"
import { lowerSnake } from "helpers/string-helper"
import useDidMountEffect from "hooks/useDidMountEffect"
import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate } from "react-router"
import * as Yup from "yup"
import FooterPaginate from "../../../../components/table/FooterPaginate"

// validasi edit
const editSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Nama minmal berisi 3 karakter")
    .max(255, "Nama maksimum berisi 255 karakter")
    .required("Nama harus diisi"),
  group_id: Yup.array().min(1).required(),
})

// komponen utama edit
export default function Edit({ id }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({})
  const [initialValues, setInitialValues] = useState({
    name: "",
    group_id: "",
  })
  const [disabledAction, setDisabledAction] = useState([])
  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
  })

  // const { user: loggedUser } = useOutletContext()
  // useCheckPermission(loggedUser, "ubah spesialis")

  // mengambil data edit checkbox
  const { data: actionCheckedData, status: actionCheckedStatus } = useQuery(
    `master-radiology-tindakan-${id}-action-checked`,
    async () =>
      axios
        .get(`/master/radiology/tindakan/${id}/edit-group`)
        .then((res) => res.data),
    {
      onSuccess: function (data) {
        if (initialValues.group_id.length === 0) {
          setInitialValues({
            ...initialValues,
            group_id: [
              ...initialValues.group_id,
              ...data.map((item) => item.id),
            ],
          })
          setDisabledAction([
            ...disabledAction,
            ...data.map((item) => lowerSnake(item.name)),
          ])
        }
      },
    }
  )

  // mengambil data edit sub group
  const { data, status } = useQuery(
    [`master-radiology-sub-group-${id}`, id],
    async (key) => {
      return axios
        .get(`/master/radiology/tindakan/${key.queryKey[1]}/edit`)
        .then((res) => res.data)
    }
  )

  // mengambil listing sub group
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

  useEffect(() => {
    data && setInitialValues({ ...initialValues, name: data.name })
  }, [data])

  const mutation = useMutation(
    async ({ data, id }) => {
      setLoading(true)
      return axios
        .post(`/master/radiology/tindakan/${id}/update`, data)
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
    validationSchema: editSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true)
      setSubmitting(true)
      mutation.mutate({
        id: id,
        data: {
          _method: "PATCH",
          name: values.name,
          group: values.group_id,
        },
      })
    },
  })

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
      <Modal
        size="lg"
        dialogClassName="w-650px"
        show="true"
        scrollable={true}
        animation={false}
      >
        <Modal.Header>
          <Modal.Title as="h3" className="me-2">
            Ubah Tindakan
          </Modal.Title>
          <GrayCrossIcon
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </Modal.Header>
        <Modal.Body className="p-10 mh-300px">
          {status === "loading" && <PrimaryLoader className="min-h-200px" />}
          {status === "success" && (
            <div className="form-group mb-8">
              <div className="row align-items-center mb-8">
                <div className="col-sm-4 d-flex justify-content-sm-end">
                  <label
                    htmlFor="edit_name"
                    className="form-label fs-6 fw-medium text-gray-700 text-sm-end mb-4 mb-sm-0 "
                  >
                    Nama
                  </label>
                </div>
                <div className="col-sm-8">
                  <input
                    id="edit_name"
                    {...formik.getFieldProps("name")}
                    className={clsx(
                      "form-control form-control-solid ",
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
                </div>
              </div>
              <div className="row align-items-start">
                <div className="col-sm-4 d-flex justify-content-sm-end">
                  <label
                    htmlFor="edit_group"
                    className="form-label fs-6 fw-medium text-gray-700 text-sm-end mb-4 mb-sm-0 "
                  >
                    Tentukan Groupnya
                  </label>
                </div>
                {groupStatus === "success" && (
                  <div className="col-sm-8">
                    {formik.touched.group_id && formik.errors.group_id && (
                      <p className="mt-1 fs-8 text-danger">
                        Group wajib untuk dipilih
                      </p>
                    )}
                    {groupData &&
                      groupData?.data.map((v, idx) => (
                        <div
                          key={idx}
                          className="form-check form-check-solid form-check-custom form-check-solid form-check-inline mt-2 mb-5"
                        >
                          <input
                            onChange={(event) => {
                              handleCheck(
                                event.currentTarget.checked,
                                formik,
                                v
                              )
                            }}
                            checked={formik.values.group_id.includes(v.id)}
                            type="checkbox"
                            id={v.name}
                            className="form-check-input text-gray-600 me-5"
                          />
                          <label
                            className="cursor-pointer text-gray-600"
                            htmlFor={v.name}
                          >
                            {v.name}
                          </label>
                        </div>
                      ))}
                    <FooterPaginate
                      data={groupData}
                      filterProp={[filter, setFilter]}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
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
