import axios from "axios"
import _ from "lodash"
import React, { useRef, useState } from "react"
import { Table } from "react-bootstrap"
import { useQuery } from "react-query"
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom"
import { ReactComponent as Search } from "assets/icons/search.svg"
import DeleteAction from "components/table/DeleteAction"
import EditAction from "components/table/SpecialistEditAction"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import useBreadcrumb from "hooks/useBreadcrumb"
import useSidebarActiveMenu, {
  useOpenAccordionMenu,
} from "hooks/useSidebarActiveMenu"
import Create from "./Create"
import Edit from "./Edit"
import Delete from "./Delete"
import { HoverBorderedTrBg } from "components/table/TableRow"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import clsx from "clsx"

// skema breadcumb
const breadCrumbJson = {
  title: "Group",
  items: [
    { text: "Data Master", path: "data-master/radiology/group" },
    { text: "Radiologi", path: "data-master/radiology/group" },
    { text: "Group", path: null },
  ],
}

// komponen utama dari group
export default function Index() {
  useBreadcrumb(breadCrumbJson)
  useOpenAccordionMenu(["master", "master-radiology"])
  useSidebarActiveMenu("data-master/radiology/group")
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
  const { allPermissions } = useOutletContext()

  //mengambil listing radiology group
  const { data, status } = useQuery(
    ["master-radiology-group", filter],
    async (key) => {
      return axios
        .get("/master/radiology/group/listing", {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
    }
  )

  // logic search data di group
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
                  <h1>Daftar Group</h1>
                  <p className="text-gray-600">
                    Total ada {data?.total} group untuk tindakan radiologi.
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
                    <ErrorMessage className="min-h-300px" />
                  )}
                  {status === "success" && (
                    <>
                      <Table hover responsive>
                        <TableHeading
                          filterProp={[filter, setFilter]}
                          columns={[
                            {
                              name: "name",
                              heading: "Nama",
                              width: "30%",
                            },
                            {
                              name: "sub_count",
                              heading: "Tindakan",
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
                            <HoverBorderedTrBg key={`data-table-${key}`}>
                              <th className="align-middle text-gray-700">
                                {data.name}
                              </th>
                              <th className="align-middle text-gray-700 ps-10">
                                {data.sub_count}
                              </th>
                              <th className="align-middle text-gray-700">
                                {data.created_at}
                              </th>
                              <th>
                                <div className="d-flex">
                                  <EditAction
                                    onClick={() =>
                                      navigate(
                                        "/data-master/radiology/group/" +
                                          data.id
                                      )
                                    }
                                    className={clsx({
                                      "me-2": true,
                                      disabled: !allPermissions.includes(
                                        "ubah group tindakan"
                                      ),
                                    })}
                                  />
                                  <DeleteAction
                                    onClick={() => {
                                      navigate(
                                        `/data-master/radiology/group/${data.id}/delete?name=${data.name}`
                                      )
                                    }}
                                    className={clsx({
                                      disabled: !allPermissions.includes(
                                        "hapus group tindakan"
                                      ),
                                    })}
                                  />
                                </div>
                              </th>
                            </HoverBorderedTrBg>
                          ))}
                        </tbody>
                      </Table>
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

      {/* ini delete spesial, jan dikasih method delete, tapi masukin data groupnya */}
      {location.pathname.includes("delete") && paramId && (
        <Delete
          url={`/master/radiology/group/${paramId}/delete`}
          query="master-radiology-group"
          idProps={paramId}
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
