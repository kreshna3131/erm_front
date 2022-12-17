import { ReactComponent as Zoom } from "assets/icons/primary-zoom.svg"
import axios from "axios"
import PrimaryLoader from "components/Loader"
import { useFormik } from "formik"
import useBreadcrumb from "hooks/useBreadcrumb"
import useDidMountEffect from "hooks/useDidMountEffect"
import useSidebarActiveMenu from "hooks/useSidebarActiveMenu"
import _ from "lodash"
import React, { useEffect, useRef, useState } from "react"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import * as Yup from "yup"
import { Toolbar } from "./AddRequest"

/**
 * Logic ketika checkbox di check / uncheck
 * @param {*} formik
 * @param {React.ChangeEvent<HTMLInputElement>} event
 * @param {*} value
 */
export function handleCheck(formik, event, value) {
  if (event.currentTarget.checked) {
    formik.setFieldValue("action", [...formik.values.action, value])
  } else {
    formik.setFieldValue(
      "action",
      [...formik.values.action].filter((item) => !_.isEqual(item, value))
    )
  }
}

/**
 * logic checkbox terchecklist
 * @param {*} formik
 * @param {*} value
 */
export function checkedCondition(formik, value) {
  return formik.values.action.some((item) => _.isEqual(item, value))
}

/**
 * logic checkbox terdisable
 * @param {Array} disabledItems
 * @param {*} value
 * @returns
 */
export function disabledCondition(disabledItems, value) {
  return disabledItems.some((item) => _.isEqual(item, value))
}

/**
 * Komponen utama untuk Add Action
 */
export default function AddAction() {
  const navigate = useNavigate()
  const { id: visitId, radiologyId } = useParams()
  const [search, setSearch] = useState("")
  const [filterGroup, setFilterGroup] = useState("")
  const [mergeObj, setMergeObj] = useState([])
  const [initialValues, setInitialValues] = useState({
    action: [],
  })
  const [disabledAction, setDisabledAction] = useState([])
  const [submitStatus, setSubmitStatus] = useState({})
  const queryClient = useQueryClient()
  const [breadCrumbJson, setBreadCrumbJson] = useState({
    title: "Kunjungan",
    items: [
      { text: "Kunjungan", path: "/" },
      {
        text: "Pelayanan",
        path: `/visit`,
      },
      {
        text: "Radiologi",
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

  /**
   * Menupdate data breadcrumb
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
          text: "Radiologi",
          path: `/visit/${visitId}/radiology`,
        },
        {
          text: "Tambah permintaan",
          path: null,
        },
      ],
    })
  }, [])
  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("visit")

  /**
   * Logic pencarian radiologi
   */
  const setSearchValue = useRef(
    _.debounce((value) => {
      setSearch(value)
    }, 1000)
  )

  /**
   * Mengambil data aksi radiologi
   */
  const { data: actionData, status: actionDataStatus } = useQuery(
    ["visit-radiology-measure-listing", search, filterGroup],
    async (key) => {
      return axios
        .get(`/visit/radiology/measure/listing`, {
          params: {
            nama: key.queryKey[1],
            group: key.queryKey[2],
          },
        })
        .then((res) => res.data)
    }
  )

  /**
   * Mengambil data aski yang sudah terpilih
   */
  useQuery(
    `visit-radiology-${radiologyId}-action-checked`,
    async () =>
      axios
        .get(`visit/radiology/${radiologyId}/measure/listing-update`)
        .then((res) => res.data),
    {
      onSuccess: function (data) {
        if (initialValues.action.length === 0) {
          setInitialValues({
            action: data,
          })
          setDisabledAction(data)
        }
      },
    }
  )

  /**
   * Mengubah struktur data aksi radiologi
   */
  useEffect(() => {
    if (Array.isArray(actionData)) {
      let mergeObj = actionData.reduce((p, c) => {
        const { action_group, ...otherData } = c

        if (!(action_group in p)) {
          p[action_group] = {
            data: [],
          }
        }

        p[action_group].data.push({ action_group, ...otherData })
        return p
      }, {})

      if (mergeObj !== undefined) {
        setMergeObj(
          Object.keys(mergeObj).map((key) => {
            return {
              action_group: key,
              data: mergeObj[key].data,
            }
          })
        )
      }
    } else {
      setMergeObj([])
    }
  }, [actionData])

  /**
   * Menyimpan data aksi radiologi
   */
  const mutation = useMutation(async (data) => {
    return axios
      .post(`/visit/radiology/${radiologyId}/measure/store`, data)
      .then((res) => res.data)
  })

  /**
   * Konfigurasi formik
   */
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      action: Yup.array().min(1).required("Kolom ini wajib untuk dipilih"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true)
      mutation.mutate(values, {
        onSuccess: function () {
          queryClient.invalidateQueries(
            `visit-${visitId}-radiology-${radiologyId}-action`
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
              {actionDataStatus === "loading" && (
                <div className="py-20 d-flex flex-center">
                  <PrimaryLoader />
                </div>
              )}
              {actionDataStatus === "error" && (
                <div className="py-10 d-flex flex-center">
                  <p className="text-gray-600">Error ...</p>
                </div>
              )}
              {actionDataStatus === "success" && (
                <>
                  {formik.touched.action_id && formik.errors.action_id && (
                    <div className="alert alert-danger text-danger border-0 mb-8">
                      Anda wajib memilih salah satu tindakan
                    </div>
                  )}
                  {mergeObj?.length === 0 && (
                    <div className="py-10 d-flex flex-center">
                      <div className="d-flex flex-center flex-column">
                        <Zoom />
                        <p className="text-gray-600 mt-3">
                          Belum ada tindakan radiologi yang sesuai dengan kata
                          kunci anda ...
                        </p>
                      </div>
                    </div>
                  )}
                  {mergeObj?.map((value, key) => (
                    <form onSubmit={formik.handleSubmit} key={key}>
                      <div className="row mb-6">
                        <div className="col-md-3 ">
                          <h1 className="fs-5 mb-5 ">{value.action_group}</h1>
                        </div>
                        <div className="row col-md-9">
                          {value?.data &&
                            value?.data.map((v, idx) => (
                              <div className="col-md-3" key={idx}>
                                <div className=" d-flex align-items-start form-check form-check-solid form-check-custom form-check-inline ms-10 mb-5">
                                  <input
                                    onChange={(event) =>
                                      handleCheck(formik, event, v)
                                    }
                                    checked={checkedCondition(formik, v)}
                                    onBlur={
                                      formik.getFieldProps("action_id").onBlur
                                    }
                                    type="checkbox"
                                    id={v.action_group_id + "" + v.action_id}
                                    className="form-check-input text-gray-600 me-5"
                                    disabled={disabledCondition(
                                      disabledAction,
                                      v
                                    )}
                                  />
                                  <label
                                    className="cursor-pointer text-gray-600"
                                    htmlFor={
                                      v.action_group_id + "" + v.action_id
                                    }
                                  >
                                    {v.name}
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
