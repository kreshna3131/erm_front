import styled from "styled-components"

/**
 * Kustom komponen styled table row
 * - ketika di hover background akan berubah warna
 * - memiliki border bottom tiap row kecuali row terakhir
 */
export const HoverBorderedTr = styled.tr`
  &:hover {
    td {
      background-color: #f5fbfa;
    }
  }

  td {
    border-bottom: 2px dashed #eff2f5;
  }
`

/**
 * Kustom komponen styled table row dengan background dinamis
 * - warna background tergantung status
 * - memiliki border bottom tiap row kecuali row terakhir
 * @param {String} dynamicBg
 * @param {Boolean} disbled
 */
export const HoverBorderedTrBg = styled(HoverBorderedTr)`
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};

  ${(props) => (props.disabled ? "position: relative;" : "")}

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: ${(props) => (props.disabled ? "block" : "none")};
  }

  cursor: ${(props) => (props.disabled ? "not-allowed" : "default")};

  td,
  th {
    ${(props) =>
      !props.dynamicBg
        ? "background-color: #FFFFFF"
        : `background-color:${props.dynamicBg} !important`};
  }

  &:not(:last-child) {
    td,
    th {
      border-bottom: 2px dashed
        ${(props) => (!props.dynamicBg ? "#eff2f5" : "#FFFFFF")};
    }
  }
`
