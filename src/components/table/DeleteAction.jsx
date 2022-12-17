import React from "react"
import styled from "styled-components"

/**
 * Komponen kustom delete action
 */
const ButtonStyled = styled.div`
  button {
    background-color: #f5f8fa;
    :hover {
      background-color: rgba(203, 0, 63, 0.08);
      path {
        fill: #cb003f;
      }
    }
  }
  span {
    background-color: #f5f8fa;
    :hover {
      background-color: rgba(203, 0, 63, 0.08);
      path {
        fill: #cb003f;
      }
    }
  }
`

/**
 * Komponen kustom delete action dengan ikon
 * @param {{
 * onClick: Function
 * className: String
 * condition: *
 * }}
 * @returns
 */
export default function DeleteAction({ onClick, className, condition }) {
  return condition ? (
    <ButtonStyled>
      <span
        className={`btn btn-sm btn-icon ${
          condition ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <g
            id="Group_7771"
            data-name="Group 7771"
            transform="translate(0 0.119)"
          >
            <rect
              id="Rectangle_4095"
              data-name="Rectangle 4095"
              width="18"
              height="18"
              transform="translate(0 -0.119)"
              fill="none"
            />
            <g
              id="Group_7770"
              data-name="Group 7770"
              transform="translate(3.725 2.235)"
            >
              <path
                id="Path_1591"
                data-name="Path 1591"
                d="M5,8.745A.745.745,0,0,1,5.745,8h8.941a.745.745,0,0,1,.745.745v6.706A2.235,2.235,0,0,1,13.2,17.686H7.235A2.235,2.235,0,0,1,5,15.451Z"
                transform="translate(-5 -4.275)"
                fill="#a1a5b7"
              />
              <path
                id="Path_1592"
                data-name="Path 1592"
                d="M5,4.745A.745.745,0,0,1,5.745,4h8.941a.745.745,0,0,1,.745.745h0a.745.745,0,0,1-.745.745H5.745A.745.745,0,0,1,5,4.745Z"
                transform="translate(-5 -3.255)"
                fill="#a1a5b7"
                opacity="0.5"
              />
              <path
                id="Path_1593"
                data-name="Path 1593"
                d="M9,3.745A.745.745,0,0,1,9.745,3h2.98a.745.745,0,0,1,.745.745H9Z"
                transform="translate(-6.02 -3)"
                fill="#a1a5b7"
                opacity="0.5"
              />
            </g>
          </g>
        </svg>
      </span>
    </ButtonStyled>
  ) : (
    <ButtonStyled>
      <button onClick={onClick} className={`btn btn-sm btn-icon ${className}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <g
            id="Group_7771"
            data-name="Group 7771"
            transform="translate(0 0.119)"
          >
            <rect
              id="Rectangle_4095"
              data-name="Rectangle 4095"
              width="18"
              height="18"
              transform="translate(0 -0.119)"
              fill="none"
            />
            <g
              id="Group_7770"
              data-name="Group 7770"
              transform="translate(3.725 2.235)"
            >
              <path
                id="Path_1591"
                data-name="Path 1591"
                d="M5,8.745A.745.745,0,0,1,5.745,8h8.941a.745.745,0,0,1,.745.745v6.706A2.235,2.235,0,0,1,13.2,17.686H7.235A2.235,2.235,0,0,1,5,15.451Z"
                transform="translate(-5 -4.275)"
                fill="#a1a5b7"
              />
              <path
                id="Path_1592"
                data-name="Path 1592"
                d="M5,4.745A.745.745,0,0,1,5.745,4h8.941a.745.745,0,0,1,.745.745h0a.745.745,0,0,1-.745.745H5.745A.745.745,0,0,1,5,4.745Z"
                transform="translate(-5 -3.255)"
                fill="#a1a5b7"
                opacity="0.5"
              />
              <path
                id="Path_1593"
                data-name="Path 1593"
                d="M9,3.745A.745.745,0,0,1,9.745,3h2.98a.745.745,0,0,1,.745.745H9Z"
                transform="translate(-6.02 -3)"
                fill="#a1a5b7"
                opacity="0.5"
              />
            </g>
          </g>
        </svg>
      </button>
    </ButtonStyled>
  )
}
