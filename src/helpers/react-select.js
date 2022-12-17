/**
 * react select global style
 */
export const globalStyle = {
  control: (styles, state) => ({
    ...styles,
    backgroundColor: "#F5F8FA",
    padding: "5px",
    borderRadius: "0.475rem",
    border: state.isFocused ? 0 : 0,
    boxShadow: state.isFocused ? 0 : 0,
    padding: "4px",
    maxHeight: "42px",

    "&:hover": {
      border: state.isFocused ? 0 : 0,
    },
  }),

  menu: (styles, state) => ({
    ...styles,
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
  }),

  singleValue: (styles, { data }) => ({
    ...styles,
    color: data.value === "" ? "#A1A5B7" : "#5e6278",
    fontSize: "1.1rem",
  }),

  option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
    ...styles,
    fontSize: "1.1rem",
    color: isSelected ? "#FFFFFF" : "#3f4254",
    backgroundColor: isDisabled
      ? undefined
      : isSelected
      ? "#0D9A89"
      : isFocused
      ? "rgba(126,130,153,0.1)"
      : undefined,

    ":active": {
      ...styles[":active"],
      backgroundColor: !isDisabled
        ? isSelected
          ? "#0D9A89"
          : "rgba(126,130,153,0.1)"
        : undefined,
    },
  }),
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: "#d3e5ea",
    }
  },
  multiValueLabel: (styles) => ({
    ...styles,
    color: "#0d9a89",
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: "#0d9a89",
    ":hover": {
      backgroundColor: data.color,
      color: "red",
    },
  }),
}
