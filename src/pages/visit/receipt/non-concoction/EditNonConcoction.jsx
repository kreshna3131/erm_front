import { ReactComponent as PlusIcon } from "assets/icons/plus.svg"

import { ReactComponent as SearchIcon } from "assets/icons/search.svg"

import axios from "axios"
import DeleteAction from "components/table/DeleteAction"
import DeleteModalMethode from "components/table/DeleteModalMethode"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"

import useBreadcrumb from "hooks/useBreadcrumb"
import _ from "lodash"
import React, { useEffect, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useLocation, useNavigate, useParams } from "react-router"
import { Link, useSearchParams } from "react-router-dom"
import styled from "styled-components"

import TabMenuRecipe from "../../TabMenuRecipe"
import Create from "./Create"
import SpecialistEditAction from "components/table/SpecialistEditAction"
import EditMedicine from "./EditMedicine"
import ToolbarRecipe from "../ToolbarRecipe"
import CommentRecipe from "../CommentRecipe"
import { HoverBorderedTrBg } from "components/table/TableRow"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import clsx from "clsx"

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

// komponen utama Non Racikan
export default function EditNonConcoction() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id: visitId, receiptId, medicineId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [breadCrumbJson, setBreadCrumbJson] = useState(initialBreadCrumbJson)
  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
  })

  useBreadcrumb(breadCrumbJson)

  // pengaturan route di pharmacy dan recipe
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

  // get edit data medicine non-concoction
  const recipeQuery = useQuery(
    `visit-${visitId}-recipe-${receiptId}`,
    async () =>
      axios.get(`/visit/recipe/${receiptId}/edit`).then((res) => res.data)
  )
  const recipeData = recipeQuery.data

  // get listing data non-concoction
  /** @type {import("interfaces/laboratorium").Laboratorium} */
  const { data: actionData, status: actionStatus } = useQuery(
    [`visit-recipe-${receiptId}-non-concoction-listing`, filter],
    async (key) =>
      axios
        .get(`/visit/recipe/${receiptId}/non-concoction/listing`, {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
  )

  // skema pencarian obat di non racikan
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
                        to={
                          ["cancel", "done"].includes(recipeData?.status)
                            ? ""
                            : "create"
                        }
                        className={clsx({
                          "btn btn-primary": true,
                          "disabled cursor-not-allowed": [
                            "cancel",
                            "done",
                          ].includes(recipeData?.status),
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
                    <ErrorMessage className="min-h-300px" />
                  )}
                  {actionStatus === "success" && (
                    <>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <TableHeading
                            filterProp={[filter, setFilter]}
                            columns={[
                              {
                                name: "medicine_name",
                                heading: "Nama obat",
                                width: "20%",
                              },
                              {
                                name: "medicine_unit",
                                heading: "Satuan",
                                width: "10%",
                              },
                              {
                                name: "medicine_use_time",
                                heading: "Waktu Pakai",
                                width: "18%",
                              },
                              {
                                name: "medicine_suggestion_use",
                                heading: "Anjuran Pakai",
                                width: "25%",
                              },
                              {
                                name: "medicine_quantity",
                                heading: "QTY",
                                width: "10%",
                              },
                              {
                                name: "medicine_note",
                                heading: "Ket.",
                                width: "10%",
                              },
                              {
                                heading: "Tindakan",
                                width: "10%",
                                sort: false,
                              },
                            ]}
                          />
                          <tbody>
                            {actionData.data.length === 0 && (
                              <tr>
                                <td colSpan={12}>
                                  <center className="text-gray-600">
                                    Belum ada data yang dapat ditampilkan
                                  </center>
                                </td>
                              </tr>
                            )}
                            {actionData.data.map((data, key) => {
                              /** @type import("interfaces/laboratoriumAction").LaboratoriumAction */
                              const action = data
                              return (
                                <HoverBorderedTrBg
                                  disabled={["cancel", "done"].includes(
                                    recipeData?.status
                                  )}
                                  key={`data-table-${key}`}
                                >
                                  <th className="align-middle text-gray-700">
                                    {action.medicine_name}
                                  </th>
                                  <th className="align-middle text-gray-700">
                                    {action.medicine_unit}
                                  </th>
                                  <th className="align-middle text-gray-700">
                                    {action.medicine_use_time}
                                  </th>
                                  <th className="align-middle text-gray-700">
                                    {action.medicine_suggestion_use}
                                  </th>
                                  <th className="align-middle text-gray-700">
                                    {action.medicine_quantity}
                                  </th>
                                  <th className="align-middle text-gray-700">
                                    {action.medicine_note}
                                  </th>

                                  <th>
                                    <span className="d-flex">
                                      <SpecialistEditAction
                                        onClick={() =>
                                          navigate(`medicine/${action.id}/edit`)
                                        }
                                        className="me-1"
                                        condition={["cancel"].includes(
                                          recipeQuery?.data?.status
                                        )}
                                      />
                                      <DeleteAction
                                        onClick={() =>
                                          navigate(
                                            `medicine/${action.id}/delete?name=${action.medicine_name}`
                                          )
                                        }
                                        condition={["cancel"].includes(
                                          recipeQuery?.data?.status
                                        )}
                                      />
                                    </span>
                                  </th>
                                </HoverBorderedTrBg>
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
      {location.pathname.includes(`medicine/${medicineId}/delete`) && (
        <DeleteModalMethode
          url={`/visit/recipe/${receiptId}/non-concoction/${medicineId}/destroy`}
          query={`visit-recipe-${receiptId}-non-concoction-listing`}
          message={`Anda yakin ingin menghapus obat ${searchParams.get(
            "name"
          )}?`}
          successMessage={`Anda telah menghapus obat ${searchParams.get(
            "name"
          )} dari basis data!`}
        />
      )}
      {location.pathname.includes(`create`) && (
        <Create
          receiptId={receiptId}
          query={`visit-recipe-${receiptId}-non-concoction-listing`}
        />
      )}
      {location.pathname.includes(`medicine/${medicineId}/edit`) && (
        <EditMedicine
          medicineId={medicineId}
          query={`visit-recipe-${receiptId}-non-concoction-listing`}
        />
      )}
    </>
  )
}
