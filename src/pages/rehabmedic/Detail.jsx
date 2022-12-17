import "@pnotify/confirm/dist/PNotifyConfirm.css"
import { error, success } from "@pnotify/core"
import "@pnotify/core/dist/BrightTheme.css"
import "@pnotify/core/dist/PNotify.css"
import { ReactComponent as BlueGlass } from "assets/icons/blue-glass.svg"
import { ReactComponent as Checklist } from "assets/icons/checklist.svg"
import { ReactComponent as Clock } from "assets/icons/clock.svg"
import { ReactComponent as DropdownChecklistIcon } from "assets/icons/dropdown-checklist.svg"
import { ReactComponent as PrimaryArrowLeftIcon } from "assets/icons/primary-arrow-left.svg"
import { ReactComponent as PrimaryChatIcon } from "assets/icons/primary-chat.svg"
import { ReactComponent as Search } from "assets/icons/search.svg"
import { ReactComponent as TripleDotIcon } from "assets/icons/triple-dot.svg"
import { ReactComponent as WarningExclamation } from "assets/icons/warning-exclamation.svg"
import { ReactComponent as WarningPencil } from "assets/icons/warning-pencil.svg"
import { ReactComponent as WarningRestartIcon } from "assets/icons/warning-restart.svg"
import { ReactComponent as WhitePaperPlaneIcon } from "assets/icons/white-paper-plane.svg"
import { ReactComponent as DangerDownloadIcon } from "assets/icons/danger-download.svg"

import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import { DropdownStatusStyled } from "components/Dropdown"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import { HoverBorderedTrBg } from "components/table/TableRow"
import UpdateModal from "components/table/UpdateModal"
import { useFormik } from "formik"
import { dynamicFormControlClass } from "helpers/formik-helper"
import { localeStatus } from "helpers/helper"
import { truncate } from "helpers/string-helper"
import useBreadcrumb from "hooks/useBreadcrumb"
import useOnClickOutside from "hooks/useOnClickOutside"
import useSidebarActiveMenu from "hooks/useSidebarActiveMenu"
import _ from "lodash"
import { LaboratoryStatus } from "pages/visit/laboratory/Edit"
import React, { useRef, useState } from "react"
import { Dropdown, Overlay } from "react-bootstrap"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useLocation } from "react-router"
import { useNavigate, useParams } from "react-router-dom"
import * as Yup from "yup"
import ButtonDetailPatient from "./ButtonDetailPatient"

/**
 * Skema menu breadcrumb detail rehab
 */
const breadCrumbJson = {
  title: "Rehab Medik",
  items: [
    { text: "Rehab Medik", path: "/rehab-medic" },
    { text: "Detail", path: null },
  ],
}

/**
 * Komponen utama detail rehab
 */
export default function Detail() {
  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("rehab-medic")
  const { rehabId } = useParams()
  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
    status: "",
    is_read: "",
  })

  /**
   * Logic pencarian tindakan rehab
   */
  const setSearchValue = useRef(
    _.debounce((value) => {
      setFilter({
        ...filter,
        page: 1,
        search: value,
      })
    }, 1000)
  )

  /**
   * Mengambil data detail rehab
   */
  const requestQuery = useQuery(`visit-rehab-${rehabId}-edit`, async (key) =>
    axios
      .get(`/visit/rehab/${rehabId}/edit`, {
        params: key.queryKey[1],
      })
      .then((res) => res.data)
  )
  const requestData = requestQuery.data

  /**
   * Mengambil data tindakan rehab
   */
  const { data: detailRehab, status: detailRehabStatus } = useQuery(
    [`detail-rehab-${rehabId}-measure-listing`, filter],
    async (key) =>
      axios
        .get(`/visit/rehab/${rehabId}/measure/listing`, {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
  )

  return (
    <>
      <Toolbar requestQuery={requestQuery} />
      <div className="post d-flex flex-column-fluid pt-5 pt-lg-15" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          <div className="row ">
            <div className=" col-md-8">
              <div className="card mb-8 mb-md-0">
                <div className="card-header border-0 pt-6">
                  <div className="card-toolbar">
                    {detailRehabStatus === "success" && (
                      <div
                        className="d-flex justify-content-end"
                        data-kt-user-table-toolbar="base"
                      >
                        <span className="text-gray-600">
                          <WarningExclamation />
                          <span className="ms-1">
                            {detailRehab?.not_serve_count} Tindakan belum
                            dilayani
                          </span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="card-title">
                    <div className="d-flex align-items-center position-relative my-1 ">
                      <span className="svg-icon svg-icon-1 position-absolute ms-4">
                        <Search />
                      </span>
                      <input
                        type="text"
                        data-kt-user-table-filter="search"
                        className="form-control form-control-solid w-250px ps-14"
                        placeholder="Search"
                        onKeyUp={(event) => {
                          setSearchValue.current(event.target.value)
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-body p-10">
                  {detailRehabStatus === "loading" && (
                    <PrimaryLoader className="min-h-300px" />
                  )}
                  {detailRehabStatus === "error" && (
                    <ErrorMessage className="min-h-300px" />
                  )}
                  {detailRehabStatus === "success" && (
                    <>
                      <table className="table position-relative ">
                        <TableHeading
                          filterProp={[filter, setFilter]}
                          columns={[
                            {
                              name: "action_id",
                              heading: "Kode",
                              width: "20%",
                            },
                            {
                              name: "name",
                              heading: "Group",
                              width: "35%",
                            },
                            {
                              name: "action_group_id",
                              heading: "Kode kel.",
                              width: "15%",
                            },
                            {
                              name: "action_group",
                              heading: "Kelompok",
                              width: "20%",
                            },
                            // {
                            //   name: "order_number",
                            //   heading: "Order",
                            //   width: "10%",
                            // },
                            {
                              heading: "",
                              width: "5%",
                              sort: false,
                            },
                          ]}
                        />
                        <tbody>
                          {detailRehab && detailRehab?.data.length === 0 && (
                            <tr>
                              <td colSpan={4}>
                                <center className="text-gray-600">
                                  Belum ada data yang dapat ditampilkan
                                </center>
                              </td>
                            </tr>
                          )}
                          {detailRehab?.data.map((data, key) => {
                            const dynamicBg =
                              data.status === "finish" ? "#ecf7f6" : ""

                            return (
                              <HoverBorderedTrBg
                                key={`data-table-${key}`}
                                dynamicBg={dynamicBg}
                                disabled={["cancel", "done"].includes(
                                  requestData?.status
                                )}
                              >
                                <td className="align-middle text-gray-700">
                                  {data.action_id}
                                </td>
                                <td className="align-middle text-gray-700">
                                  {data.name}
                                </td>
                                <td className="align-middle text-gray-700">
                                  {data.action_group_id}
                                </td>
                                <td className="align-middle text-gray-700">
                                  {data.action_group}
                                </td>
                                {/* <td className="align-middle text-gray-700">
                                  {data.order_number}
                                </td> */}
                                <td className="align-middle">
                                  <UpdateActionStatusButton
                                    url={`/visit/rehab/${rehabId}/measure/${data.id}/update-status`}
                                    status={data.status}
                                    invalidateQueries={`detail-rehab-${rehabId}-measure-listing`}
                                  />
                                </td>
                              </HoverBorderedTrBg>
                            )
                          })}
                        </tbody>
                      </table>
                      <TableFooter
                        data={detailRehab}
                        filterProp={[filter, setFilter]}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <Comment rehabId={rehabId} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Komponen tombol untuk mengupdate status permintaan lab

 */
function UpdateStatusButton({ id, currentStatus }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { status } = useParams()
  const [show, setShow] = useState(false)
  const overlayContainerRef = useRef()
  const overlayTargetRef = useRef()
  useOnClickOutside(overlayContainerRef, () => setShow(false))
  return (
    <>
      {location.pathname.includes(`/${id}/action-status/${status}`) && (
        <UpdateModal
          url={`visit/rehab/${id}/update-status`}
          data={{ status: status }}
          query={`visit-rehab-${id}-edit`}
          message={`
            Anda yakin ingin mengganti status permintaan  menjadi ${localeStatus(
              status
            )}?
          `}
          successMessage={`Anda telah berhasil mengubah status menjadi ${localeStatus(
            status
          )}.`}
        />
      )}
      <div ref={overlayContainerRef}>
        <ButtonLightStyled
          ref={overlayTargetRef}
          onClick={() => setShow(!show)}
          className="btn btn-icon btn-light-warning"
        >
          <TripleDotIcon />
        </ButtonLightStyled>
        <Overlay
          show={show}
          target={overlayTargetRef.current}
          container={overlayContainerRef.current}
          placement="bottom-end"
        >
          <Dropdown.Menu show={true} className="py-5 w-200px me-2">
            <DropdownStatusStyled
              disabled={["cancel", "done"].includes(currentStatus)}
            >
              <Dropdown.Item
                active={currentStatus === "waiting"}
                onClick={() => {
                  setShow(false)
                  navigate(`action-status/waiting`)
                }}
              >
                <Clock className="me-4" />
                <span>Menunggu</span>
              </Dropdown.Item>
              <Dropdown.Item
                active={currentStatus === "fixing"}
                onClick={() => {
                  setShow(false)
                  navigate(`action-status/fixing`)
                }}
              >
                <WarningPencil className="me-4" />
                <span>Perbaikan</span>
              </Dropdown.Item>
              <Dropdown.Item
                active={currentStatus === "progress"}
                onClick={() => {
                  setShow(false)
                  navigate(`action-status/progress`)
                }}
              >
                <BlueGlass className="me-4" />
                <span>Proses</span>
              </Dropdown.Item>
              <Dropdown.Item
                active={currentStatus === "done"}
                onClick={() => {
                  setShow(false)
                  navigate(`action-status/done`)
                }}
              >
                <Checklist className="me-4" />
                <span>Selesai</span>
              </Dropdown.Item>
            </DropdownStatusStyled>
          </Dropdown.Menu>
        </Overlay>
      </div>
    </>
  )
}

/**
 * Tombol untuk mengupdate status pada list tindakan permintaan rehab
 
 */
function UpdateActionStatusButton({ url, status, invalidateQuery }) {
  const [show, setShow] = useState(false)
  const queryClient = useQueryClient()
  const overlayContainerRef = useRef()
  const overlayTargetRef = useRef()
  useOnClickOutside(overlayContainerRef, () => setShow(false))

  /**
   * Mengupdate status tindakan
   */
  const mutation = useMutation(
    async (data) => {
      return axios
        .post(url, {
          _method: "PATCH",
          status: data,
        })
        .then((res) => res.data)
    },
    {
      onSuccess: () => {
        setTimeout(() => {
          queryClient.invalidateQueries(invalidateQuery)
          success({
            text: "Status tindakan berhasil diganti",
          })
        }, 500)
      },
      onError: () => {
        error({
          text: "Status tindakan gagal diganti",
        })
      },
    }
  )

  const onSubmit = (data) => {
    mutation.mutate(data)
  }

  return (
    <>
      <div ref={overlayContainerRef}>
        <ButtonLightStyled
          ref={overlayTargetRef}
          onClick={() => setShow(!show)}
          className="btn btn-icon btn-light-warning"
        >
          <TripleDotIcon />
        </ButtonLightStyled>
        <Overlay
          show={show}
          target={overlayTargetRef.current}
          container={overlayContainerRef.current}
          placement="left-start"
        >
          <Dropdown.Menu show={true}>
            <DropdownStatusStyled>
              <Dropdown.Item
                active={status === "unfinish"}
                onClick={() => {
                  setShow(false)
                  onSubmit("unfinish")
                }}
              >
                <DropdownChecklistIcon className="me-4" />
                <span>Belum Selesai</span>
              </Dropdown.Item>
              <Dropdown.Item
                active={status === "finish"}
                onClick={() => {
                  setShow(false)
                  onSubmit("finish")
                }}
              >
                <DropdownChecklistIcon className="me-4" />
                <span>Sudah Selesai</span>
              </Dropdown.Item>
            </DropdownStatusStyled>
          </Dropdown.Menu>
        </Overlay>
      </div>
    </>
  )
}

/**
 * Komponen toolbar halaman edit laboratorium dari semua user

 */
function Toolbar({ requestQuery }) {
  const navigate = useNavigate()
  const requestData = requestQuery.data
  const requestStatus = requestQuery.status

  return (
    <div className="toolbar mt-n3 mt-lg-0" id="kt_toolbar">
      <div className="container-fluid">
        <div className="row justify-content-between">
          <div className="col-sm-6 d-flex align-items-center mb-5 mb-sm-0">
            <ButtonLightStyled
              onClick={() => navigate(-1)}
              className="btn btn-icon btn-light-primary flex-shrink-0 me-8"
            >
              <PrimaryArrowLeftIcon />
            </ButtonLightStyled>
            {requestStatus === "success" && (
              <>
                <h1 className="fs-3 mb-0 me-4 text-truncate">
                  {requestData.unique_id}
                </h1>
                <div className="overflow-hidden">
                  <LaboratoryStatus status={requestData.status} />
                </div>
              </>
            )}
          </div>
          {requestStatus === "success" && (
            <div
              className="col-sm-6 d-flex justify-content-start justify-content-sm-end"
              style={{ zIndex: 9999 }}
            >
              <div className="d-flex">
                <DonwnlodPDFButton
                  name={`Rehab Medik - ${requestData?.unique_id}`}
                  url={`/visit/rehab/${requestData?.id}/print-pdf`}
                />
              </div>
              <div className="me-4">
                <UpdateStatusButton
                  id={requestData.id}
                  currentStatus={requestData.status}
                />
              </div>
              <ButtonDetailPatient patientId={requestData.visit_id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Komponen Download pdf
export function DonwnlodPDFButton({ name, url }) {
  const { status: pdfStatus, refetch: pdfRefetch } = useQuery(
    "downloadPDF",
    async () =>
      axios
        .get(url, {
          responseType: "blob",
        })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", `${name}.pdf`)
          document.body.appendChild(link)
          link.click()

          return res.data
        }),
    {
      enabled: false,
    }
  )

  return (
    <ButtonLightStyled
      onClick={() => pdfRefetch()}
      className="btn btn-icon btn-light-danger me-4"
      disabled={pdfStatus === "loading"}
    >
      <DangerDownloadIcon />
    </ButtonLightStyled>
  )
}

/**
 * Komponen komen halaman edit laboratorium dari semua user
 */
function Comment({ rehabId }) {
  const queryClient = useQueryClient()

  /**
   * Mengambil data komentar
   */
  const { data: commentData, status: commentStatus } = useQuery(
    `visit-rehab-${rehabId}-comment`,
    async () =>
      axios.get(`visit/rehab/${rehabId}/comment`).then((res) => res.data),
    {
      refetchInterval: 5000,
    }
  )

  /**
   * Mengirim komentar
   */
  const { mutate } = useMutation(async (data) =>
    axios
      .post(`/visit/rehab/${rehabId}/store-comment`, data)
      .then((res) => res.data)
  )

  /**
   * Konfigurasi formik komentar
   */
  const formik = useFormik({
    initialValues: {
      message: "",
    },
    validationSchema: Yup.object().shape({
      message: Yup.string().required("Kolom ini wajib untuk diisi"),
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(true)
      mutate(values, {
        onSuccess: function () {
          queryClient.invalidateQueries(`visit-rehab-${rehabId}-comment`)
          resetForm()
          setSubmitting(false)
          success({
            text: "Sudah terkirim",
          })
        },
        onError: function () {
          resetForm()
          setSubmitting(false)
          error({
            text: "Gagal terkirim",
          })
        },
      })
    },
  })

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex w-100 align-items-center justify-content-between">
            <h1 className="fs-3 m-0">Komentar</h1>
            <div className="rounded d-flex flex-center h-30px w-30px bg-light-primary">
              <div className="text-primary fw-bold">{commentData?.length}</div>
            </div>
          </div>
        </div>
        <div className="card-body overflow-auto mh-300px d-flex flex-column-reverse">
          {commentStatus === "loading" && <PrimaryLoader />}
          {commentStatus === "error" && (
            <div className="d-flex flex-column flex-center min-h-200px">
              <p className="w-200px text-center text-gray-600">Error...</p>
            </div>
          )}
          {commentStatus === "success" && (
            <>
              {commentData.length === 0 ? (
                <div className="d-flex flex-column flex-center min-h-200px">
                  <PrimaryChatIcon className="mb-5" />
                  <p className="w-200px text-center text-gray-600">
                    Saat ini belum ada komentar masuk dari pihak manapun
                  </p>
                </div>
              ) : (
                <>
                  {commentData.map(
                    /** @param {import("interfaces/message").Message} comment */
                    (comment, key) => {
                      if (comment.user_role.toLowerCase().includes("rehab")) {
                        return (
                          <React.Fragment key={key}>
                            <div className="rounded bg-primary p-4 mb-4 ">
                              <p className="text-white mb-1">
                                {comment.message}
                              </p>
                            </div>
                            <div className="d-flex justify-content-between">
                              <p>{truncate(comment.user_name, 15)}</p>
                              <small className="text-gray-600">
                                {comment.created_at}
                              </small>
                            </div>
                          </React.Fragment>
                        )
                      }
                      return (
                        <React.Fragment key={key}>
                          <div className="rounded bg-light-primary p-4 mb-4">
                            <p className="text-gray-800 mb-1">
                              {comment.message}
                            </p>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p>{truncate(comment.user_name, 15)}</p>
                            <small className="text-gray-600">
                              {comment.created_at}
                            </small>
                          </div>
                        </React.Fragment>
                      )
                    }
                  )}
                </>
              )}
            </>
          )}
        </div>
        <div className="card-footer">
          <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
            <div className="mb-4">
              <textarea
                {...formik.getFieldProps("message")}
                placeholder="Mulai atau balas komentar"
                rows={3}
                className={dynamicFormControlClass(formik, "message")}
              ></textarea>
            </div>
            <div className="d-flex justify-content-end">
              <ButtonLightStyled
                type="reset"
                className="btn btn-icon btn-light-warning me-3"
              >
                <WarningRestartIcon />
              </ButtonLightStyled>
              <button
                disabled={formik.isSubmitting || !formik.isValid}
                type="submit"
                className="btn btn-icon btn-primary"
              >
                <WhitePaperPlaneIcon />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
