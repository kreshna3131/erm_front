import { ReactComponent as Plus } from "assets/icons/plus.svg"
import { ReactComponent as Search } from "assets/icons/search.svg"
import axios from "axios"
import clsx from "clsx"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import DeleteAction from "components/table/DeleteAction"
import DeleteModal from "components/table/DeleteModal"
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
import {
  Link,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom"

/**
 * Data menu breadcrumb
 */
const breadCrumbJson = {
  title: "Role",
  items: [{ text: "Role", path: null }],
}

/**
 * Komponen utama list role
 */
export default function Index() {
  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("role")
  const { id: paramId } = useParams()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
  })
  const { user: loggedUser, allPermissions } = useOutletContext()
  useCheckPermission(loggedUser, "lihat role")

  const { data, status } = useQuery(["role", filter], async (key) => {
    return axios
      .get("/role/listing", {
        params: key.queryKey[1],
      })
      .then((res) => res.data)
  })

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
                        !allPermissions.includes("tambah role")
                          ? ""
                          : "/role/create"
                      )
                    }
                    disabled={!allPermissions.includes("tambah role")}
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
                            name: "name",
                            heading: "Role",
                            width: "30%",
                          },
                          {
                            name: "note",
                            heading: "Deskripsi",
                            width: "30%",
                          },
                          {
                            name: "created_at",
                            heading: "Dibuat Pada",
                            width: "30%",
                          },
                          {
                            heading: "Tindakan",
                            width: "10%",
                            sort: false,
                          },
                        ]}
                      />
                      <tbody>
                        {data?.data.length === 0 && (
                          <tr>
                            <td colSpan={4}>
                              <center className="text-gray-600">
                                Belum ada data yang dapat ditampilkan
                              </center>
                            </td>
                          </tr>
                        )}
                        {data?.data.map((data, key) => (
                          <HoverBorderedTr key={`data-table-${key}`}>
                            <td className="align-middle text-gray-700">
                              {data.name}
                            </td>
                            <td className="align-middle text-gray-700">
                              {data.note}
                            </td>
                            <td className="align-middle text-gray-700">
                              {data.created_at}
                            </td>
                            <td>
                              <div className="d-flex">
                                <EditAction
                                  url={`/role/${data.id}`}
                                  className={clsx({
                                    "me-2": true,
                                    disabled:
                                      !allPermissions.includes("ubah role"),
                                  })}
                                />
                                {![1, 2].includes(data.id) && (
                                  <DeleteAction
                                    className={clsx({
                                      disabled:
                                        !allPermissions.includes("hapus role"),
                                    })}
                                    onClick={() => {
                                      navigate(
                                        `/role/${data.id}/delete?name=${data.name}`
                                      )
                                    }}
                                  />
                                )}
                              </div>
                            </td>
                          </HoverBorderedTr>
                        ))}
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
      {location.pathname.includes("delete") && paramId && (
        <DeleteModal
          url={`/role/delete/${paramId}`}
          query="role"
          htmlMessage={`
          <p className="text-gray-600">
            Role ini mungkin memiliki data penting. Delegasikan ke role 'Tidak Punya Role'.
          </p>
          <p className="text-gray-600">
            Anda yakin ingin menghapus ${searchParams.get("name")}
          </p>
          `}
          successMessage={`Anda telah menghapus ${searchParams.get(
            "name"
          )} dari basis data!`}
        />
      )}
    </>
  )
}
