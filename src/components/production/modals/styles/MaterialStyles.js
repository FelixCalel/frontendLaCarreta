export const getMaterialSelectStyles = (isDark) => {
  const selectBg = isDark ? "#2D3748" : "white";
  const selectColor = isDark ? "white" : "black";
  const selectBorderColor = isDark ? "#4A5568" : "#E2E8F0";
  const selectHoverBg = isDark ? "#4A5568" : "#EDF2F7";
  const selectActiveBg = isDark ? "#2C5282" : "#EBF8FF";
  const placeholderColor = isDark ? "#718096" : "#A0AEC0";

  return {
    control: (provided) => ({
      ...provided,
      backgroundColor: selectBg,
      borderColor: selectBorderColor,
      color: selectColor,
      minHeight: "40px",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: selectBg,
      zIndex: 9999,
      border: `1px solid ${selectBorderColor}`,
    }),
    menuList: (provided) => ({
      ...provided,
      backgroundColor: selectBg,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? selectHoverBg
        : state.isSelected
          ? selectActiveBg
          : selectBg,
      color: selectColor,
      cursor: "pointer",
      "&:active": {
        backgroundColor: selectActiveBg,
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: selectColor,
    }),
    input: (provided) => ({
      ...provided,
      color: selectColor,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: placeholderColor,
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: selectColor,
    }),
  };
};

export const getModalColors = (isDark) => ({
  selectBg: isDark ? "#2D3748" : "white",
  selectColor: isDark ? "white" : "black",
  selectBorderColor: isDark ? "#4A5568" : "#E2E8F0",
  greenHoverBg: isDark ? "green.900" : "green.50",
  subTextColor: isDark ? "gray.300" : "gray.600",
  stockRedBg: isDark ? "rgba(227, 83, 83, 0.12)" : "red.50",
  stockGreenBg: isDark ? "rgba(72, 187, 120, 0.12)" : "green.50",
  stockGrayBg: isDark ? "rgba(160, 174, 192, 0.12)" : "gray.50",
});
