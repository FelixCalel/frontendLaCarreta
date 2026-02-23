import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Card,
  CardBody,
  Flex,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdAddBusiness } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchOpciones, crearAreaThunk } from "../../store/areas/thunks";
import { fetchUsuarios } from "../../store/usuarios/usuariosSlice";

const CrearArea = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const [nombre, setNombre] = useState("");
  const [encargadoId, setEncargadoId] = useState("");
  const [opcionId, setOpcionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { opciones } = useSelector((state) => state.areas);
  const { items } = useSelector((state) => state.usuarios);
  const usuarios = items || [];

  useEffect(() => {
    dispatch(fetchOpciones());
    dispatch(fetchUsuarios());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !opcionId) {
      toast({
        title: "Campos obligatorios",
        description:
          "Por favor, ingresa el nombre y selecciona la Opción Base.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    const usuarioId = Number(localStorage.getItem("usuarioId")) || 1;

    const nuevaArea = {
      nombre,
      encargado: encargadoId ? Number(encargadoId) : null,
      opcion: Number(opcionId),
      create_by: usuarioId,
      state: true,
    };

    dispatch(crearAreaThunk(nuevaArea)).then((res) => {
      setIsSubmitting(false);
      if (res.meta.requestStatus === "fulfilled") {
        toast({
          title: "Área creada",
          description:
            "La nueva área de producción ha sido registrada correctamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        navigate("/asignacion-areas");
      } else {
        toast({
          title: "Error",
          description:
            "Hubo un problema al crear el área. " + (res.payload || ""),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    });
  };

  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorderColor = useColorModeValue("gray.100", "gray.700");
  const iconBg = useColorModeValue("green.50", "green.900");
  const iconColor = useColorModeValue("green.600", "green.300");
  const headingColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const textColor = useColorModeValue("gray.500", "whiteAlpha.700");
  const labelColor = useColorModeValue("gray.700", "whiteAlpha.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Box p={{ base: 4, md: 8 }} maxW="800px" mx="auto">
      <Card
        bg={cardBg}
        shadow="sm"
        borderRadius="xl"
        borderWidth="1px"
        borderColor={cardBorderColor}
      >
        <CardBody p={8}>
          <Flex
            align="center"
            gap={4}
            mb={6}
            borderBottom="1px solid"
            borderColor={borderColor}
            pb={4}
          >
            <Flex bg={iconBg} p={3} borderRadius="md" color={iconColor}>
              <Icon as={MdAddBusiness} boxSize={6} />
            </Flex>
            <Box>
              <Heading size="lg" color={headingColor}>
                Crear Nueva Área
              </Heading>
              <Text color={textColor} fontSize="sm" mt={1}>
                Registra una nueva área de producción y configúrala.
              </Text>
            </Box>
          </Flex>

          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <FormControl isRequired>
                <FormLabel fontWeight="medium" color={labelColor}>
                  Nombre del Área
                </FormLabel>
                <Input
                  placeholder="Ej. Producción Principal, Área de Corte..."
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  focusBorderColor="green.400"
                  size="lg"
                  bg={useColorModeValue("white", "gray.700")}
                  color={useColorModeValue("gray.800", "white")}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="medium" color={labelColor}>
                  Opción Base (Referencia del Menú)
                </FormLabel>
                <Select
                  placeholder="Selecciona la opción a la que pertenece"
                  value={opcionId}
                  onChange={(e) => setOpcionId(e.target.value)}
                  focusBorderColor="green.400"
                  size="lg"
                  bg={useColorModeValue("white", "gray.700")}
                  color={useColorModeValue("gray.800", "white")}
                >
                  {(opciones || []).map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.nombre}
                    </option>
                  ))}
                </Select>
                <Text fontSize="xs" color={textColor} mt={1}>
                  Toda área requiere estar enlazada a una Opción del sistema.
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="medium" color={labelColor}>
                  Encargado Inicial (Opcional)
                </FormLabel>
                <Select
                  placeholder="Sin encargado"
                  value={encargadoId}
                  onChange={(e) => setEncargadoId(e.target.value)}
                  focusBorderColor="green.400"
                  size="lg"
                  bg={useColorModeValue("white", "gray.700")}
                  color={useColorModeValue("gray.800", "white")}
                >
                  {(usuarios || [])
                    .filter((u) => u.estaActivo)
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.nombre} {user.apellido}
                      </option>
                    ))}
                </Select>
              </FormControl>

              <Flex justify="flex-end" gap={4} mt={4}>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/asignacion-areas")}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  colorScheme="green"
                  size="lg"
                  isLoading={isSubmitting}
                  px={8}
                >
                  Guardar Área
                </Button>
              </Flex>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
};

export default CrearArea;
