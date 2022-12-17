import { ReactComponent as Zoom } from "assets/icons/primary-zoom.svg"
import axios from "axios"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import { useFormik } from "formik"
import { lowerSnake } from "helpers/string-helper"
import useBreadcrumb from "hooks/useBreadcrumb"
import useDidMountEffect from "hooks/useDidMountEffect"
import useSidebarActiveMenu from "hooks/useSidebarActiveMenu"
import _ from "lodash"
import { useEffect, useRef, useState } from "react"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import * as Yup from "yup"
import { Toolbar } from "./AddRequest"

/**
 * Komponen utama untuk tambah aksi
 */
export default function AddAction() {
  const navigate = useNavigate()
  const { id: visitId, laboratoryId } = useParams()
  const [breadCrumbJson, setBreadCrumbJson] = useState({
    title: "Kunjungan",
    items: [
      { text: "Kunjungan", path: "/" },
      {
        text: "Pelayanan",
        path: `/visit`,
      },
      {
        text: "Laboratorium",
        path: null,
      },
      {
        text: "Permintaan",
        path: null,
      },
      {
        text: "Tambah tindakan",
        path: null,
      },
    ],
  })
  const [search, setSearch] = useState("")
  const [filterGroup, setFilterGroup] = useState("")
  const [mergeObj, setMergeObj] = useState([])
  const [disabledAction, setDisabledAction] = useState([])
  const [submitStatus, setSubmitStatus] = useState({})
  const queryClient = useQueryClient()
  const [initialValues, setInitialValues] = useState({
    action_id: [],
    action_group_id: [],
    action_group: [],
    name: [],
  })

  /**
   * Mengupdate skema breadcrumb
   */
  useEffect(() => {
    setBreadCrumbJson({
      title: "Kunjungan",
      items: [
        { text: "Kunjungan", path: "/" },
        {
          text: "Pelayanan",
          path: `/visit`,
        },
        {
          text: "Laboratorium",
          path: `/visit/${visitId}/laboratory`,
        },
        {
          text: "Permintaan",
          path: `/visit/${visitId}/laboratory/${laboratoryId}`,
        },
        {
          text: "Tambah tindakan",
          path: null,
        },
      ],
    })
  }, [])
  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("visit")

  /**
   * Logic pencarian aksi laboratorium
   */
  const setSearchValue = useRef(
    _.debounce((value) => {
      setSearch(value)
    }, 1000)
  )

  /**
   * Mengambil data aski laboratorium yang sudah terpilih
   */
  useQuery(
    `visit-laboratorium-${laboratoryId}-action-checked`,
    async () =>
      axios
        .get(`visit/laboratorium/${laboratoryId}/measure/listing-update`)
        .then((res) => res.data),
    {
      onSuccess: function (data) {
        if (initialValues.action_id.length === 0) {
          setInitialValues({
            action_id: [
              ...initialValues.action_id,
              ...data.map((item) => item.action_id),
            ],
            action_group_id: [
              ...initialValues.action_group_id,
              ...data.map((item) => item.action_group_id),
            ],
            action_group: [
              ...initialValues.action_group,
              ...data.map((item) => item.action_group),
            ],
            name: [...initialValues.name, ...data.map((item) => item.name)],
          })
          setDisabledAction([
            ...disabledAction,
            ...data.map((item) => lowerSnake(item.name)),
          ])
        }
      },
    }
  )

  /**
   * Mengambil data permintaan laboratorium
   */
  const { data: addRequestData, status: addRequestDataStatus } = useQuery(
    ["request-lab", search, filterGroup],
    async (key) => {
      return fetch(
        `${process.env.REACT_APP_API_SIMO_BASE_URL}/ref/tindakanlab?nama=${key.queryKey[1]}&kodekelompok=${key.queryKey[2]}`
      )
        .then((res) => res.json())
        .then((data) => data)
    }
  )

  /**
   * Mengolah data permintaan laboratorium ke struktur baru
   */
  useEffect(() => {
    if (Array.isArray(addRequestData)) {
      let mergeObj = addRequestData.reduce((p, c) => {
        const { kelompok, ...otherData } = c

        if (!(kelompok in p)) {
          p[kelompok] = {
            data: [],
          }
        }

        p[kelompok].data.push({ kelompok, ...otherData })
        return p
      }, {})

      if (mergeObj !== undefined) {
        setMergeObj(
          Object.keys(mergeObj).map((key) => {
            return {
              kelompok: key,
              data: mergeObj[key].data,
            }
          })
        )
      }
    } else {
      setMergeObj([])
    }
  }, [addRequestData])

  /**
   * Mentimpan data permintaan laboratorium
   */
  const mutation = useMutation(async (data) => {
    return axios
      .post(`/visit/laboratorium/${laboratoryId}/measure/store`, data)
      .then((res) => res.data)
  })

  /**
   * Konfigurasi formik
   */
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      action_id: Yup.array().min(1).required("Kolom ini wajib untuk dipilih"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true)
      mutation.mutate(values, {
        onSuccess: function () {
          queryClient.invalidateQueries(
            `visit-${visitId}-laboratorium-${laboratoryId}-action`
          )
          setTimeout(() => {
            setSubmitStatus({
              status: "success",
              message: "Data telah berhasil disimpan ke dalam basis data",
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
  useDidMountEffect(() => {
    formik.setFieldTouched("action_id")
  }, [formik.values.action_id])

  /**
   * Menghandle ketika checkbox terchecklist
   */
  const handleCheck = (isChecked, formik, action) => {
    if (isChecked) {
      formik.setFieldValue("action_id", [
        ...formik.values.action_id,
        action.kode,
      ])
      formik.setFieldValue("action_group_id", [
        ...formik.values.action_group_id,
        action.kodekelompok,
      ])
      formik.setFieldValue("action_group", [
        ...formik.values.action_group,
        action.kelompok,
      ])
      formik.setFieldValue("name", [...formik.values.name, action.nama])
    } else {
      const key = formik.values.name.indexOf(action.nama)

      const actionIds = [...formik.values.action_id]
      formik.values.action_id.length && actionIds.splice(key, 1)
      formik.setFieldValue("action_id", actionIds)

      const actionGroupIds = [...formik.values.action_group_id]
      formik.values.action_group_id.length && actionGroupIds.splice(key, 1)
      formik.setFieldValue("action_group_id", actionGroupIds)

      const actionGroups = [...formik.values.action_group]
      formik.values.action_group.length && actionGroups.splice(key, 1)
      formik.setFieldValue("action_group", actionGroups)

      const names = [...formik.values.name]
      formik.values.name.length && names.splice(key, 1)
      formik.setFieldValue("name", names)
    }
  }

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
      <Toolbar
        formik={formik}
        setSearchValue={setSearchValue}
        filterGroup={filterGroup}
        setFilterGroup={setFilterGroup}
      />
      <div className="post d-flex flex-column-fluid pt-5 pt-lg-15" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          <div className="card">
            <div className="card-body p-10">
              {addRequestDataStatus === "loading" && (
                <PrimaryLoader className="min-h-400px" />
              )}
              {addRequestDataStatus === "error" && (
                <ErrorMessage className="min-h-400px" />
              )}
              {addRequestData?.length === 0 && (
                <div className="py-10 d-flex flex-center">
                  <div className="d-flex flex-center flex-column">
                    <Zoom />
                    <p className="text-gray-600 mt-3">
                      Belum ada tindakan laboratorium yang sesuai dengan kata
                      kunci anda ...
                    </p>
                  </div>
                </div>
              )}
              {addRequestDataStatus === "success" && (
                <>
                  {formik.touched.action_id && formik.errors.action_id && (
                    <div className="alert alert-danger text-danger border-0 mb-8">
                      Anda wajib memilih salah satu tindakan
                    </div>
                  )}
                  {mergeObj.length === 0 && (
                    <div className="py-10 d-flex flex-center">
                      <div className="d-flex flex-center flex-column">
                        <Zoom />
                        <p className="text-gray-600 mt-3">
                          Belum ada tindakan laboratorium yang sesuai dengan
                          kata kunci anda ...
                        </p>
                      </div>
                    </div>
                  )}
                  {mergeObj.length > 0 &&
                    mergeObj.map((value, key) => (
                      <form onSubmit={formik.handleSubmit} key={key}>
                        <div className="row mb-6">
                          <div className="col-md-3 ">
                            <h1 className="fs-5 mb-5 ">{value.kelompok}</h1>
                          </div>
                          <div className="row col-md-9">
                            {value?.data &&
                              value?.data.map((v, idx) => (
                                <div className="col-md-3" key={idx}>
                                  <div className=" d-flex align-items-start form-check form-check-solid form-check-custom form-check-inline ms-10 mb-5">
                                    <input
                                      onChange={(event) =>
                                        handleCheck(
                                          event.currentTarget.checked,
                                          formik,
                                          v
                                        )
                                      }
                                      onBlur={
                                        formik.getFieldProps("action_id").onBlur
                                      }
                                      checked={formik.values.name.includes(
                                        v.nama
                                      )}
                                      type="checkbox"
                                      id={v.kode}
                                      className="form-check-input text-gray-600 me-5"
                                      disabled={disabledAction.includes(
                                        lowerSnake(v.nama)
                                      )}
                                    />

                                    <label
                                      className="cursor-pointer text-gray-600 text-break"
                                      htmlFor={v.kode}
                                    >
                                      {v.nama}
                                    </label>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </form>
                    ))}
                </>
              )}
            </div>
          </div>
          <div className="d-flex justify-content-between mt-5">
            <button
              className="btn btn-light-primary me-5"
              onClick={() => navigate(-1)}
            >
              Batal
            </button>
            <button
              className="btn btn-primary"
              onClick={() => formik.submitForm()}
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {!formik.isSubmitting && (
                <span className="indicator-label fw-medium">Buat</span>
              )}
              {formik.isSubmitting && (
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
      </div>
    </>
  )
}
