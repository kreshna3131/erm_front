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
import { Toolbar } from "./Create"
import styled from "styled-components"

// garis pemisah antar perkelompok
export const Separator = styled.div`
  background-image: linear-gradient(
    to right,
    #e4e6ef 33%,
    rgba(255, 255, 255, 0) 0%
  );
  background-position: bottom;
  background-size: 10px 2px;
  background-repeat: repeat-x;
  height: 2px;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
`

/**
 * Komponen utama untuk tambah aksi
 */
export default function AddAction() {
  const navigate = useNavigate()
  const { id: visitId, rehabId } = useParams()
  const [breadCrumbJson, setBreadCrumbJson] = useState({
    title: "Kunjungan",
    items: [
      { text: "Kunjungan", path: "/" },
      {
        text: "Pelayanan",
        path: `/visit`,
      },
      {
        text: "Rehab",
        path: null,
      },
      {
        text: "Permintaan",
        path: null,
      },
      {
        text: "Tambah",
        path: null,
      },
    ],
  })
  const [search, setSearch] = useState("")
  const [filterGroup, setFilterGroup] = useState("Semua group")
  const [disabledAction, setDisabledAction] = useState([])
  const [submitStatus, setSubmitStatus] = useState({})
  const queryClient = useQueryClient()
  const [initialValues, setInitialValues] = useState({
    rehab_id: [],
    rehab_group_id: [],
    rehab_group: [],
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
          text: "Rehab",
          path: `/visit/${visitId}/rehab`,
        },
        {
          text: "Permintaan",
          path: `/visit/${visitId}/rehab/${rehabId}`,
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

  const fisioActionQuery = useQuery(
    [`fisioteraphy-action`, search],
    async (key) =>
      fetch(
        `${process.env.REACT_APP_API_SIMO_BASE_URL}/ref/tindakanfisio?nama=${key.queryKey[1]}`
      )
        .then((res) => res.json())
        .then((data) => data)
  )
  /** @type {Array<import("interfaces/fisioAction").FisioAction>} */
  const fisioActionData = fisioActionQuery.data
  const fisioActionStatus = fisioActionQuery.status

  /** Mengambil data okupasi */
  const ocupacyActionQuery = useQuery([`ocupacy-action`, search], async (key) =>
    fetch(
      `${process.env.REACT_APP_API_SIMO_BASE_URL}/ref/tindakanokupasi?nama=${key.queryKey[1]}`
    )
      .then((res) => res.json())
      .then((data) => data)
  )
  /** @type {Array<import("interfaces/fisioAction").FisioAction>} */
  const ocupacyActionData = ocupacyActionQuery.data
  const ocupacyActionStatus = ocupacyActionQuery.status

  /** Mengambil data psikologi */
  const pyschoActionQuery = useQuery([`psycho-action`, search], async (key) =>
    fetch(
      `${process.env.REACT_APP_API_SIMO_BASE_URL}/ref/tindakanpsiko?nama=${key.queryKey[1]}`
    )
      .then((res) => res.json())
      .then((data) => data)
  )
  /** @type {Array<import("interfaces/fisioAction").FisioAction>} */
  const psychoActionData = pyschoActionQuery.data
  const psychoActionStatus = pyschoActionQuery.status

  /**
   * Logic pencarian aksi rehab
   */
  const setSearchValue = useRef(
    _.debounce((value) => {
      setSearch(value)
    }, 1000)
  )

  /**
   * Mengambil data aski rehab yang sudah terpilih
   */
  useQuery(
    `visit-rehab-${rehabId}-action-checked`,
    async () =>
      axios
        .get(`visit/rehab/${rehabId}/measure/listing-update`)
        .then((res) => res.data),
    {
      onSuccess: function (data) {
        if (initialValues.rehab_id.length === 0) {
          setInitialValues({
            rehab_id: [
              ...initialValues.rehab_id,
              ...data.map((item) => item.action_id),
            ],
            rehab_group_id: [
              ...initialValues.rehab_group_id,
              ...data.map((item) => item.action_group_id),
            ],
            rehab_group: [
              ...initialValues.rehab_group,
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
   * Menyimpan data permintaan rehab
   */
  const mutation = useMutation(async (data) => {
    return axios
      .post(`/visit/rehab/${rehabId}/measure/store`, data)
      .then((res) => res.data)
  })

  /**
   * Konfigurasi formik
   */
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      rehab_id: Yup.array().min(1).required("Kolom ini wajib untuk dipilih"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true)
      mutation.mutate(values, {
        onSuccess: function () {
          queryClient.invalidateQueries(
            `visit-${visitId}-rehab-${rehabId}-action`
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
    formik.setFieldTouched("rehab_id")
  }, [formik.values.rehab_id])

  /**
   * Menghandle ketika checkbox terchecklist
   */
  const handleCheck = (isChecked, formik, action) => {
    if (isChecked) {
      formik.setFieldValue("rehab_id", [...formik.values.rehab_id, action.kode])
      formik.setFieldValue("rehab_group_id", [
        ...formik.values.rehab_group_id,
        action.kodekelompok,
      ])
      formik.setFieldValue("rehab_group", [
        ...formik.values.rehab_group,
        action.kelompok,
      ])
      formik.setFieldValue("name", [...formik.values.name, action.nama])
    } else {
      const key = formik.values.name.indexOf(action.nama)

      const actionIds = [...formik.values.rehab_id]
      formik.values.rehab_id.length && actionIds.splice(key, 1)
      formik.setFieldValue("rehab_id", actionIds)

      const actionGroupIds = [...formik.values.rehab_group_id]
      formik.values.rehab_group_id.length && actionGroupIds.splice(key, 1)
      formik.setFieldValue("rehab_group_id", actionGroupIds)

      const actionGroups = [...formik.values.rehab_group]
      formik.values.rehab_group.length && actionGroups.splice(key, 1)
      formik.setFieldValue("rehab_group", actionGroups)

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
        filterGroupState={[filterGroup, setFilterGroup]}
      />
      <div className="post d-flex flex-column-fluid pt-5 pt-lg-15" id="kt_post">
        <div id="kt_content_container" className="container-xxl">
          <div className="card">
            <div className="card-body p-10">
              {[
                fisioActionStatus,
                ocupacyActionStatus,
                psychoActionStatus,
              ].includes("loading") && (
                <PrimaryLoader className="min-h-400px" />
              )}
              {[
                fisioActionStatus,
                ocupacyActionStatus,
                psychoActionStatus,
              ].includes("error") && <ErrorMessage className="min-h-400px" />}

              {[
                fisioActionStatus,
                ocupacyActionStatus,
                psychoActionStatus,
              ].every((status) => status === "success") && (
                <>
                  {formik.touched.rehab_id && formik.errors.rehab_id && (
                    <div className="alert alert-danger text-danger border-0 mb-8">
                      Anda wajib memilih salah satu tindakan
                    </div>
                  )}
                  {[
                    fisioActionData?.length,
                    ocupacyActionData?.length,
                    psychoActionData?.length,
                  ].every((length) => length === undefined) && (
                    <div className="py-10 d-flex flex-center">
                      <div className="d-flex flex-center flex-column">
                        <Zoom />
                        <p className="text-gray-600 mt-3">
                          Belum ada item rehab yang sesuai dengan kata kunci
                          anda ...
                        </p>
                      </div>
                    </div>
                  )}
                  <form onSubmit={formik.handleSubmit}>
                    {fisioActionData?.length &&
                      ["Semua group", "Fisioterapi"].includes(filterGroup) && (
                        <>
                          <div className="row">
                            <div className="col-md-3">
                              <h3 className="mb-5">Fisioterapi</h3>
                            </div>
                            <div className="row col-md-9">
                              {fisioActionData.map((fisioAction, key) => (
                                <div className="col-md-6" key={key}>
                                  <div className=" d-flex align-items-start form-check form-check-solid form-check-custom form-check-inline ms-10 mb-5">
                                    <input
                                      onChange={(event) =>
                                        handleCheck(
                                          event.currentTarget.checked,
                                          formik,
                                          fisioAction
                                        )
                                      }
                                      checked={formik.values.name.includes(
                                        fisioAction.nama
                                      )}
                                      type="checkbox"
                                      id={fisioAction.kode}
                                      className="form-check-input text-gray-600 me-5"
                                      disabled={disabledAction.includes(
                                        lowerSnake(fisioAction.nama)
                                      )}
                                    />
                                    <label
                                      className="cursor-pointer text-gray-600"
                                      htmlFor={fisioAction.kode}
                                    >
                                      {fisioAction.nama}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          {filterGroup === "Semua group" && <Separator />}
                        </>
                      )}
                    {ocupacyActionData?.length &&
                      ["Semua group", "Okupasi terapi"].includes(
                        filterGroup
                      ) && (
                        <>
                          <div className="row">
                            <div className="col-md-3">
                              <h3 className="mb-5">Okupasi terapi</h3>
                            </div>
                            <div className="row col-md-9">
                              {ocupacyActionData.map((ocupacy, key) => (
                                <div className="col-md-6" key={key}>
                                  <div className=" d-flex align-items-start form-check form-check-solid form-check-custom form-check-inline ms-10 mb-5">
                                    <input
                                      onChange={(event) =>
                                        handleCheck(
                                          event.currentTarget.checked,
                                          formik,
                                          ocupacy
                                        )
                                      }
                                      checked={formik.values.name.includes(
                                        ocupacy.nama
                                      )}
                                      type="checkbox"
                                      id={ocupacy.kode}
                                      className="form-check-input text-gray-600 me-5"
                                      disabled={disabledAction.includes(
                                        lowerSnake(ocupacy.nama)
                                      )}
                                    />
                                    <label
                                      className="cursor-pointer text-gray-600"
                                      htmlFor={ocupacy.kode}
                                    >
                                      {ocupacy.nama}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          {filterGroup === "Semua group" && <Separator />}
                        </>
                      )}
                    {psychoActionData?.length &&
                      ["Semua group", "Psikologi"].includes(filterGroup) && (
                        <>
                          <div className="row">
                            <div className="col-md-3">
                              <h3 className="mb-5">Psikologi</h3>
                            </div>
                            <div className="row col-md-9">
                              {psychoActionData.map((psycho, key) => (
                                <div className="col-md-6" key={key}>
                                  <div className=" d-flex align-items-start form-check form-check-solid form-check-custom form-check-inline ms-10 mb-5">
                                    <input
                                      onChange={(event) =>
                                        handleCheck(
                                          event.currentTarget.checked,
                                          formik,
                                          psycho
                                        )
                                      }
                                      checked={formik.values.name.includes(
                                        psycho.nama
                                      )}
                                      type="checkbox"
                                      id={psycho.kode}
                                      className="form-check-input text-gray-600 me-5"
                                      disabled={disabledAction.includes(
                                        lowerSnake(psycho.nama)
                                      )}
                                    />
                                    <label
                                      className="cursor-pointer text-gray-600"
                                      htmlFor={psycho.kode}
                                    >
                                      {psycho.nama}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                  </form>
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
