import { useNavigate } from "react-router"
import styled from "styled-components"

/**
 * Komponen custom untuk tombol light hover
 */
export const ButtonLightStyled = styled.button`
  &.active,
  &:hover,
  &:focus,
  &:active {
    path:not(.exception),
    rect:not(.exception),
    circle:not(.exception) {
      fill: #ffffff;
    }
  }
`
export const SpanLightStyled = styled.span`
  &:hover,
  &:focus,
  &:active {
    path:not(.exception),
    rect:not(.exception),
    circle:not(.exception) {
      fill: #ffffff;
    }
  }
`
/**
 * Komponen tombol reusable submit form formik
 * @param {{
 * formik: *
 * }}
 */
export function FormikSubmitButton({ formik }) {
  const navigate = useNavigate()
  return (
    <div className="d-flex justify-content-center">
      <button className="btn btn-light me-5" onClick={() => navigate(-1)}>
        Batal
      </button>
      <button
        onClick={() => formik.submitForm()}
        className="btn btn-primary"
        disabled={formik.isSubmitting || !formik.isValid}
      >
        {!formik.isSubmitting && (
          <span className="indicator-label fw-medium">Simpan</span>
        )}
        {formik.isSubmitting && (
          <span className="indicator-progress" style={{ display: "block" }}>
            Please wait...
            <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
          </span>
        )}
      </button>
    </div>
  )
}
