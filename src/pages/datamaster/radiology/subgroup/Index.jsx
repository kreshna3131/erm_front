import axios from "axios"
import _ from "lodash"
import React, { useRef, useState } from "react"
import { OverlayTrigger, Table, Tooltip } from "react-bootstrap"
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
import DeleteModal from "components/table/DeleteModal"
import EditAction from "components/table/SpecialistEditAction"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import useBreadcrumb from "hooks/useBreadcrumb"
import useCheckPermission from "hooks/useCheckPermission"
import useSidebarActiveMenu, {
  useOpenAccordionMenu,
} from "hooks/useSidebarActiveMenu"
import Create from "./Create"
import Edit from "./Edit"
import { isTruncated, truncate } from "helpers/string-helper"
import { globalStyle } from "helpers/react-select"
import Select from "react-select"
import DeleteModalSubGroup from "./DeleteModalSubGroup"
import { HoverBorderedTrBg } from "components/table/TableRow"
import PrimaryLoader from "components/Loader"
import clsx from "clsx"

// skema breadcumb
const breadCrumbJson = {
  title: "Tindakan",
  items: [
    { text: "Data Master", path: "data-master/radiology/group" },
    { text: "Radiologi", path: "data-master/radiology/group" },
    { text: "Tindakan", path: null },
  ],
}

// komponen utama subgroup
export default function Index() {
  useBreadcrumb(breadCrumbJson)
  useOpenAccordionMenu(["master", "master-radiology"])
  useSidebarActiveMenu("data-master/radiology/sub-group")
  const navigate = useNavigate()
  const { id: paramId } = useParams()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    group: "",
    pagination: 10,
  })
  const { allPermissions } = useOutletContext()

  // const { user: loggedUser } = useOutletContext()
  // useCheckPermission(loggedUser, "lihat spesialis")

  const groupTruncateLength = 15

  // mengambil listing sub group
  const { data, status } = useQuery(
    ["master-radiology-sub-group", filter],
    async (key) => {
      return axios
        .get("/master/radiology/tindakan/listing", {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
    }
  )

  // mengambil listing group
  const { data: groupData, status: groupStatus } = useQuery(
    "master-radiology-sub-group-listing-group",
    async (key) => {
      return axios
        .get("/master/radiology/tindakan/listing-group")
        .then((res) => res.data)
    }
  )

  // logic untuk option group
  const dataSelect =
    groupStatus === "success" &&
    groupData.map((v) => ({
      label: v.name,
      value: v.id,
    }))

  const select = { label: "Semua group", value: "" }
  const newDataSelect = groupData && [select].concat(dataSelect)

  // logic untuk search di sub group
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
                  <h1>Daftar Tindakan</h1>
                  <p className="text-gray-600">
                    Total ada {data?.total} tindakan radiologi.
                  </p>
                  <div className="d-flex justify-content-between">
                    <div className="card-toolbar">
                      <form
                        action=""
                        method="post"
                        onSubmit={(event) => {
                          event.preventDefault()
                        }}
                      >
                        <div
                          className="form-group  "
                          style={{ width: "250px" }}
                        >
                          <Select
                            options={newDataSelect}
                            value={{
                              label:
                                newDataSelect?.filter((is_read) => {
                                  return is_read.value === filter.group
                                })?.[0]?.label ?? "Select",
                              value: filter.group,
                            }}
                            onChange={(option) => {
                              setFilter({
                                ...filter,
                                ...{
                                  group: option.value,
                                },
                              })
                            }}
                            name="group"
                            id="group"
                            styles={globalStyle}
                            noOptionsMessage={() => "Data tidak ditemukan"}
                            components={{
                              IndicatorSeparator: "",
                            }}
                          />
                        </div>
                      </form>
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
                      <Table hover responsive>
                        <TableHeading
                          filterProp={[filter, setFilter]}
                          columns={[
                            {
                              name: "name",
                              heading: "Nama",
                              width: "25%",
                            },
                            {
                              name: "group_name",
                              heading: "Group",
                              width: "30%",
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
                              <th className="align-middle text-gray-700 ">
                                {data.group_name &&
                                isTruncated(
                                  data.group_name,
                                  groupTruncateLength
                                ) ? (
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip id={`tooltip-${key}`}>
                                        {data.group_name}
                                      </Tooltip>
                                    }
                                  >
                                    <span>
                                      {truncate(
                                        data.group_name,
                                        groupTruncateLength
                                      )}
                                    </span>
                                  </OverlayTrigger>
                                ) : (
                                  <>{data.group_name}</>
                                )}
                              </th>
                              <th className="align-middle text-gray-700">
                                {data.created_at}
                              </th>
                              <th>
                                <div className="d-flex">
                                  <EditAction
                                    onClick={() =>
                                      navigate(
                                        "/data-master/radiology/sub-group/" +
                                          data.id
                                      )
                                    }
                                    className={clsx({
                                      "me-2": true,
                                      disabled: !allPermissions.includes(
                                        "ubah sub group tindakan"
                                      ),
                                    })}
                                  />
                                  <DeleteAction
                                    onClick={() => {
                                      navigate(
                                        `/data-master/radiology/sub-group/${data.id}/delete?name=${data.name}`
                                      )
                                    }}
                                    className={clsx({
                                      disabled: !allPermissions.includes(
                                        "hapus sub group tindakan"
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

      {location.pathname.includes("delete") && paramId && (
        <DeleteModalSubGroup
          url={`/master/radiology/tindakan/${paramId}/delete`}
          query="master-radiology-sub-group"
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
