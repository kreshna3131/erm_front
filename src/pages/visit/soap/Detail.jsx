import { ReactComponent as DropdownChecklistIcon } from "assets/icons/dropdown-checklist.svg"
import { ReactComponent as Plus } from "assets/icons/plus.svg"
import { ReactComponent as ArrowLeftIcon } from "assets/icons/primary-arrow-left.svg"
import { ReactComponent as PrimaryPencilIcon } from "assets/icons/primary-pencil.svg"
import { ReactComponent as Search } from "assets/icons/search.svg"
import { ReactComponent as TripleDotIcon } from "assets/icons/triple-dot.svg"
import axios from "axios"
import clsx from "clsx"
import { ButtonLightStyled } from "components/Button"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import { HoverBorderedTrBg } from "components/table/TableRow"
import UpdateModal from "components/table/UpdateModal"
import { useFormik } from "formik"
import { localeStatus } from "helpers/helper"
import { globalStyle } from "helpers/react-select"
import { isTruncated, truncate } from "helpers/string-helper"
import useBreadcrumb from "hooks/useBreadcrumb"
import useOnClickOutside from "hooks/useOnClickOutside"
import _ from "lodash"
import { useEffect, useRef, useState } from "react"
import { Dropdown, Overlay, OverlayTrigger, Tooltip } from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQuery, useQueryClient } from "react-query"
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router"
import Select from "react-select"
import * as Yup from "yup"
import DetailPatient, { DropdownItemStyled } from "../DetailPatient"
import { FloatingActionButton } from "../Index"
import { dynamicRowBg } from "../laboratory/Index"
import {
  AssessmentTypeLabel,
  CreateButton,
  CreateCovidAssessmentButton,
  CreateGlobalAssessmentButton,
} from "./Index"

/**
 * Skema create assesment
 */
const createAssesmentSchema = Yup.object().shape({
  id: Yup.number().required("Anda wajib memilih minimal 1 tipe"),
})

/**
 * Komponen utama untuk halaman detail
 */
export default function Index() {
  const location = useLocation()
  const navigate = useNavigate()
  const { allPermissions } = useOutletContext()
  const { id: visitId, soapId } = useParams()
  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
  })

  /**
   * Update skema menu breadcrumb
   */
  const [breadCrumbJson, setBreadCrumbJson] = useState({
    title: "Home",
    items: [],
  })
  useEffect(() => {
    if (visitId) {
      setBreadCrumbJson({
        title: "Kunjungan",
        items: [
          { text: "Kunjungan", path: "/visit" },
          {
            text: "Pelayanan",
            path: `/visit/${visitId}/soap`,
          },
          {
            text: "SOAP",
            path: null,
          },
        ],
      })
    }
  }, [visitId])
  useBreadcrumb(breadCrumbJson)

  /**
   * Mengambil data asesmen
   */
  const { data: assessmentData, status: assessmentStatus } = useQuery(
    [`visit-${visitId}-soap-${soapId}-assessment`, filter],
    async (key) => {
      return axios
        .get(`visit/${visitId}/soap/${soapId}/assesment/listing`, {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
    }
  )

  /**
   * Mengambil data soap
   */
  const { data: soapData, status: soapStatus } = useQuery(
    `visit-${visitId}-soap-${soapId}-edit`,
    async (key) => {
      return axios
        .get(`visit/${visitId}/soap/${soapId}/edit`)
        .then((res) => res.data)
    }
  )

  /**
   * Mengambil data logic tombol
   */
  const buttonQuery = useQuery(
    `visit-${visitId}-soap-check-button`,
    async () => {
      return axios
        .get(`/visit/${visitId}/soap/check-button`)
        .then((res) => res.data)
    }
  )
  const buttonData = buttonQuery.data
  const buttonStatus = buttonQuery.status

  /**
   * Logic pencarian soap
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
    <div className="post d-flex flex-column-fluid" id="kt_post">
      <div id="kt_content_container" className="container-fluid">
        <DetailPatient id={visitId} updateStatus={false} />
        <div className="card">
          <div className="card-header border-0 px-10 bg-primary">
            <div className="d-flex flex-center">
              {soapStatus === "loading" && (
                <div className="d-flex flex-center">
                  <p className="mb-0 text-white">Loading ...</p>
                </div>
              )}
              {soapStatus === "error" && (
                <div className="d-flex flex-center">
                  <p className="mb-0 text-white">Error ...</p>
                </div>
              )}
              {soapStatus === "success" && (
                <h1 className="mb-0 text-white">
                  # SOAP {soapData.soap_number}
                </h1>
              )}
            </div>
          </div>
          <div className="card-header border-0 pt-6">
            <div className="card-toolbar">
              {buttonStatus === "success" && (
                <>
                  <ButtonLightStyled
                    onClick={() => navigate(-1)}
                    className="btn btn-icon btn-light-primary me-5"
                  >
                    <ArrowLeftIcon />
                  </ButtonLightStyled>
                  <CreateCovidAssessmentButton
                    disabled={
                      buttonData.is_create ||
                      !allPermissions.includes("tambah assesment covid")
                    }
                    hidden={["global", "assesment"].includes(buttonData.action)}
                  />
                  <CreateGlobalAssessmentButton
                    disabled={
                      buttonData.is_create ||
                      !allPermissions.includes("tambah assesment global")
                    }
                    hidden={["covid", "assesment"].includes(buttonData.action)}
                  />
                  <CreateButton
                    disabled={buttonData.is_create}
                    hidden={["covid", "global"].includes(buttonData.action)}
                  />
                </>
              )}
            </div>
            <div className="card-title">
              <div className="d-flex align-items-center position-relative my-1">
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
            {assessmentStatus === "loading" && (
              <PrimaryLoader className="min-h-300px" />
            )}
            {assessmentStatus === "error" && (
              <ErrorMessage className="min-h-300px" />
            )}
            {assessmentStatus === "success" && (
              <div className="position-relative">
                <FloatingActionButton length={assessmentData.data.length}>
                  {assessmentData.data.map((assessment, key) => (
                    <ButtonLightStyled
                      key={key}
                      onClick={() =>
                        navigate(
                          location.pathname + "/document/" + assessment.id
                        )
                      }
                      className="btn btn-light-primary btn-icon"
                    >
                      <PrimaryPencilIcon />
                    </ButtonLightStyled>
                  ))}
                </FloatingActionButton>
                <div className="table-responsive">
                  <table
                    className="table"
                    style={{ marginLeft: "80px", minWidth: "1300px" }}
                  >
                    <TableHeading
                      filterProp={[filter, setFilter]}
                      columns={[
                        {
                          name: "type",
                          heading: "Jenis assesmen",
                          width: "10%",
                        },
                        {
                          name: "title",
                          heading: "Judul dokumen utama",
                          width: "25%",
                        },
                        {
                          name: "document",
                          heading: "Jumlah",
                          width: "12.5%",
                        },
                        {
                          name: "user",
                          heading: "Dibuat oleh",
                          width: "12.5%",
                        },
                        {
                          name: "role",
                          heading: "Role",
                          width: "5%",
                        },
                        {
                          name: "created_at",
                          heading: "Tanggal dibuat",
                          width: "15%",
                        },
                        {
                          name: "updated_at",
                          heading: "Terakhir diubah",
                          width: "15%",
                        },
                        {
                          name: "user",
                          heading: "",
                          width: "5%",
                          sort: false,
                        },
                      ]}
                    />
                    <tbody>
                      {assessmentData?.data.length === 0 && (
                        <tr>
                          <td className="py-10 align-middle" colSpan={7}>
                            <center className="text-gray-600">
                              Belum ada data yang dapat ditampilkan
                            </center>
                          </td>
                        </tr>
                      )}
                      {assessmentData?.data.map((assessment, key) => {
                        return (
                          <HoverBorderedTrBg
                            key={`data-table-${key}`}
                            dynamicBg={dynamicRowBg(assessment.status)}
                          >
                            <td className="align-middle text-gray-700">
                              <AssessmentTypeLabel type={assessment.type} />
                            </td>
                            <td className="align-middle text-gray-700">
                              {assessment.title}
                            </td>
                            <td className="align-middle text-gray-700">
                              {assessment.document}
                            </td>
                            <td className="align-middle text-gray-700">
                              {assessment.user &&
                              isTruncated(assessment.user, 15) ? (
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id={`tooltip-${key}`}>
                                      {assessment.user}
                                    </Tooltip>
                                  }
                                >
                                  <span>{truncate(assessment.user, 15)}</span>
                                </OverlayTrigger>
                              ) : (
                                <>{assessment.user}</>
                              )}
                            </td>
                            <td className="align-middle text-gray-700">
                              {assessment.role}
                            </td>
                            <td className="align-middle text-gray-700">
                              {assessment.created_at}
                            </td>
                            <td className="align-middle text-gray-700">
                              {assessment.updated_at}
                            </td>
                            <td className="align-middle text-gray-700">
                              <UpdateAssessmentStatusButton
                                id={assessment.id}
                                disabled={assessment.allow === 0}
                                currentStatus={assessment.status}
                              />
                            </td>
                          </HoverBorderedTrBg>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <TableFooter
                  data={assessmentData}
                  filterProp={[filter, setFilter]}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Komponen untuk membuat asesmen
 * @param {{disabled: Boolean}}
 */
function CreateAssessmentButton({ disabled }) {
  const queryClient = useQueryClient()
  const overlayTargetRef = useRef()
  const overlayContainerRef = useRef()
  const { id: visitId, soapId } = useParams()
  const [createToastShow, setCreateToastShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({})
  useOnClickOutside(overlayContainerRef, () => setCreateToastShow(false))

  /**
   * Mengambil data template
   */
  const {
    data: templates,
    status: templateStatus,
    refetch: templateRefetch,
  } = useQuery(
    "templates",
    async () => {
      return axios.get("visit/soap/list-template").then((res) => res.data)
    },
    { enabled: false }
  )

  /**
   * Konfigurasi formik
   */
  const formik = useFormik({
    initialValues: { id: "" },
    validationSchema: createAssesmentSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true)
      setLoading(true)
      mutate({
        assesment: values.id,
      })
    },
  })

  /**
   * Menyimpan soap
   */
  const { mutate } = useMutation(
    async (data) => {
      setLoading(true)
      return axios
        .post(`/visit/${visitId}/soap/${soapId}/assesment/store`, data)
        .then((res) => res.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          `visit-${visitId}-soap-${soapId}-assessment`
        )
        setSubmitStatus({
          status: "success",
          message: "Data telah berhasil disimpan ke dalam basis data.",
        })
        setLoading(false)
        formik.setSubmitting(false)
        formik.resetForm()
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
            setSubmitStatus({})
            setCreateToastShow(false)
          }}
          confirmBtnText="OK mengerti"
        >
          <div className="text-gray-600 mb-5">{submitStatus?.message}</div>
        </SweetAlert>
      )}
      <div ref={overlayContainerRef}>
        <button
          disabled={disabled}
          ref={overlayTargetRef}
          onClick={() => {
            templateRefetch()
            setCreateToastShow(!createToastShow)
          }}
          className={clsx("btn btn-primary", {
            "cursor-not-allowed": disabled,
          })}
          style={{ pointerEvents: "visible" }}
        >
          <Plus /> Assesmen
        </button>
        <Overlay
          target={overlayTargetRef.current}
          container={overlayContainerRef.current}
          show={createToastShow}
          placement="bottom-start"
        >
          <div className="card mt-2 shadow-sm w-300px" style={{ zIndex: 99 }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h1 className="fs-3 mb-0">Tambah Assesmen</h1>
            </div>
            <div className="card-body">
              <p className="fs-6 text-gray-600">Jenis Assesmen</p>
              <form action="" onSubmit={formik.handleSubmit} method="post">
                <Select
                  styles={globalStyle}
                  placeholder="Select"
                  onBlur={() =>
                    formik.setTouched({
                      ...formik.touched,
                      ...{
                        id: true,
                      },
                    })
                  }
                  onChange={(option) =>
                    formik.setValues({
                      ...formik.values,
                      ...{
                        id: option.value,
                      },
                    })
                  }
                  options={templates?.map((template) => ({
                    value: template.id,
                    label: "Assesment " + template.type,
                  }))}
                  components={{
                    IndicatorSeparator: "",
                  }}
                  isLoading={templateStatus === "loading"}
                  name="type"
                />
                <div className="d-flex justify-content-end mt-5">
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
                    {!loading && (
                      <span className="indicator-label fw-medium">Simpan</span>
                    )}
                    {loading && (
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
            </div>
          </div>
        </Overlay>
      </div>
    </>
  )
}

/**
 * Komponen tombol untuk mengupdate status soap
 * @param {{
 * id: Number
 * disabled: Boolean
 * }}
 * @returns
 */
function UpdateAssessmentStatusButton({ id, disabled, currentStatus }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { id: visitId, soapId, status } = useParams()
  const [show, setShow] = useState(false)
  const overlayContainerRef = useRef()
  const overlayTargetRef = useRef()
  useOnClickOutside(overlayContainerRef, () => setShow(false))

  return (
    <>
      {location.pathname.includes(`/document/${id}/status/${status}`) && (
        <UpdateModal
          url={`visit/${visitId}/soap/${soapId}/assesment/${id}/update-status`}
          data={{ status: status }}
          query={`visit-${visitId}-soap-${soapId}-assessment`}
          message={`
            Anda yakin ingin mengganti status pasien menjadi ${localeStatus(
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
          disabled={disabled}
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
          placement="left"
        >
          <Dropdown.Menu className="w-200px py-5" show={true}>
            <DropdownItemStyled>
              <Dropdown.Item
                active={currentStatus === "progress"}
                className="d-flex align-items-center px-5 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(`document/${id}/status/progress`)
                }}
              >
                <DropdownChecklistIcon className="me-4" />
                <span>Progress</span>
              </Dropdown.Item>
            </DropdownItemStyled>
            <DropdownItemStyled>
              <Dropdown.Item
                active={currentStatus === "done"}
                className="d-flex align-items-center px-5 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(`document/${id}/status/done`)
                }}
              >
                <DropdownChecklistIcon className="me-4" />
                <span>Selesai</span>
              </Dropdown.Item>
            </DropdownItemStyled>
            <DropdownItemStyled>
              <Dropdown.Item
                active={currentStatus === "cancel"}
                className="d-flex align-items-center px-5 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(`document/${id}/status/cancel`)
                }}
              >
                <DropdownChecklistIcon className="me-4" />
                <span>Batalkan</span>
              </Dropdown.Item>
            </DropdownItemStyled>
          </Dropdown.Menu>
        </Overlay>
      </div>
    </>
  )
}
