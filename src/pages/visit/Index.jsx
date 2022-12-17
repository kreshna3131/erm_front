import { ReactComponent as AddIcon } from "assets/icons/add-person.svg"
import { ReactComponent as DetailIcon } from "assets/icons/double-love.svg"
import { ReactComponent as Search } from "assets/icons/search.svg"
import { ReactComponent as WarningExclamationIcon } from "assets/icons/warning-exclamation.svg"
import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import { HoverBorderedTrBg } from "components/table/TableRow"
import { variantStatus } from "helpers/helper"
import { isTruncated, truncate } from "helpers/string-helper"
import useBreadcrumb from "hooks/useBreadcrumb"
import useCheckPermission from "hooks/useCheckPermission"
import useSidebarActiveMenu from "hooks/useSidebarActiveMenu"
import _ from "lodash"
import { useCallback, useState } from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { useQuery } from "react-query"
import { useNavigate, useOutletContext } from "react-router-dom"
import styled from "styled-components"
import FilterButton from "./FilterButton"

/**
 * Styling Floating Action Button
 */
export const FloatingActionButton = styled.div`
  width: 60px;
  background-color: #ffffff;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  box-shadow: 8px 2px 16px 0px rgba(76, 87, 125, 0.04);
  display: ${(props) => (props.length ? "flex" : "none")};
  flex-direction: column;
  justify-content: space-evenly;
  margin-top: 35px;
  margin-bottom: 85px;

  @media (max-width: 768px) {
    margin-top: 25px;
    margin-bottom: 120px;
  }
`

/**
 * Skema untuk Breadcrumb
 */
const breadCrumbJson = {
  title: "Kunjungan",
  items: [{ text: "Kunjungan", path: null }],
}

/**
 * Panjang truncate untuk alamat
 */
const alamatTruncateLength = 35

/**
 * Komponen utama untuk halaman visit
 */
export default function Index() {
  const navigate = useNavigate()
  const { user: loggedUser } = useOutletContext()
  const [info, setInfo] = useState(null)
  useCheckPermission(loggedUser, "lihat kunjungan")

  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("visit")

  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
    dokter: "",
    unit: "",
    spesialis: "",
    ruang: "",
    periode: [],
    status: "",
  })

  /**
   * Mengambil data kunjungan
   */
  const { data: visitData, status: visitStatus } = useQuery(
    ["visit", filter],
    async (key) => {
      return axios
        .get("/visit/listing", {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
    },
    {
      onError: (err) => {
        switch (err.response.data.message) {
          case "API SIMRS error!":
            setInfo({
              type: "danger",
              message:
                "Terdapat masalah pada data dari SIMRS. Silakan langsung menghubungi tim SIMRS Simo",
            })
            break

          default:
            setInfo({
              type: "danger",
              message: "Terjadi kesalahan silakan coba beberapa saat lagi",
            })
            break
        }
      },
      onSuccess: () => setInfo(null),
    }
  )

  /**
   * Logic pencarian data kunjungan
   */
  const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), [])
  function handleDebounceFn(filter, value) {
    setFilter({
      ...filter,
      page: 1,
      search: value,
    })
  }

  return (
    <>
      <div className="post d-flex flex-column-fluid" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          {info && (
            <div
              className={`alert alert-${info.type} text-${info.type} border-0`}
              role="alert"
            >
              {info.message}
            </div>
          )}
          <div className="card">
            <div className="card-header border-0 pt-6">
              <div className="card-toolbar">
                <div className="d-flex align-items-center position-relative my-1">
                  <span className="svg-icon svg-icon-1 position-absolute ms-4">
                    <Search />
                  </span>
                  <input
                    type="text"
                    data-kt-user-table-filter="search"
                    className="form-control form-control-solid w-250px ps-14"
                    placeholder="Search"
                    onKeyUp={(event) => debounceFn(filter, event.target.value)}
                  />
                </div>
              </div>
              <div className="card-title">
                <FilterButton
                  filterProps={[filter, setFilter]}
                  visitStatus={visitStatus}
                />
              </div>
            </div>
            <div className="card-body p-10">
              {visitStatus === "loading" && (
                <PrimaryLoader className="min-h-450px" />
              )}
              {visitStatus === "error" && (
                <ErrorMessage className="min-h-450px" />
              )}
              {visitStatus === "success" && (
                <div className="position-relative">
                  <FloatingActionButton length={visitData.data.length}>
                    {visitData.data.map((data, key) => (
                      <ButtonLightStyled
                        onClick={() => {
                          navigate(`/visit/${data.kode}/soap`)
                        }}
                        className="btn btn-light-primary btn-icon"
                        key={key}
                      >
                        {data.status === "Belum dilayani" ? (
                          <AddIcon />
                        ) : (
                          <DetailIcon />
                        )}
                      </ButtonLightStyled>
                    ))}
                  </FloatingActionButton>
                  <div className="table-responsive">
                    <table
                      className="table"
                      style={{
                        minWidth: "2500px",
                        marginLeft: visitData.data.length && "90px",
                      }}
                    >
                      <TableHeading
                        filterProp={[filter, setFilter]}
                        columns={[
                          {
                            name: "kode",
                            heading: "Registrasi",
                            width: "8%",
                          },
                          {
                            name: "norm",
                            heading: "Rekam Medis",
                            width: "8%",
                          },
                          {
                            name: "nama",
                            heading: "Pasien",
                            width: "8%",
                          },
                          {
                            name: "tgllahir",
                            heading: "Tgl Lahir",
                            width: "6%",
                          },
                          {
                            name: "unit",
                            heading: "Unit",
                            width: "8%",
                          },
                          {
                            name: "ruang",
                            heading: "Ruang",
                            width: "8%",
                          },
                          {
                            name: "spesialisasi",
                            heading: "Spesialis",
                            width: "8%",
                          },
                          {
                            name: "penjamin",
                            heading: "Penjamin",
                            width: "8%",
                          },
                          {
                            name: "dokter",
                            heading: "Dokter",
                            width: "10%",
                          },
                          {
                            name: "tglawal",
                            heading: "Tgl Masuk",
                            width: "6%",
                          },
                          {
                            name: "alamat",
                            heading: "Alamat",
                            width: "13%",
                          },
                          {
                            name: "alapasien",
                            heading: "Asal Pasien",
                            width: "5%",
                          },
                        ]}
                      />
                      <tbody>
                        {visitData.data.length === 0 && (
                          <tr>
                            <td className="py-10 align-middle" colSpan={6}>
                              <center className="text-gray-600">
                                Data not found
                              </center>
                            </td>
                          </tr>
                        )}
                        {visitData.data.map((data, key) => {
                          return (
                            <HoverBorderedTrBg
                              key={`data-table-${key}`}
                              dynamicBg={
                                data.status === "done"
                                  ? "#f5fbfa"
                                  : data.status === "progress"
                                  ? "#fff7ee"
                                  : ""
                              }
                            >
                              <td
                                className="align-middle text-gray-700"
                                style={{
                                  height: "54px",
                                }}
                              >
                                {data.kode}
                              </td>
                              <td
                                className="align-middle text-gray-700"
                                style={{
                                  height: "54px",
                                }}
                              >
                                {data.norm}
                              </td>
                              <td
                                className="align-middle text-gray-700"
                                style={{
                                  height: "54px",
                                }}
                              >
                                <span
                                  class={`bullet bg-${variantStatus(
                                    data.status
                                  )} w-10px h-10px me-2`}
                                ></span>
                                <span className="me-2">{data.nama}</span>
                                {data.is_read === 0 && (
                                  <WarningExclamationIcon />
                                )}
                              </td>
                              <td
                                className="align-middle text-gray-700"
                                style={{
                                  height: "54px",
                                }}
                              >
                                {data.tgllahir}
                              </td>
                              <td
                                className="align-middle text-gray-700"
                                style={{
                                  height: "54px",
                                }}
                              >
                                {data.unit}
                              </td>
                              <td
                                className="align-middle text-gray-700"
                                style={{
                                  height: "54px",
                                }}
                              >
                                {data.ruang}
                              </td>
                              <td
                                className="align-middle text-gray-700"
                                style={{
                                  height: "54px",
                                }}
                              >
                                {data.spesialisasi}
                              </td>
                              <td
                                className="align-middle text-gray-700"
                                style={{
                                  height: "54px",
                                }}
                              >
                                {data.penjamin}
                              </td>
                              <td
                                className="align-middle text-gray-700"
                                style={{
                                  height: "54px",
                                }}
                              >
                                {isTruncated(data.dokter, 30) ? (
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip id={`tooltip-${key}`}>
                                        {data.dokter}
                                      </Tooltip>
                                    }
                                  >
                                    <span>{truncate(data.dokter, 30)}</span>
                                  </OverlayTrigger>
                                ) : (
                                  <>{data.dokter}</>
                                )}
                              </td>
                              <td
                                className="align-middle text-gray-700"
                                style={{
                                  height: "54px",
                                }}
                              >
                                {data.tglawal}
                              </td>
                              <td
                                className="align-middle text-gray-700"
                                style={{
                                  height: "54px",
                                }}
                              >
                                {isTruncated(
                                  data.alamat,
                                  alamatTruncateLength
                                ) ? (
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip id={`tooltip-${key}`}>
                                        {data.alamat}
                                      </Tooltip>
                                    }
                                  >
                                    <span>
                                      {truncate(
                                        data.alamat,
                                        alamatTruncateLength
                                      )}
                                    </span>
                                  </OverlayTrigger>
                                ) : (
                                  <>{data.alamat}</>
                                )}
                              </td>
                              <td
                                className="align-middle text-gray-700"
                                style={{
                                  height: "54px",
                                }}
                              >
                                {data.asalpasien}
                              </td>
                            </HoverBorderedTrBg>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <TableFooter
                    data={visitData}
                    filterProp={[filter, setFilter]}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
