import { ReactComponent as PlusIcon } from "assets/icons/plus.svg"

import { ReactComponent as SearchIcon } from "assets/icons/search.svg"

import { ReactComponent as ArrowRightIcon } from "assets/icons/primary-arrow-right.svg"

import axios from "axios"
import { ButtonLightStyled } from "components/Button"

import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"

import useBreadcrumb from "hooks/useBreadcrumb"
import _ from "lodash"
import React, { useEffect, useRef, useState } from "react"
import { useQuery } from "react-query"
import { useLocation, useNavigate, useParams } from "react-router"
import { Link } from "react-router-dom"
import styled from "styled-components"

import TabMenuRecipe from "../../TabMenuRecipe"
import CreateConcoction from "./CreateConcoction"
import ToolbarRecipe from "../ToolbarRecipe"
import CommentRecipe from "../CommentRecipe"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import clsx from "clsx"

/**
 * Styling Conditional Tr
 */
const ConditionalTr = styled.tr`
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  position: relative;

  th {
    background-color: ${(props) => props.backgroundColor};
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: ${(props) => (props.disabled ? "block" : "none")};
  }

  cursor: ${(props) => (props.disabled ? "not-allowed" : "default")};
  td,
  th {
    ${(props) =>
      !props.dynamicBg
        ? "background-color: #FFFFFF"
        : `background-color:${props.dynamicBg} !important`};
  }

  &:not(:last-child) {
    td,
    th {
      border-bottom: 2px dashed
        ${(props) => (!props.dynamicBg ? "#eff2f5" : "#FFFFFF")};
    }
  }
`
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
      text: "E Resep",
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
 * Komponen utama untuk halaman edit receipt
 */
export default function Edit() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    id: visitId,

    receiptId,
  } = useParams()
  const [breadCrumbJson, setBreadCrumbJson] = useState(initialBreadCrumbJson)
  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
  })

  useBreadcrumb(breadCrumbJson)

  // mengatur  breadcumb ketika pertama kali load
  useEffect(() => {
    if (location.pathname.includes("pharmacy")) {
      setBreadCrumbJson({
        title: "Farmasi",
        items: [
          { text: "Farmasi", path: "/pharmacy/request" },
          {
            text: "Permintaan",
            path: "/pharmacy/request",
          },
          {
            text: "Detail",
            path: null,
          },
        ],
      })
    } else {
      setBreadCrumbJson({
        title: "Kunjungan",
        items: [
          { text: "Kunjungan", path: "/" },
          {
            text: "Pelayanan",
            path: "/visit",
          },
          {
            text: "E Resep",
            path: `visit/${visitId}/receipt`,
          },
          {
            text: "Permintaan",
            path: `visit/${visitId}/receipt`,
          },
          {
            text: "Detail",
            path: null,
          },
        ],
      })
    }
  }, [])

  // mengambil data edit resep untuk dikirimkan ke toolbar
  const recipeQuery = useQuery(
    `visit-${visitId}-recipe-${receiptId}`,
    async () =>
      axios.get(`/visit/recipe/${receiptId}/edit`).then((res) => res.data)
  )
  const recipeData = recipeQuery.data

  // mengambil data listing racikan
  const { data: actionData, status: actionStatus } = useQuery(
    [`visit-recipe-${receiptId}-concoction-listing`, filter],
    async (key) =>
      axios
        .get(`/visit/recipe/${receiptId}/concoction/listing`, {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
  )

  // skema untuk search racikan
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
      <ToolbarRecipe recipeQuery={recipeQuery} recipeId={receiptId} />
      <div className="post d-flex flex-column-fluid pt-5 pt-lg-15" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              <div className="card mb-8 mb-md-0">
                <TabMenuRecipe recipeQuery={recipeQuery} />
                <div className="card-header border-0 pt-6">
                  <div className="card-toolbar">
                    <div
                      className="d-flex justify-content-end"
                      data-kt-user-table-toolbar="base"
                    >
                      <Link
                        type="button"
                        to={recipeData?.status === "done" ? "" : "create"}
                        className={clsx({
                          "btn btn-primary": true,
                          "disabled cursor-not-allowed":
                            recipeData?.status === "done",
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
                  {actionStatus === "loading" && (
                    <PrimaryLoader className="min-h-300px" />
                  )}
                  {actionStatus === "error" && (
                    <ErrorMessage className="min-h-400px" />
                  )}
                  {actionStatus === "success" && (
                    <>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <TableHeading
                            filterProp={[filter, setFilter]}
                            columns={[
                              {
                                name: "name",
                                heading: "Nama Racikan",
                                width: "25%",
                              },
                              {
                                name: "total",
                                heading: "Jml.",
                                width: "10%",
                              },
                              {
                                name: "use_time",
                                heading: "Waktu Pakai",
                                width: "25%",
                              },
                              {
                                name: "suggestion_use",
                                heading: "Anjuran Pakai",
                                width: "20%",
                              },
                              {
                                name: "medicine_count",
                                heading: "Obat",
                                width: "10%",
                              },
                              {
                                name: "note",
                                heading: "Ket.",
                                width: "50%",
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
                            {actionData.data.length === 0 && (
                              <tr>
                                <td colSpan={4}>
                                  <center className="text-gray-600">
                                    Belum ada data yang dapat ditampilkan
                                  </center>
                                </td>
                              </tr>
                            )}
                            {actionData.data.map((data, key) => {
                              const action = data
                              return (
                                <ConditionalTr
                                  key={`data-table-${key}`}
                                  backgroundColor={() => {
                                    if (
                                      recipeQuery?.data?.status === "cancel"
                                    ) {
                                      return "rgba(203, 0, 63, 0.1) !important"
                                    }

                                    return ""
                                  }}
                                >
                                  <th className="align-middle text-gray-700">
                                    {action.name}
                                  </th>
                                  <th
                                    className="align-middle text-gray-700 "
                                    style={{ paddingLeft: "20px" }}
                                  >
                                    {action.total}
                                  </th>
                                  <th className="align-middle text-gray-700">
                                    {action.use_time}
                                  </th>
                                  <th className="align-middle text-gray-700">
                                    {action.suggestion_use}
                                  </th>
                                  <th
                                    className="align-middle text-gray-700"
                                    style={{ paddingLeft: "20px" }}
                                  >
                                    {action.medicine_count}
                                  </th>
                                  <th className="align-middle text-gray-700">
                                    {action.note}
                                  </th>
                                  <th className="align-middle text-gray-700">
                                    <div className="d-flex">
                                      <ButtonLightStyled
                                        onClick={() => navigate(`${action.id}`)}
                                        className="btn btn-icon btn-light-primary"
                                      >
                                        <ArrowRightIcon />
                                      </ButtonLightStyled>
                                    </div>
                                  </th>
                                </ConditionalTr>
                              )
                            })}
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
              <CommentRecipe />
            </div>
          </div>
        </div>
      </div>
      {location.pathname.includes(`create`) && (
        <CreateConcoction
          receiptId={receiptId}
          query={`visit-recipe-${receiptId}-concoction-listing`}
        />
      )}
    </>
  )
}
