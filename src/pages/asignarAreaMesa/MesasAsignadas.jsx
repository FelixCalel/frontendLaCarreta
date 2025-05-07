import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, Heading, Spinner, Text, HStack, Tag, TagLabel, TagCloseButton,useDisclosure, Menu,MenuButton,MenuList,MenuItem,IconButton} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { fetchMesasAsignadasThunk, desasignarMesaThunk, fetchMesasActivasThunk,
  fetchMesasDisponiblesThunk, asignarMesaThunk} from "../../store/asignacionAM/thunks";
import ModalComentario from "../../components/component/ModalComentario";

const MesasAsignadas = ({ areaId }) => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const usuarioId = localStorage.getItem("usuarioId");
  const { mesasActivas, mesasAsignadas,mesasDisponibles, status, error } = useSelector((state) => state.AsignacionAreaMesa);

  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    if (areaId) {
      dispatch(fetchMesasAsignadasThunk(areaId));
      dispatch(fetchMesasActivasThunk());
      dispatch(fetchMesasDisponiblesThunk());
    }
  }, [dispatch, areaId]);

  const getNombreMesa = (mesaId) => {
    const mesa = mesasActivas?.find((mesa) => mesa.id === mesaId);
    return mesa ? `${mesa.name}` : "Mesa no encontrada";
  };

  const handleAsignar = ({ id_mesa, comentario }) => {
    dispatch(asignarMesaThunk({
      id_area: areaId,
      id_mesa,
      comentario,
      create_by: Number(usuarioId),
      state: true
    })).then(() => {
      dispatch(fetchMesasAsignadasThunk(areaId));
      dispatch(fetchMesasDisponiblesThunk());
    });
  };
  

  const handleDesasignar = (mesaId) => {
    const asignacion = mesasAsignadas.find((m) => m.id === mesaId);
    if (asignacion) {
      dispatch(desasignarMesaThunk({id: asignacion.id , userId: Number(usuarioId)})).then(() => {
        dispatch(fetchMesasAsignadasThunk(areaId));
        dispatch(fetchMesasDisponiblesThunk());
      });
    } else {
      console.error("No se encontró la asignación para esta mesa");
    }
  };

  if (status === "loading") {
    return <Spinner />;
  }

  if (status === "failed") {
    return <Text color="red.500">Error: {error}</Text>;
  }

  return (
    <Box mt={6}>
      <Heading size="md" mb={4}>Mesas asignadas</Heading>
      {mesasAsignadas.length === 0 ? (
        <Text>No hay mesas asignadas.</Text>
      ) : (
        <HStack spacing={2} wrap="wrap" border={"1px solid"} borderColor="gray.200" p={2} borderRadius="md">
          {mesasAsignadas.map((mesa) => (
            <Tag
              size="lg"
              key={mesa.id}
              borderRadius="full"
              variant='outline'
              colorScheme="green"
            >
              <TagLabel>{getNombreMesa(mesa.id_mesa)}</TagLabel>
              <TagCloseButton onClick={() => handleDesasignar(mesa.id)} />
            </Tag>
          ))}
          <Box ml="auto">
            <Menu>
              <MenuButton as={IconButton} icon={<ChevronDownIcon />} colorScheme="green" variant="ghost" aria-label="Agregar mesa" mb={3}>
                Agregar Mesa
              </MenuButton>
              <MenuList>
                {mesasDisponibles?.map((mesa) => (
                  <MenuItem key={mesa.id} onClick={() => {
                    setMesaSeleccionada(mesa);
                    onOpen();
                  }}>
                    {mesa.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
        </HStack>
      )}
      <ModalComentario
        isOpen={isOpen}
        onClose={() => {
          setMesaSeleccionada(null);
          setComentario("");
          onClose();
        }}
        mesa={mesaSeleccionada}
        comentario={comentario}
        setComentario={setComentario}
        onConfirm={() => {
          handleAsignar({ id_mesa: mesaSeleccionada.id, comentario });
          setMesaSeleccionada(null);
          setComentario("");
          onClose();
        }}
      />

    </Box>
  );
};

MesasAsignadas.propTypes = {
  areaId: PropTypes.number.isRequired,
};

export default MesasAsignadas;
