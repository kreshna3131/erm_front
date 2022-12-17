import React from "react"
import styled from "styled-components"

const ButtonStyled = styled.div`
  button {
    background-color: #f5f8fa;
    :hover {
      background-color: rgba(13, 154, 137, 0.1);
      path {
        fill: #0d9a89;
      }
    }
  }
  span {
    background-color: #f5f8fa;
    :hover {
      background-color: rgba(13, 154, 137, 0.1);
      path {
        fill: #0d9a89;
      }
    }
  }
`

export default function SpecialistEditAction({ onClick, className,condition }) {
  return (
    condition ?
    <ButtonStyled >

   <span  className={`btn btn-sm btn-icon
   ${
    condition
      ? "opacity-50 cursor-not-allowed"
      : ""
  } ${className}
   `}>
 <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <g
            id="Group_7772"
            data-name="Group 7772"
            transform="translate(0 -0.001)"
          >
            <rect
              id="Rectangle_4095"
              data-name="Rectangle 4095"
              width="18"
              height="18"
              transform="translate(0 0.001)"
              fill="none"
            />
            <g
              id="Group_7767"
              data-name="Group 7767"
              transform="translate(1.501 1.5)"
            >
              <path
                id="Path_1589"
                data-name="Path 1589"
                d="M16.55,6.765,14.931,8.384,10.614,4.066l1.619-1.619a1.527,1.527,0,0,1,2.159,0L16.55,4.606a1.527,1.527,0,0,1,0,2.159ZM3.265,16.95l4.65-1.55L3.6,11.082l-1.55,4.65a.962.962,0,0,0,1.22,1.217Z"
                transform="translate(-1.998 -2)"
                fill="#a1a5b7"
                opacity="0.3"
              />
              <path
                id="Path_1590"
                data-name="Path 1590"
                d="M4.681,17.164l-1.412.471a.963.963,0,0,1-1.218-1.217L2.523,15ZM3.6,11.767l4.317,4.317,7.016-7.016L10.618,4.751Z"
                transform="translate(-1.999 -2.688)"
                fill="#a1a5b7"
              />
            </g>
          </g>
        </svg>
   </span>
   </ButtonStyled>

    :
    <ButtonStyled 
   >
      <button onClick={onClick} className={`btn btn-sm btn-icon ${className}`} >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <g
            id="Group_7772"
            data-name="Group 7772"
            transform="translate(0 -0.001)"
          >
            <rect
              id="Rectangle_4095"
              data-name="Rectangle 4095"
              width="18"
              height="18"
              transform="translate(0 0.001)"
              fill="none"
            />
            <g
              id="Group_7767"
              data-name="Group 7767"
              transform="translate(1.501 1.5)"
            >
              <path
                id="Path_1589"
                data-name="Path 1589"
                d="M16.55,6.765,14.931,8.384,10.614,4.066l1.619-1.619a1.527,1.527,0,0,1,2.159,0L16.55,4.606a1.527,1.527,0,0,1,0,2.159ZM3.265,16.95l4.65-1.55L3.6,11.082l-1.55,4.65a.962.962,0,0,0,1.22,1.217Z"
                transform="translate(-1.998 -2)"
                fill="#a1a5b7"
                opacity="0.3"
              />
              <path
                id="Path_1590"
                data-name="Path 1590"
                d="M4.681,17.164l-1.412.471a.963.963,0,0,1-1.218-1.217L2.523,15ZM3.6,11.767l4.317,4.317,7.016-7.016L10.618,4.751Z"
                transform="translate(-1.999 -2.688)"
                fill="#a1a5b7"
              />
            </g>
          </g>
        </svg>
      </button>
    </ButtonStyled>
  )
}
