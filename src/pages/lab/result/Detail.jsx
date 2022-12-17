import { ReactComponent as PrimaryArrowLeftIcon } from "assets/icons/primary-arrow-left.svg"
import { ReactComponent as PrimaryExclamationIcon } from "assets/icons/primary-exclamation.svg"
import { ReactComponent as Search } from "assets/icons/search.svg"
import { ReactComponent as GrayArrowUpicon } from "assets/icons/table-sort-asc.svg"
import { ReactComponent as GrayArrowDownicon } from "assets/icons/table-sort-desc.svg"
import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import { nestedFilter } from "helpers/helper"
import useBreadcrumb from "hooks/useBreadcrumb"
import useDidMountEffect from "hooks/useDidMountEffect"
import useSidebarActiveMenu, {
  useOpenAccordionMenu,
} from "hooks/useSidebarActiveMenu"
import _ from "lodash"
import { LaboratoryStatus } from "pages/visit/laboratory/Edit"
import React, { useRef, useState } from "react"
import { useQuery } from "react-query"
import { useNavigate, useParams } from "react-router"
import DetailPatient from "./ButtonDetailPatient"
import CryptoJS from "crypto-js"
import { Buffer } from "buffer"
import { HoverBorderedTr } from "components/table/TableRow"

/**
 * Skema data breadcrumb
 */
const breadCrumbJson = {
  title: "Laboratorium",
  items: [
    { text: "Laboratorium", path: "/laboratory/request" },
    { text: "Hasil", path: "/laboratory/result" },
    { text: "Detail", path: null },
  ],
}

/**
 * Membuat code untuk header x-time API LIS
 */
function generateXtime() {
  return Math.floor(Date.now() / 1000) - new Date("1970-01-01 00:00:00") / 1000
}

/**
 * Membuat code untuk header x-time API LIS
 */
function generateXsign() {
  return Buffer.from(
    CryptoJS.HmacSHA256("testtesttest", "secretkey").toString()
  ).toString("base64")
}

async function getPemeriksaanData(labId) {
  const headers = {
    "X-cons": 330913001,
    "X-time": generateXtime(),
    "X-sign": generateXsign(),
  }

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    const res = await axios.get("/visit/laboratorium/result")
    return res.data.result.pemeriksaan
  }

  const fetchApi = await fetch(
    `${process.env.REACT_APP_API_LIS_BASE_URL}/getResult/json?no_laboratorium=${labId}`,
    {
      headers: headers,
    }
  )
  const jsonData = await fetchApi.json()
  return jsonData.response.data.pemeriksaan
}

/**
 * Komponen utama detail hasil laboratorium
 */
export default function Detail() {
  useBreadcrumb(breadCrumbJson)
  useOpenAccordionMenu("laboratory")
  useSidebarActiveMenu("laboratory-result")
  const { resultId } = useParams()
  const [resultData, setresultData] = useState(null)
  const [resultCount, setResultCount] = useState(0)
  const [treeSearch, setTreeSearch] = useState("")
  const [isRemaping, setIsRemaping] = useState(true)
  const [laboratoryId, setLaboratoryId] = useState()

  /**
   * Mengambil data hasil laboratorium dari ERM
   */
  const labQuery = useQuery(
    `visit-laboratorium-result-${resultId}`,
    async (key) =>
      axios
        .get(`/visit/laboratorium/${resultId}/edit`, {
          params: key.queryKey[1],
        })
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        setLaboratoryId(data.laboratorium_id ?? 3108220001)
      },
    }
  )

  /**
   * Mengubah struktur data hasil laboratorium
   */
  useDidMountEffect(() => {
    if (treeSearch === "") {
      labResultRefetch()
    } else {
      labResultRefetch().then((res) => {
        const data = res.data
        let newArray = []
        if (data !== undefined) {
          Object.keys(data).map((item, key) => {
            newArray = [
              ...newArray,
              {
                name: item,
                childs: Object.values(data)[key],
              },
            ]
          })
        }
        setresultData(nestedFilter(newArray, treeSearch))
      })
    }
  }, [treeSearch])

  /**
   * Mengambil data hasil laboratorium dari LIS
   */
  const { status: labResultStatus, refetch: labResultRefetch } = useQuery(
    `visit-laboratorium-result`,
    async () => getPemeriksaanData(laboratoryId),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: function (data) {
        let newArray = []
        if (data !== undefined) {
          Object.keys(data).map((item, key) => {
            newArray = [
              ...newArray,
              {
                name: item,
                childs: Object.values(data)[key],
              },
            ]

            if (key === Object.keys(data).length - 1) {
              setIsRemaping(false)
            }
          })

          if (Object.keys(data).length === 0) {
            setIsRemaping(false)
          }
        }
        setResultCount(newArray.length)
        setresultData(newArray)
      },
    }
  )

  useDidMountEffect(() => {
    labResultRefetch()
  }, [laboratoryId])

  /**
   * Logic pencarian hasil laboratorium
   */
  const setSearchValue = useRef(
    _.debounce((value) => {
      setTreeSearch(value)
    }, 1000)
  )

  return (
    <>
      <Toolbar labQuery={labQuery} />
      <div className="post d-flex flex-column-fluid pt-5 pt-lg-15" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          <div className="card">
            <div className="card-header border-0 pt-6">
              <div className="card-toolbar">
                <div className="d-flex flex-center">
                  <PrimaryExclamationIcon className="me-3" />
                  <p className="text-gray-600 m-0">
                    {resultCount} Permintaan sudah ada hasil
                  </p>
                </div>
              </div>
              <div className="card-title">
                <div className="d-flex align-items-center position-relative my-1 me-7">
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
              {(labResultStatus === "loading" || isRemaping) && (
                <PrimaryLoader className="min-h-400px" />
              )}
              {labResultStatus === "error" && !isRemaping && (
                <ErrorMessage className="min-h-400px" />
              )}
              {labResultStatus === "success" && resultData !== null && (
                <>
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="text-gray-600" width="28%">
                          Nama
                        </th>
                        <th className="text-gray-600" width="12%">
                          Unit
                        </th>
                        <th className="text-gray-600" width="12%">
                          Metode
                        </th>
                        <th className="text-gray-600" width="12%">
                          Tanda
                        </th>
                        <th className="text-gray-600" width="12%">
                          Hasil angka
                        </th>
                        <th className="text-gray-600" width="12%">
                          Hasil karakter
                        </th>
                        <th className="text-gray-600" width="12%">
                          Hasil memo
                        </th>
                      </tr>
                    </thead>
                    {!resultData.length ? (
                      <tbody>
                        <tr>
                          <td className="text-gray-700 text-center" colSpan={7}>
                            Data tidak ditemukan
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <TableBody data={resultData} />
                    )}
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Komponen table body hasil laboratorium
 */
function TableBody({ data }) {
  const depth = 0
  const [collapsed, setCollapsed] = useState([])
  return (
    <>
      <tbody>
        {data.map((item, key) => {
          return (
            <React.Fragment key={key}>
              {item.childs.length > 0 ? (
                <ParentTableRow
                  name={item.name}
                  data={item}
                  depth={depth + 1}
                  parentId={key.toString()}
                  collapsedState={[collapsed, setCollapsed]}
                />
              ) : (
                <ChildTableRow
                  data={item}
                  collapsedState={[collapsed, setCollapsed]}
                  parentId={key.toString()}
                  depth={depth + 1}
                />
              )}
            </React.Fragment>
          )
        })}
      </tbody>
    </>
  )
}

/**
 * Komponen parant table row yang memiliki fitur collapse
 */
function ParentTableRow({ data, depth, parentId, collapsedState }) {
  const [collapsed, setCollapsed] = collapsedState
  return (
    <>
      <HoverBorderedTr data-id={`${parentId}`}>
        <td className="text-gray-700 align-middle h-60px" width="28%">
          <span
            onClick={() => {
              if (!collapsed.includes(parentId)) {
                setCollapsed([...collapsed, parentId])
              } else {
                setCollapsed(collapsed.filter((x) => ![parentId].includes(x)))
              }
            }}
            className="cursor-pointer"
            style={{
              paddingLeft: depth - 1 + "rem",
              paddingRight: depth * 0.5 + "rem",
            }}
          >
            {!collapsed.includes(parentId) ? (
              <GrayArrowUpicon />
            ) : (
              <GrayArrowDownicon />
            )}
          </span>
          {data.name}
        </td>
        <td width="12%" className="text-gray-700 align-middle h-60px">
          -
        </td>
        <td width="12%" className="text-gray-700 align-middle h-60px">
          -
        </td>
        <td width="12%" className="text-gray-700 align-middle h-60px">
          -
        </td>
        <td width="12%" className="text-gray-700 align-middle h-60px">
          -
        </td>
        <td width="12%" className="text-gray-700 align-middle h-60px">
          -
        </td>
        <td width="12%" className="text-gray-700 align-middle h-60px">
          -
        </td>
      </HoverBorderedTr>
      {!collapsed.includes(parentId) &&
        data.childs?.length &&
        data.childs?.map((item, key) => {
          return (
            <React.Fragment key={key}>
              {item?.childs?.length > 0 ? (
                <ParentTableRow
                  data={item}
                  depth={depth + 1}
                  parentId={parentId + "" + key}
                  collapsedState={collapsedState}
                />
              ) : (
                <ChildTableRow
                  data={item}
                  depth={depth + 1}
                  parentId={parentId}
                  collapsedState={collapsedState}
                />
              )}
            </React.Fragment>
          )
        })}
    </>
  )
}

/**
 * Komponen child table row
 * yang berdada di dalam parent table row
 */
function ChildTableRow({ data, depth, parentId, collapsedState }) {
  return (
    <React.Fragment>
      {data?.childs?.length > 1 ? (
        <ParentTableRow
          name={data.name}
          data={data}
          depth={depth + 1}
          parentId={parentId}
          collapsedState={collapsedState}
        />
      ) : (
        <HoverBorderedTr>
          <td
            width="28%"
            className="text-gray-700 align-middle h-60px"
            style={{ paddingLeft: depth * 1.45 + "rem" }}
          >
            {data.name}
          </td>
          <td width="12%" className="text-gray-700 align-middle h-60px">
            {data.unit}
          </td>
          <td width="12%" className="text-gray-700 align-middle h-60px">
            {data.method}
          </td>
          <td width="12%" className="text-gray-700 align-middle h-60px">
            {data.flag}
          </td>
          <td width="12%" className="text-gray-700 align-middle h-60px">
            {data.value}
          </td>
          <td width="12%" className="text-gray-700 align-middle h-60px">
            {data.value_string}
          </td>
          <td width="12%" className="text-gray-700 align-middle h-60px">
            {data.value_memo}
          </td>
        </HoverBorderedTr>
      )}
    </React.Fragment>
  )
}

/**
 * Komponen toolbar hasil laboratorium
 */
function Toolbar({ labQuery }) {
  const navigate = useNavigate()
  const labStatus = labQuery.status
  const labData = labQuery.data

  return (
    <>
      <div className="toolbar mt-n2 mt-md-n3 mt-lg-0" id="kt_toolbar">
        <div className="container-fluid">
          <div className="row justify-content-between">
            <div className="col-sm-9 d-flex align-items-center mb-5 mb-sm-0">
              <ButtonLightStyled
                onClick={() => navigate(-1)}
                className="btn btn-icon btn-light-primary flex-shrink-0 me-8"
              >
                <PrimaryArrowLeftIcon />
              </ButtonLightStyled>
              {labStatus === "success" && (
                <>
                  <h1 className="fs-3 mb-0 me-4 text-truncate">
                    {labData.unique_id}
                  </h1>
                  <div className="overflow-hidden">
                    <LaboratoryStatus status={labData.status} />
                  </div>
                </>
              )}
            </div>
            {labStatus === "success" && (
              <div className="col-sm-3 d-flex justify-content-start justify-content-sm-end">
                <DetailPatient visitId={labData.visit_id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
