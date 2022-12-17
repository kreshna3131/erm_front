import { ReactComponent as Plus } from "assets/icons/plus.svg"
import { ReactComponent as Search } from "assets/icons/search.svg"
import axios from "axios"
import clsx from "clsx"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import EditAction from "components/table/EditAction"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import { HoverBorderedTr } from "components/table/TableRow"
import useBreadcrumb from "hooks/useBreadcrumb"
import useCheckPermission from "hooks/useCheckPermission"
import useSidebarActiveMenu from "hooks/useSidebarActiveMenu"
import _ from "lodash"
import { useRef, useState } from "react"
import { useQuery } from "react-query"
import { Link, useNavigate, useOutletContext } from "react-router-dom"

/**
 * Data menu breadcrumb
 */
const breadCrumbJson = {
  title: "Pengguna",
  items: [{ text: "Pengguna", path: null }],
}

/**
 * Komponen utama halaman list user
 */
export default function Index() {
  const navigate = useNavigate()
  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("user")
  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
  })
  const { user: loggedUser, allPermissions } = useOutletContext()
  useCheckPermission(loggedUser, "lihat pengguna")

  /** Mengambil data semua user */
  const { data, status } = useQuery(["user", filter], async (key) => {
    return axios
      .get("/user/listing", {
        params: key.queryKey[1],
      })
      .then((res) => res.data)
  })

  /** Logic mencari user */
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
      <div className="post d-flex flex-column-fluid" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          <div className="card">
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
                        !allPermissions.includes("tambah pengguna")
                          ? ""
                          : "/user/create"
                      )
                    }
                    disabled={!allPermissions.includes("tambah pengguna")}
                    className="btn btn-primary me-3"
                  >
                    <Plus /> Tambah
                  </button>
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
              {status === "loading" && (
                <PrimaryLoader className="min-h-400px" />
              )}
              {status === "error" && <ErrorMessage className="min-h-400px" />}
              {status === "success" && (
                <>
                  <div className="table-responsive">
                    <table className="table" style={{ minWidth: "1000px" }}>
                      <TableHeading
                        filterProp={[filter, setFilter]}
                        columns={[
                          {
                            name: "user_name",
                            heading: "Nama",
                            width: "20%",
                          },
                          {
                            name: "role_name",
                            heading: "Role",
                            width: "10%",
                          },
                          {
                            name: "specialist_name",
                            heading: "Spesialis",
                            width: "10%",
                          },
                          {
                            name: "email",
                            heading: "Email",
                            width: "18%",
                          },
                          {
                            name: "status",
                            heading: "Status",
                            width: "7%",
                          },
                          {
                            name: "created_at",
                            heading: "Bergabung Pada",
                            width: "15%",
                          },
                          {
                            heading: "Tindakan",
                            width: "5%",
                            sort: false,
                          },
                        ]}
                      />
                      <tbody>
                        {data?.data.length === 0 && (
                          <tr>
                            <td className="py-10 align-middle" colSpan={7}>
                              <center className="text-gray-600">
                                Belum ada data yang dapat ditampilkan
                              </center>
                            </td>
                          </tr>
                        )}
                        {data?.data.map((data, key) => {
                          return (
                            <HoverBorderedTr key={`data-table-${key}`}>
                              <td className="align-middle text-gray-700">
                                {data.user_name}
                              </td>
                              <td className="align-middle text-gray-700">
                                {data.role_name}
                              </td>
                              <td className="align-middle text-gray-700">
                                {data.specialist_name ?? "-"}
                              </td>
                              <td className="align-middle text-gray-700">
                                {data.email}
                              </td>
                              <td className="align-middle text-gray-700">
                                {data.status === "Active" ? (
                                  <div className="badge px-8 py-2 bg-light-primary text-primary">
                                    {data.status}
                                  </div>
                                ) : (
                                  <div className="badge px-8 py-2 bg-light-danger text-danger">
                                    {data.status}
                                  </div>
                                )}
                              </td>
                              <td className="align-middle text-gray-700">
                                {data.created_at}
                              </td>
                              <td>
                                <div className="d-flex">
                                  <EditAction
                                    url={`/user/${data.id}`}
                                    className={clsx({
                                      "me-2": true,
                                      disabled:
                                        !allPermissions.includes(
                                          "ubah pengguna"
                                        ),
                                    })}
                                  />
                                </div>
                              </td>
                            </HoverBorderedTr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <TableFooter data={data} filterProp={[filter, setFilter]} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
