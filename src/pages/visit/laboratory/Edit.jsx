import { defaultModules, defaults, error, success } from "@pnotify/core"
import "@pnotify/core/dist/PNotify.css"
import * as PNotifyMobile from "@pnotify/mobile"
import "@pnotify/mobile/dist/PNotifyMobile.css"
import "assets/css/custom-pnotify.css"
import { ReactComponent as WarningClockIcon } from "assets/icons/clock.svg"
import { ReactComponent as CancelIcon } from "assets/icons/cross-sign.svg"
import { ReactComponent as PrimaryChecklistIcon } from "assets/icons/dropdown-checklist.svg"
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg"
import { ReactComponent as PrimaryArrowLeftIcon } from "assets/icons/primary-arrow-left.svg"
import { ReactComponent as PrimaryChatIcon } from "assets/icons/primary-chat.svg"
import { ReactComponent as SearchIcon } from "assets/icons/search.svg"
import { ReactComponent as TripleDotIcon } from "assets/icons/triple-dot.svg"
import { ReactComponent as WarningPencilIcon } from "assets/icons/warning-pencil.svg"
import { ReactComponent as WarningRestartIcon } from "assets/icons/warning-restart.svg"
import { ReactComponent as WhitePaperPlaneIcon } from "assets/icons/white-paper-plane.svg"
import axios from "axios"
import clsx from "clsx"
import { ButtonLightStyled } from "components/Button"
import { DropdownStatusStyled } from "components/Dropdown"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import DeleteAction from "components/table/DeleteAction"
import DeleteModal from "components/table/DeleteModal"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import { HoverBorderedTrBg } from "components/table/TableRow"
import UpdateModal from "components/table/UpdateModal"
import { useFormik } from "formik"
import { dynamicFormControlClass } from "helpers/formik-helper"
import { truncate } from "helpers/string-helper"
import useBreadcrumb from "hooks/useBreadcrumb"
import useOnClickOutside from "hooks/useOnClickOutside"
import _ from "lodash"
import React, { useEffect, useRef, useState } from "react"
import { Dropdown, Overlay } from "react-bootstrap"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useLocation, useNavigate, useParams } from "react-router"
import { Link, useSearchParams } from "react-router-dom"
import * as Yup from "yup"
import ButtonDetailPatient from "../ButtonDetailPatient"
import { localeStatus } from "./Index"

/**
 * Konfigursi pnotify
 */
defaultModules.set(PNotifyMobile, {})
defaults.delay = 2000
defaults.sticker = false

/**
 * Skema untuk Breadcrumb
 */
const initialBreadCrumbJson = {
  title: "Kunjungan",
  items: [
    { text: "Kunjungan", path: "/" },
    {
      text: "Pelayanan",
      path: "/visit",
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
      text: "Detail",
      path: null,
    },
  ],
}

/**
 * Komponen utama halaman edit laboratory
 */
export default function Edit() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { id: visitId, laboratoryId, actionId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [breadCrumbJson, setBreadCrumbJson] = useState(initialBreadCrumbJson)
  const [initialValues, setInitialValues] = useState({})
  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
  })

  /**
   * Mengupdate skema breadcrumb
   */
  useBreadcrumb(breadCrumbJson)
  useEffect(() => {
    setBreadCrumbJson({
      title: "Kunjungan",
      items: [
        { text: "Kunjungan", path: "/" },
        {
          text: "Pelayanan",
          path: "/visit",
        },
        {
          text: "Laboratorium",
          path: `visit/${visitId}/laboratory`,
        },
        {
          text: "Permintaan",
          path: `visit/${visitId}/laboratory`,
        },
        {
          text: "Detail",
          path: null,
        },
      ],
    })
  }, [])

  /**
   * Mengambil data laboratorium
   */
  const laboratoryQuery = useQuery(
    `visit-${visitId}-laboratory-${laboratoryId}`,
    async () =>
      axios
        .get(`/visit/laboratorium/${laboratoryId}/edit`)
        .then((res) => res.data)
  )
  /** @type {import("interfaces/laboratorium").Laboratorium} */
  const laboratoryData = laboratoryQuery.data
  const laboratoryStatus = laboratoryQuery.status

  /**
   * Mengambil data permintaan laboratorium
   */
  const { data: actionData, status: actionStatus } = useQuery(
    [`visit-${visitId}-laboratorium-${laboratoryId}-action`, filter],
    async (key) =>
      axios
        .get(`/visit/laboratorium/${laboratoryId}/measure/listing`, {
          params: key.queryKey[1],
        })
        .then((res) => res.data),
    {
      onSuccess: function (data) {
        const initialValues = {}
        data.data.map((item) => {
          initialValues["order_number_" + item.id] = item.order_number ?? ""
        })
        if (Object.values(initialValues).length === data.data.length) {
          setInitialValues(initialValues)
        }
      },
    }
  )

  /**
   * Mengupdate urutan permintaan laboratorium
   */
  const { mutate } = useMutation(
    async (data) => {
      formik.setSubmitting(true)
      return axios
        .post(
          `visit/laboratorium/${laboratoryId}/measure/${data.actionId}/update-order`,
          data
        )
        .then((res) => res.data)
    },
    {
      onSuccess: function () {
        queryClient.invalidateQueries(
          `visit-${visitId}-laboratorium-${laboratoryId}-action`
        )
        success({
          text: "Urutan tindakan berhasil diupdate",
        })
        formik.setSubmitting(false)
      },
      /**@param {import("axios").AxiosError} err*/
      onError: function (err) {
        switch (err.response.status) {
          case 422:
            error({
              text: "Nomor urutan sudah digunakan",
            })
            break

          default:
            error({
              text: "Urutan tindakan gagal diupdate",
            })
            break
        }
        formik.setSubmitting(false)
      },
    }
  )

  /**
   * Konfigurasi formik
   */
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
  })

  /**
   * Logic pencarian
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

  return (
    <>
      <Toolbar laboratoryQuery={laboratoryQuery} />
      <div className="post d-flex flex-column-fluid pt-5 pt-lg-15" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              <div className="card mb-8 mb-md-0">
                <div className="card-header border-0 pt-6">
                  <div className="card-toolbar">
                    <div
                      className="d-flex justify-content-end"
                      data-kt-user-table-toolbar="base"
                    >
                      <Link
                        type="button"
                        to={
                          laboratoryData?.status === "done"
                            ? ""
                            : "action/create"
                        }
                        className={clsx({
                          "btn btn-primary": true,
                          "disabled cursor-not-allowed":
                            laboratoryData?.status === "done",
                        })}
                      >
                        <PlusIcon />
                        Tambah
                      </Link>
                    </div>
                  </div>
                  <div className="card-title">
                    <div className="d-flex align-items-center position-relative my-1">
                      <span className="svg-icon svg-icon-1 position-absolute ms-4">
                        <SearchIcon />
                      </span>
                      <input
                        type="text"
                        data-kt-user-table-filter="search"
                        className="form-control form-control-solid w-100 w-sm-250px ps-14"
                        placeholder="Search"
                        onKeyUp={(event) => {
                          setSearchValue.current(event.target.value)
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-body p-10">
                  {[actionStatus, laboratoryStatus].includes("loading") && (
                    <PrimaryLoader className="min-h-400px" />
                  )}
                  {[actionStatus, laboratoryStatus].includes("error") && (
                    <ErrorMessage className="min-h-400px" />
                  )}
                  {[actionStatus, laboratoryStatus].every(
                    (status) => status === "success"
                  ) && (
                    <>
                      <div className="table-responsive">
                        <table className="table">
                          <TableHeading
                            filterProp={[filter, setFilter]}
                            columns={[
                              {
                                name: "name",
                                heading: "Nama tindakan",
                                width: "45%",
                              },
                              {
                                name: "action_group",
                                heading: "Group",
                                width: "45%",
                              },
                              // {
                              //   name: "order_number",
                              //   heading: "Order",
                              //   width: "40%",
                              // },
                              {
                                heading: "",
                                width: "10%",
                                sort: false,
                              },
                            ]}
                          />
                          <tbody>
                            {actionData.data.length === 0 && (
                              <tr>
                                <td colSpan={4}>
                                  <center className="text-gray-600">
                                    Belum ada data yang dapat ditampilkan
                                  </center>
                                </td>
                              </tr>
                            )}
                            {actionData.data.map(
                              /** @param {import("interfaces/laboratoriumAction").LaboratoriumAction} action */
                              (action, key) => {
                                const dynamicBg =
                                  action.status === "finish"
                                    ? "#ecf7f6"
                                    : laboratoryData.status === "cancel"
                                    ? "#fbebf0"
                                    : ""

                                return (
                                  <HoverBorderedTrBg
                                    key={`data-table-${key}`}
                                    dynamicBg={dynamicBg}
                                    disabled={
                                      action.status === "finish" ||
                                      ["done", "cancel"].includes(
                                        laboratoryData.status
                                      )
                                    }
                                  >
                                    <td className="align-middle text-gray-700">
                                      {action.name}
                                    </td>
                                    <td className="align-middle text-gray-700">
                                      {action.action_group}
                                    </td>
                                    {/* <td className="align-middle text-gray-700">
                                      <div className="d-flex">
                                        <input
                                          className="form-control form-control-solid form-control-sm w-80px me-5"
                                          type="number"
                                          min="1"
                                          onKeyPress={(event) => {
                                            if (!/[1-9]/.test(event.key)) {
                                              event.preventDefault()
                                            }
                                          }}
                                          value={
                                            formik.values[
                                              "order_number_" + action.id
                                            ] ?? ""
                                          }
                                          onChange={(event) => {
                                            formik.setFieldValue(
                                              "order_number_" + action.id,
                                              event.target.value
                                            )
                                          }}
                                        />
                                        <ButtonLightStyled
                                          disabled={formik.isSubmitting}
                                          onClick={() =>
                                            mutate({
                                              _method: "PATCH",
                                              actionId: action.id,
                                              order_number:
                                                formik.values[
                                                  "order_number_" + action.id
                                                ]?.toString(),
                                            })
                                          }
                                          className="btn btn-icon btn-light-primary"
                                        >
                                          <PrimaryChecklistIcon />
                                        </ButtonLightStyled>
                                      </div>
                                    </td> */}
                                    <td className="align-middle">
                                      <DeleteAction
                                        onClick={() =>
                                          navigate(
                                            `action/${action.id}/delete?name=${action.name}`
                                          )
                                        }
                                      />
                                    </td>
                                  </HoverBorderedTrBg>
                                )
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                      <TableFooter
                        data={actionData}
                        filterProp={[filter, setFilter]}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <Comment />
            </div>
          </div>
        </div>
      </div>
      {location.pathname.includes(`action/${actionId}/delete`) && (
        <DeleteModal
          url={`/visit/laboratorium/${laboratoryId}/measure/${actionId}/destroy`}
          query={`visit-${visitId}-laboratorium-${laboratoryId}-action`}
          message={`Anda yakin ingin menghapus tindakan ${searchParams.get(
            "name"
          )}?`}
          successMessage={`Anda telah menghapus tindakan ${searchParams.get(
            "name"
          )} dari basis data!`}
        />
      )}
    </>
  )
}

/**
 * Komponen komen halaman edit laboratorium
 */
function Comment() {
  const queryClient = useQueryClient()
  const { laboratoryId } = useParams()

  /**
   * Mengambil data komentar
   */
  const { data: commentData, status: commentStatus } = useQuery(
    `visit-laboratorium-${laboratoryId}-comment`,
    async () =>
      axios
        .get(`visit/laboratorium/${laboratoryId}/comment`)
        .then((res) => res.data),
    {
      refetchInterval: 5000,
    }
  )

  /**
   * Mengirim komentar
   */
  const { mutate } = useMutation(async (data) =>
    axios
      .post(`/visit/laboratorium/${laboratoryId}/store-comment`, data)
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
          queryClient.invalidateQueries(
            `visit-laboratorium-${laboratoryId}-comment`
          )
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
          {commentStatus === "error" && <ErrorMessage />}
          {commentStatus === "success" && (
            <>
              {commentData.length === 0 ? (
                <div className="d-flex flex-column flex-center min-h-200px">
                  <PrimaryChatIcon className="mb-5" />
                  <p className="w-200px text-center text-gray-600">
                    Belum ada komentar dari laboratorium
                  </p>
                </div>
              ) : (
                <>
                  {commentData.map(
                    /** @type {import("interfaces/message").Message} */
                    (comment, key) => {
                      if (!comment.user_role.toLowerCase().includes("lab")) {
                        return (
                          <React.Fragment key={key}>
                            <div className="rounded bg-primary p-4 mb-4">
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

/**
 * Komponen toolbar halaman edit laboratorium
 * @param {{
 * laboratoryQuery: import("react-query").UseQueryResult
 * }}
 */
function Toolbar({ laboratoryQuery }) {
  const navigate = useNavigate()
  /** @type {import("interfaces/laboratorium").Laboratorium} */
  const laboratoryData = laboratoryQuery.data
  const laboratoryStatus = laboratoryQuery.status

  return (
    <div
      className="toolbar mt-n3 mt-lg-0"
      style={{ zIndex: 99 }}
      id="kt_toolbar"
    >
      <div className="container-fluid">
        <div className="row justify-content-between py-2 py-md-0">
          <div className="col-sm-9 d-flex align-items-center mb-3 mb-sm-0 text-truncate">
            <ButtonLightStyled
              onClick={() => navigate(-1)}
              className="btn btn-icon btn-light-primary flex-shrink-0 me-8"
            >
              <PrimaryArrowLeftIcon />
            </ButtonLightStyled>
            {laboratoryStatus === "success" && (
              <>
                <h1 className="fs-3 mb-0 me-4">{laboratoryData.unique_id}</h1>
                <LaboratoryStatus status={laboratoryData.status} />
              </>
            )}
          </div>
          <div
            className="col-sm-3 d-flex justify-content-start justify-content-sm-end"
            style={{ zIndex: 9999 }}
          >
            {laboratoryStatus === "success" && (
              <UpdateStatusButton
                id={laboratoryData.id}
                overlayPlacement="bottom-end"
                currentStatus={laboratoryData.status}
              />
            )}
            <ButtonDetailPatient />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Komponen status laboratorium
 * @param {{status: import("interfaces/laboratorium").Status}}
 */
export function LaboratoryStatus({ status }) {
  switch (status) {
    case "waiting":
      return (
        <div className={`badge px-4 py-2 bg-light-warning text-warning me-2`}>
          Menunggu
        </div>
      )

    case "progress":
      return (
        <div className={`badge px-4 py-2 bg-light-info text-info me-2`}>
          Proses
        </div>
      )

    case "fixing":
      return (
        <div className={`badge px-4 py-2 bg-light-warning text-warning me-2`}>
          Perbaikan
        </div>
      )

    case "done":
      return (
        <div className={`badge px-4 py-2 bg-light-primary text-primary me-2`}>
          Selesai
        </div>
      )

    case "cancel":
      return (
        <div className={`badge px-4 py-2 bg-light-danger text-danger me-2`}>
          Batalkan
        </div>
      )

    default:
      return <></>
  }
}

/**
 * Tombol untuk mengupdate status laboratorium
 * @param {{
 * id: Number
 * currentStatus: String
 * }}
 */
export function UpdateStatusButton({ id, currentStatus }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { id: visitId, laboratoryId, status } = useParams()
  const [show, setShow] = useState(false)
  const overlayContainerRef = useRef()
  const overlayTargetRef = useRef()
  useOnClickOutside(overlayContainerRef, () => setShow(false))

  return (
    <>
      {location.pathname.includes(
        `/laboratory/${id}/edit/status/${status}`
      ) && (
        <UpdateModal
          url={`/visit/laboratorium/${id}/update-status`}
          data={{ status: status }}
          query={`visit-${visitId}-laboratory-${laboratoryId}`}
          message={`
            Anda yakin ingin mengganti status permintaan menjadi ${localeStatus(
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
          className="btn btn-icon btn-light-warning me-3"
        >
          <TripleDotIcon />
        </ButtonLightStyled>
        <Overlay
          show={show}
          target={overlayTargetRef.current}
          container={overlayContainerRef.current}
          placement="bottom-end"
        >
          <Dropdown.Menu show={true} className="py-5 w-200px">
            <DropdownStatusStyled
              disabled={["done", "cancel"].includes(currentStatus)}
            >
              <Dropdown.Item
                active={currentStatus === "waiting"}
                className="d-flex align-items-center px-8 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(`edit/status/waiting`)
                }}
              >
                <WarningClockIcon className="me-4" />
                <span>Menunggu</span>
              </Dropdown.Item>
              <Dropdown.Item
                active={currentStatus === "fixing"}
                className="d-flex align-items-center px-8 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(`edit/status/fixing`)
                }}
              >
                <WarningPencilIcon className="me-4" />
                <span>Perbaikan</span>
              </Dropdown.Item>
              <Dropdown.Item
                active={currentStatus === "cancel"}
                className="d-flex align-items-center px-8 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(`edit/status/cancel`)
                }}
              >
                <CancelIcon className="me-4" />
                <span>Batalkan</span>
              </Dropdown.Item>
            </DropdownStatusStyled>
          </Dropdown.Menu>
        </Overlay>
      </div>
    </>
  )
}
