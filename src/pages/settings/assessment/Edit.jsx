import { ReactComponent as ArrowLeft } from "assets/icons/arrow-left.svg"
import { ReactComponent as ArrowRight } from "assets/icons/arrow-right.svg"
import { ReactComponent as GrayCalendarIcon } from "assets/icons/gray-calendar.svg"
import { ReactComponent as GrayCircleIcon } from "assets/icons/gray-circle.svg"
import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"
import { ReactComponent as GrayNumberIcon } from "assets/icons/gray-number.svg"
import { ReactComponent as GrayPencilIcon } from "assets/icons/gray-pencil.svg"
import { ReactComponent as GraySquareIcon } from "assets/icons/gray-square.svg"
import { ReactComponent as GrayTextIcon } from "assets/icons/gray-text.svg"
import { ReactComponent as GrayThreeDotIcon } from "assets/icons/gray-three-dot.svg"
import { ReactComponent as GrayUniqueIcon } from "assets/icons/gray-unique.svg"
import { ReactComponent as PrimaryArrowLeftIcon } from "assets/icons/primary-arrow-left.svg"
import { ReactComponent as PencilIcon } from "assets/icons/primary-pencil.svg"
import { ReactComponent as PrimaryZoomIcon } from "assets/icons/primary-zoom.svg"
import { ReactComponent as SearchIcon } from "assets/icons/search.svg"
import axios from "axios"
import { ButtonLightStyled, FormikSubmitButton } from "components/Button"
import PrimaryLoader, { ErrorMessage } from "components/Loader.jsx"
import { disabledCondition } from "components/table/TableFooter"
import { useFormik } from "formik"
import { globalStyle } from "helpers/react-select"
import { getQueryParameter } from "helpers/url-helper"
import useBreadcrumb from "hooks/useBreadcrumb"
import React, { useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useLocation, useNavigate, useParams } from "react-router"
import Select from "react-select"
import Switch from "react-switch"
import styled from "styled-components"
import * as Yup from "yup"
import { VisibilityIcon } from "./Index.jsx"
import { defaultModules, defaults, error } from "@pnotify/core"
import "@pnotify/core/dist/PNotify.css"
import * as PNotifyMobile from "@pnotify/mobile"
import "@pnotify/mobile/dist/PNotifyMobile.css"
import "assets/css/custom-pnotify.css"

defaultModules.set(PNotifyMobile, {})
defaults.delay = 2000
defaults.sticker = false

/**
 * Kustom komponen kartu untuk list input
 */
const InfoCardStyled = styled.div`
  width: 100px;
  height: 60px;
  background-color: #f5f8fa;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: 5px;
`

/**
 * Kustom komponen styled untuk animasi hover
 */
const HoverCard = styled.div`
  &:hover {
    .card {
      position: relative;

      &:after {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 28px;
        background-color: #0d9a89;
        border-radius: 2px;
      }
    }
  }
`

/**
 * Skema validasi edit form builder
 */
const editValidationSchema = Yup.object().shape({
  status: Yup.number().required("Status harus diisi"),
  group_name: Yup.string().required("Group wajib dipilih"),
})

/**
 * Komponen icon dinamik sesuai tipe input
 * @param {{type: String}}
 */
function DynamicIcon({ type = "" }) {
  switch (type) {
    case "text":
      return <GrayPencilIcon />

    case "number":
      return <GrayNumberIcon />

    case "radio":
      return <GrayCircleIcon />

    case "checkbox":
      return <GraySquareIcon />

    case "select":
      return <GrayThreeDotIcon />

    case "textarea":
      return <GrayTextIcon />

    case "datepicker":
      return <GrayCalendarIcon />

    default:
      return <GrayUniqueIcon />
  }
}

/**
 * Komponen utama form builder asesmen
 */
export default function Edit() {
  const { id: templateId, attributeId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const [pageOptions, setPageOptions] = useState([
    { value: "10", label: "10 item" },
    { value: "20", label: "20 item" },
    { value: "30", label: "30 item" },
    { value: "40", label: "40 item" },
    { value: "50", label: "50 item" },
    { value: "100", label: "100 item" },
  ])
  const [breadCrumbJson, setBreadCrumbJson] = useState({
    title: "Pengaturan Assesmen",
    items: [
      { text: "Pengaturan Asessmen", path: "/assessment-setting" },
      { text: "Edit", path: null },
    ],
  })
  useBreadcrumb(breadCrumbJson)

  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
    group: "",
  })

  const { data: templateData, status: templateStatus } = useQuery(
    `template-${templateId}`,
    async () =>
      axios.get(`/template/edit/${templateId}`).then((res) => res.data)
  )

  const { data: attributeData, status: attributeStatus } = useQuery(
    [`template-${templateId}-attribute`, filter],
    async (key) =>
      axios
        .get(`/template/list-attribute/${templateId}`, {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
  )

  useEffect(() => {
    if (
      attributeData &&
      pageOptions.filter((option) => option.label === "Semua").length === 0
    ) {
      setPageOptions(
        [{ value: attributeData.total.toString(), label: "Semua" }].concat(
          pageOptions
        )
      )
    }
  }, [attributeData])

  const { mutate } = useMutation(
    async ({ data, templateId, attributeId }) => {
      return axios
        .post(
          `/template/${templateId}/update-status-attribute/${attributeId}`,
          data
        )
        .then((res) => res.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`template-${templateId}-attribute`)
        queryClient.invalidateQueries(
          `template-${templateId}-attribute-${attributeId}`
        )
      },
      onError: (err) => {
        if (err.response.data.message === "This column required.") {
          error("Kolom ini tidak boleh dinonaktifkan.")
        }
      },
    }
  )

  useEffect(() => {
    if (templateStatus === "success") {
      setBreadCrumbJson({
        ...breadCrumbJson,
        items: [
          { text: "Pengaturan Asessmen", path: "/assessment-setting" },
          { text: templateData.name, path: null },
        ],
      })
    }
  }, [templateStatus])

  return (
    <>
      {location.pathname.includes("edit") && attributeId && (
        <EditModal templateData={templateData} />
      )}
      <Toolbar filterProps={[filter, setFilter]} pageOptions={pageOptions} />
      <div className="post d-flex flex-column-fluid pt-5 pt-lg-15" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          <div className="row">
            <div className="col-xl-9">
              {attributeStatus === "loading" && (
                <PrimaryLoader className="min-h-400px" />
              )}
              {attributeStatus === "error" && (
                <ErrorMessage className="min-h-400px" />
              )}
              {attributeStatus === "success" && (
                <>
                  {attributeData?.data.length === 0 && (
                    <div className="d-flex flex-center min-h-500px">
                      <div className="d-flex flex-column flex-center">
                        <PrimaryZoomIcon className="mb-5" />
                        <p className="text-gray-600">
                          Belum ada attribute atau inputan yang sesuai dengan
                          kata kunci Anda.
                        </p>
                      </div>
                    </div>
                  )}
                  {attributeData.data.map((data, key) => (
                    <HoverCard key={key}>
                      <div className="card mb-3">
                        <div
                          className="card-body px-5"
                          style={{ padding: "8px" }}
                        >
                          <div className="d-flex justify-content-between">
                            <div className="d-flex align-items-center">
                              <div className="w-40px h-40px bg-gray-200 rounded-circle d-flex flex-center me-5">
                                <DynamicIcon type={data.type} />
                              </div>
                              <div className="d-flex flex-column justify-content-center">
                                <p className="text-gray-600 mb-1">
                                  {data.label}
                                </p>
                                <p className="text-gray-500 mb-0">
                                  {!data.group_name
                                    ? "Undefined"
                                    : data.group_name}
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center">
                              <Switch
                                checked={data.status === 1 ? true : false}
                                offColor="#E4E6EF"
                                onColor="#0D9A89"
                                uncheckedIcon={false}
                                checkedIcon={false}
                                handleDiameter={20}
                                onChange={() => {
                                  mutate({
                                    templateId: templateId,
                                    attributeId: data.attr_id,
                                    data: {
                                      _method: "PATCH",
                                      status: data.status ? 0 : 1,
                                    },
                                  })
                                }}
                                className="me-3"
                              />
                              <ButtonLightStyled
                                onClick={() =>
                                  navigate(
                                    location.pathname + "/edit/" + data.attr_id
                                  )
                                }
                                className="btn btn-icon btn-light-primary h-35px w-35px"
                              >
                                <PencilIcon />
                              </ButtonLightStyled>
                            </div>
                          </div>
                        </div>
                      </div>
                    </HoverCard>
                  ))}
                  <div className="my-10 my-lg-5">
                    <Pagination
                      data={attributeData}
                      filterProps={[filter, setFilter]}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="col-xl-3">
              <div className="card">
                <div className="card-body p-6">
                  <h1 className="fs-1">Dokumentasi</h1>
                  <p className="text-gray-600">
                    Simbol dan keterangan untuk tipe inputan.
                  </p>
                  <div className="d-flex flex-wrap justify-content-center mb-3">
                    <InfoCardStyled>
                      <GrayPencilIcon />
                      <div className="text-gray-600">Basic Input</div>
                    </InfoCardStyled>
                    <InfoCardStyled>
                      <GrayNumberIcon />
                      <div className="text-gray-600">Number</div>
                    </InfoCardStyled>
                    <InfoCardStyled>
                      <GrayCircleIcon />
                      <div className="text-gray-600">Radio Button</div>
                    </InfoCardStyled>
                    <InfoCardStyled>
                      <GraySquareIcon />
                      <div className="text-gray-600">Checkbox</div>
                    </InfoCardStyled>
                    <InfoCardStyled>
                      <GrayThreeDotIcon />
                      <div className="text-gray-600">Select</div>
                    </InfoCardStyled>
                    <InfoCardStyled>
                      <GrayTextIcon />
                      <div className="text-gray-600">Textarea</div>
                    </InfoCardStyled>
                    <InfoCardStyled>
                      <GrayCalendarIcon />
                      <div className="text-gray-600">Datepicker</div>
                    </InfoCardStyled>
                    <InfoCardStyled>
                      <GrayUniqueIcon />
                      <div className="text-gray-600">Unique</div>
                    </InfoCardStyled>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Komponen paginasi data form builder
 * @param {{
 * data: Object
 * filterProps: Array
 * }}
 */
function Pagination({ data, filterProps }) {
  const [filter, setFilter] = filterProps
  return (
    <nav>
      <ul className="pagination justify-content-end">
        {data.links.map((link, key) => {
          return (
            <li
              key={`pagination-item-${key}`}
              className={`page-item ${link.active ? "offset active" : ""} ${
                disabledCondition(data, link.label) ? "disabled" : ""
              }`}
            >
              <a
                className="page-link"
                href="#"
                onClick={(event) => {
                  event.preventDefault()

                  setFilter({
                    ...filter,
                    page: getQueryParameter(link.url).page,
                  })
                }}
              >
                {link.label === "&laquo; Sebelumnya" ? (
                  <ArrowLeft />
                ) : link.label === "Berikutnya &raquo;" ? (
                  <ArrowRight />
                ) : (
                  link.label
                )}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/**
 * Komponen modal edit form builder
 * @param {{
 * templateData: Object
 * }}
 */
function EditModal({ templateData }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id: templateId, attributeId } = useParams()
  const [submitStatus, setSubmitStatus] = useState()
  const [initialValues, setInitialValues] = useState({
    status: 0,
    group_name: null,
  })

  const { data: attributeData, status: attributeStatus } = useQuery(
    `template-${templateId}-attribute-${attributeId}`,
    async () => {
      return axios
        .get(`/template/${templateId}/edit-attribute/${attributeId}`)
        .then((res) => res.data)
    }
  )

  useEffect(() => {
    if (attributeData) {
      setInitialValues({
        status: attributeData.status,
        group_name:
          attributeData.group_name === "" ? null : attributeData.group_name,
      })
    }
  }, [attributeData])

  const { data: groupData, status: groupStatus } = useQuery(
    "group",
    async () => {
      return axios.get(`/template/list-group`).then((res) => res.data)
    }
  )

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: editValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true)
      axios
        .post(`template/${templateId}/update-attribute/${attributeId}`, {
          _method: "PATCH",
          ...values,
        })
        .then(() => {
          setSubmitting(false)

          queryClient.invalidateQueries(`template-${templateId}-attribute`)
          queryClient.invalidateQueries(
            `template-${templateId}-attribute-${attributeId}`
          )
          setSubmitStatus({
            status: "success",
            message: "Data telah berhasil disimpan ke dalam basis data.",
          })
        })
        .catch(() => {
          setSubmitStatus({
            status: "danger",
            message:
              "Maaf, sepertinya ada beberapa kesalahan yang terdeteksi, silakan coba lagi.",
          })
          setSubmitting(false)
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
          onConfirm={() => navigate(-1)}
          confirmBtnText="OK mengerti"
        >
          <div className="text-gray-600 mb-5">{submitStatus?.message}</div>
        </SweetAlert>
      )}
      <Modal animation={false} show={true}>
        <Modal.Header>
          <div className="d-flex flex-center">
            <Modal.Title as="h3" className="me-2">
              Ubah
            </Modal.Title>
            <span className="text-gray-600">{templateData?.name}</span>
          </div>
          <GrayCrossIcon
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </Modal.Header>
        <form action="" onSubmit={formik.handleSubmit} method="post">
          <Modal.Body>
            {[attributeStatus, groupStatus].includes("loading") && (
              <PrimaryLoader />
            )}
            {[attributeStatus, groupStatus].includes("error") === "error" && (
              <ErrorMessage />
            )}
            {attributeStatus === "success" && groupStatus === "success" && (
              <>
                <div className="mb-3 row">
                  <label
                    htmlFor="edit_name"
                    className="col-sm-4 col-form-label text-sm-end"
                  >
                    Nama Label
                  </label>
                  <div className="col-sm-8">
                    <textarea
                      id="edit_name"
                      disabled={true}
                      className="form-control form-control-solid"
                      style={{ cursor: "not-allowed" }}
                      rows={4}
                      value={attributeData.label}
                    ></textarea>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label
                    htmlFor="status"
                    className="col-sm-4 col-form-label text-sm-end"
                  >
                    Status
                  </label>
                  <div className="col-sm-8">
                    <Switch
                      checked={formik.values.status === 1 ? true : false}
                      offColor="#E4E6EF"
                      onColor="#0D9A89"
                      uncheckedIcon={false}
                      checkedIcon={false}
                      handleDiameter={20}
                      onChange={(value) =>
                        formik.setFieldValue("status", value ? 1 : 0)
                      }
                      className="mt-2"
                      name="status"
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label
                    htmlFor="group_name"
                    className="col-sm-4 col-form-label text-sm-end"
                  >
                    Tempatkan ke group
                  </label>
                  <div className="col-sm-8">
                    <Select
                      name="group_name"
                      id="group_name"
                      styles={globalStyle}
                      options={groupData.map((group) => {
                        return {
                          label: group.name,
                          value: group.name,
                        }
                      })}
                      value={{
                        value: formik.values.group_name ?? "",
                        label: formik.values.group_name ?? "Select",
                      }}
                      onBlur={() => formik.setFieldTouched("group_name")}
                      onChange={(option) =>
                        formik.setFieldValue("group_name", option.value)
                      }
                      noOptionsMessage={() => "Data tidak ditemukan"}
                      components={{
                        IndicatorSeparator: "",
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer className="flex-center">
            <FormikSubmitButton formik={formik} />
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

/**
 * Komponen toolbar edit form builder
 * @param {{
 * filterProps: Array
 * pageOptions: Array<{value: String, label: String}>
 * }}
 */
function Toolbar({ filterProps, pageOptions }) {
  const navigate = useNavigate()
  const [filter, setFilter] = filterProps
  const [groupOption, setGroupOption] = useState([])
  const { id: templateId } = useParams()

  const { data: templateData, status: templateStatus } = useQuery(
    `template-${templateId}`,
    async () =>
      axios.get(`/template/edit/${templateId}`).then((res) => res.data)
  )

  const {
    data: groupData,
    status: groupStatus,
    refetch: groupRefetch,
  } = useQuery(
    "group",
    async () => {
      return axios.get(`/template/list-group`).then((res) => res.data)
    },
    { enabled: false }
  )

  useEffect(() => {
    if (groupStatus === "success") {
      const mappedOption = groupData?.map((group) => {
        return {
          label: group.name,
          value: group.name,
        }
      })

      if (mappedOption.length === groupData.length) {
        setGroupOption(
          [
            {
              label: "Semua Group",
              value: "",
            },
          ].concat(mappedOption)
        )
      }
    }
  }, [groupStatus])

  const debounce = (fn, delay = 1000) => {
    let timerId
    return (...args) => {
      clearTimeout(timerId)
      timerId = setTimeout(() => fn(...args), delay)
    }
  }

  return (
    <div className="toolbar mt-n3 mt-lg-0" id="kt_toolbar">
      <div className="container-fluid">
        <div className="row justify-content-between overflow-x-auto">
          <div className="col-md-10">
            <div className="d-flex flex-column flex-md-row align-items-center me-0 me-md-3 mb-0">
              <ButtonLightStyled
                className="btn btn-icon btn-light-primary flex-shrink-0 mb-2 mb-md-0 me-0 me-md-10"
                onClick={() => navigate(-1)}
              >
                <PrimaryArrowLeftIcon />
              </ButtonLightStyled>
              <div className="d-flex align-items-center position-relative w-100 w-md-200px me-0 me-md-5 mb-2 mb-md-0">
                <span className="svg-icon svg-icon-1 position-absolute ms-4">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  data-kt-user-table-filter="search"
                  className="form-control form-control-solid w-100 w-md-200px ps-14"
                  placeholder="Search"
                  defaultValue={filter.search}
                  onChange={debounce((event) => {
                    setFilter({
                      ...filter,
                      page: 1,
                      search: event.target.value,
                    })
                  })}
                />
              </div>
              <div className="w-100 w-md-200px mb-2 mb-md-0 me-0 me-md-5">
                <Select
                  name="group_name"
                  id="group_name"
                  styles={globalStyle}
                  isLoading={groupStatus === "loading"}
                  onMenuOpen={() => groupRefetch()}
                  options={groupOption}
                  value={{
                    value: filter.group,
                    label: !filter.group ? "Select" : filter.group,
                  }}
                  onChange={(option) =>
                    setFilter({
                      ...filter,
                      group: option.value,
                    })
                  }
                  noOptionsMessage={() => "Data tidak ditemukan"}
                  components={{
                    IndicatorSeparator: "",
                  }}
                />
              </div>
              <div className="w-100 w-md-200px mb-2 mb-md-0 me-0 me-md-5">
                <Select
                  isSearchable={false}
                  name="group_name"
                  id="group_name"
                  styles={globalStyle}
                  options={pageOptions}
                  value={{
                    value: filter.pagination ?? "",
                    label: !filter.pagination
                      ? "Select"
                      : pageOptions.filter(
                          (option) =>
                            option.value.toString() ===
                            filter.pagination.toString()
                        )?.[0]?.label,
                  }}
                  onChange={(option) =>
                    setFilter({
                      ...filter,
                      pagination: option.value,
                    })
                  }
                  noOptionsMessage={() => "Data tidak ditemukan"}
                  components={{
                    IndicatorSeparator: "",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-md-1 d-flex justify-content-center justify-content-md-end">
            {templateStatus !== "success" && (
              <button className="btn btn-icon btn-primary"></button>
            )}
            {templateStatus === "success" && (
              <VisibilityIcon
                id={templateId}
                visibility={templateData.visibility}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
