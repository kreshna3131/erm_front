import { ReactComponent as SoapIcon } from "assets/icons/document.svg"
import { ReactComponent as LaboratoryIcon } from "assets/icons/laboratory.svg"
import { ReactComponent as RadiologyIcon } from "assets/icons/radiology.svg"
import { ReactComponent as ReceiptIcon } from "assets/icons/receipt.svg"
import { ReactComponent as RehabIcon } from "assets/icons/rehab.svg"
import { ReactComponent as IcdIcon } from "assets/icons/icd.svg"

import { ReactComponent as WarningExclamationLabIcon } from "assets/icons/warning-exclamation-lab.svg"
import axios from "axios"
import { useQuery } from "react-query"
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router"
import { useKey } from "rooks"
import styled from "styled-components"

/**
 * Komponen custom Tab menu item
 */
const TabMenuItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  margin-right: 10px;
  padding-right: 10px;
  padding-left: 10px;
  height: 70px;
  position: relative;

  svg:not(.opacity-exception),
  div:not(.opacity-exception) {
    opacity: ${(props) => (props.active ? "1" : "0.5")};
  }

  &:after {
    content: "";
    height: ${(props) => (props.active ? "3px" : "0px")};
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #ffffff;
  }
`
/**
 * Styling untuk Read Warning
 */
const IsReadWarning = styled.div`
  position: absolute;
  top: -13px;
  left: 50%;
  width: 24px;
  display: ${(props) => (props.show ? "block" : "none")};
  transform: translateX(-20%);
`

/**
 * Komponen utama untuk Tabmenu
 * @param {{
 * isSearching: Boolean
 * }}
 */
export default function TabMenu({ isSearching = false }) {
  const { id: visitId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { allPermissions } = useOutletContext()

  /**
   * Mengambil data apakah komen sudah dibaca
   */
  const isReadQuery = useQuery(
    `visit-${visitId}-laboratorium-check-is-read`,
    async () =>
      axios
        .get(`/visit/${visitId}/laboratorium/check-is-read`)
        .then((res) => res.data)
  )
  /** @type {{is_read_lab: Boolean, is_read_rad: Boolean}} */
  const isReadData = isReadQuery.data

  useKey(
    ["1", "2", "3", "4", "5"],
    (event) => {
      navigate(dynamicUrl(event.key, visitId))
    },
    {
      when: !isSearching,
    }
  )

  return (
    <div className="card-header border-0 px-10 bg-primary">
      <div className="d-flex flex-wrap flex-center">
        {!allPermissions.length ? (
          <p className="text-white mb-0">Loading...</p>
        ) : (
          <>
            <TabMenuItem
              active={location.pathname.includes(`/visit/${visitId}/soap`)}
              onClick={() => navigate(`/visit/${visitId}/soap`)}
            >
              <SoapIcon className="me-3" />
              <div className="text-white">SOAP</div>
            </TabMenuItem>
            {allPermissions.includes(
              "melihat permintaan laboratorium di kunjungan"
            ) && (
              <TabMenuItem
                active={location.pathname.includes(
                  `/visit/${visitId}/laboratory`
                )}
                onClick={() => navigate(`/visit/${visitId}/laboratory`)}
              >
                {isReadQuery.status === "success" && (
                  <IsReadWarning
                    show={!isReadData.is_read_lab}
                    className="opacity-exception"
                  >
                    <WarningExclamationLabIcon className="opacity-exception" />
                  </IsReadWarning>
                )}
                <LaboratoryIcon className="me-3" />
                <div className="text-white">Laboratorium</div>
              </TabMenuItem>
            )}
            {allPermissions.includes(
              "melihat permintaan radiologi di kunjungan"
            ) && (
              <TabMenuItem
                active={location.pathname.includes(
                  `/visit/${visitId}/radiology`
                )}
                onClick={() => navigate(`/visit/${visitId}/radiology`)}
              >
                {isReadQuery.status === "success" && (
                  <IsReadWarning
                    show={!isReadData.is_read_rad}
                    className="opacity-exception"
                  >
                    <WarningExclamationLabIcon className="opacity-exception" />
                  </IsReadWarning>
                )}
                <RadiologyIcon className="me-3" />
                <div className="text-white">Radiology</div>
              </TabMenuItem>
            )}
            {allPermissions.includes(
              "melihat permintaan resep di kunjungan"
            ) && (
              <TabMenuItem
                active={location.pathname.includes(`/visit/${visitId}/receipt`)}
                onClick={() => navigate(`/visit/${visitId}/receipt`)}
              >
                {isReadQuery.status === "success" && (
                  <IsReadWarning
                    show={!isReadQuery.data?.is_read_res}
                    className="opacity-exception"
                  >
                    <WarningExclamationLabIcon className="opacity-exception" />
                  </IsReadWarning>
                )}
                <ReceiptIcon className="me-3" />
                <div className="text-white">E Resep</div>
              </TabMenuItem>
            )}
            {allPermissions.includes(
              "melihat permintaan rehab medik di kunjungan"
            ) && (
              <TabMenuItem
                active={location.pathname.includes(`/visit/${visitId}/rehab`)}
                onClick={() => navigate(`/visit/${visitId}/rehab`)}
              >
                <RehabIcon className="me-3" />
                <div className="text-white">Rehab</div>
              </TabMenuItem>
            )}
            {(allPermissions.includes("lihat icd 9") ||
              allPermissions.includes("lihat icd 10")) && (
              <TabMenuItem
                active={location.pathname.includes(
                  `/visit/${visitId}/icd/diagnosa-nine`
                )}
                onClick={() => navigate(`/visit/${visitId}/icd/diagnosa-nine`)}
              >
                <IcdIcon className="me-3" />
                <div className="text-white">ICD</div>
              </TabMenuItem>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/**
 * Mengambil url berdasarkan key
 * @param {String} key
 * @param {Number} visitId
 * @returns
 */
function dynamicUrl(key, visitId) {
  switch (key) {
    case "1":
      return `/visit/${visitId}/soap`

    case "2":
      return `/visit/${visitId}/laboratory`

    case "3":
      return `/visit/${visitId}/radiology`

    case "4":
      return `/visit/${visitId}/receipt`

    case "5":
      return `/visit/${visitId}/rehab`
  }
}
