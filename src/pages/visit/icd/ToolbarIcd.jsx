import React, { useRef, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import { ButtonLightStyled } from "components/Button"
import { ReactComponent as PrimaryArrowLeftIcon } from "assets/icons/primary-arrow-left.svg"
import { useQuery } from "react-query"
import axios from "axios"
import ButtonDetailPatient from "../ButtonDetailPatient"
import { Dropdown, Overlay } from "react-bootstrap"
import useOnClickOutside from "hooks/useOnClickOutside"
import { ReactComponent as TripleDotIcon } from "assets/icons/triple-dot.svg"
import { ReactComponent as DangerDownloadIcon } from "assets/icons/danger-download.svg"
import { ReactComponent as InfoPreviewIcon } from "assets/icons/info-preview.svg"
import styled from "styled-components"
import { DownloadSoapLabel } from "../soap/Index"

/**
 * Styling Dropdown item
 */
export const DropdownItemStyled = styled.div`
  span {
    color: #7e8299;
    font-size: 13px;
  }

  .active,
  &:hover {
  }
`

// Komponen Utama Toolbar untuk Icd
export default function ToolbarIcd() {
  const navigate = useNavigate()
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
            <h1 className="fs-3 mb-0 me-4">ICD</h1>
          </div>
          <div
            className="col-sm-6 d-flex justify-content-start justify-content-sm-end"
            style={{ zIndex: 9999 }}
          >
         
            <DownloadButton/>
            <ButtonDetailPatient />
          </div>
        </div>
      </div>
    </div>
  )
}





function DownloadButton() {
  const overlayTarget = useRef()
  const overlayContainer = useRef()
  const { id: visitId } = useParams()
  const [showOverlay, setShowOverlay] = useState(false)
  useOnClickOutside(overlayContainer, () => setShowOverlay(false))

  const { isFetching: downloadPdfIsFetching, refetch: downloadPdfRefetch } =
    useQuery(
      "downloadPDF",
      async () =>
        axios
          .get(`/visit/${visitId}/icd/print-pdf`, {
            responseType: "blob",
          })
          .then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `Histori Rekam Medis.pdf`)
            document.body.appendChild(link)
            link.click()

            return res.data
          }),
      {
        enabled: false,
      }
    )

  const { isFetching: previewPdfIsFetching, refetch: previewPdfRefetch } =
    useQuery(
      "previewPdf",
      async () =>
        axios
          .get(`/visit/${visitId}/icd/preview-pdf`, {
            responseType: "blob",
          })
          .then((res) => {
            const blob = new Blob([res.data], {
              type: "application/pdf",
            })
            const url = window.URL.createObjectURL(blob)
            window.open(url)

            return res.data
          }),
      {
        enabled: false,
      }
    )

  return (
    <div className="position-relative w-50px" ref={overlayContainer}>
      <ButtonLightStyled
        ref={overlayTarget}
        onClick={() => setShowOverlay(!showOverlay)}
        className="btn btn-icon btn-light-warning me-3"
      >
        <TripleDotIcon />
      </ButtonLightStyled>
      <Overlay
        show={showOverlay}
        container={overlayContainer.current}
        target={overlayTarget.current}
        placement="left-start"
      >
        <div className="card shadow-sm w-200px" style={{ marginLeft: "-45px" }}>
          <div className="card-body p-4">
            <div className="d-flex flex-column">
              <DownloadSoapLabel className="mb-3">
                <p className="fs-6 m-0">Download</p>
                <ButtonLightStyled
                  disabled={downloadPdfIsFetching}
                  className="btn btn-icon btn-light-danger"
                  onClick={() => downloadPdfRefetch()}
                >
                  {downloadPdfIsFetching ? (
                    <span
                      className="indicator-progress"
                      style={{ display: "block" }}
                    >
                      <span className="spinner-border spinner-border-sm align-middle"></span>
                    </span>
                  ) : (
                    <DangerDownloadIcon />
                  )}
                </ButtonLightStyled>
              </DownloadSoapLabel>
              <DownloadSoapLabel>
                <p className="fs-6 m-0">Preview</p>
                <ButtonLightStyled
                  disabled={previewPdfIsFetching}
                  className="btn btn-icon btn-light-info"
                  onClick={() => previewPdfRefetch()}
                >
                  {previewPdfIsFetching ? (
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
              </DownloadSoapLabel>
            </div>
          </div>
        </div>
      </Overlay>
    </div>
  )
}