import BlueGlass from "assets/icons/blue-glass.png"
import { ReactComponent as Checklist } from "assets/icons/checklist.svg"
import { ReactComponent as Clock } from "assets/icons/clock.svg"
import { ReactComponent as CrossSign } from "assets/icons/cross-sign.svg"
import { ReactComponent as PrimaryArrow } from "assets/icons/primary-arrow-right.svg"
import { ReactComponent as PrimaryExclamationIcon } from "assets/icons/primary-exclamation.svg"
import { ReactComponent as Search } from "assets/icons/search.svg"
import YellowPencil from "assets/icons/yellow-pencil.png"
import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import TableFooter from "components/table/TableFooter"
import TableHeading from "components/table/TableHeading"
import { HoverBorderedTrBg } from "components/table/TableRow"
import { isTruncated, truncate } from "helpers/string-helper"
import useBreadcrumb from "hooks/useBreadcrumb"
import useSidebarActiveMenu, {
  useOpenAccordionMenu,
} from "hooks/useSidebarActiveMenu"
import _ from "lodash"
import { useRef, useState } from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"
import FilterButton from "./FilterButton"

/** Panjang text truncate untuk kolom `di buat oleh` */
const createdByTruncateLength = 15

/**
 * Skema data breadcrumb
 */
const breadCrumbJson = {
  title: "Laboratorium",
  items: [
    { text: "Laboratorium", path: "/laboratory/request" },
    { text: "Hasil", path: null },
  ],
}

/**
 * Komponen utama halaman list laboratorium dari semua user
 */
export default function Index() {
  const navigate = useNavigate()
  useBreadcrumb(breadCrumbJson)
  useOpenAccordionMenu("laboratory")
  useSidebarActiveMenu("laboratory-result")
  const [filter, setFilter] = useState({
    order_by: "",
    order_dir: "",
    search: "",
    page: 1,
    pagination: 10,
    periode: [],
    status: "",
    is_read: "",
  })

  /**
   * Logic pencarian data laboratorium
   */
  const setSearchValue = useRef(
    _.debounce((value) => {
      setFilter({
        ...filter,
        page: 1,
        search: value,
      })
    }, 1000)
  )

  /**
   * Mengambil data laboratorium
   */
  const { data: labData, status: labStatus } = useQuery(
    ["laboratory-listing-result", filter],
    async (key) =>
      axios
        .get("/visit/laboratorium/listingResult", {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
  )

  return (
    <div className="post d-flex flex-column-fluid" id="kt_post">
      <div id="kt_content_container" className="container-fluid">
        <div className="card">
          <div className="card-header border-0 pt-6">
            <div className="card-toolbar w-100 w-sm-300px">
              <div className="d-flex flex-center">
                {labStatus === "success" && (
                  <>
                    <PrimaryExclamationIcon className="me-3" />
                    <p className="text-gray-600 m-0">
                      {labData?.done_count} Permintaan sudah ada hasil
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="card-title align-items-sm-center flex-column flex-sm-row">
              <div className="d-flex align-items-center position-relative w-full w-sm-250px mb-2 mb-sm-0 me-7">
                <span className="svg-icon svg-icon-1 position-absolute ms-4">
                  <Search />
                </span>
                <input
                  type="text"
                  data-kt-user-table-filter="search"
                  className="form-control form-control-solid ps-14"
                  placeholder="Search"
                  onKeyUp={(event) => {
                    setSearchValue.current(event.target.value)
                  }}
                />
              </div>
              <FilterButton
                filterProps={[filter, setFilter]}
                labStatus={labStatus}
              />
            </div>
          </div>
          <div className="card-body p-10">
            {labStatus === "loading" && (
              <PrimaryLoader className="min-h-400px" />
            )}
            {labStatus === "error" && <ErrorMessage className="min-h-400px" />}
            {labStatus === "success" && (
              <>
                <div className="table-responsive">
                  <table className="table" style={{ minWidth: "1000px" }}>
                    <TableHeading
                      filterProp={[filter, setFilter]}
                      columns={[
                        {
                          name: "unique_id",
                          heading: "ID Permintaan",
                          width: "15%",
                        },
                        {
                          name: "created_at",
                          heading: "Tanggal Dibuat",
                          width: "20%",
                        },
                        {
                          name: "created_by",
                          heading: "Dibuat Oleh",
                          width: "13%",
                        },
                        {
                          name: "status",
                          heading: "Status",
                          width: "8%",
                        },
                        {
                          name: "created_for",
                          heading: "Nama pasien",
                          width: "20%",
                        },
                        {
                          name: "created_at",
                          heading: "Selesai pada",
                          width: "20%",
                        },
                        {
                          heading: "",
                          width: "13%",
                          sort: false,
                        },
                      ]}
                    />
                    <tbody>
                      {labData && labData?.data.length === 0 && (
                        <tr>
                          <td colSpan={6}>
                            <center className="text-gray-600">
                              Belum ada data yang dapat ditampilkan
                            </center>
                          </td>
                        </tr>
                      )}
                      {labData?.data.map((data, key) => {
                        const dynamicBg =
                          data.is_read === 0
                            ? "#ecf7f6"
                            : data.status === "cancel"
                            ? "#fbebf0"
                            : ""
                        return (
                          <HoverBorderedTrBg
                            key={`data-table-${key}`}
                            dynamicBg={dynamicBg}
                          >
                            <td className="align-middle text-gray-700">
                              {data.unique_id}
                            </td>
                            <td className="align-middle text-gray-700">
                              {data.created_at}
                            </td>
                            <td className="align-middle text-gray-700">
                              {data.created_by &&
                              isTruncated(
                                data.created_by,
                                createdByTruncateLength
                              ) ? (
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id={`tooltip-${key}`}>
                                      {data.created_by}
                                    </Tooltip>
                                  }
                                >
                                  <span>
                                    {truncate(
                                      data.created_by,
                                      createdByTruncateLength
                                    )}
                                  </span>
                                </OverlayTrigger>
                              ) : (
                                <>{data.created_by}</>
                              )}
                            </td>
                            <td className="align-middle text-gray-700">
                              {data.status === "progress" && (
                                <span style={{ marginLeft: "8px" }}>
                                  <img src={BlueGlass} alt={BlueGlass} />
                                </span>
                              )}
                              {data.status === "waiting" && (
                                <span style={{ marginLeft: "8px" }}>
                                  <Clock />
                                </span>
                              )}
                              {data.status === "fixing" && (
                                <span style={{ marginLeft: "8px" }}>
                                  <img src={YellowPencil} alt={YellowPencil} />
                                </span>
                              )}
                              {data.status === "done" && (
                                <span style={{ marginLeft: "8px" }}>
                                  <Checklist />
                                </span>
                              )}
                              {data.status === "cancel" && (
                                <span style={{ marginLeft: "8px" }}>
                                  <CrossSign />
                                </span>
                              )}
                            </td>
                            <td className="align-middle text-gray-700">
                              {data.created_for &&
                              isTruncated(
                                data.created_for,
                                createdByTruncateLength
                              ) ? (
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id={`tooltip-${key}`}>
                                      {data.created_for}
                                    </Tooltip>
                                  }
                                >
                                  <span>
                                    {truncate(
                                      data.created_for,
                                      createdByTruncateLength
                                    )}
                                  </span>
                                </OverlayTrigger>
                              ) : (
                                <>{data.created_for}</>
                              )}
                            </td>
                            <td className="align-middle">{data.done_at}</td>
                            <td className="align-middle ">
                              <ButtonLightStyled
                                className="btn btn-light-primary p-3"
                                onClick={() =>
                                  navigate(`/laboratory/result/${data.id}`)
                                }
                              >
                                <PrimaryArrow />
                              </ButtonLightStyled>
                            </td>
                          </HoverBorderedTrBg>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <TableFooter data={labData} filterProp={[filter, setFilter]} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
