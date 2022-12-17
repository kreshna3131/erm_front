import styled from "styled-components"

/**
 * Kustom komponen untuk dropdown
 * @param {Boolean} disabled
 */
export const DropdownStatusStyled = styled.div`
  ${(props) => (props.disabled ? "position: relative" : "")};

  ${(props) =>
    props.disabled
      ? `
        &:after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          opacity: 0.5;
          background: #ffffff;
          cursor: not-allowed;
        }
        `
      : ""};

  .dropdown-item {
    display: flex;
    align-items: center;
    padding: 0 2rem;
    height: 40px;

    &.active,
    &:hover {
      background-color: #eff2f5;

      span {
        color: #0d9a89;
      }
    }
  }

  span {
    color: #7e8299;
  }
`
