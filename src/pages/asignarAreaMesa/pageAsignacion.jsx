import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Spinner,
  Heading,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAreas, fetchOpciones } from "../../store/areas/thunks";
import { fetchUsuarios } from "../../store/usuarios/usuariosSlice";
import MesasAsignadas from "./MesasAsignadas";
import AsignacionesTipoGrupo from "./AsignacionesTipoGrupo";
import EncargadoModal from "./EncargadoModal";

const PageAsignacion = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [areaId, setAreaId] = useState(null);
  const [nombreArea, setNombreArea] = useState("");
  const [encargado, setEncargado] = useState(null);

  const { areas, opciones, loading: areasLoading } = useSelector((state) => state.areas);
  const { usuarios, loading: usuariosLoading } = useSelector((state) => state.usuarios);

  useEffect(() => {
    dispatch(fetchAreas());
    dispatch(fetchOpciones());
    dispatch(fetchUsuarios());
  }, [dispatch]);

  useEffect(() => {
    if (areasLoading || usuariosLoading) return;

    const rutaActual = location.pathname.split("/")[1];
    const rutaConSlash = `/${rutaActual}`;

    const opcion = opciones.find((o) => o.ruta === rutaConSlash);

    if (!opcion) {
      console.warn("No se encontró la opción para esta ruta");
      return;
    }

    const area = areas.find((a) => a.opcion_id === opcion.id);
    
    if (!area) {
      console.warn("No se encontró el área para esta opción");
      return;
    }

    setAreaId(area.id);
    setNombreArea(opcion.nombre);

    // We need to fetch area details to get encargado_id if it's not in the list
    // But assuming fetchAreas returns enough info or we rely on what we have.
    // The original code fetched area details.
    // Let's assume the area object from list has encargado_id or we need to fetch it.
    // If fetchAreas returns list of areas, check if it has encargado_id.
    // If not, we might need a specific thunk or just use what we have.
    // Let's assume for now we use what we have, or if needed we can dispatch fetchAreaById.
    
    if (area.encargado_id) {
        const encargadoData = usuarios.find((u) => u.id === area.encargado_id);
        setEncargado(encargadoData);
    } else {
        setEncargado(null);
    }

  }, [location.pathname, areas, opciones, usuarios, areasLoading, usuariosLoading]);

  if (areasLoading || usuariosLoading) {
    return (
      <Box p={4}>
        <Spinner />
        <Text>Cargando datos...</Text>
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
          Encargado:{" "}
          {encargado
            ? `${encargado.nombre} ${encargado.apellido}`
            : "Ninguno asignado"}
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
