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
