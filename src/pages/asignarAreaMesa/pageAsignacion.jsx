// src/pages/asignarAreaMesa/pageAsignacion.jsx
import { useEffect, useState } from "react";
import { Box, Text, Spinner, Heading } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import MesasAsignadas from "./MesasAsignadas"; // Asegúrate que este path sea correcto

const BASE_URL = import.meta.env.VITE_API_URL;

const PageAsignacion = () => {
  const location = useLocation();
  const [areaId, setAreaId] = useState(null);
  const [nombreArea, setNombreArea] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreaId = async () => {
      try {
        const rutaActual = location.pathname.split("/")[1]; // ej: 'area1'
        const rutaConSlash = `/${rutaActual}`;

        const opcionesRes = await axios.get(`${BASE_URL}/api/opciones/`);
        const opcion = opcionesRes.data.find((o) => o.ruta === rutaConSlash);

        if (!opcion) {
          console.warn("No se encontró la opción para esta ruta");
          return;
        }

        const areasRes = await axios.get(`${BASE_URL}/area/`);
        const area = areasRes.data.find((a) => a.opcion_id === opcion.id);

        if (!area) {
          console.warn("No se encontró el área para esta opción");
          return;
        }

        setAreaId(area.id);
        setNombreArea(opcion.nombre);
      } catch (error) {
        console.error("Error al obtener datos del área:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreaId();
  }, [location.pathname]);

  if (loading) {
    return (
      <Box p={4}>
        <Spinner />
        <Text>Cargando mesas asignadas…</Text>
      </Box>
    );
  }

  if (!areaId) {
    return (
      <Box p={4}>
        <Text>No se pudo determinar el área.</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading size="lg" mb={4} textAlign={"center"}>
        {nombreArea}
      </Heading>

      {/* Aquí se integra el componente que renderiza las mesas */}
      <MesasAsignadas areaId={areaId} />
    </Box>
  );
};

export default PageAsignacion;
