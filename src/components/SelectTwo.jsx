import React from "react"
import Select from "react-select"

export default function SelectTwo({ data, onChange, name, id, value }) {
  const colourStyles = {
    control: (styles, state) => ({
      ...styles,
      backgroundColor: "#F5F8FA",
      padding: "5px",
      border: state.isFocused ? 0 : 0,
      boxShadow: state.isFocused ? 0 : 0,
      fontWeight: "500",

      "&:hover": {
        border: state.isFocused ? 0 : 0,
      },
    }),

    option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
      ...styles,
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
  }

  return (
    <Select
      name={name}
      id={id}
      onChange={onChange}
      components={{
        IndicatorSeparator: "",
      }}
      options={data}
      value={value}
      placeholder="Semua"
      styles={colourStyles}
    />
  )
}
