import { ReactComponent as BlueGlassIcon } from "assets/icons/blue-glass.svg"
import { ReactComponent as PrimaryChecklistIcon } from "assets/icons/checklist.svg"
import { ReactComponent as WarningClockIcon } from "assets/icons/clock.svg"
import { ReactComponent as CancelIcon } from "assets/icons/cross-sign.svg"
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg"
import { ReactComponent as ArrowRightIcon } from "assets/icons/primary-arrow-right.svg"
import { ReactComponent as SearchIcon } from "assets/icons/search.svg"
import { ReactComponent as TripleDotIcon } from "assets/icons/triple-dot.svg"
import { ReactComponent as WarningExclamationIcon } from "assets/icons/warning-exclamation.svg"
import { ReactComponent as WarningPencilIcon } from "assets/icons/warning-pencil.svg"
import { ReactComponent as WarningQuestionMarkIcon } from "assets/icons/warning-question-mark.svg"
import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import { DropdownStatusStyled } from "components/Dropdown"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import { HoverBorderedTrBg } from "components/table/TableRow"
import UpdateModalRecipe from "components/table/UpdateModalRecipe"
import { useFormik } from "formik"
import { isTruncated, lowerSnake, truncate } from "helpers/string-helper"
import useOnClickOutside from "hooks/useOnClickOutside"
import _ from "lodash"
import { useRef, useState } from "react"
import {
  Dropdown,
  Overlay,
  OverlayTrigger,
  Popover,
  Tooltip,
} from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQuery, useQueryClient } from "react-query"
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom"
import styled from "styled-components"
import * as Yup from "yup"
import useBreadcrumb from "../../../hooks/useBreadcrumb"
import useSidebarActiveMenu from "../../../hooks/useSidebarActiveMenu"
import DetailPatient from "../DetailPatient"
import { HistoryMedicDownloadButton } from "../HistoryMedicDownloadButton"
import { breadCrumbJson } from "../soap/Index"
import TabMenu from "../TabMenu"

/**
 * Styling Dropdown item
 */
export const DropdownItemStyled = styled.div`
  span {
    color: #7e8299;
    font-size: 13px;
  }

  .active,
  &:hover {
  }
`

/**
 * Menerjemahkan status
 * @param {import("interfaces/laboratorium").Status} status
 * @returns
 */
export function localeStatus(status) {
  switch (status) {
    case "waiting":
      return "Menunggu"

    case "fixing":
      return "Perbaikan"

    case "cancel":
      return "Dibatalkan"

    case "done":
      return "Selesai"

    case "progress":
      return "Diproses"

    default:
      return status
  }
}

/**
 * Mengganti background row table berdasarkan status
 * @param {import("interfaces/laboratorium").Status} status
 * @returns
 */
function dynamicRowBg(status) {
  switch (status) {
    case "fixing":
      return "#fff7ee"

    case "done":
      return "#ecf7f6"

    case "cancel":
      return "#fbebf0"

    default:
      return ""
  }
}

/**
 * Skema untuk create resep
 */
const createResepSchema = Yup.object().shape({
  type: Yup.array().min(1, "Anda wajib memilih minimal 1 resep"),
})

/**
 * Skema data awal untuk formik
 */
const initialValues = {
  type: [],
}

/**
 * Komponen utama untuk halaman receipt
 */
export default function Index() {
  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("visit")
  const { id: visitId } = useParams()
  const location = useLocation()
  const [isSearching, setIsSearching] = useState(false)

  const [submitStatus, setSubmitStatus] = useState({})
  const navigate = useNavigate()

  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
  })
  const createdByTruncateLength = 15

  const setSearchValue = useRef(
    _.debounce((value) => {
      setFilter({
        ...filter,
        page: 1,
        search: value,
      })
    }, 1000)
  )

  const { data: recipeData, status: recipeStatus } = useQuery(
    [`visit-${visitId}-recipe`, filter],
    async (key) =>
      axios
        .get(`/visit/${visitId}/recipe/listing`, {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
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
              setSubmitStatus({})
            } else {
              setSubmitStatus({})
            }
          }}
          confirmBtnText="OK mengerti"
        >
          <div className="text-gray-600 mb-5">{submitStatus?.message}</div>
        </SweetAlert>
      )}

      <div className="post d-flex flex-column-fluid" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          <DetailPatient id={visitId} />
          <div className="card">
            <TabMenu isSearching={isSearching} />
            <div className="card-header border-0 pt-6">
              <div className="card-toolbar">
                <div className="me-3">
                  <CreateButton
                    submitStatusProp={[submitStatus, setSubmitStatus]}
                  />
                </div>
                <HistoryMedicDownloadButton
                  downloadUrl={`/visit/${visitId}/recipe/print-pdf`}
                  downloadName="Histori E-resep.pdf"
                  previewUrl={`/visit/${visitId}/recipe/preview-pdf`}
                />
              </div>
              <div className="card-title">
                <div className="d-flex align-items-center position-relative my-1">
                  <span className="svg-icon svg-icon-1 position-absolute ms-4">
                    <SearchIcon />
                  </span>
                  <input
                    onFocus={() => setIsSearching(true)}
                    onBlur={() => setIsSearching(false)}
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
              {/* <ComingSoon /> */}
              {recipeStatus === "loading" && (
                <PrimaryLoader className="min-h-300px" />
              )}
              {recipeStatus === "error" && (
                <ErrorMessage className="min-h-300px" />
              )}
              {recipeStatus === "success" && (
                <>
                  <div className="table-responsive">
                    <table className="table" style={{ minWidth: "1200px" }}>
                      <TableHeading
                        filterProp={[filter, setFilter]}
                        columns={[
                          {
                            name: "unique_id",
                            heading: "ID Permintaan",
                            width: "7%",
                          },
                          {
                            name: "created_at",
                            heading: "Tanggal dibuat",
                            width: "15%",
                          },
                          {
                            name: "info",
                            heading: "Terdapat",
                            width: "15%",
                          },
                          {
                            name: "type",
                            heading: "Jenis Resep",
                            width: "17%",
                          },
                          {
                            name: "created_by",
                            heading: "Dibuat oleh",
                            width: "12%",
                          },
                          {
                            name: "status",
                            heading: "Status",
                            width: "10%",
                          },
                          {
                            name: "nota_number",
                            heading: "Kode Nota",
                            width: "10%",
                          },

                          {
                            name: "action",
                            heading: "",
                            width: "5%",
                            sort: false,
                          },
                        ]}
                      />
                      <tbody>
                        {recipeData.data.length === 0 && (
                          <tr>
                            <td className="py-10 align-middle" colSpan={7}>
                              <center className="text-gray-600">
                                Belum ada data yang dapat ditampilkan
                              </center>
                            </td>
                          </tr>
                        )}
                        {recipeData.data.map((data, key) => {
                          /** @type {import("interfaces/laboratorium").Laboratorium} */
                          const recipe = data

                          return (
                            <HoverBorderedTrBg
                              key={`data-table-${key}`}
                              dynamicBg={dynamicRowBg(recipe.status)}
                            >
                              <td className="align-middle text-gray-700">
                                {recipe.unique_id}
                              </td>
                              <td className="align-middle text-gray-700">
                                {recipe.created_at}
                              </td>
                              <td className="align-middle text-gray-700">
                                <div className="d-flex align-items-center">
                                  <span className="me-3">{recipe.info}</span>
                                  {recipe.is_read_doc === 0 && (
                                    <WarningExclamationIcon />
                                  )}
                                </div>
                              </td>
                              <td className="align-middle text-gray-700">
                                <RecipeTypeLabel type={recipe.type} />
                              </td>
                              <td className="align-middle text-gray-700">
                                {data.created_by &&
                                isTruncated(
                                  data.created_by,
                                  createdByTruncateLength
                                ) ? (
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip id={`tooltip-${key}`}>
                                        {data.created_by}
                                      </Tooltip>
                                    }
                                  >
                                    <span>
                                      {truncate(
                                        data.created_by,
                                        createdByTruncateLength
                                      )}
                                    </span>
                                  </OverlayTrigger>
                                ) : (
                                  <>{data.created_by}</>
                                )}
                              </td>
                              <td className="align-middle text-gray-700">
                                {recipe.status === "waiting" && (
                                  <WarningClockIcon />
                                )}
                                {recipe.status === "progress" && (
                                  <BlueGlassIcon />
                                )}
                                {recipe.status === "fixing" && (
                                  <WarningPencilIcon />
                                )}
                                {recipe.status === "done" && (
                                  <PrimaryChecklistIcon />
                                )}
                                {recipe.status === "cancel" && <CancelIcon />}
                              </td>
                              <td className="align-middle text-gray-700">
                                {recipe.nota_number}
                              </td>
                              <td className="align-middle text-gray-700">
                                <div className="d-flex">
                                  <UpdateRecipeStatusButton
                                    id={recipe.id}
                                    statusRecipe={recipe.status}
                                    disabled={
                                      recipe.allow === 0 ||
                                      ["done", "cancel"].includes(recipe.status)
                                    }
                                  />
                                  <ButtonLightStyled
                                    disabled={recipe.allow === 0}
                                    onClick={() =>
                                      // navigate(
                                      //   location.pathname + "/" + recipe.id + "/concoction"
                                      // )
                                      navigate(
                                        updateRoute(
                                          location,
                                          recipe.id,
                                          recipe.type
                                        )
                                      )
                                    }
                                    className="btn btn-icon btn-light-primary"
                                  >
                                    <ArrowRightIcon />
                                  </ButtonLightStyled>
                                </div>
                              </td>
                            </HoverBorderedTrBg>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <TableFooter
                    data={recipeData}
                    filterProp={[filter, setFilter]}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// update status
function UpdateRecipeStatusButton({ id, disabled, statusRecipe }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { id: visitId, status } = useParams()
  const [show, setShow] = useState(false)
  const overlayContainerRef = useRef()
  const overlayTargetRef = useRef()
  useOnClickOutside(overlayContainerRef, () => setShow(false))
  return (
    <>
      {location.pathname.includes(`/receipt/${id}/status/${status}`) && (
        <UpdateModalRecipe
          url={`/visit/recipe/${id}/update-status`}
          data={{ status: status }}
          query={`visit-${visitId}-recipe`}
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
          className="btn btn-icon btn-light-warning me-2"
        >
          <TripleDotIcon />
        </ButtonLightStyled>
        <Overlay
          show={show}
          target={overlayTargetRef.current}
          container={overlayContainerRef.current}
          placement="left-start"
        >
          <Dropdown.Menu show={true} className="py-5 w-200px">
            <DropdownStatusStyled disabled={disabled}>
              <Dropdown.Item
                active={statusRecipe === "waiting"}
                className="d-flex align-items-center px-8 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(`${id}/status/waiting`)
                }}
              >
                <WarningClockIcon className="me-4" />
                <span>Menunggu</span>
              </Dropdown.Item>
              <Dropdown.Item
                active={statusRecipe === "fixing"}
                className="d-flex align-items-center px-8 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(`${id}/status/fixing`)
                }}
              >
                <WarningPencilIcon className="me-4" />
                <span>Perbaikan</span>
              </Dropdown.Item>
              <Dropdown.Item
                active={statusRecipe === "cancel"}
                className="d-flex align-items-center px-8 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(`${id}/status/cancel`)
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

// Buat resep
function CreateButton({ submitStatusProp }) {
  const overlayTarget = useRef()
  const overlayContainer = useRef()
  const queryClient = useQueryClient()
  const { id: visitId } = useParams()
  const [createToastShow, setCreateToastShow] = useState(false)
  const [submitStatus, setSubmitStatus] = submitStatusProp
  const { allPermissions } = useOutletContext()
  useOnClickOutside(overlayContainer, () => setCreateToastShow(false))

  const mutation = useMutation(
    async (data) => {
      return axios
        .post(`visit/${visitId}/recipe/store`, data)
        .then((res) => res.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`visit-${visitId}-recipe`)
        setSubmitStatus({
          status: "success",
          message: "Data telah berhasil disimpan ke dalam basis data.",
        })
        formik.resetForm()
        formik.setSubmitting(false)
      },
      onError: () => {
        setSubmitStatus({
          status: "danger",
          message:
            "Maaf, sepertinya ada beberapa kesalahan yang terdeteksi, silakan coba lagi.",
        })
        formik.setSubmitting(false)
      },
    }
  )

  const {
    data: recipes,
    status: recipeStatus,
    refetch: recipeRefetch,
    isFetching: recipeIsFething,
  } = useQuery(
    "recipes",
    async () => {
      return axios.get("visit/recipe/listing-resep").then((res) => res.data)
    },
    { enabled: false }
  )

  const formik = useFormik({
    initialValues,
    validationSchema: createResepSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true)
      mutation.mutate({
        type: values.type,
      })
    },
  })

  return (
    <div ref={overlayContainer}>
      <button
        ref={overlayTarget}
        onClick={() => {
          if (!createToastShow) {
            recipeRefetch().then(function () {
              setCreateToastShow(!createToastShow)
            })
          } else {
            setCreateToastShow(!createToastShow)
          }
        }}
        disabled={
          recipeIsFething ||
          !allPermissions.includes("tambah permintaan resep di kunjungan")
        }
        className="btn btn-primary"
      >
        {!recipeIsFething && (
          <>
            <PlusIcon /> Tambah
          </>
        )}
        {recipeIsFething && (
          <>
            <PlusIcon /> Loading
          </>
        )}
      </button>
      <Overlay
        container={overlayContainer.current}
        target={overlayTarget.current}
        show={createToastShow}
        placement="bottom-start"
      >
        <Popover
          placement="bottom-start"
          className="w-600px"
          style={{ zIndex: 5 }}
        >
          <Popover.Header className="p-5 d-flex justify-content-between align-items-center">
            <h1 className="fs-3 mb-0">Tambah Resep</h1>
            <OverlayTrigger
              placement="right"
              overlay={
                <Popover className="card shadow-sm w-300px">
                  <div className="card-body">
                    <div className="text-center">
                      Saat menambahkan resep baru setidaknya ada minimal 1 jenis
                      resep yang harus Anda pilih.
                    </div>
                  </div>
                </Popover>
              }
            >
              <WarningQuestionMarkIcon />
            </OverlayTrigger>
          </Popover.Header>
          <Popover.Body className="p-5">
            <form onSubmit={formik.handleSubmit} method="post">
              {recipeStatus === "loading" && (
                <div className="d-flex flex-center h-100px">
                  <p className="text-gray-600">Loading...</p>
                </div>
              )}
              {recipeStatus === "error" && (
                <div className="d-flex flex-center h-100px">
                  <p className="text-gray-600">Error...</p>
                </div>
              )}
              {recipeStatus === "success" &&
                recipes.map((template, key) => (
                  <div key={key} className="form-group">
                    <div className="form-check form-check-solid form-check-custom form-check-solid form-check-inline mb-5">
                      <input
                        {...formik.getFieldProps("type")}
                        type="checkbox"
                        name="type"
                        id={lowerSnake(template.type)}
                        value={template.type}
                        className="form-check-input text-gray-600 me-5"
                      />
                      <label
                        htmlFor={lowerSnake(template.type)}
                        className="cursor-pointer text-gray-600"
                      >
                        {template.type}
                      </label>
                    </div>
                  </div>
                ))}
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-white mb-5 me-4"
                  onClick={() => setCreateToastShow(false)}
                >
                  <span className="indicator-label fw-medium">Batal</span>
                </button>
                <button
                  type="submit"
                  className="btn btn-primary mb-5"
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  {!formik.isSubmitting && (
                    <span className="indicator-label fw-medium">Buat</span>
                  )}
                  {formik.isSubmitting && (
                    <span
                      className="indicator-progress text-truncate"
                      style={{ display: "block" }}
                    >
                      Please wait...
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  )
}

// Label Warna untuk resep
export function RecipeTypeLabel({ type }) {
  return (
    <>
      {type.split(", ").map((val, key) => {
        let color = "primary"
        switch (val) {
          case "Racikan":
            color = "warning"
            break

          case "Non Racikan":
            color = "primary"
            break

          default:
            color = "primary"
            break
        }

        return (
          <div
            key={key}
            className={`badge px-4 py-2 bg-light-${color} text-${color} me-2 mb-1`}
          >
            {val}
          </div>
        )
      })}
    </>
  )
}

// Pengaturan Route untuk masuk ke detail Racikan atau Non Racikan
function updateRoute(location, recipeId, recipeType) {
  const recipeTypeSplit = recipeType && recipeType.split(",")

  if (recipeTypeSplit.length < 2 && recipeTypeSplit[0] === "Non Racikan") {
    return location.pathname + "/" + recipeId + "/non-concoction"
  } else {
    return location.pathname + "/" + recipeId + "/concoction"
  }
}
