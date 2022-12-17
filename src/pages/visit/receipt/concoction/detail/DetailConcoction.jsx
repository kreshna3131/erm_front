import axios from "axios"
import _ from "lodash"
import React, { useEffect, useRef, useState } from "react"
import { useQuery } from "react-query"
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom"
import { ReactComponent as Search } from "assets/icons/search.svg"
import DeleteAction from "components/table/DeleteAction"
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg"
import { ReactComponent as PrimaryArrowLeftIcon } from "assets/icons/primary-arrow-left.svg"
import { ReactComponent as DangerTrashIcon } from "assets/icons/danger-trash.svg"

import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import useBreadcrumb from "hooks/useBreadcrumb"
import useSidebarActiveMenu from "hooks/useSidebarActiveMenu"
import Edit from "./Edit"
import DeleteModalMethode from "components/table/DeleteModalMethode"
import { ButtonLightStyled, SpanLightStyled } from "components/Button"
import Create from "./Create"
import SpecialistEditAction from "components/table/SpecialistEditAction"
import EditMedicine from "./EditMedicine"
import { HoverBorderedTrBg } from "components/table/TableRow"

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
    {
      text: "Racikan",
      path: null,
    },
  ],
}

// komponen utama detail Racikan
export default function DetailConcoction() {
  useSidebarActiveMenu("visit")
  const navigate = useNavigate()
  const { id: visitId, receiptId, concoctionId, medicineId } = useParams()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const [breadCrumbJson, setBreadCrumbJson] = useState(initialBreadCrumbJson)
  useBreadcrumb(breadCrumbJson)

  // pengaturan route pharmacy dan recipe
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
            path: `/pharmacy/request/${visitId}/receipt/${receiptId}/concoction`,
          },
          {
            text: "Racikan",
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
            path: `visit/${visitId}/receipt/${receiptId}/concoction`,
          },
          {
            text: "Racikan",
            path: null,
          },
        ],
      })
    }
  }, [])
  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
  })

  // mengambil data edit resep untuk dikirim ke toolbar
  const recipeQuery = useQuery(
    `visit-${visitId}-recipe-${receiptId}`,
    async () =>
      axios.get(`/visit/recipe/${receiptId}/edit`).then((res) => res.data)
  )

  // mengambil data listing obat di racikan
  const { data: actionData, status: actionStatus } = useQuery(
    [`visit-recipe-concoction-${concoctionId}-listing`, filter],
    async (key) =>
      axios
        .get(`/visit/recipe/concoction/${concoctionId}/listing-medicine`, {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
  )

  // mengambil data edit untuk racikan
  const { data, status } = useQuery(
    `visit-recipe-${receiptId}-concoction-${concoctionId}`,
    async (key) => {
      return axios
        .get(`/visit/recipe/${receiptId}/concoction/${concoctionId}/edit`)
        .then((res) => res.data)
    }
  )

  // skema search obat di racikan
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
      <Toolbar data={data} recipeQuery={recipeQuery} />

      <div className="post d-flex flex-column-fluid pt-5 pt-lg-15" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              <Edit data={data} status={status} recipeQuery={recipeQuery} />
            </div>
            <div className="col-md-8">
              <div className="card">
                <div className="card-header border-0 pt-6">
                  <div className="card-toolbar">
                    <div
                      className="d-flex justify-content-end"
                      data-kt-user-table-toolbar="base"
                    >
                      {["cancel", "done"].includes(
                        recipeQuery?.data?.status
                      ) ? (
                        <span
                          className={`btn btn-primary ${
                            ["cancel", "done"].includes(
                              recipeQuery?.data?.status
                            )
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <PlusIcon />
                          Tambah
                        </span>
                      ) : (
                        <Link
                          to="medicine/create"
                          type="button"
                          className="btn btn-primary"
                        >
                          <PlusIcon />
                          Tambah
                        </Link>
                      )}
                    </div>
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
                  {actionStatus === "loading" && (
                    <div className="py-10 d-flex flex-center">
                      <p className="text-gray-600">Loading ...</p>
                    </div>
                  )}
                  {actionStatus === "error" && (
                    <div className="py-10 d-flex flex-center">
                      <p className="text-gray-600">Error ...</p>
                    </div>
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
                                heading: "Nama obat",
                                width: "30%",
                              },
                              {
                                name: "unit",
                                heading: "Satuan",
                                width: "20%",
                              },
                              {
                                name: "strength",
                                heading: "Kekuatan",
                                width: "20%",
                              },
                              {
                                name: "dose",
                                heading: "Dosis",
                                width: "20%",
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
                                <td colSpan={4}>
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
                                    recipeQuery?.data?.status
                                  )}
                                  key={`data-table-${key}`}
                                >
                                  <th className="align-middle text-gray-700">
                                    {action.name}
                                  </th>
                                  <th className="align-middle text-gray-700">
                                    {action.unit}
                                  </th>
                                  <th className="align-middle text-gray-700">
                                    {action.strength}
                                  </th>
                                  <th className="align-middle text-gray-700">
                                    {action.dose}
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
                                            `medicine/${action.id}/delete?name=${action.name}`
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
          </div>
        </div>
      </div>

      {location.pathname.includes(`${concoctionId}/delete`) && (
        <DeleteModalMethode
          url={`/visit/recipe/${receiptId}/concoction/${concoctionId}/destroy`}
          query={`visit-recipe-${receiptId}-concoction-${concoctionId}`}
          message={`Anda yakin ingin menghapus racikan ${searchParams.get(
            "name"
          )}?`}
          successMessage={`Anda telah menghapus racikan ${searchParams.get(
            "name"
          )} dari basis data!`}
          type={"back"}
        />
      )}
      {location.pathname.includes(`medicine/${medicineId}/delete`) && (
        <DeleteModalMethode
          url={`/visit/recipe/${receiptId}/concoction/${concoctionId}/medicine/${medicineId}/destroy`}
          query={`visit-recipe-concoction-${concoctionId}-listing`}
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
          concoctionId={concoctionId}
          query={`visit-recipe-concoction-${concoctionId}-listing`}
        />
      )}
      {location.pathname.includes(`medicine/${medicineId}/edit`) && (
        <EditMedicine
          medicineId={medicineId}
          query={`visit-recipe-concoction-${concoctionId}-listing`}
          receiptId={receiptId}
          concoctionId={concoctionId}
        />
      )}
    </>
  )
}

function Toolbar({ data, recipeQuery }) {
  const navigate = useNavigate()

  return (
    <div
      className="toolbar mt-n3 mt-lg-0"
      style={{ zIndex: 99 }}
      id="kt_toolbar"
    >
      <div className="container-fluid">
        <div className="row justify-content-between">
          <div className="col-sm-6 d-flex align-items-center mb-5 mb-sm-0">
            <ButtonLightStyled
              onClick={() => navigate(-1)}
              className="btn btn-icon btn-light-primary me-8"
            >
              <PrimaryArrowLeftIcon />
            </ButtonLightStyled>
            <h1 className="fs-3 mb-0">Racikan</h1>
          </div>
          <div
            className="col-sm-6 d-flex justify-content-start justify-content-sm-end"
            style={{ zIndex: 9999 }}
          >
            {["cancel", "done"].includes(recipeQuery?.data?.status) ? (
              <SpanLightStyled
                className={`btn btn-icon btn-light-danger ${
                  ["cancel", "done"].includes(recipeQuery?.data?.status)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <DangerTrashIcon />
              </SpanLightStyled>
            ) : (
              <ButtonLightStyled
                className="btn btn-icon btn-light-danger"
                onClick={() => navigate(`delete?name=${data.name}`)}
              >
                <DangerTrashIcon />
              </ButtonLightStyled>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
