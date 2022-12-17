import { ReactComponent as DoneIcon } from "assets/icons/checklist.svg"
import { ReactComponent as ProgressIcon } from "assets/icons/clock.svg"
import { ReactComponent as CancelIcon } from "assets/icons/cross-sign.svg"
import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"
import { ReactComponent as Plus } from "assets/icons/plus.svg"
import { ReactComponent as ArrowRightIcon } from "assets/icons/primary-arrow-right.svg"
import { ReactComponent as PrimaryQuestionIcon } from "assets/icons/primary-question.svg"
import { ReactComponent as Search } from "assets/icons/search.svg"
import { ReactComponent as WhitePencilIcon } from "assets/icons/white-pencil_2.svg"
import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import { HoverBorderedTrBg } from "components/table/TableRow"
import useBreadcrumb from "hooks/useBreadcrumb"
import useSidebarActiveMenu from "hooks/useSidebarActiveMenu"
import _ from "lodash"
import React, { useRef, useState } from "react"
import { Modal } from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { useQuery } from "react-query"
import { useLocation, useOutletContext } from "react-router"
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import DetailPatient from "../DetailPatient"
import { HistoryMedicDownloadButton } from "../HistoryMedicDownloadButton"
import TabMenu from "../TabMenu"

export const DownloadSoapLabel = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: #7e8299;

  &.active,
  &:hover,
  &:focus,
  &:active {
    p {
      color: #0d9a89;
    }
  }
`

/**
 * Skema awal BreadCrumb
 */
export const breadCrumbJson = {
  title: "Kunjungan",
  items: [
    { text: "Kunjungan", path: "/" },
    {
      text: "Pelayanan",
      path: null,
    },
  ],
}

/**
 * Komponen utama untuk halaman soap
 */
export default function Index() {
  const { id: visitId } = useParams()
  const [submitStatus, setSubmitStatus] = useState({})
  const navigate = useNavigate()
  const location = useLocation()
  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
  })
  const [isSearching, setIsSearching] = useState(false)
  const { allPermissions } = useOutletContext()

  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("visit")

  /**
   * Mengambil detail data pasien
   */
  const buttonQuery = useQuery(
    `visit-${visitId}-soap-check-button`,
    async () => {
      return axios
        .get(`/visit/${visitId}/soap/check-button`)
        .then((res) => res.data)
    }
  )
  /** @type {import("interfaces/patient").patient} */
  const buttonData = buttonQuery.data
  const buttonStatus = buttonQuery.status

  /**
   * Mengambil data list soap
   */
  const { data: soapData, status: soapStatus } = useQuery(
    [`visit-${visitId}-soap`, filter],
    async (key) => {
      return axios
        .get(`visit/${visitId}/soap/listing`, {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
    }
  )

  /**
   * Logic pencarian data soap
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
                {buttonStatus === "success" && (
                  <>
                    <div className="mb-3">
                      <CreateCovidAssessmentButton
                        disabled={
                          buttonData.is_create ||
                          !allPermissions.includes("tambah assesment covid")
                        }
                        hidden={["global", "assesment"].includes(
                          buttonData.action
                        )}
                      />
                      <CreateGlobalAssessmentButton
                        disabled={
                          buttonData.is_create ||
                          !allPermissions.includes("tambah assesment global")
                        }
                        hidden={["covid", "assesment"].includes(
                          buttonData.action
                        )}
                      />
                      <CreateButton
                        disabled={buttonData.is_create}
                        hidden={["covid", "global"].includes(buttonData.action)}
                      />
                    </div>
                    <ButtonLightStyled
                      className="btn btn-light-primary btn-icon mb-3 me-3"
                      onClick={() => navigate("check-flow")}
                    >
                      <PrimaryQuestionIcon />
                    </ButtonLightStyled>
                    <ButtonLightStyled
                      disabled={
                        !allPermissions.includes(
                          "lihat assesment hasil terintegrasi"
                        )
                      }
                      className="btn btn-light-primary mb-3 me-3"
                      onClick={() => navigate("inspection")}
                    >
                      Hasil Terintegrasi
                    </ButtonLightStyled>
                    <ButtonLightStyled
                      disabled={
                        !allPermissions.includes(
                          "lihat assesment hasil resume rawat jalan"
                        )
                      }
                      className="btn btn-light-primary mb-3 me-3"
                      onClick={() => navigate("resume")}
                    >
                      Resume
                    </ButtonLightStyled>
                    <div className="mb-3">
                      <HistoryMedicDownloadButton
                        downloadUrl={`/visit/${visitId}/soap/print-pdf`}
                        downloadName="Histori rekam medis SOAP.pdf"
                        previewUrl={`/visit/${visitId}/soap/preview-pdf`}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="card-title">
                <div className="d-flex align-items-center position-relative mb-3">
                  <span className="svg-icon svg-icon-1 position-absolute ms-4">
                    <Search />
                  </span>
                  <input
                    onFocus={() => setIsSearching(true)}
                    onBlur={() => setIsSearching(false)}
                    type="text"
                    data-kt-user-table-filter="search"
                    className="form-control form-control-solid w-250px ps-14 me-4"
                    placeholder="Search"
                    onKeyUp={(event) => {
                      setSearchValue.current(event.target.value)
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="card-body p-10">
              {soapStatus === "loading" && (
                <PrimaryLoader className="min-h-300px" />
              )}
              {soapStatus === "error" && (
                <ErrorMessage className="min-h-300px" />
              )}
              {soapStatus === "success" && (
                <>
                  <div className="table-responsive">
                    <table className="table" style={{ minWidth: "1000px" }}>
                      <TableHeading
                        filterProp={[filter, setFilter]}
                        columns={[
                          {
                            name: "id",
                            heading: "#",
                            width: "5%",
                          },
                          {
                            name: "created_at",
                            heading: "Tanggal dibuat",
                            width: "20%",
                          },
                          {
                            name: "assesment",
                            heading: "Assesmen yang dilakukan",
                            width: "30%",
                          },
                          {
                            name: "status",
                            heading: "Status",
                            width: "7%",
                          },
                          {
                            name: "updated_at",
                            heading: "Terakhir diubah",
                            width: "20%",
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
                        {soapData.data.length === 0 && (
                          <tr>
                            <td className="py-10 align-middle" colSpan={7}>
                              <center className="text-gray-600">
                                Belum ada data yang dapat ditampilkan
                              </center>
                            </td>
                          </tr>
                        )}
                        {soapData.data.map((data, key) => {
                          /** @type {import("interfaces/soap").Soap} */
                          const soap = data
                          return (
                            <HoverBorderedTrBg
                              dynamicBg={soap.status === "cancel" && "#fbebf0"}
                              key={`data-table-${key}`}
                            >
                              <td className="align-middle text-gray-700">
                                {key + 1}
                              </td>
                              <td className="align-middle text-gray-700">
                                {soap.created_at}
                              </td>
                              <td className="align-middle text-gray-700">
                                <AssessmentTypeLabel type={soap.assesment} />
                              </td>
                              <td className="align-middle text-gray-700">
                                {soap.status === "progress" && <ProgressIcon />}
                                {soap.status === "done" && <DoneIcon />}
                                {soap.status === "cancel" && <CancelIcon />}
                              </td>
                              <td className="align-middle text-gray-700">
                                {soap.updated_at ?? "-"}
                              </td>
                              <td className="align-middle text-gray-700">
                                <ButtonLightStyled
                                  onClick={() =>
                                    navigate(
                                      location.pathname + "/" + `${soap.id}`
                                    )
                                  }
                                  className="btn btn-icon btn-light-primary"
                                >
                                  <ArrowRightIcon />
                                </ButtonLightStyled>
                              </td>
                            </HoverBorderedTrBg>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <TableFooter
                    data={soapData}
                    filterProp={[filter, setFilter]}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ModalHelper show={location.pathname.includes("check-flow")} />
    </>
  )
}

/**
 * Komponen tombol untuk membuat soap
 * @param {React.HTMLAttributes} props
 */
export function CreateButton(props) {
  const navigate = useNavigate()

  return (
    <button
      {...props}
      onClick={() => navigate("create")}
      className="btn btn-primary me-3"
    >
      <Plus /> Tambah
    </button>
  )
}

/**
 * Komponen tombol untuk membuat asesmen covid
 * @param {React.HTMLAttributes} props
 */
export function CreateCovidAssessmentButton(props) {
  const navigate = useNavigate()

  return (
    <button
      {...props}
      onClick={() => navigate("create")}
      className="btn btn-danger me-3"
    >
      <Plus /> Assesmen covid
    </button>
  )
}

/**
 * Komponen tombol untuk membuat asesmen global
 * @param {React.HTMLAttributes} props
 */
export function CreateGlobalAssessmentButton(props) {
  const navigate = useNavigate()

  return (
    <button
      {...props}
      onClick={() => navigate("create")}
      className="btn btn-warning me-3"
    >
      <WhitePencilIcon /> Assesmen global
    </button>
  )
}

/**
 * Modal alur pemeriksaan
 * @param {{show: Boolean}}
 */
function ModalHelper({ show }) {
  const navigate = useNavigate()
  return (
    <Modal animation={false} dialogClassName="mw-600px" show={show}>
      <Modal.Header>
        <Modal.Title as="h3">Alur Pemeriksaan</Modal.Title>
        <GrayCrossIcon
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </Modal.Header>
      <Modal.Body>
        <ol>
          <li className="text-primary fw-semi-bold mb-2">Assesmen Covid</li>
          <div className="text-gray-600 mb-4">
            Diharuskan pasien ini melalui pemeriksaan Covid terlebih dahulu.
            Pemeriksaan Covid secara otomatis akan dimasukkan sebagai SOAP
            pertama.
          </div>
          <li className="text-primary fw-semi-bold mb-2">Assesmen Global</li>
          <div className="text-gray-600 mb-4">
            Pemeriksaan lainnya tidak dapat dilakukan sebelum adanya pemeriksaan
            Global. Pemeriksaan Global secara otomatis juga akan dimasukkan pada
            SOAP pertama.
          </div>
          <li className="text-primary fw-semi-bold mb-2">Assesmen Lainnya</li>
          <div className="text-gray-600 mb-4">
            Pasien dapat dilakukan pemeriksaan lainnya sesuai dengan
            kebutuhannya. Secara fleksibel pemeriksaan dapat dilakukan pada SOAP
            ke berapapun.
          </div>
        </ol>
        <div className="d-flex flex-center mt-8 mb-4">
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Close
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

/**
 * Komponen label dinamik nama soap
 * @param {{
 * type: String
 * }}
 */
export function AssessmentTypeLabel({ type }) {
  return (
    <>
      {type.split(", ").map((val, key) => {
        let color = "primary"
        switch (val) {
          case "Covid":
            color = "danger"
            break

          case "Global":
            color = "warning"
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
