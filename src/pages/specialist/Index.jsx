import { ReactComponent as Search } from "assets/icons/search.svg"
import axios from "axios"
import DeleteAction from "components/table/DeleteAction"
import DeleteModal from "components/table/DeleteModal"
import EditAction from "components/table/SpecialistEditAction"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import useBreadcrumb from "hooks/useBreadcrumb"
import useCheckPermission from "hooks/useCheckPermission"
import useSidebarActiveMenu from "hooks/useSidebarActiveMenu"
import _ from "lodash"
import { useRef, useState } from "react"
import { useQuery } from "react-query"
import { HoverBorderedTr } from "components/table/TableRow"

import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom"
import Create from "./Create"
import Edit from "./Edit"
import PrimaryLoader from "components/Loader"
import clsx from "clsx"

/**
 * Data menu breadcrumb
 */
const breadCrumbJson = {
  title: "Spesialis",
  items: [{ text: "Spesialis", path: null }],
}

/**
 * Komponen utama halaman list spesialis
 */
export default function Index() {
  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("specialist")
  const navigate = useNavigate()
  const { id: paramId } = useParams()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
  })
  const { user: loggedUser, allPermissions } = useOutletContext()
  useCheckPermission(loggedUser, "lihat spesialis")

  const { data, status } = useQuery(["specialist", filter], async (key) => {
    return axios
      .get("/specialist/listing", {
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
          <div className="row">
            <div className="col-md-4">
              <Create />
            </div>
            <div className="col-md-8">
              <div className="card">
                <div className="card-header flex-column border-0 p-7 pb-0">
                  <h1>Daftar spesialis</h1>
                  <p className="text-gray-600">
                    Terdapat {data?.total} spesialis pada rumah sakit Anda.
                  </p>
                  <div className="d-flex justify-content-between">
                    <div className="card-toolbar"></div>
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
                </div>
                <div className="card-body p-10">
                  {status === "loading" && (
                    <PrimaryLoader className="min-h-300px" />
                  )}
                  {status === "error" && (
                    <div className="py-10 d-flex flex-center">
                      <p className="text-gray-600">Error ...</p>
                    </div>
                  )}
                  {status === "success" && (
                    <>
                      <div className="table-responsive">
                        <table className="table" style={{ minWidth: "700px" }}>
                          <TableHeading
                            filterProp={[filter, setFilter]}
                            columns={[
                              {
                                name: "name",
                                heading: "Nama",
                                width: "35%",
                              },
                              {
                                name: "doctor_count",
                                heading: "Dokter",
                                width: "15%",
                              },
                              {
                                name: "created_at",
                                heading: "Dibuat Pada",
                                width: "40%",
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
                                  {data.doctor_count}
                                </td>
                                <td className="align-middle text-gray-700">
                                  {data.created_at}
                                </td>
                                <td>
                                  <div className="d-flex">
                                    <EditAction
                                      onClick={() =>
                                        navigate("/specialist/" + data.id)
                                      }
                                      className={clsx({
                                        "me-2": true,
                                        disabled:
                                          !allPermissions.includes(
                                            "ubah spesialis"
                                          ),
                                      })}
                                    />
                                    <DeleteAction
                                      className={clsx({
                                        disabled:
                                          !allPermissions.includes(
                                            "hapus spesialis"
                                          ),
                                      })}
                                      onClick={() => {
                                        navigate(
                                          `/specialist/${data.id}/delete?name=${data.name}`
                                        )
                                      }}
                                    />
                                  </div>
                                </td>
                              </HoverBorderedTr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <TableFooter
                        data={data}
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
      {location.pathname.includes("delete") && paramId && (
        <DeleteModal
          url={`/specialist/delete/${paramId}`}
          query="specialist"
          message={`Anda yakin ingin menghapus ${searchParams.get("name")}?`}
          successMessage={`Anda telah menghapus ${searchParams.get(
            "name"
          )} dari basis data!`}
        />
      )}
      {!location.pathname.includes("delete") && paramId && (
        <Edit id={paramId} />
      )}
    </>
  )
}
