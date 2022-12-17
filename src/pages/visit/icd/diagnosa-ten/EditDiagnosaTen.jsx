import { ReactComponent as PlusIcon } from "assets/icons/plus.svg"
import { ReactComponent as SearchIcon } from "assets/icons/search.svg"
import axios from "axios"
import DeleteModalMethode from "components/table/DeleteModalMethode"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import useBreadcrumb from "hooks/useBreadcrumb"
import _ from "lodash"
import React, { useEffect, useRef, useState } from "react"
import { useQuery } from "react-query"
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router"
import { Link, useSearchParams } from "react-router-dom"
import styled from "styled-components"
import Create from "./Create"
import Edit from "./Edit"
import ToolbarIcd from "../ToolbarIcd"
import AssesmenIcd from "../AssesmenIcd"
import { HoverBorderedTrBg } from "components/table/TableRow"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import TabMenuIcd from "pages/visit/TabMenuIcd"
import { ButtonLightStyled } from "components/Button"
import { ReactComponent as PrimaryPencilIcon } from "assets/icons/primary-pencil.svg"
import { ReactComponent as TripleDot } from "assets/icons/triple-dot.svg"
import { ReactComponent as CancelIcon } from "assets/icons/cross-sign.svg"
import { Dropdown, Overlay, OverlayTrigger, Tooltip } from "react-bootstrap"
import useOnClickOutside from "hooks/useOnClickOutside"
import { isTruncated, truncate } from "helpers/string-helper"
import { DropdownStatusStyled } from "components/Dropdown"

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

// skema breadcumb
const initialBreadCrumbJson = {
  title: "Kunjungan",
  items: [
    { text: "Kunjungan", path: "/" },
    {
      text: "Pelayanan",
      path: "/visit",
    },
    {
      text: "ICD",
      path: null,
    },
  ],
}

// Dynamic Bg
export function dynamicRowBg(isAdd) {
  switch (isAdd) {
    case 0:
      return "#fbebf0"
    default:
      return ""
  }
}

// komponen utama Diagnosa 10
export default function EditDiagnosaTen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id: visitId, diagnosaTenId } = useParams()
  const [breadCrumbJson, setBreadCrumbJson] = useState(initialBreadCrumbJson)
  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
  })
  const { allPermissions } = useOutletContext()

  useBreadcrumb(breadCrumbJson)

  // pengaturan route
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
          text: "ICD",
          path: null,
        },
      ],
    })
  }, [])

  const nameTruncateLength = 28

  // get listing data diagnosa 10
  const { data: diagnosaTenData, status: diagnosaTenStatus } = useQuery(
    [`visit-${visitId}-icd-ten-listing`, filter],
    async (key) =>
      axios
        .get(`/visit/${visitId}/icd-ten/listing`, {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
  )

  // skema pencarian
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
      <ToolbarIcd />
      <div className="post d-flex flex-column-fluid pt-5 pt-lg-15" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              <AssesmenIcd />
            </div>
            <div className="col-md-8">
              <div className="card mb-8 mb-md-0">
                <TabMenuIcd />
                <div className="card-header border-0 pt-6">
                  <div className="card-toolbar">
                    <div
                      className="d-flex justify-content-end"
                      data-kt-user-table-toolbar="base"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            !allPermissions.includes("tambah icd 10")
                              ? ""
                              : "create"
                          )
                        }
                        disabled={!allPermissions.includes("tambah icd 10")}
                        className="btn btn-primary me-3"
                      >
                        <PlusIcon /> Tambah
                      </button>
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
                  {diagnosaTenStatus === "loading" && (
                    <PrimaryLoader className="min-h-300px" />
                  )}
                  {diagnosaTenStatus === "error" && (
                    <ErrorMessage className="min-h-300px" />
                  )}
                  {diagnosaTenStatus === "success" && (
                    <div className="position-relative">
                      <FloatingActionButton
                        length={diagnosaTenData.data.length}
                      >
                        {diagnosaTenData.data.map((v, key) => (
                          <ButtonLightStyled
                            key={key}
                            onClick={() => navigate(v.id + "/edit")}
                            className="btn btn-light-primary btn-icon"
                            disabled={
                              v.is_add === 0 ||
                              !allPermissions.includes("ubah icd 10")
                            }
                          >
                            <PrimaryPencilIcon />
                          </ButtonLightStyled>
                        ))}
                      </FloatingActionButton>
                      <div className="table-responsive">
                        <table
                          className="table"
                          style={{ marginLeft: "80px", minWidth: "1200px" }}
                        >
                          <TableHeading
                            filterProp={[filter, setFilter]}
                            columns={[
                              {
                                name: "kode",
                                heading: "Kode",
                                width: "10%",
                              },
                              {
                                name: "name",
                                heading: "Nama",
                                width: "20%",
                              },
                              {
                                name: "diagnosis_type",
                                heading: "Jenis Diagnosa",
                                width: "15%",
                              },
                              {
                                name: "case",
                                heading: "Kasus",
                                width: "8%",
                              },
                              {
                                name: "status",
                                heading: "Status Diagnosa",
                                width: "15%",
                              },
                              {
                                name: "created_by",
                                heading: "Dibuat Oleh",
                                width: "15%",
                              },
                              {
                                name: "created_at",
                                heading: "Tanggal Dibuat",
                                width: "25%",
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
                            {diagnosaTenData.data.length === 0 && (
                              <tr>
                                <td colSpan={12}>
                                  <center className="text-gray-600">
                                    Belum ada data yang dapat ditampilkan
                                  </center>
                                </td>
                              </tr>
                            )}
                            {diagnosaTenData.data.map((data, key) => {
                              return (
                                <HoverBorderedTrBg
                                  key={`data-table-${key}`}
                                  dynamicBg={dynamicRowBg(data.is_add)}
                                >
                                  <td className="align-middle text-gray-700">
                                    {data.kode}
                                  </td>
                                  <td className="align-middle text-gray-700">
                                    {data.name &&
                                    isTruncated(
                                      data.name,
                                      nameTruncateLength
                                    ) ? (
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip id={`tooltip-${key}`}>
                                            {data.name}
                                          </Tooltip>
                                        }
                                      >
                                        <span>
                                          {truncate(
                                            data.name,
                                            nameTruncateLength
                                          )}
                                        </span>
                                      </OverlayTrigger>
                                    ) : (
                                      <>{data.name}</>
                                    )}
                                  </td>
                                  <td className="align-middle text-gray-700">
                                    {data.diagnosis_type}
                                  </td>
                                  <td className="align-middle text-gray-700">
                                    {data.case}
                                  </td>
                                  <td className="align-middle text-gray-700">
                                    <div
                                      className={`badge px-4 py-2 ${
                                        data.diagnosis_type
                                          .toLowerCase()
                                          .includes("awal")
                                          ? "bg-light-primary text-primary"
                                          : "bg-light-warning text-warning"
                                      } me-2 mb-1`}
                                    >
                                      {data.status}
                                    </div>
                                  </td>
                                  <td className="align-middle text-gray-700">
                                    {data.created_by}
                                  </td>
                                  <td className="align-middle text-gray-700">
                                    {data.created_at}
                                  </td>

                                  <td className="align-middle">
                                    <div className="d-flex">
                                      <CancelIcdButton
                                        id={data.id}
                                        name={data.name}
                                        query={`visit-${visitId}-icd-ten-listing`}
                                        isAdd={data.is_add}
                                      />
                                    </div>
                                  </td>
                                </HoverBorderedTrBg>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                      <TableFooter
                        data={diagnosaTenData}
                        filterProp={[filter, setFilter]}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {location.pathname.includes(`create`) && (
        <Create visitId={visitId} query={`visit-${visitId}-icd-ten-listing`} />
      )}
      {location.pathname.includes(`edit`) && (
        <Edit
          diagnosaTenId={diagnosaTenId}
          query={`visit-${visitId}-icd-ten-listing`}
        />
      )}
    </>
  )
}

function CancelIcdButton({ id, name: nameDiagnosa, query, isAdd }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { status } = useParams()
  const [show, setShow] = useState(false)
  const overlayContainerRef = useRef()
  const overlayTargetRef = useRef()
  useOnClickOutside(overlayContainerRef, () => setShow(false))
  const [searchParams] = useSearchParams()
  const { allPermissions } = useOutletContext()

  return (
    <>
      {location.pathname.includes(`${id}/delete`) && (
        <DeleteModalMethode
          url={`visit/icd-ten/${id}/update-status`}
          query={query}
          message={`
            Anda yakin ingin membatalkan diagnosa ${searchParams.get("name")}?
          `}
          successMessage={`Anda telah berhasil membatalkan diagnosa ${searchParams.get(
            "name"
          )}.`}
          isDiagnosa={true}
        />
      )}
      <div ref={overlayContainerRef}>
        <ButtonLightStyled
          ref={overlayTargetRef}
          onClick={() => setShow(!show)}
          className="btn btn-icon btn-light-warning"
        >
          <TripleDot />
        </ButtonLightStyled>
        <Overlay
          show={show}
          target={overlayTargetRef.current}
          container={overlayContainerRef.current}
          placement="left-start"
        >
          <Dropdown.Menu show={true} className="py-5 w-200px">
            <DropdownStatusStyled
              disabled={!allPermissions.includes("ubah icd 10") || isAdd === 0}
            >
              <Dropdown.Item
                className="d-flex align-items-center px-8 h-40px"
                onClick={() => {
                  setShow(false)
                  navigate(`${id}/delete?name=${nameDiagnosa}`)
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

export const DropdownItemStyledLab = styled.div`
  span {
    color: #7e8299;
  }

  .active,
  &:hover {
    background-color: #eff2f5;

    span {
      color: #0d9a89;
    }
  }
`
