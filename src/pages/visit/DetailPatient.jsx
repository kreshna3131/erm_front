import axios from "axios"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import React, { useState } from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import Accordion from "react-bootstrap/Accordion"
import Dropdown from "react-bootstrap/Dropdown"
import { useQuery } from "react-query"
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router"
import styled from "styled-components"
import { ReactComponent as DropdownChecklistIcon } from "../../assets/icons/dropdown-checklist.svg"
import UpdateModal from "../../components/table/UpdateModal"
import { variantStatus } from "../../helpers/helper"
import { isTruncated, truncate } from "../../helpers/string-helper"

/**
 * deklarasi panjang alamat truncate
 */
const alamatTruncateLength = 35

/**
 * Komponen kustom dropdown
 */
const DropdownStyled = styled.div`
  background: #ffffff;
  display: flex;
  border-radius: 5px;

  .dropdown-menu {
    ${(props) => (props.disabled ? "position: relative" : "")};

    ${(props) =>
      props.disabled
        ? `
          &:after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            opacity: 0.5;
            background: #ffffff;
            cursor: not-allowed;
          }
          `
        : ""};
  }

  .dropdown-toggle {
    padding: 5px;
    padding-right: 20px;
  }

  .dropdown-toggle::after {
    display: none;
  }

  .dropdown-toggle::before {
    position: absolute;
    top: 4px;
    right: 5px;
    height: 15px;
    width: 15px;
    content: "";
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='
    ${(props) => {
      switch (props.status) {
        case "waiting":
          return "%23cb003f"
        case "progress":
          return "%23f79d25"
        case "done":
          return "%230d9a89"
        default:
          return "%23FFFFFF"
      }
    }}
    ' class='bi bi-three-dots-vertical' viewBox='0 0 16 16'%3E%3Cpath d='M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z'/%3E%3C/svg%3E");
  }
`

/**
 * Komponen kustom dropdown item
 */
export const DropdownItemStyled = styled.div`
  path {
    opacity: 0.2;
  }

  span {
    color: #7e8299;
  }

  .active,
  &:hover {
    background-color: #eff2f5;

    path {
      opacity: 1;
    }

    span {
      color: #0d9a89;
    }
  }
`
/**
 * styling dropdown item
 */
const AccordionHeaderStyled = styled.div`
  .accordion-button {
    &:after {
      height: 8px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='8' viewBox='0 0 14 8'%3E%3Cpath id='Path_1681' data-name='Path 1681' d='M6.707,15.707a1,1,0,0,1-1.414-1.414l6-6a1,1,0,0,1,1.383-.03l6,5.5a1,1,0,1,1-1.351,1.474L12.03,10.384Z' transform='translate(19 16) rotate(180)' fill='%23fff'/%3E%3C/svg%3E%0A");
    }
  }
`
/**
 * styling detail patient
 */
const DetailPatientStyled = styled.div`
  margin-bottom: 30px;
  .accordion-button {
    color: white;
    background-color: #0c96c5;
  }
`
/**
 * Menterjemahkan status
 * @param {import("interfaces/patient").Status} status
 */
function localeStatus(status) {
  switch (status) {
    case "waiting":
      status = "Belum Dilayani"
      break

    case "progress":
      status = "Sedang Dilayani"
      break

    case "done":
      status = "Sudah Dilayani"
      break

    default:
      status = " "
      break
  }

  return status
}

/**
 * Komponen utama detail patient
 */
export default function DetailPatient({ id, updateStatus = true }) {
  const { type, status } = useParams()
  const [submitStatus, setSubmitStatus] = useState()
  const location = useLocation()
  const navigate = useNavigate()
  const { allPermissions } = useOutletContext()

  /**
   * Mengambil detail data pasien
   */
  const patientQuery = useQuery(`visit-${id}`, async () => {
    return axios.get(`/visit/${id}/edit`).then((res) => res.data)
  })
  /** @type {import("interfaces/patient").patient} */
  const patientData = patientQuery.data
  const patientStatus = patientQuery.status

  return (
    <DetailPatientStyled>
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
      <Accordion defaultActiveKey="1">
        <Accordion.Item eventKey="0">
          <AccordionHeaderStyled>
            <Accordion.Header onClick={(event) => event.stopPropagation()}>
              {patientStatus === "loading" && (
                <div className="d-flex flex-center w-100">
                  <p className="text-white mb-0">Loading ...</p>
                </div>
              )}
              {patientStatus === "error" && (
                <div className="d-flex flex-center w-100">
                  <p className="text-white mb-0">Error ...</p>
                </div>
              )}
              {patientStatus === "success" && (
                <div className="d-flex align-items-center w-100">
                  <h1 className="fs-4 fw-semi-bold text-white mb-0 me-4">
                    Identitas Pasien
                  </h1>
                  <p className="m-0 me-4">
                    {patientData.nama}, {patientData.kode}
                  </p>
                  {updateStatus === true && (
                    <DropdownStyled
                      disabled={
                        !allPermissions.includes("ubah status kunjungan")
                      }
                      status={patientData.status}
                    >
                      <Dropdown onClick={(event) => event.stopPropagation()}>
                        <Dropdown.Toggle
                          as="div"
                          className={`bg-light-${variantStatus(
                            patientData.status
                          )} text-${variantStatus(patientData.status)} fs-7`}
                        >
                          {localeStatus(patientData.status)}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="w-200px py-5">
                          <DropdownItemStyled>
                            <Dropdown.Item
                              onClick={() => {
                                navigate(`patient-status/waiting`)
                              }}
                              className={`d-flex align-items-center px-5 h-40px ${
                                patientData.status === "waiting" && "active"
                              } pt-2 pb-2`}
                            >
                              <DropdownChecklistIcon className="me-4" />
                              <span>Belum Dilayani</span>
                            </Dropdown.Item>
                          </DropdownItemStyled>
                          <DropdownItemStyled>
                            <Dropdown.Item
                              onClick={() => {
                                navigate(`patient-status/progress`)
                              }}
                              href="#"
                              className={`d-flex align-items-center px-5 h-40px ${
                                patientData.status === "progress" && "active"
                              } pt-2 pb-2`}
                            >
                              <DropdownChecklistIcon className="me-4" />
                              <span>Sedang Dilayani</span>
                            </Dropdown.Item>
                          </DropdownItemStyled>
                          <DropdownItemStyled>
                            <Dropdown.Item
                              onClick={() => {
                                navigate(`patient-status/done`)
                              }}
                              href="#"
                              className={`d-flex align-items-center px-5 h-40px ${
                                patientData.status === "done" && "active"
                              } pt-2 pb-2`}
                            >
                              <DropdownChecklistIcon className="me-4" />
                              <span>Sudah Dilayani</span>
                            </Dropdown.Item>
                          </DropdownItemStyled>
                        </Dropdown.Menu>
                      </Dropdown>
                    </DropdownStyled>
                  )}
                </div>
              )}
            </Accordion.Header>
          </AccordionHeaderStyled>
          <Accordion.Body>
            {patientStatus === "loading" && (
              <PrimaryLoader className="min-h-200px" />
            )}
            {patientStatus === "error" && (
              <ErrorMessage className="min-h-200px" />
            )}
            {patientStatus === "success" && (
              <div className="row">
                <div className="col-md-4">
                  <div>
                    <p className="text-gray-700 fw-bold mb-2">
                      Nomor registrasi
                    </p>
                    <p className="text-gray-500">{patientData.kode}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 fw-bold mb-2">Nama pasien</p>
                    <p className="text-gray-500">{patientData.nama}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 fw-bold mb-2">Umur</p>
                    <p className="text-gray-500">{patientData.umur}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 fw-bold mb-2">Ruang</p>
                    <p className="text-gray-500">{patientData.ruang}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 fw-bold mb-2">Asal pasien</p>
                    <p className="text-gray-500">{patientData.asalpasien}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 fw-bold mb-2">Tanggal SEP</p>
                    <p className="text-gray-500">{patientData.tglsep || "-"}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div>
                    <p className="text-gray-700 fw-bold mb-2">
                      Tanggal awal masuk
                    </p>
                    <p className="text-gray-500">{patientData.tglawal}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 fw-bold mb-2">Jenis kelamin</p>
                    <p className="text-gray-500">{patientData.jkl}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 fw-bold mb-2">Alamat</p>
                    <p className="text-gray-500">
                      {isTruncated(patientData.alamat, alamatTruncateLength) ? (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="address-tooltip">
                              {patientData.alamat}
                            </Tooltip>
                          }
                        >
                          <span>
                            {truncate(patientData.alamat, alamatTruncateLength)}
                          </span>
                        </OverlayTrigger>
                      ) : (
                        <>{patientData.alamat}</>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700 fw-bold mb-2">Dokter</p>
                    <p className="text-gray-500">{patientData.dokter}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 fw-bold mb-2">Penjamin</p>
                    <p className="text-gray-500">{patientData.penjamin}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 fw-bold mb-2">Nomor rujukan</p>
                    <p className="text-gray-500">
                      {patientData.norujukan ?? "-"}
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div>
                    <p className="text-gray-700 fw-bold mb-2">
                      Nomor rekam medis
                    </p>
                    <p className="text-gray-500">{patientData.norm}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 fw-bold mb-2">Tanggal lahir</p>
                    <p className="text-gray-500">{patientData.tgllahir}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 fw-bold mb-2">Unit</p>
                    <p className="text-gray-500">{patientData.unit}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 fw-bold mb-2">Spesialisasi</p>
                    <p className="text-gray-500">{patientData.spesialisasi}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 fw-bold mb-2">Nomor SEP</p>
                    <p className="text-gray-500">{patientData.nosep ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 fw-bold mb-2">
                      Tanggal rujukan
                    </p>
                    <p className="text-gray-500">
                      {patientData.tglrujukan || "-"}
                    </p>
                  </div>
                </div>
                <div className="col-md-4"></div>
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {location.pathname.includes(`/${type}/patient-status/${status}`) && id && (
        <UpdateModal
          url={`/visit/${id}/update`}
          data={{ visit_status: status }}
          query={`visit-${id}`}
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
    </DetailPatientStyled>
  )
}
