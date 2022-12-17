import { ReactComponent as DangerDownloadIcon } from "assets/icons/danger-download.svg"
import { ReactComponent as InfoPreviewIcon } from "assets/icons/info-preview.svg"
import { ReactComponent as TripleDotIcon } from "assets/icons/triple-dot.svg"
import axios from "axios"
import clsx from "clsx"
import { ButtonLightStyled } from "components/Button"
import useOnClickOutside from "hooks/useOnClickOutside"
import { useRef, useState } from "react"
import { Overlay } from "react-bootstrap"
import { useQuery } from "react-query"
import { useOutletContext } from "react-router"
import styled from "styled-components"

const DownloadSoapLabel = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: #7e8299;

  &.active,
  &:hover,
  &:focus,
  &:active {
    p {
      color: #0d9a89;
    }
  }
`

/**
 * Komponen tombol untuk mendownload / preview SOAP
 */
export function HistoryMedicDownloadButton({
  downloadUrl,
  downloadName,
  previewUrl,
}) {
  const overlayTarget = useRef()
  const overlayContainer = useRef()
  const [showOverlay, setShowOverlay] = useState(false)
  useOnClickOutside(overlayContainer, () => setShowOverlay(false))
  const { allPermissions } = useOutletContext()

  const { isFetching: downloadPdfIsFetching, refetch: downloadPdfRefetch } =
    useQuery(
      "downloadPDF",
      async () =>
        axios
          .get(downloadUrl, {
            responseType: "blob",
          })
          .then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", downloadName)
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
          .get(previewUrl, {
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
        placement="right-start"
      >
        <div className="card shadow-sm w-200px" style={{ marginLeft: "-45px" }}>
          <div className="card-body p-4">
            <div className="d-flex flex-column">
              <DownloadSoapLabel
                className={clsx({
                  "mb-3": true,
                  "cursor-not-allowed": !allPermissions.includes(
                    "lihat histori rekam medis"
                  ),
                })}
              >
                <p className="fs-6 m-0">Download</p>
                <ButtonLightStyled
                  disabled={
                    downloadPdfIsFetching ||
                    !allPermissions.includes("lihat histori rekam medis")
                  }
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
              <DownloadSoapLabel
                className={clsx({
                  "cursor-not-allowed": !allPermissions.includes(
                    "lihat histori rekam medis"
                  ),
                })}
              >
                <p className="fs-6 m-0">Preview</p>
                <ButtonLightStyled
                  disabled={
                    downloadPdfIsFetching ||
                    !allPermissions.includes("lihat histori rekam medis")
                  }
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
