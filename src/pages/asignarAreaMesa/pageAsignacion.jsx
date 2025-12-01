import { useEffect, useState } from "react";
import { Box, Text, Spinner, Heading, Button, useDisclosure  } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import MesasAsignadas from "./MesasAsignadas";
import AsignacionesTipoGrupo from "./AsignacionesTipoGrupo";
import EncargadoModal from "./EncargadoModal";


const BASE_URL = import.meta.env.VITE_API_URL;

const PageAsignacion = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const [areaId, setAreaId] = useState(null);
  const [nombreArea, setNombreArea] = useState("");
  const [loading, setLoading] = useState(true);
  const [encargado, setEncargado] = useState(null);



  useEffect(() => {
    const fetchAreaId = async () => {
      try {
        const rutaActual = location.pathname.split("/")[1];
        const rutaConSlash = `/${rutaActual}`;

        const opcionesRes = await axios.get(`${BASE_URL}/api/opciones/`);
        const opcion = opcionesRes.data.find((o) => o.ruta === rutaConSlash);

        if (!opcion) {
          console.warn("No se encontró la opción para esta ruta");
          return;
        }

        const areasRes = await axios.get(`${BASE_URL}/area/`);
        const area = areasRes.data.find((a) => a.opcion_id === opcion.id);
        const areaDetalleRes = await axios.get(`${BASE_URL}/area/${area.id}`);
        const encargadoId = areaDetalleRes.data.encargado_id;
        if (!area) {
          console.warn("No se encontró el área para esta opción");
          return;
        }

        setAreaId(area.id);
        if (encargadoId) {
          const usuariosRes = await axios.get(`${BASE_URL}/usuarios/todos`);
          const encargadoData = usuariosRes.data.usuarios.find(
            (u) => u.id === encargadoId
          );
          setEncargado(encargadoData);
        }
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
    <Box p={5}>
      <Heading size="lg" mb={4} textAlign={"center"}>
        {nombreArea}
      </Heading>
      <Box mb={4}>
        <Button onClick={onOpen} colorScheme="green">
          Encargado
        </Button>
        <Text mt={2} fontWeight="bold">
          Encargado: {encargado ? `${encargado.nombre} ${encargado.apellido}` : "Ninguno asignado"}
        </Text>
      </Box>

      <EncargadoModal
        isOpen={isOpen}
        onClose={onClose}
        areaId={areaId}
        currentEncargado={encargado}
      />


      <MesasAsignadas areaId={areaId} />
      <AsignacionesTipoGrupo areaId={areaId} />
    </Box>
  );
};

export default PageAsignacion;
