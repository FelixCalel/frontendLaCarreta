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
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";

const PageAsignacion = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [areaId, setAreaId] = useState(null);
  const [nombreArea, setNombreArea] = useState("");
  const [encargado, setEncargado] = useState(null);

  const {
    areas,
    opciones,
    loading: areasLoading,
  } = useSelector((state) => state.areas);
  const { usuarios, loading: usuariosLoading } = useSelector(
    (state) => state.usuarios,
  );

  useEffect(() => {
    dispatch(fetchAreas());
    dispatch(fetchOpciones());
    dispatch(fetchUsuarios());
  }, [dispatch]);

  useEffect(() => {
    if (areasLoading || usuariosLoading || !id) return;

    const area = (areas || []).find((a) => a.id === Number(id));

    if (!area) {
      console.warn("No se encontró el área proporcionada en la URL");
      return;
    }

    const opcion = (opciones || []).find((o) => o.id === area.opcion_id);

    setAreaId(area.id);
    setNombreArea(opcion ? opcion.nombre : "Área");

    if (area.encargado_id) {
      const encargadoData = (usuarios || []).find(
        (u) => u.id === area.encargado_id,
      );
      setEncargado(encargadoData);
    } else {
      setEncargado(null);
    }
  }, [id, areas, opciones, usuarios, areasLoading, usuariosLoading]);

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
      <Button
        leftIcon={<ArrowBackIcon />}
        variant="ghost"
        mb={4}
        onClick={() => {
          navigate("/asignacion-areas");
        }}
      >
        Volver
      </Button>

      <Heading size="lg" mb={4} textAlign={"center"}>
        {nombreArea} (Área {areaId})
      </Heading>
      <Box mb={4}>
        <Button onClick={onOpen} colorScheme="green">
          Administrar Encargado
        </Button>
        <Text mt={2} fontWeight="bold">
          Encargado Actual:{" "}
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
