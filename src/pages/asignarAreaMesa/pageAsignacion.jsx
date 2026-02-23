import { useEffect, useMemo, useRef } from "react";
import {
  Box,
  Text,
  Spinner,
  Heading,
  Button,
  useDisclosure,
  Card,
  CardBody,
  Flex,
  Avatar,
  Badge,
  Icon,
  useColorModeValue,
  IconButton,
  Tooltip,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import { MdPerson, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import MesasAsignadas from "./MesasAsignadas";
import AsignacionesTipoGrupo from "./AsignacionesTipoGrupo";
import EncargadoModal from "./EncargadoModal";
import { useParams, useNavigate } from "react-router-dom";
import { eliminarAreaThunk } from "../../store/areas/thunks";

const PageAsignacion = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = useRef();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();

  const {
    areas,
    opciones,
    loading: areasLoading,
  } = useSelector((state) => state.areas);
  const { items, status: usuariosStatus } = useSelector(
    (state) => state.usuarios,
  );
  const usuarios = items || [];
  const usuariosLoading = usuariosStatus === "loading";

  const area = useMemo(
    () => (areas || []).find((a) => a.id === Number(id)),
    [areas, id],
  );

  const opcion = useMemo(
    () => (area ? (opciones || []).find((o) => o.id === area.opcion_id) : null),
    [area, opciones],
  );

  const encargado = useMemo(
    () =>
      area && area.encargado_id
        ? (usuarios || []).find((u) => u.id === area.encargado_id)
        : null,
    [area, usuarios],
  );

  const nombreArea = useMemo(() => {
    if (!area) return "Área Sin Nombre";
    return area.nombre && area.nombre !== "Área Sin Nombre"
      ? area.nombre
      : opcion
        ? opcion.nombre
        : "Área Sin Nombre";
  }, [area, opcion]);

  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorderColor = useColorModeValue("gray.100", "gray.700");
  const statsBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const statsBorderColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");

  const handleDelete = async () => {
    try {
      await dispatch(
        eliminarAreaThunk({
          id: Number(id),
          update_by: Number(localStorage.getItem("usuarioId")),
        }),
      ).unwrap();

      toast({
        title: "Área eliminada",
        description: "El área ha sido eliminada correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onDeleteClose();
      navigate("/asignacion-areas");
    } catch (error) {
      toast({
        title: "Error al eliminar",
        description: error || "No se pudo eliminar el área",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (areasLoading || usuariosLoading) {
    return (
      <Box p={4}>
        <Spinner />
        <Text>Cargando datos del área...</Text>
      </Box>
    );
  }

  if (!area) {
    return (
      <Box p={4}>
        <Text>No se encontró el área proporcionada.</Text>
      </Box>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} maxW="1200px" mx="auto">
      <Card
        bg={cardBg}
        shadow="sm"
        borderRadius="xl"
        borderWidth="1px"
        borderColor={cardBorderColor}
        mb={8}
      >
        <CardBody>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            gap={4}
          >
            <Box>
              <Flex align="center" gap={3} mb={1}>
                <Heading size="lg" color="green.700">
                  {nombreArea}
                </Heading>
                <Badge
                  colorScheme="green"
                  variant="subtle"
                  fontSize="0.8em"
                  px={2}
                  py={1}
                  borderRadius="md"
                >
                  Área {area.id}
                </Badge>
              </Flex>
              <Text color="gray.500" fontSize="sm">
                Administración de mesas y líneas de producción asignadas
              </Text>
            </Box>

            <Flex
              align="center"
              gap={4}
              bg={statsBg}
              p={3}
              borderRadius="lg"
              border="1px solid"
              borderColor={statsBorderColor}
            >
              <Avatar
                size="sm"
                icon={<MdPerson fontSize="1.5rem" />}
                bg="green.100"
                color="green.600"
              />
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="gray.500"
                  textTransform="uppercase"
                >
                  Encargado Actual
                </Text>
                <Text fontWeight="medium" color={textColor} fontSize="sm">
                  {encargado
                    ? `${encargado.nombre} ${encargado.apellido}`
                    : "Aún no asignado"}
                </Text>
              </Box>
              <Button
                size="sm"
                onClick={onOpen}
                colorScheme="green"
                variant="outline"
                ml={2}
              >
                Cambiar
              </Button>
              <Tooltip label="Eliminar Área" hasArrow>
                <IconButton
                  aria-label="Eliminar área"
                  icon={<MdDelete />}
                  colorScheme="red"
                  variant="ghost"
                  onClick={onDeleteOpen}
                  size="sm"
                  ml={2}
                  _hover={{ bg: "red.50", color: "red.600" }}
                />
              </Tooltip>
            </Flex>
          </Flex>
        </CardBody>
      </Card>

      <EncargadoModal
        isOpen={isOpen}
        onClose={onClose}
        areaId={area.id}
        currentEncargado={encargado}
      />

      <MesasAsignadas areaId={area.id} />
      <AsignacionesTipoGrupo areaId={area.id} />

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="xl" bg={cardBg}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Área
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de que deseas eliminar el área{" "}
              <strong>{nombreArea}</strong>? Esta acción ocultará el área de la
              lista de producción.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose} variant="ghost">
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default PageAsignacion;
