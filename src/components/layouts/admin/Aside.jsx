import { ReactComponent as Bookmark } from "assets/icons/bookmark.svg"
import { ReactComponent as DataMaster } from "assets/icons/data-master.svg"
import { ReactComponent as VisitIcon } from "assets/icons/double-person.svg"
import { ReactComponent as PrimaryGlass } from "assets/icons/primary-glass.svg"
import { ReactComponent as PrimaryRadiologyIcon } from "assets/icons/primary-radiology.svg"
import { ReactComponent as SecurityTime } from "assets/icons/security-time.svg"
import { ReactComponent as SpecialistIcon } from "assets/icons/specialist.svg"
import { ReactComponent as UserIcon } from "assets/icons/user.svg"
import { ReactComponent as Logo } from "assets/logos/sidebar.svg"
import { ReactComponent as DocumentFavorite } from "assets/icons/document-favorite.svg"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

/**
 * List menu yang di dalam accordion
 */
const menuWithAccordion = [
  "laboratory/request",
  "laboratory-result",
  "data-master/radiology/group",
  "data-master/radiology/sub-group",
]

/**
 * Komponen parent menu sidebar desktop
 */
export default function Aside({ children }) {
  const [activeSidebar, setActiveSidebar] = useState(true)
  function toggleSidebar() {
    const status = activeSidebar ? false : true
    setActiveSidebar(status)
  }

  /**
   * Logic buka / tutup sidebar
   */
  useEffect(() => {
    const body = document.querySelector("body")
    if (!body.getAttribute("data-kt-aside-minimize")) {
      document
        .querySelector("body")
        .setAttribute("data-kt-aside-minimize", "on")
      document.querySelector("#kt_aside").classList.remove("aside-hoverable")
      setTimeout(() => {
        document.querySelector("#kt_aside").classList.add("aside-hoverable")
      }, 200)
    } else {
      document.querySelector("body").removeAttribute("data-kt-aside-minimize")
    }
  }, [activeSidebar])

  return (
    <div id="kt_aside" className="aside aside-dark aside-hoverable">
      <div className="aside-logo flex-column-auto" id="kt_aside_logo">
        <div
          id="kt_aside_toggle"
          className="btn btn-icon w-auto px-0 btn-active-color-primary aside-toggle "
        >
          <Link to="/">
            <Logo className="logo" />
          </Link>
        </div>
        <div
          id="kt_aside_toggle"
          className={`btn btn-icon w-auto px-0 btn-active-color-primary aside-toggle ${
            activeSidebar ? "active" : ""
          }`}
          onClick={() => {
            toggleSidebar()
          }}
        >
          <span className="svg-icon svg-icon-1 rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                opacity="0.5"
                d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z"
                fill="currentColor"
              ></path>
              <path
                d="M8.2657 11.4343L12.45 7.25C12.8642 6.83579 12.8642 6.16421 12.45 5.75C12.0358 5.33579 11.3642 5.33579 10.95 5.75L5.40712 11.2929C5.01659 11.6834 5.01659 12.3166 5.40712 12.7071L10.95 18.25C11.3642 18.6642 12.0358 18.6642 12.45 18.25C12.8642 17.8358 12.8642 17.1642 12.45 16.75L8.2657 12.5657C7.95328 12.2533 7.95328 11.7467 8.2657 11.4343Z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
        </div>
      </div>
      {children}
    </div>
  )
}

/**
 * Komponen menu sidebar
 */
export function AsideMenu({
  allPermissions,
  activeMenuProp,
  openAccordionProp,
}) {
  const [activeMenu] = activeMenuProp
  const [openAccordion, setOpenAccordion] = openAccordionProp

  /**
   * Menutup menu accordion jika pindah menu lain
   */
  useEffect(() => {
    if (!menuWithAccordion.includes(activeMenu)) {
      setOpenAccordion([])
    }
  }, [activeMenu])

  return (
    <div className="aside-menu flex-column-fluid min-vh-100">
      <div className="menu menu-column menu-title-gray-800 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-500">
        <div className="menu-item">
          {allPermissions.includes("lihat kunjungan") && (
            <Link
              className={`menu-link ${activeMenu === "visit" ? "active" : ""}`}
              to="/visit"
            >
              <span className="menu-icon">
                <VisitIcon />
              </span>
              <span className="menu-title">Kunjungan Pasien</span>
            </Link>
          )}
          {allPermissions.includes("lihat spesialis") && (
            <Link
              className={`menu-link ${
                activeMenu === "specialist" ? "active" : ""
              }`}
              to="/specialist"
            >
              <span className="menu-icon">
                <SpecialistIcon />
              </span>
              <span className="menu-title">Spesialis</span>
            </Link>
          )}
          {(allPermissions.includes("mengelola permintaan di laboratorium") ||
            allPermissions.includes(
              "melihat hasil permintaan di laboratorium"
            )) && (
            <div
              className={`menu-item menu-accordion ${
                openAccordion.includes("laboratory") ? "hover show" : ""
              }`}
            >
              <span
                className="menu-link"
                onClick={() => {
                  if (!openAccordion.includes("laboratory")) {
                    setOpenAccordion(["laboratory"])
                  } else {
                    setOpenAccordion([])
                  }
                }}
              >
                <span className="menu-icon">
                  <PrimaryGlass />
                </span>
                <span className="menu-title">Laboratorium</span>
                <span className="menu-arrow"></span>
              </span>
              <div className={`menu-sub menu-sub-accordion menu-active-bg`}>
                {allPermissions.includes(
                  "mengelola permintaan di laboratorium"
                ) && (
                  <div className="menu-item">
                    <Link
                      className={`menu-link ${
                        activeMenu === "laboratory/request" ? "active" : ""
                      }`}
                      to="/laboratory/request"
                    >
                      <span
                        className="menu-bullet"
                        style={{
                          marginLeft: "15px",
                        }}
                      >
                        <span className="bullet bullet-dot"></span>
                      </span>
                      <span className="menu-title">Permintaan</span>
                    </Link>
                  </div>
                )}
                {allPermissions.includes(
                  "melihat hasil permintaan di laboratorium"
                ) && (
                  <div className="menu-item">
                    <Link
                      className={`menu-link ${
                        activeMenu === "laboratory-result" ? "active" : ""
                      } `}
                      to="/laboratory/result"
                    >
                      <span
                        className="menu-bullet"
                        style={{
                          marginLeft: "15px",
                        }}
                      >
                        <span className="bullet bullet-dot"></span>
                      </span>
                      <span className="menu-title">Hasil</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
          {allPermissions.includes("mengelola permintaan di radiologi") && (
            <Link
              className={`menu-link ${
                activeMenu === "radiology" ? "active" : ""
              } `}
              to="/radiology"
            >
              <span className="menu-icon">
                <PrimaryRadiologyIcon />
              </span>
              <span className="menu-title">Radiologi</span>
            </Link>
          )}

          {allPermissions.includes("mengelola permintaan di farmasi") && (
            <Link
              className={`menu-link ${
                activeMenu === "pharmacy-request" ? "active" : ""
              }`}
              to="/pharmacy/request"
            >
              <span className="menu-icon">
                <DataMaster />
              </span>
              <span className="menu-title">E Resep</span>
            </Link>
          )}

          {allPermissions.includes("mengelola permintaan di rehab medik") && (
            <Link
              className={`menu-link ${
                activeMenu === "rehab-medic" ? "active" : ""
              }`}
              to="/rehab-medic"
            >
              <span className="menu-icon">
                <DocumentFavorite />
              </span>
              <span className="menu-title">Rehab Medik</span>
            </Link>
          )}

          {(allPermissions.includes("lihat group tindakan") ||
            allPermissions.includes("lihat sub group tindakan")) && (
            <div
              className={`menu-item menu-accordion  ${
                openAccordion.includes("master") ? " hover show" : ""
              }`}
            >
              <span
                className="menu-link"
                onClick={() => {
                  if (!openAccordion.includes("master")) {
                    setOpenAccordion(["master"])
                  } else {
                    setOpenAccordion([])
                  }
                }}
              >
                <span className="menu-icon">
                  <Bookmark />
                </span>
                <span className="menu-title">Data Master</span>
                <span className="menu-arrow"></span>
              </span>
              <div className={`menu-sub menu-sub-accordion menu-active-bg`}>
                <div
                  className={`menu-item menu-accordion  ${
                    openAccordion.includes("master-radiology")
                      ? " hover show"
                      : ""
                  }`}
                >
                  <span
                    className="menu-link"
                    onClick={() => {
                      if (!openAccordion.includes("master-radiology")) {
                        setOpenAccordion(["master", "master-radiology"])
                      } else {
                        setOpenAccordion(["master"])
                      }
                    }}
                  >
                    <span
                      className="menu-bullet"
                      style={{
                        marginLeft: "15px",
                      }}
                    >
                      <span className="bullet bullet-dot"></span>
                    </span>
                    <span className="menu-title">Radiologi</span>
                  </span>
                  <div className={`menu-sub menu-sub-accordion menu-active-bg`}>
                    {allPermissions.includes("lihat group tindakan") && (
                      <div className="menu-item">
                        <Link
                          className={`menu-link ${
                            activeMenu === "data-master/radiology/group"
                              ? "active"
                              : ""
                          }`}
                          to="/data-master/radiology/group"
                        >
                          <span
                            className="menu-bullet"
                            style={{
                              marginLeft: "15px",
                            }}
                          >
                            <span className="bullet bullet-dot"></span>
                          </span>
                          <span className="menu-title">Group</span>
                        </Link>
                      </div>
                    )}
                    {allPermissions.includes("lihat sub group tindakan") && (
                      <div className="menu-item">
                        <Link
                          className={`menu-link ${
                            activeMenu === "data-master/radiology/sub-group"
                              ? "active"
                              : ""
                          } `}
                          to="/data-master/radiology/sub-group"
                        >
                          <span
                            className="menu-bullet"
                            style={{
                              marginLeft: "15px",
                            }}
                          >
                            <span className="bullet bullet-dot"></span>
                          </span>
                          <span className="menu-title">Tindakan</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {allPermissions.includes("lihat pengguna") && (
            <Link
              className={`menu-link ${activeMenu === "user" ? "active" : ""}`}
              to="/user"
            >
              <span className="menu-icon">
                <UserIcon />
              </span>
              <span className="menu-title">Pengguna</span>
            </Link>
          )}
          {allPermissions.includes("lihat activity log") && (
            <Link
              className={`menu-link ${
                activeMenu === "log-activity" ? "active" : ""
              }`}
              to="/log-activity"
            >
              <span className="menu-icon">
                <SecurityTime />
              </span>
              <span className="menu-title">Activity Log</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
