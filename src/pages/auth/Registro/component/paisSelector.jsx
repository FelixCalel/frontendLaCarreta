import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Select, FormControl, FormLabel, Text } from "@chakra-ui/react";
import { tablaPais } from "../../../../store/pais/thunks";

export default function PaisSelector({ value, onPaisChange, error }) {
  const dispatch = useDispatch();
  const { data: paises, status } = useSelector((state) => state.paises);

  useEffect(() => {
    dispatch(tablaPais());
  }, [dispatch]);

  if (status === "loading") {
    return <Text>Cargando países...</Text>;
  }
  if (status === "failed") {
    return <Text color="red.500">Error al cargar los países.</Text>;
  }

  return (
    <FormControl id="pais" isInvalid={!!error} isRequired>
      <FormLabel>País</FormLabel>
      <Select
        placeholder="Selecciona un país"
        value={value}
        onChange={(e) => onPaisChange(Number(e.target.value))}
        focusBorderColor="green.500"
      >
        {paises.map((pais) => (
          <option key={pais.id} value={pais.id}>
            {pais.nombre} {pais.dialCode ? `(${pais.dialCode})` : ""}
          </option>
        ))}
      </Select>
      {error && (
        <Text color="red.500" fontSize="sm" mt={1}>
          {error}
        </Text>
      )}
    </FormControl>
  );
}

PaisSelector.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPaisChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

PaisSelector.defaultProps = {
  value: "",
  error: "",
};
