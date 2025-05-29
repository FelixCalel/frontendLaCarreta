import PropTypes from "prop-types";
import { Checkbox, Stack, Text } from "@chakra-ui/react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const RutaSelector = ({
  selectedRoutes,
  setSelectedRoutes,
  usuarioId,
  filteredRutas,
}) => {
  const handleCheckboxChange = async (rutaId, isChecked) => {
    if (isChecked) {
      if (!selectedRoutes.includes(rutaId)) {
        await asignarRuta(usuarioId, rutaId);
        setSelectedRoutes((prevSelectedRoutes) => [
          ...prevSelectedRoutes,
          rutaId,
        ]);
      }
    } else {
      await desasignarRuta(usuarioId, rutaId);
      setSelectedRoutes((prevSelectedRoutes) =>
        prevSelectedRoutes.filter((id) => id !== rutaId)
      );
    }
  };

  const asignarRuta = async (usuarioId, rutaId) => {
    try {
      await axios.post(`${BASE_URL}/usuarios/${usuarioId}/asignar-ruta`, {
        rutaId: [rutaId],
      });
    } catch (error) {
      console.error("Error al asignar la ruta:", error);
    }
  };

  const desasignarRuta = async (usuarioId, rutaId) => {
    try {
      await axios.post(`${BASE_URL}/usuarios/${usuarioId}/desasignar-ruta`, {
        rutaId: [rutaId],
      });
    } catch (error) {
      console.error("Error al desasignar la ruta:", error);
    }
  };

  return (
    <Stack spacing={2}>
      {filteredRutas.length > 0 ? (
        filteredRutas.map((ruta) => (
          <Checkbox
            key={ruta.id}
            isChecked={selectedRoutes.includes(ruta.id)}
            onChange={(e) => handleCheckboxChange(ruta.id, e.target.checked)}
          >
            {ruta.nombre}
          </Checkbox>
        ))
      ) : (
        <Text>No hay rutas disponibles para este país.</Text>
      )}
    </Stack>
  );
};

RutaSelector.propTypes = {
  selectedRoutes: PropTypes.array.isRequired,
  setSelectedRoutes: PropTypes.func.isRequired,
  usuarioId: PropTypes.number.isRequired,
  filteredRutas: PropTypes.array.isRequired,
};

export default RutaSelector;
