import { ReactComponent as GrayArrowRightIcon } from "assets/icons/arrow-right.svg"
import { ReactComponent as NotificationIcon } from "assets/icons/red-notification.svg"
import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import { getInitialName } from "helpers/string-helper"
import { unsetClientCredential } from "hooks/useAuth"
import React, { useEffect, useRef, useState } from "react"
import { Overlay, Toast, ToastContainer } from "react-bootstrap"
import { useQuery } from "react-query"
import { Link, useNavigate } from "react-router-dom"

/**
 * Komponen utama header aplikasi
 * @param {{
 * breadCrumb: Array
 * allPermissions: Array<String>
 * activeMobileMenuProp: Array
 * userProp: Array
 * }}
 */
export default function Header({
  breadCrumb,
  allPermissions,
  activeMobileMenuProp,
  userProp,
}) {
  const [user] = userProp
  const [activeMobileMenu, setActiveMobileMenu] = activeMobileMenuProp

  const [showOffCanvas, setShowOffCanvas] = useState(false)
  const [profileDropDown, setprofileDropDown] = useState(false)

  const [settingOverlayShow, setSettingOverlayShow] = useState(false)
  const settingOverlayTarget = useRef()
  const settingOverlayContainer = useRef()

  const [securityOverlayShow, setSecurityOverlayShow] = useState(false)
  const securityOverlayTarget = useRef()
  const securityOverlayContainer = useRef()

  const navigate = useNavigate()

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setprofileDropDown(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [ref])
  }

  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef)

  const overlayTarget = useRef()

  /**
   * Fungsi untuk logout dari applikasi
   */
  async function logout() {
    await axios.post("/logout").then((res) => res.data)
    await unsetClientCredential()
    window.location.href = "/"
  }

  // fungsi megecek apakah ada notifikasi
  const { data: newNotification, status } = useQuery(
    ["notification-listing"],
    async (key) => {
      return axios.get("/notification/listing").then((res) => res.data)
    }
  )

  return (
    <>
      <div className="container-fluid d-flex align-items-stretch justify-content-between bg-white">
        <div className="d-flex flex-center">
          <div
            className="d-flex align-items-center d-lg-none ms-n2 me-2"
            title="Show aside menu"
            onClick={() => setShowOffCanvas(!showOffCanvas)}
          >
            <div
              className="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
              onClick={() => setActiveMobileMenu(true)}
              id="kt_aside_mobile_toggle"
            >
              <span className="svg-icon svg-icon-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 7H3C2.4 7 2 6.6 2 6V4C2 3.4 2.4 3 3 3H21C21.6 3 22 3.4 22 4V6C22 6.6 21.6 7 21 7Z"
                    fill="currentColor"
                  />
                  <path
                    opacity="0.3"
                    d="M21 14H3C2.4 14 2 13.6 2 13V11C2 10.4 2.4 10 3 10H21C21.6 10 22 10.4 22 11V13C22 13.6 21.6 14 21 14ZM22 20V18C22 17.4 21.6 17 21 17H3C2.4 17 2 17.4 2 18V20C2 20.6 2.4 21 3 21H21C21.6 21 22 20.6 22 20Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div className="page-title d-flex align-items-center flex-wrap me-3 mb-lg-0">
            <h1 className="d-flex text-dark fw-bolder fs-3 align-items-center my-1">
              {breadCrumb.title}
            </h1>
            <span className="h-20px border-gray-300 border-start mx-4" />
            <ul className="breadcrumb breadcrumb-separatorless fw-bold fs-7 my-1">
              <li className="breadcrumb-item text-muted">
                <Link to="/" className="text-muted text-hover-primary">
                  Home
                </Link>
              </li>
              {breadCrumb.items.map((item, key) => {
                return (
                  <React.Fragment key={key}>
                    <li className="breadcrumb-item">
                      <span className="bullet bg-gray-300 w-5px h-5px" />
                    </li>
                    {item.path ? (
                      <li className="breadcrumb-item text-dark">
                        <Link
                          to={item.path}
                          className="text-muted text-hover-primary"
                        >
                          {item.text}
                        </Link>
                      </li>
                    ) : (
                      <li className="breadcrumb-item text-dark">{item.text}</li>
                    )}
                  </React.Fragment>
                )
              })}
            </ul>
          </div>
        </div>
        <div className="d-flex align-items-stretch flex-shrink-0 relative">
          <div className="d-flex align-items-center ">
            <ButtonLightStyled
              className="btn btn-icon btn-light-danger positon-relative"
              onClick={() => navigate("/notification")}
            >
              {status === "success" && newNotification?.data?.length > 0 && (
                <span
                  className="bg-danger "
                  style={{
                    top: "7px",
                    position: "absolute",
                    height: "10px",
                    width: "10px",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                ></span>
              )}
              <NotificationIcon />
            </ButtonLightStyled>
          </div>
          <div
            className="d-flex align-items-center ms-1 ms-lg-3"
            id="kt_header_user_menu_toggle"
          >
            <div
              className="cursor-pointer symbol symbol-30px symbol-md-40px bg-primary"
              data-kt-menu-trigger="click"
              data-kt-menu-attach="parent"
              data-kt-menu-placement="bottom-end"
              onClick={() => setprofileDropDown(!profileDropDown)}
              ref={overlayTarget}
            >
              <div className="d-flex flex-center h-40px w-40px">
                <div className="text-white">
                  {user?.name && getInitialName(user.name)}
                </div>
              </div>
            </div>
          </div>
          <Overlay
            show={profileDropDown}
            ref={wrapperRef}
            target={overlayTarget.current}
            className="border-0"
            placement="bottom-end"
          >
            <div
              className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-100 show w-350px"
              data-kt-menu="true"
              data-popper-placement="bottom-end"
            >
              <div className="px-5">
                <div className="d-flex align-items-center">
                  <div className="d-flex bg-primary flex-shrink-0 rounded flex-center h-50px w-50px me-6">
                    <div className="text-white">
                      {user?.name && getInitialName(user.name)}
                    </div>
                  </div>
                  <div className="d-flex align-items-start flex-column menu-link disabled">
                    <div className="fw-medium">{user?.name}</div>
                    <div className="fw-light text-gray-600">
                      {user?.roles[0].name}
                    </div>
                  </div>
                </div>
              </div>
              <div className="separator mt-6 mb-2" />
              {(allPermissions.includes("lihat profile") ||
                allPermissions.includes("lihat pengaturan assesmen")) && (
                <div
                  ref={settingOverlayContainer}
                  className="menu-item px-5 position-relative"
                  onMouseEnter={() => setSettingOverlayShow(true)}
                  onMouseLeave={() => setSettingOverlayShow(false)}
                >
                  <div
                    className="menu-link justify-content-between fw-normal"
                    ref={settingOverlayTarget}
                  >
                    Pengaturan
                    <GrayArrowRightIcon />
                  </div>
                  <Overlay
                    container={settingOverlayContainer}
                    target={settingOverlayTarget}
                    show={settingOverlayShow}
                    placement="left"
                  >
                    <div className="card shadow-sm w-250px me-6">
                      <div className="card-body px-2 py-4">
                        {allPermissions.includes(
                          "lihat pengaturan assesmen"
                        ) && (
                          <div className="menu-item">
                            <Link
                              to="/assessment-setting"
                              className="menu-link fw-normal"
                            >
                              Assesmen
                            </Link>
                          </div>
                        )}
                        {allPermissions.includes("lihat profile") && (
                          <div className="menu-item">
                            <Link to="/profile" className="menu-link fw-normal">
                              Profil saya
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </Overlay>
                </div>
              )}
              {(allPermissions.includes("lihat role") ||
                allPermissions.includes("tambah role")) && (
                <div
                  ref={securityOverlayContainer}
                  className="menu-item px-5 position-relative"
                  onMouseEnter={() => setSecurityOverlayShow(true)}
                  onMouseLeave={() => setSecurityOverlayShow(false)}
                >
                  <div
                    className="menu-link justify-content-between fw-normal"
                    ref={securityOverlayTarget}
                  >
                    Keamanan
                    <GrayArrowRightIcon />
                  </div>
                  <Overlay
                    container={securityOverlayContainer}
                    target={securityOverlayTarget}
                    show={securityOverlayShow}
                    placement="left"
                  >
                    <div className="card shadow-sm w-250px me-6">
                      <div className="card-body px-2 py-4">
                        <h5 className="fw-semi-bold text-gray-700 px-4 pb-0">
                          ACL
                        </h5>
                        {allPermissions.includes("lihat role") && (
                          <div className="menu-item">
                            <Link to="/role" className="menu-link fw-normal">
                              Semua role
                            </Link>
                          </div>
                        )}
                        {allPermissions.includes("tambah role") && (
                          <div className="menu-item">
                            <Link
                              to="/role/create"
                              className="menu-link fw-normal"
                            >
                              Tambah role
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </Overlay>
                </div>
              )}
              <div className="separator my-2" />
              <div className="menu-item px-5">
                <button
                  type="button"
                  className="btn w-100 menu-link"
                  onClick={() => logout()}
                >
                  Logout
                </button>
              </div>
            </div>
          </Overlay>
        </div>
      </div>
    </>
  )
}
