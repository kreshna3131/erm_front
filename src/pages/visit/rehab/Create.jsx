import { ReactComponent as PrimaryArrowLeftIcon } from "assets/icons/primary-arrow-left.svg"
import { ReactComponent as PrimaryZoomIcon } from "assets/icons/primary-zoom.svg"
import { ReactComponent as SearchIcon } from "assets/icons/search.svg"
import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import PrimaryLoader from "components/Loader"
import { useFormik } from "formik"
import { globalStyle } from "helpers/react-select"
import useBreadcrumb from "hooks/useBreadcrumb"
import useCheckPermission from "hooks/useCheckPermission"
import useDidMountEffect from "hooks/useDidMountEffect"
import useSidebarActiveMenu from "hooks/useSidebarActiveMenu"
import _ from "lodash"
import { useEffect, useRef, useState } from "react"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useOutletContext, useParams } from "react-router"
import Select from "react-select"
import styled from "styled-components"
import * as Yup from "yup"

/** Border separator untuk memisah item */
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

/** Data select filter group */
const groupOptions = [
  {
    label: "Semua group",
    value: "Semua group",
  },
  {
    label: "Fisioterapi",
    value: "Fisioterapi",
  },
  {
    label: "Okupasi terapi",
    value: "Okupasi terapi",
  },
  {
    label: "Psikologi",
    value: "Psikologi",
  },
]

/**
 * Skema awal BreadCrumb
 */
export const initialBreadCrumbJson = {
  title: "Kunjungan",
  items: [
    { text: "Kunjungan", path: "/visit" },
    {
      text: "Pelayanan",
      path: "",
    },
    {
      text: "Rehab",
      path: "",
    },
    {
      text: "Tambah",
      path: null,
    },
  ],
}

/**
 * Komponen utama buat rehab
 */
export default function Create() {
  const navigate = useNavigate()
  const [breadCrumbJson, setBreadCrumbJson] = useState(initialBreadCrumbJson)
  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("visit")
  const queryClient = useQueryClient()
  const { id: visitId } = useParams()
  const [search, setSearch] = useState("")
  const [filterGroup, setFilterGroup] = useState("Semua group")
  const [submitStatus, setSubmitStatus] = useState({})
  const [initialValues] = useState({
    rehab_id: [],
    rehab_group_id: [],
    rehab_group: [],
    name: [],
  })

  /** Menambahkan permission */
  const { user: loggedUser } = useOutletContext()
  useCheckPermission(loggedUser, "tambah permintaan rehab medik di kunjungan")

  useEffect(() => {
    setBreadCrumbJson({
      ...initialBreadCrumbJson,
      items: [
        { text: "Kunjungan", path: "/visit" },
        {
          text: "Pelayanan",
          path: `/visit/${visitId}/rehab`,
        },
        {
          text: "Rehab",
          path: `/visit/${visitId}/rehab`,
        },
        {
          text: "Tambah",
          path: null,
        },
      ],
    })
  }, [visitId])

  /** Konfigurasi formik buat rehab */
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      rehab_id: Yup.array().min(1).required("Kolom ini wajib untuk dipilih"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true)
      mutate(values, {
        onSuccess: () => {
          setSubmitting(false)
          queryClient.invalidateQueries(`visit-${visitId}-rehab-medic-listing`)
          setSubmitStatus({
            status: "success",
            message: "Data telah berhasil disimpan ke dalam basis data",
          })
          setSubmitting(false)
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

  /** Menyimpan data rehab */
  const { mutate } = useMutation((data) =>
    axios.post(`/visit/${visitId}/rehab/store`, data).then((res) => res.data)
  )

  /** Mengambil data fisioterapi */
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

  /** Logic yang mengandle ketika nilai checkbox berubah */
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

  useDidMountEffect(() => {
    formik.setFieldTouched("rehab_id")
  }, [formik.values.rehab_id])

  /** Pencarian rehab */
  const setSearchValue = useRef(
    _.debounce((value) => {
      setSearch(value)
    }, 1000)
  )

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
        <div id="kt_content_container" className="container-fluid">
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
              ].includes("error") && (
                <div className="py-10 d-flex flex-center">
                  <p className="text-gray-600">Error ...</p>
                </div>
              )}
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
                        <PrimaryZoomIcon />
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

/**
 * Komponen toolbar buat rehab
 */
export function Toolbar({ formik, setSearchValue, filterGroupState }) {
  const navigate = useNavigate()
  const [filterGroup, setFilterGroup] = filterGroupState

  return (
    <div className="toolbar mt-n3 mt-lg-0">
      <div className="container-fluid">
        <div className="row justify-content-between">
          <div className="col-md-9 d-flex flex-wrap align-items-center mb-md-0">
            <ButtonLightStyled
              onClick={() => navigate(-1)}
              className="btn btn-icon btn-light-primary flex-shrink-0 me-8 my-1"
            >
              <PrimaryArrowLeftIcon />
            </ButtonLightStyled>
            <div className="d-flex align-items-center position-relative w-100 w-sm-250px my-1 me-0 me-sm-3">
              <span className="svg-icon svg-icon-1 position-absolute ms-4">
                <SearchIcon />
              </span>
              <input
                type="text"
                data-kt-user-table-filter="search"
                className="form-control form-control-solid ps-14"
                placeholder="Search"
                onKeyUp={(event) => setSearchValue.current(event.target.value)}
              />
            </div>
            <div className="form-group w-100 w-sm-250px my-1">
              <Select
                options={groupOptions}
                onChange={(option) => {
                  setFilterGroup(option.value)
                }}
                defaultValue={{ label: "Semua Group", value: "Semua Group" }}
                name="is_read"
                id="is_read"
                styles={globalStyle}
                noOptionmdessage={() => "Data tidak ditemukan"}
                components={{
                  IndicatorSeparator: "",
                }}
              />
            </div>
          </div>
          <div className="col-md-3 d-flex justify-content-md-end align-items-start my-1">
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
    </div>
  )
}
