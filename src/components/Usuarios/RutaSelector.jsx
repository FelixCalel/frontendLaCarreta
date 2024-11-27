import { useState } from "react";
import PropTypes from "prop-types"; // Importamos PropTypes para la validación de las props
import { Checkbox, Stack, Text, useToast, Spinner } from "@chakra-ui/react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL; // Agregar esta línea

const RutaSelector = ({ selectedRoutes, setSelectedRoutes, usuarioId, filteredRutas }) => {
  const [loading, setLoading] = useState(false);  // Estado para controlar el estado de carga
  const toast = useToast();  // Usamos toast para mostrar mensajes de retroalimentación

  // Manejar la selección de rutas usando checkboxes
  const handleCheckboxChange = async (rutaId, isChecked) => {
    setLoading(true);  // Inicia el estado de carga
    try {
      if (isChecked) {
        await asignarRuta(usuarioId, rutaId);
        setSelectedRoutes([...selectedRoutes, rutaId]);
        toast({
          title: "Ruta asignada",
          description: "La ruta ha sido asignada correctamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await desasignarRuta(usuarioId, rutaId);
        setSelectedRoutes(selectedRoutes.filter((id) => id !== rutaId));
        toast({
          title: "Ruta desasignada",
          description: "La ruta ha sido desasignada correctamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error al manejar la ruta:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al asignar o desasignar la ruta.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);  // Finaliza el estado de carga
    }
  };

  const asignarRuta = async (usuarioId, rutaId) => {
    try {
      await axios.post(`${BASE_URL}/usuarios/${usuarioId}/asignar-ruta`, {
        rutaId: [rutaId], // Asigna solo esta ruta
      });
    } catch (error) {
      throw new Error("Error al asignar la ruta");
    }
  };

  const desasignarRuta = async (usuarioId, rutaId) => {
    try {
      await axios.post(`${BASE_URL}/usuarios/${usuarioId}/desasignar-ruta`, {
        rutaId: [rutaId], // Desasigna solo esta ruta
      });
    } catch (error) {
      throw new Error("Error al desasignar la ruta");
    }
  };

  return (
    <Stack spacing={2}>
      {loading ? (
        <Spinner size="lg" color="green.500" />
      ) : filteredRutas.length > 0 ? (
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

// Añadimos la validación de las props con PropTypes
RutaSelector.propTypes = {
  selectedRoutes: PropTypes.array.isRequired,  // 'selectedRoutes' es un array de IDs de rutas seleccionadas
  setSelectedRoutes: PropTypes.func.isRequired, // 'setSelectedRoutes' es una función para actualizar las rutas seleccionadas
  usuarioId: PropTypes.number.isRequired,      // 'usuarioId' es el ID del usuario actual
  filteredRutas: PropTypes.array.isRequired,   // 'filteredRutas' es el array de rutas filtradas según el país
};

export default RutaSelector;
