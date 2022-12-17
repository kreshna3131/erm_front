import React, { useRef, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import { ButtonLightStyled } from "components/Button"
import { ReactComponent as PrimaryArrowLeftIcon } from "assets/icons/primary-arrow-left.svg"
import { useMutation, useQuery } from "react-query"
import axios from "axios"
import ButtonDetailPatient from "../ButtonDetailPatient"
import { Dropdown, Overlay } from "react-bootstrap"
import { DropdownItemStyled, localeStatus } from "./Index"
import useOnClickOutside from "hooks/useOnClickOutside"
import { ReactComponent as TripleDotIcon } from "assets/icons/triple-dot.svg"
import { ReactComponent as WarningClockIcon } from "assets/icons/clock.svg"
import { ReactComponent as CancelIcon } from "assets/icons/cross-sign.svg"
import { ReactComponent as DangerDownloadIcon } from "assets/icons/danger-download.svg"

import { ReactComponent as WarningPencilIcon } from "assets/icons/warning-pencil.svg"
import { ReactComponent as BlueGlass } from "assets/icons/blue-glass.svg"
import { ReactComponent as Checklist } from "assets/icons/checklist.svg"
import { ReactComponent as InfoPreviewIcon } from "assets/icons/info-preview.svg"
import UpdateModalRecipe from "components/table/UpdateModalRecipe"
import { DropdownStatusStyled } from "components/Dropdown"

// Komponen Utama Toolbar untuk E Resep
export default function ToolbarRecipe({ recipeQuery, recipeId }) {
  const navigate = useNavigate()
  const recipeData = recipeQuery.data
  const recipeStatus = recipeQuery.status

  /**
   * Preview data resep
   */
  const [previewClicked, setPreviewClicked] = useState(0)
  const { mutate: previewMutate, status: previewPdfStatus } = useMutation(
    async (data) => {
      setPreviewClicked(data.recipe_id)
      return axios
        .get(`visit/recipe/${data.recipe_id}/preview-pdf`, {
          responseType: "blob",
        })
        .then((res) => {
          const blob = new Blob([res.data], {
            type: "application/pdf",
          })
          const url = window.URL.createObjectURL(blob)
          window.open(url)

          return res.data
        })
        .finally(() => {
          setPreviewClicked(0)
        })
    }
  )

  return (
    <div
      className="toolbar mt-n3 mt-lg-0"
      style={{ zIndex: 99 }}
      id="kt_toolbar"
    >
      <div className="container-fluid">
        <div className="row justify-content-between">
          <div className="col-sm-6 d-flex align-items-center mb-5 mb-sm-0">
            <ButtonLightStyled
              onClick={() => navigate(-1)}
              className="btn btn-icon btn-light-primary me-8"
            >
              <PrimaryArrowLeftIcon />
            </ButtonLightStyled>
            {recipeStatus === "success" && (
              <>
                <h1 className="fs-3 mb-0 me-4">{recipeData?.unique_id}</h1>
                <RecipeStatus status={recipeData?.status} />
              </>
            )}
          </div>
          <div
            className="col-sm-6 d-flex justify-content-start justify-content-sm-end"
            style={{ zIndex: 9999 }}
          >
            <div className="d-flex">
              <DonwnlodPDFButton
                name={`E-Resep - ${recipeData?.unique_id}`}
                url={`/visit/recipe/${recipeId}/print-pdf`}
              />
            </div>
            <ButtonLightStyled
              onClick={() =>
                previewMutate({
                  recipe_id: recipeData?.id,
                })
              }
              className="btn btn-icon btn-light-info me-4"
              disabled={previewPdfStatus === "loading"}
            >
              {previewPdfStatus === "loading" &&
              previewClicked === recipeData?.id ? (
                <span
                  className="indicator-progress"
                  style={{ display: "block" }}
                >
                  <span className="spinner-border spinner-border-sm align-middle"></span>
                </span>
              ) : (
                <InfoPreviewIcon />
              )}
            </ButtonLightStyled>
            {recipeStatus === "success" && (
              <UpdateRecipeStatusButton
                id={recipeData.id}
                overlayPlacement="bottom-end"
                currentStatus={recipeData.status}
              />
            )}
            <ButtonDetailPatient />
          </div>
        </div>
      </div>
    </div>
  )
}

// Pengaturan bg color untuk status resep
export function RecipeStatus({ status }) {
  switch (status) {
    case "waiting":
      return (
        <div className={`badge px-4 py-2 bg-light-warning text-warning me-2`}>
          Menunggu
        </div>
      )

    case "progress":
      return (
        <div className={`badge px-4 py-2 bg-light-info text-info me-2`}>
          Proses
        </div>
      )

    case "fixing":
      return (
        <div className={`badge px-4 py-2 bg-light-warning text-warning me-2`}>
          Perbaikan
        </div>
      )

    case "done":
      return (
        <div className={`badge px-4 py-2 bg-light-primary text-primary me-2`}>
          Selesai
        </div>
      )

    case "cancel":
      return (
        <div className={`badge px-4 py-2 bg-light-danger text-danger me-2`}>
          Dibatalkan
        </div>
      )

    default:
      return <></>
  }
}

// update status resep
export function UpdateRecipeStatusButton({ id, currentStatus }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { id: visitId, receiptId, status } = useParams()
  const [show, setShow] = useState(false)
  const overlayContainerRef = useRef()
  const overlayTargetRef = useRef()
  useOnClickOutside(overlayContainerRef, () => setShow(false))
  return (
    <>
      {location.pathname.includes(`/status/${status}`) && (
        <UpdateModalRecipe
          url={`/visit/recipe/${id}/update-status`}
          data={{ status: status }}
          query={`visit-${visitId}-recipe-${receiptId}`}
          message={`
            Anda yakin ingin mengganti status permintaan menjadi ${localeStatus(
              status
            )}?
          `}
          successMessage={`Anda telah berhasil mengubah status menjadi ${localeStatus(
            status
          )}.`}
        />
      )}
      {location.pathname.includes("pharmacy") ? (
        // ketika berada di route pharmacy bisa mengupdate semua
        <div ref={overlayContainerRef}>
          <ButtonLightStyled
            ref={overlayTargetRef}
            onClick={() => setShow(!show)}
            className="btn btn-icon btn-light-warning me-4"
          >
            <TripleDotIcon />
          </ButtonLightStyled>
          <Overlay
            show={show}
            target={overlayTargetRef.current}
            container={overlayContainerRef.current}
            placement="bottom-end"
          >
            <Dropdown.Menu show={true} className="py-5 w-200px">
              <DropdownStatusStyled
                disabled={["done", "cancel"].includes(currentStatus)}
              >
                <Dropdown.Item
                  active={currentStatus === "waiting"}
                  className="d-flex align-items-center px-8 h-40px"
                  onClick={() => {
                    setShow(false)
                    navigate("edit/status/waiting")
                  }}
                >
                  <WarningClockIcon className="me-4" />

                  <span
                    className={
                      currentStatus === "waiting" ? "text-primary" : ""
                    }
                  >
                    Menunggu
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  active={currentStatus === "fixing"}
                  className="d-flex align-items-center px-8 h-40px"
                  onClick={() => {
                    setShow(false)
                    navigate("edit/status/fixing")
                  }}
                >
                  <WarningPencilIcon className="me-4" />
                  <span
                    className={currentStatus === "fixing" ? "text-primary" : ""}
                  >
                    Perbaikan
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  active={currentStatus === "progress"}
                  className="d-flex align-items-center px-8 h-40px"
                  onClick={() => {
                    setShow(false)
                    navigate("edit/status/progress")
                  }}
                >
                  <BlueGlass className="me-4" />

                  <span
                    className={
                      currentStatus === "progress" ? "text-primary" : ""
                    }
                  >
                    Proses
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  active={currentStatus === "done"}
                  className="d-flex align-items-center px-8 h-40px"
                  onClick={() => {
                    setShow(false)
                    navigate("edit/status/done")
                  }}
                >
                  <Checklist className="me-4" />
                  <span
                    className={currentStatus === "done" ? "text-primary" : ""}
                  >
                    Selesai
                  </span>
                </Dropdown.Item>
              </DropdownStatusStyled>
            </Dropdown.Menu>
          </Overlay>
        </div>
      ) : (
        // ketika berada di route E resep hanya bisa mengupdate "Menunggu", "Perbaikan", dan "Batalkan"
        <div ref={overlayContainerRef}>
          <ButtonLightStyled
            ref={overlayTargetRef}
            onClick={() => setShow(!show)}
            className={`btn btn-icon btn-light-warning me-4 ${
              ["progress"].includes(currentStatus)
                ? "opacity-50 cursor-not-allowed"
                : ""
            } `}
          >
            <TripleDotIcon />
          </ButtonLightStyled>
          <Overlay
            show={show}
            target={overlayTargetRef.current}
            container={overlayContainerRef.current}
            placement="bottom-end"
          >
            <Dropdown.Menu show={true} className="py-5 w-200px">
              <DropdownStatusStyled
                disabled={["done", "cancel"].includes(currentStatus)}
              >
                <Dropdown.Item
                  active={currentStatus === "waiting"}
                  className="d-flex align-items-center px-8 h-40px"
                  onClick={() => {
                    setShow(false)
                    navigate(`status/waiting`)
                  }}
                >
                  <WarningClockIcon className="me-4" />
                  <span>Menunggu</span>
                </Dropdown.Item>
                <Dropdown.Item
                  active={currentStatus === "fixing"}
                  className="d-flex align-items-center px-8 h-40px"
                  onClick={() => {
                    setShow(false)
                    navigate(`status/fixing`)
                  }}
                >
                  <WarningPencilIcon className="me-4" />
                  <span>Perbaikan</span>
                </Dropdown.Item>
                <Dropdown.Item
                  active={currentStatus === "cancel"}
                  className="d-flex align-items-center px-8 h-40px"
                  onClick={() => {
                    setShow(false)
                    navigate(`status/cancel`)
                  }}
                >
                  <CancelIcon className="me-4" />
                  <span>Batalkan</span>
                </Dropdown.Item>
              </DropdownStatusStyled>
            </Dropdown.Menu>
          </Overlay>
        </div>
      )}
    </>
  )
}

export function DonwnlodPDFButton({ name, url }) {
  const { status: pdfStatus, refetch: pdfRefetch } = useQuery(
    "downloadPDF",
    async () =>
      axios
        .get(url, {
          responseType: "blob",
        })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", `${name}.pdf`)
          document.body.appendChild(link)
          link.click()

          return res.data
        }),
    {
      enabled: false,
    }
  )

  return (
    <ButtonLightStyled
      onClick={() => pdfRefetch()}
      className="btn btn-icon btn-light-danger me-4"
      disabled={pdfStatus === "loading"}
    >
      <DangerDownloadIcon />
    </ButtonLightStyled>
  )
}
