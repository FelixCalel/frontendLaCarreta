import { useEffect } from "react";
import PropTypes from "prop-types"; // Importamos PropTypes para la validación de las props
import { useSelector, useDispatch } from "react-redux";
import { tablaRuta } from "../../store/Ruta/thunks";
import { Checkbox, Stack, Text } from "@chakra-ui/react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL; // Agregar esta línea

const RutaSelector = ({ selectedRoutes, setSelectedRoutes, usuarioId }) => {
  const dispatch = useDispatch();

  // Aseguramos que 'rutas' sea siempre un array vacío si no tiene datos
  const rutas = useSelector((state) => state.rutas.data || []);

  // Carga las rutas cuando el componente es montado
  useEffect(() => {
    dispatch(tablaRuta()); // Despachamos la acción para cargar las rutas
  }, [dispatch]);

  // Manejar la selección de rutas usando checkboxes
  const handleCheckboxChange = async (rutaId, isChecked) => {
    if (isChecked) {
      // Si se marca el checkbox, se asigna la ruta
      await asignarRuta(usuarioId, rutaId);
      setSelectedRoutes([...selectedRoutes, rutaId]);
    } else {
      // Si se desmarca el checkbox, se desasigna la ruta
      await desasignarRuta(usuarioId, rutaId);
      setSelectedRoutes(selectedRoutes.filter((id) => id !== rutaId));
    }
  };

  const asignarRuta = async (usuarioId, rutaId) => {
    try {
      await axios.post(`${BASE_URL}/usuarios/${usuarioId}/asignar-ruta`, {
        rutaId: [rutaId], // Asigna solo esta ruta
      });
    } catch (error) {
      console.error("Error al asignar la ruta:", error);
    }
  };

  const desasignarRuta = async (usuarioId, rutaId) => {
    try {
      await axios.post(`${BASE_URL}/usuarios/${usuarioId}/desasignar-ruta`, {
        rutaId: [rutaId], // Desasigna solo esta ruta
      });
    } catch (error) {
      console.error("Error al desasignar la ruta:", error);
    }
  };

  return (
    <Stack spacing={2}>
      {rutas.length > 0 ? (
        rutas.map((ruta) => (
          <Checkbox
            key={ruta.id}
            isChecked={selectedRoutes.includes(ruta.id)}
            onChange={(e) => handleCheckboxChange(ruta.id, e.target.checked)}
          >
            {ruta.nombre}
          </Checkbox>
        ))
      ) : (
        <Text>No hay rutas disponibles</Text>
      )}
    </Stack>
  );
};

// Añadimos la validación de las props con PropTypes
RutaSelector.propTypes = {
  selectedRoutes: PropTypes.array.isRequired,  // 'selectedRoutes' es un array de IDs de rutas seleccionadas
  setSelectedRoutes: PropTypes.func.isRequired, // 'setSelectedRoutes' es una función para actualizar las rutas seleccionadas
  usuarioId: PropTypes.number.isRequired,      // 'usuarioId' es el ID del usuario actual
};

export default RutaSelector;
