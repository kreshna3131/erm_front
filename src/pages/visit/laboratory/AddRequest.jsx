import { ReactComponent as PrimaryArrowLeftIcon } from "assets/icons/primary-arrow-left.svg"
import { ReactComponent as Zoom } from "assets/icons/primary-zoom.svg"
import { ReactComponent as Search } from "assets/icons/search.svg"
import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import { useFormik } from "formik"
import { globalStyle } from "helpers/react-select"
import { lowerSnake } from "helpers/string-helper"
import useBreadcrumb from "hooks/useBreadcrumb"
import useCheckPermission from "hooks/useCheckPermission"
import useDidMountEffect from "hooks/useDidMountEffect"
import useSidebarActiveMenu from "hooks/useSidebarActiveMenu"
import _ from "lodash"
import { useEffect, useRef, useState } from "react"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import Select from "react-select"
import * as Yup from "yup"

/**
 * Data group permintaan laboratorium
 */
const actionGroup = [
  {
    label: "Semua",
    value: "",
  },
  {
    label: "Kimia Darah",
    value: "415050001",
  },
  {
    label: "Hematologi",
    value: "415050002",
  },
  {
    label: "Pemeriksaan Feses",
    value: "415050003",
  },
  {
    label: "Pemeriksaan Mikrobiologi/Serologi/Imunologi",
    value: "415050004",
  },
  {
    label: "Pemeriksaan Urin",
    value: "415050005",
  },
  {
    label: "Pemeriksaan Coagulometri",
    value: "417100001",
  },
  {
    label: "Bank Darah",
    value: "417110001",
  },
  {
    label: "Pemeriksaan Cairan Tubuh Lainnya",
    value: "418110001",
  },
  {
    label: "Lain-lain",
    value: "418110002",
  },
  {
    label: "Tindakan Spesialistik",
    value: "420100001",
  },
]

/**
 * Komponen utama untuk Add Request
 */
export default function AddRequest() {
  const { id } = useParams()
  const [submitStatus, setSubmitStatus] = useState({})
  const [initialValues, setInitialValues] = useState({
    action_id: [],
    action_group_id: [],
    action_group: [],
    name: [],
  })
  const [disabledAction, setDisabledAction] = useState([])
  const [mergeObj, setMergeObj] = useState([])
  const [search, setSearch] = useState("")
  const [filterGroup, setFilterGroup] = useState("")
  const queryClient = useQueryClient()
  const navigate = useNavigate()
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
        text: "Tambah Permintaan",
        path: null,
      },
    ],
  })

  /** Menambahkan permission */
  const { user: loggedUser } = useOutletContext()
  useCheckPermission(loggedUser, "tambah permintaan laboratorium di kunjungan")

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
          path: `/visit/${id}/laboratory`,
        },
        {
          text: "Tambah Permintaan",
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
   * Menyimpan data permintaan laboratorium
   */
  const mutation = useMutation(async (data) => {
    return axios
      .post(`/visit/${id}/laboratorium/store`, data)
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
          queryClient.invalidateQueries(`visit-laboratorium-action`)
          setTimeout(() => {
            setSubmitStatus({
              status: "success",
              message: "Data telah berhasil disimpan ke dalam basis data",
            })
            setSubmitting(false)
          }, 500)
        },
        onError: function (err) {
          if (err.response.data.message === "Nomor order tersebut sudah ada") {
            setSubmitStatus({
              status: "danger",
              message: "Nomor order tersebut sudah ada.",
            })
            setSubmitting(false)
            return
          }

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
  const handleCheck = (isChecked, formik, action, value) => {
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
        value.kelompok,
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
                        <div className="row mb-6" key={key}>
                          <div className="col-md-3 ">
                            <h1
                              className="fs-5 mb-5 "
                              style={{ marginRight: "100px" }}
                            >
                              {value.kelompok}
                            </h1>
                          </div>

                          <div className="row  col-md-9">
                            {value?.data &&
                              value?.data.map((v, idx) => (
                                <div
                                  className="col-md-3 d-flex align-items-center"
                                  key={idx}
                                >
                                  <div
                                    className="form-check form-check-solid form-check-custom
                form-check-solid form-check-inline ms-10 mb-5"
                                  >
                                    <input
                                      onChange={(event) =>
                                        handleCheck(
                                          event.currentTarget.checked,
                                          formik,
                                          v,
                                          value
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
                                      className="cursor-pointer text-gray-600"
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
        </div>
      </div>
      <div className=" d-flex justify-content-between p-9 ">
        <ButtonLightStyled
          className="btn btn-light-primary "
          onClick={() => navigate(-1)}
        >
          Batal
        </ButtonLightStyled>

        <ButtonLightStyled
          className="btn btn-primary "
          onClick={() => formik.submitForm()}
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!formik.isSubmitting && (
            <span className="indicator-label fw-medium">Buat</span>
          )}
          {formik.isSubmitting && (
            <span className="indicator-progress" style={{ display: "block" }}>
              Please wait...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </ButtonLightStyled>
      </div>
    </>
  )
}

/**
 * Komponen toolbar tambah permintaan laboratorium
 */
export function Toolbar({
  formik,
  setSearchValue,
  filterGroup,
  setFilterGroup,
}) {
  const navigate = useNavigate()
  return (
    <div className="toolbar mt-n3 mt-lg-0">
      <div className="container-fluid">
        <div className="row justify-content-between">
          <div className="col-md-9 d-flex flex-wrap align-items-center mb-md-0">
            <ButtonLightStyled
              onClick={() => navigate(-1)}
              className="btn btn-icon btn-light-primary flex-shrink-0 me-8"
            >
              <PrimaryArrowLeftIcon />
            </ButtonLightStyled>
            <div className="d-flex align-items-center position-relative w-100 w-sm-250px my-1 me-0 me-sm-3">
              <span className="svg-icon svg-icon-1 position-absolute ms-4">
                <Search />
              </span>
              <input
                type="text"
                data-kt-user-table-filter="search"
                className="form-control form-control-solid ps-14"
                placeholder="Search"
                onKeyUp={(event) => {
                  setSearchValue.current(event.target.value)
                }}
              />
            </div>
            <div className="form-group w-100 w-sm-250px my-1">
              <Select
                options={actionGroup}
                value={{
                  label:
                    actionGroup.filter((is_read) => {
                      return is_read.value === filterGroup
                    })?.[0]?.label ?? "Select",
                  value: filterGroup,
                }}
                onChange={(option) => {
                  setFilterGroup(option.value)
                }}
                name="is_read"
                id="is_read"
                styles={globalStyle}
                noOptionsMessage={() => "Data tidak ditemukan"}
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
