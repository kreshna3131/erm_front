import { ReactComponent as ExclamationIcon } from "assets/icons/primary-exclamation.svg"
import { ReactComponent as PrimaryEyeIcon } from "assets/icons/primary-eye.svg"
import { ReactComponent as HexagonalIcon } from "assets/icons/primary-hexagonal.svg"
import { ReactComponent as Search } from "assets/icons/search.svg"
import { ReactComponent as WarningEyeIcon } from "assets/icons/warning-eye.svg"
import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import useBreadcrumb from "hooks/useBreadcrumb"
import useSidebarActiveMenu from "hooks/useSidebarActiveMenu"
import _ from "lodash"
import { useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useLocation, useNavigate } from "react-router"
import { HoverBorderedTr } from "components/table/TableRow"
import PrimaryLoader, { ErrorMessage } from "components/Loader"

/**
 * Data menu breadcrumb
 */
const breadCrumbJson = {
  title: "Pengaturan Assesmen",
  items: [{ text: "Pengaturan Asessmen", path: null }],
}

/**
 * Komponen utama halaman list asesmen
 */
export default function Index() {
  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("assessment-setting")

  const navigate = useNavigate()
  const location = useLocation()
  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
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

  const { data: settingData, status: settingStatus } = useQuery(
    ["template", filter],
    async (key) =>
      axios
        .get("/template/listing", {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
  )

  return (
    <div className="post d-flex flex-column-fluid" id="kt_post">
      <div id="kt_content_container" className="container-fluid">
        <div className="card">
          <div className="card-header border-0 pt-6">
            <div className="card-toolbar">
              {settingStatus === "success" && (
                <div
                  className="d-flex justify-content-end"
                  data-kt-user-table-toolbar="base"
                >
                  <span className="text-gray-600">
                    <ExclamationIcon className="me-2" />
                    {settingData.active_data} dari {settingData.data.length}{" "}
                    assesmen sudah siap digunakan
                  </span>
                </div>
              )}
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
            {settingStatus === "loading" && (
              <PrimaryLoader className="min-h-400px" />
            )}
            {settingStatus === "error" && (
              <ErrorMessage className="min-h-400px" />
            )}
            {settingStatus === "success" && (
              <>
                <div className="table-responsive">
                  <table className="table">
                    <TableHeading
                      filterProp={[filter, setFilter]}
                      columns={[
                        {
                          name: "type",
                          heading: "Jenis Assesmen",
                          width: "20%",
                        },
                        {
                          name: "name",
                          heading: "Judul",
                          width: "35%",
                        },
                        {
                          name: "updated_at",
                          heading: "Terakhir diubah",
                          width: "35%",
                        },
                        {
                          heading: "Visibilitas",
                          width: "20%",
                          sort: false,
                        },
                        {
                          heading: "Tindakan",
                          width: "20%",
                          sort: false,
                        },
                      ]}
                    />
                    <tbody>
                      {settingData?.data.length === 0 && (
                        <tr>
                          <td colSpan={4}>
                            <center className="text-gray-600">
                              Belum ada data yang dapat ditampilkan
                            </center>
                          </td>
                        </tr>
                      )}
                      {settingData?.data.map((data, key) => (
                        <HoverBorderedTr key={`data-table-${key}`}>
                          <td className="align-middle text-gray-700">
                            {data.type}
                          </td>
                          <td className="align-middle text-gray-700">
                            {data.name}
                          </td>
                          <td className="align-middle text-gray-700">
                            {data.updated_at}
                          </td>
                          <td>
                            <div className="d-flex">
                              <VisibilityIcon
                                id={data.id}
                                visibility={data.visibility}
                              />
                            </div>
                          </td>
                          <td>
                            <ButtonLightStyled
                              onClick={() =>
                                navigate(location.pathname + "/" + data.id)
                              }
                              className="btn btn-icon btn-light-primary"
                            >
                              <HexagonalIcon />
                            </ButtonLightStyled>
                          </td>
                        </HoverBorderedTr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <TableFooter
                  data={settingData}
                  filterProp={[filter, setFilter]}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Tombol untuk mengubah visibility
 * @param {Object} props
 * @param {boolean} props.visibility
 * @returns
 */
export function VisibilityIcon({ id, visibility }) {
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const { mutate } = useMutation(
    async ({ data, id }) => {
      setLoading(true)
      return axios
        .post("/template/update-status/" + id, data)
        .then((res) => res.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("template")
        queryClient.invalidateQueries("template-" + id)
        setLoading(false)
      },
      onError: () => {
        setLoading(false)
      },
    }
  )

  return (
    <ButtonLightStyled
      disabled={loading}
      onClick={() =>
        mutate({
          data: {
            _method: "PATCH",
            visibility: visibility ? 0 : 1,
          },
          id: id,
        })
      }
      className={`btn btn-icon btn-light-${visibility ? "primary" : "warning"}`}
    >
      {visibility ? <PrimaryEyeIcon /> : <WarningEyeIcon />}
    </ButtonLightStyled>
  )
}
