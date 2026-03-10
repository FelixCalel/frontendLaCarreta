import PropTypes from "prop-types";
import { Box } from "@chakra-ui/react";

export const AlmacenSelect = ({
  almacenId,
  handleAlmacenChange,
  selectBorderColor,
  selectColor,
  selectBgColor,
  almacenes,
  optionColor,
  optionBgColor,
}) => (
  <Box display="inline-flex" flexDirection="column" alignItems="flex-start">
    <select
      value={almacenId}
      onChange={(e) => handleAlmacenChange(e.target.value)}
      style={{
        fontSize: "12px",
        padding: "2px 6px",
        borderRadius: "4px",
        border: "1px solid",
        borderColor: selectBorderColor,
        color: selectColor,
        background: selectBgColor,
        cursor: "pointer",
        outline: "none",
        width: "100%",
        minWidth: "100px",
      }}
    >
      <option value="">-- Seleccionar --</option>
      {almacenes.map((almacen) => (
        <option
          key={almacen.id}
          value={almacen.id}
          style={{
            color: optionColor,
            background: optionBgColor,
          }}
        >
          {almacen.nombre || almacen.name}
        </option>
      ))}
    </select>
  </Box>
);

AlmacenSelect.propTypes = {
  almacenId: PropTypes.string.isRequired,
  handleAlmacenChange: PropTypes.func.isRequired,
  selectBorderColor: PropTypes.string.isRequired,
  selectColor: PropTypes.string.isRequired,
  selectBgColor: PropTypes.string.isRequired,
  almacenes: PropTypes.array.isRequired,
  optionColor: PropTypes.string.isRequired,
  optionBgColor: PropTypes.string.isRequired,
};

export default AlmacenSelect;
