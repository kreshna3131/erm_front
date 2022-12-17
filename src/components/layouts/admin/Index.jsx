import axios from "axios"
import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { Outlet, useNavigate } from "react-router"
import { Overlay, Toast, ToastContainer } from "react-bootstrap"

import { dashboardUrl } from "../../../config"
import useAuth, { unsetClientCredential } from "../../../hooks/useAuth"
import Aside, { AsideMenu } from "./Aside"
import Header from "./Header"
import MobileAside from "./MobileAside"
import Echo from "laravel-echo"
import { ReactComponent as DangerGlassIcon } from "assets/icons/danger-glass.svg"
import { ReactComponent as DangerDocumentFavoriteIcon } from "assets/icons/danger-document-favorite.svg"
import { ReactComponent as DangerRadiologyIcon } from "assets/icons/danger-radiology.svg"
import { ReactComponent as DangerNoteIcon } from "assets/icons/danger-note.svg"

export default function Index() {
  // mengambil list notifikasi
  const { data: newNotification, status } = useQuery(
    "notification-listing",
    async (key) => {
      return axios.get("/notification/listing").then((res) => res.data)
    }
  )
  // menambahkan object show dengan value true
  const showTrue =
    status === "success" &&
    newNotification?.data.map((v) => ({ ...v, show: true }))
  const [user, setUser] = useState()
  const [activeMenu, setActiveMenu] = useState("")
  const [activeMobileMenu, setActiveMobileMenu] = useState(false)
  const [openAccordion, setOpenAccordion] = useState([])
  const [notification, setNotification] = useState([])
  const queryClient = useQueryClient()

  const [newData, setNewData] = useState([])
  const [show, setShow] = useState(true)
  const toggleShow = () => setShow(!show)
  const navigate = useNavigate()
  const [breadCrumb, setBreadCrumb] = useState({
    title: "Home",
    items: [{ text: "Home", path: null }],
  })

  /**
   * Mengambil data user profile
   */
  const { data } = useQuery(
    "profile",
    () => axios.get("profile").then((res) => res.data),
    {
      onSuccess: () => {
        if (!localStorage.getItem("isLogin")) {
          localStorage.setItem("isLogin", true)
        }

        if (window.location.href.includes("two-factor")) {
          window.location.href = dashboardUrl
        }
      },
      onError: async (err) => {
        if (err.response.status === 401) {
          if (
            err.response.data.message === "Please verify the two factor code"
          ) {
            if (!window.location.href.includes("two-factor")) {
              window.location.href = "/two-factor"
            }
            return
          }

          if (
            err.response.data.message ===
            "The two factor code has expired. Please login again."
          ) {
            await unsetClientCredential()
            window.location.href = "/?twoFactor=expired"
            return
          }
        }

        await unsetClientCredential()
        window.location.href = "/"
      },
    }
  )
  useEffect(() => {
    data && setUser(data)
  }, [data])

  /**
   * Axios interceptor
   * contoh:
   * - Redirect 403 jika status forbidden
   */
  axios.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {
      if (error.response.status === 403) {
        window.location.href = "/forbidden"
      }

      return Promise.reject(error)
    }
  )

  /** Update class header saat pertama kali load */
  useEffect(() => {
    const body = document.querySelector("body")
    const classList =
      " header-fixed header-tablet-and-mobile-fixed toolbar-enabled toolbar-fixed aside-enabled aside-fixed"

    body.classList += classList
    body.setAttribute("data-kt-aside-minimize", "on")
  }, [])

  /**
   * Mengambil permission dari data role
   */
  const [allPermissions, setallPermissions] = useState([])
  useEffect(() => {
    if (user) {
      let roles = []
      let permissions = []
      let latestPermissionItem = []

      user.roles.forEach((role) => {
        roles = [...roles, role.name]
        role.permissions.forEach((permission, secondaryKey) => {
          permissions = [...permissions, permission.name]
          if (secondaryKey === role.permissions.length - 1) {
            latestPermissionItem = [...latestPermissionItem, true]
          }
        })
      })

      if (latestPermissionItem.length === user.roles.length) {
        setallPermissions(permissions)
      }
    }
  }, [user])

  const { token } = useAuth()

  // konfigurasi pusher
  useEffect(() => {
    const echo = new Echo({
      broadcaster: "pusher",
      appId: process.env.REACT_APP_PUSHER_ID,
      key: process.env.REACT_APP_PUSHER_KEY,
      secret: process.env.REACT_APP_PUSHER_SECRET,
      cluster: process.env.REACT_APP_PUSHER_CLUSTER,
      forceTLS: true,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "Application/json",
        },
      },
      authEndpoint: process.env.REACT_APP_API_BASE_URL + "/broadcasting/auth",
    })

    echo.private(`App.Models.User.${user?.id}`).notification((e) => {
      // alert('Test')
      // setNotification(e)
      console.log(e)
      setNewData(showTrue)
    })
  }, [])

  // menambahkan object show dengan value true
  useEffect(() => {
    setNewData(showTrue)
  }, [newNotification])

  // logic notifikasi dibaca
  const mutation = useMutation(
    async (data) => {
      return axios
        .delete(`/notification/${data.id}/read`)
        .then((res) => res.data)
    },
    {
      onSuccess: () => {
        setTimeout(() => {
          queryClient.invalidateQueries("notification-listing")
        }, 500)
      },
    }
  )

  // menuju ke detail ketika toast diklik, sekaligus read notif dan tutup toast
  const buttonToDetail = (data, index) => {
    const type = data.recipe_type.split(",")
    if (data.type === "Radiologi") {
      if (!user?.roles[0]?.name.toLowerCase().includes("rad")) {
        navigate(`/visit/${data.visit_id}/radiology/${data.request_id}`)
      } else {
        navigate(`/radiology/request/${data.request_id}`)
      }
    }
    if (data.type === "Laboratorium") {
      if (!user?.roles[0]?.name.toLowerCase().includes("lab")) {
        navigate(`/visit/${data.visit_id}/laboratory/${data.request_id}`)
      } else {
        navigate(`/laboratory/request/${data.request_id}/detail`)
      }
    }

    if (data.type === "E Resep") {
      if (!user?.roles[0]?.name.toLowerCase().includes("apo")) {
        if (type && type.length === 1 && type[0] === "Non Racikan") {
          navigate(
            `/visit/${data.visit_id}/receipt/${data.request_id}/non-concoction`
          )
        } else {
          navigate(
            `/visit/${data.visit_id}/receipt/${data.request_id}/concoction`
          )
        }
      } else {
        if (type && type.length === 1 && type[0] === "Non Racikan") {
          navigate(
            `/pharmacy/request/${data.visit_id}/receipt/${data.request_id}/non-concoction`
          )
        } else {
          navigate(
            `/pharmacy/request/${data.visit_id}/receipt/${data.request_id}/concoction`
          )
        }
      }
    }

    if (data.type === "Rehab Medic") {
      if (!user?.roles[0]?.name.toLowerCase().includes("rehab")) {
        navigate(`/visit/${data.visit_id}/rehab/${data.request_id}`)
      } else {
        navigate(`/rehab-medic/${data.request_id}`)
      }
    }
    mutation.mutate(data)
    showClose(index)
  }

  // merubah value menjadi false supaya menutup toast
  const showClose = (index) => {
    const cloneNewData = [...newData]
    cloneNewData[index].show = false
    setNewData(cloneNewData)
  }

  return (
    <>
      <div
        className="d-flex flex-column flex-root"
        style={{
          backgroundColor: "#F3F6F9",
          "--kt-toolbar-height": "55px",
          "--kt-toolbar-height-tablet-and-mobile": "55px",
          minHeight: "100vh",
        }}
      >
        <div className="page d-flex flex-row flex-column-fluid">
          <Aside>
            <AsideMenu
              allPermissions={allPermissions}
              activeMenuProp={[activeMenu]}
              openAccordionProp={[openAccordion, setOpenAccordion]}
            />
          </Aside>
          <div
            className="wrapper d-flex flex-column flex-row-fluid pt-20"
            id="kt_wrapper"
          >
            <div
              id="kt_header"
              style={{ zIndex: 99 }}
              className="header align-items-stretch"
            >
              <Header
                breadCrumb={breadCrumb}
                allPermissions={allPermissions}
                activeMobileMenuProp={[activeMobileMenu, setActiveMobileMenu]}
                userProp={[user, setUser]}
              />
            </div>
            <div
              className="content d-flex flex-column flex-column-fluid"
              id="kt_content"
            >
              <Outlet
                context={{
                  user,
                  setUser,
                  breadCrumb,
                  setBreadCrumb,
                  activeMenu,
                  setActiveMenu,
                  openAccordion,
                  setOpenAccordion,
                  allPermissions,
                }}
              />
            </div>
            <div className="footer py-4 d-flex flex-lg-column" id="kt_footer">
              <div className="container-fluid d-flex flex-column flex-md-row align-items-center justify-content-between">
                <div className="text-dark order-2 order-md-1">
                  <span className="text-muted fw-bold me-1">2022©</span>
                  <span className="text-gray-800 text-hover-primary">
                    PT Kolega
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MobileAside
          activeMobileMenuProp={[activeMobileMenu, setActiveMobileMenu]}
        >
          <AsideMenu
            allPermissions={allPermissions}
            activeMenuProp={[activeMenu]}
            openAccordionProp={[openAccordion, setOpenAccordion]}
          />
        </MobileAside>
      </div>
      {newData && (
        <div
          className="position-absolute  "
          style={{ right: "2px", top: "80px", zIndex: "999" }}
        >
          {newData?.map((data, key) => (
            <Toast
              key={key}
              show={data.show}
              onClose={() => showClose(key)}
              className={`${key > 2 && "visually-hidden"} mb-5`}
              delay={2000}
              animation={true}
            >
              <Toast.Header>
                {data.type === "Laboratorium" && (
                  <DangerGlassIcon className="me-2" />
                )}
                {data.type === "Radiologi" && (
                  <DangerRadiologyIcon className="me-2" />
                )}
                {data.type === "Rehab Medic" && (
                  <DangerDocumentFavoriteIcon className="me-2" />
                )}
                {data.type === "E Resep" && <DangerNoteIcon className="me-2" />}
                <strong className=" me-auto">{data.type} </strong>
                <small>{data.notification_at}</small>
              </Toast.Header>
              <Toast.Body
                className="py-7"
                role="button"
                onClick={() => buttonToDetail(data, key)}
              >
                {" "}
                {data.created_by} telah {data.message}
              </Toast.Body>
            </Toast>
          ))}
        </div>
      )}
    </>
  )
}
