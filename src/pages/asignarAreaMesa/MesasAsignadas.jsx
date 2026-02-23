import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Heading,
  Spinner,
  Text,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Button,
  useToast,
  Flex,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdTableRestaurant, MdDelete, MdAdd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  fetchMesasAsignadasThunk,
  desasignarMesaThunk,
  fetchMesasActivasThunk,
  fetchMesasDisponiblesThunk,
  asignarMesaThunk,
} from "../../store/asignacionAM/thunks";
import ModalComentario from "../../components/component/ModalComentario";

const MesasAsignadas = ({ areaId }) => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const usuarioId = localStorage.getItem("usuarioId");
  const { mesasActivas, mesasAsignadas, mesasDisponibles, status, error } =
    useSelector((state) => state.AsignacionAreaMesa);

  const toast = useToast();

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
    const mesa = (Array.isArray(mesasActivas) ? mesasActivas : []).find(
      (mesa) => mesa.id === mesaId,
    );
    return mesa ? `${mesa.name}` : "Mesa no encontrada";
  };

  const handleAsignar = ({ id_mesa, comentario }) => {
    dispatch(
      asignarMesaThunk({
        id_area: areaId,
        id_mesa,
        comentario,
        create_by: Number(usuarioId),
        state: true,
      }),
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast({
          title: "Mesa asignada",
          description: "La mesa se agregó correctamente al área.",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        });
      }
      dispatch(fetchMesasAsignadasThunk(areaId));
      dispatch(fetchMesasDisponiblesThunk());
    });
  };

  const handleDesasignar = (mesaId) => {
    const asignacion = (
      Array.isArray(mesasAsignadas) ? mesasAsignadas : []
    ).find((m) => m.id === mesaId);
    if (asignacion) {
      dispatch(
        desasignarMesaThunk({ id: asignacion.id, userId: Number(usuarioId) }),
      ).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast({
            title: "Mesa removida",
            description: "La mesa fue quitada del área.",
            status: "info",
            duration: 2000,
            isClosable: true,
            position: "top-right",
          });
        }
        dispatch(fetchMesasAsignadasThunk(areaId));
        dispatch(fetchMesasDisponiblesThunk());
      });
    } else {
      toast({
        title: "Error",
        description: "No se encontró la asignación de esta mesa.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const iconBg = useColorModeValue("green.50", "green.900");
  const iconColor = useColorModeValue("green.600", "green.300");
  const headingColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const listBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const listBorderColor = useColorModeValue("gray.300", "gray.600");
  const tagBg = useColorModeValue("white", "gray.700");
  const tagBorderColor = useColorModeValue("green.200", "green.800");
  const tagLabelColor = useColorModeValue("gray.700", "whiteAlpha.800");

  if (status === "loading") {
    return <Spinner />;
  }

  if (status === "failed") {
    return <Text color="red.500">Error: {error}</Text>;
  }

  return (
    <Box
      mt={8}
      p={5}
      bg={bgColor}
      borderRadius="xl"
      shadow="sm"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={6}
        borderBottom="1px solid"
        borderColor={borderColor}
        pb={4}
      >
        <Flex align="center" gap={3}>
          <Flex bg={iconBg} p={2} borderRadius="md" color={iconColor}>
            <Icon as={MdTableRestaurant} boxSize={5} />
          </Flex>
          <Heading size="md" color={headingColor} fontWeight="semibold">
            Mesas Asignadas
          </Heading>
        </Flex>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            colorScheme="green"
            aria-label="Agregar mesa"
            size="sm"
            boxShadow="sm"
          >
            + Agregar Mesa
          </MenuButton>
          <MenuList border="none" shadow="lg" borderRadius="lg">
            {(Array.isArray(mesasDisponibles) ? mesasDisponibles : []).map(
              (mesa) => (
                <MenuItem
                  key={mesa.id}
                  _hover={{ bg: "green.50", color: "green.700" }}
                  onClick={() => {
                    setMesaSeleccionada(mesa);
                    onOpen();
                  }}
                >
                  {mesa.name}
                </MenuItem>
              ),
            )}
            {(!Array.isArray(mesasDisponibles) ||
              mesasDisponibles.length === 0) && (
              <MenuItem isDisabled>No hay mesas disponibles</MenuItem>
            )}
          </MenuList>
        </Menu>
      </Flex>

      <Box
        p={4}
        bg={listBg}
        borderRadius="lg"
        minH="80px"
        border="1px dashed"
        borderColor={listBorderColor}
      >
        <HStack spacing={3} wrap="wrap">
          {!Array.isArray(mesasAsignadas) || mesasAsignadas.length === 0 ? (
            <Text color="gray.500" fontStyle="italic">
              No hay mesas asignadas en este momento.
            </Text>
          ) : (
            (Array.isArray(mesasAsignadas) ? mesasAsignadas : []).map(
              (mesa) => (
                <Tag
                  size="lg"
                  key={mesa.id}
                  borderRadius="md"
                  variant="subtle"
                  colorScheme="green"
                  bg={tagBg}
                  border="1px solid"
                  borderColor={tagBorderColor}
                  px={4}
                  py={2}
                  boxShadow="sm"
                  _hover={{
                    shadow: "md",
                    transform: "translateY(-1px)",
                    transition: "all 0.2s",
                  }}
                >
                  <Icon as={MdTableRestaurant} mr={2} color="green.500" />
                  <TagLabel fontWeight="medium" color={tagLabelColor}>
                    {getNombreMesa(mesa.id_mesa)}
                  </TagLabel>
                  <TagCloseButton
                    ml={3}
                    color="red.400"
                    _hover={{ bg: "red.50", color: "red.600" }}
                    onClick={() => handleDesasignar(mesa.id)}
                  >
                    <Icon as={MdDelete} />
                  </TagCloseButton>
                </Tag>
              ),
            )
          )}
        </HStack>
      </Box>
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
