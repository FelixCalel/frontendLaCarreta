import { useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAreas, fetchOpciones } from "../../store/areas/thunks";
import { fetchUsuarios } from "../../store/usuarios/usuariosSlice";

const PageAsignacionAreas = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const cardBg = useColorModeValue("white", "gray.800");

  if (areasLoading || usuariosLoading) {
    return (
      <Box
        p={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        h="50vh"
      >
        <Spinner size="xl" />
        <Text ml={4}>Cargando áreas de producción...</Text>
      </Box>
    );
  }

  // Filtrar áreas y enriquecerlas con el nombre de la opción (si están asociadas) y el encargado
  // Asumimos que el backend envía la data de áreas o lo podemos armar
  const areasEnriquecidas = (areas || []).map((area) => {
    const opcionAsociada = (opciones || []).find(
      (op) => op.id === area.opcion_id,
    );
    const encargado = (usuarios || []).find((u) => u.id === area.encargado_id);
    return {
      ...area,
      nombreOpcion: opcionAsociada ? opcionAsociada.nombre : "Área Inicial",
      encargadoNombre: encargado
        ? `${encargado.nombre} ${encargado.apellido}`
        : "Sin encargado",
    };
  });

  return (
    <Box p={5}>
      <Heading size="lg" mb={6} textAlign="center">
        Asignación de Áreas de Producción
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {areasEnriquecidas.length > 0 ? (
          areasEnriquecidas.map((area) => (
            <Card
              key={area.id}
              bg={cardBg}
              shadow="md"
              borderWidth="1px"
              borderRadius="lg"
            >
              <CardHeader pb={0}>
                <Heading size="md" color="teal.600">
                  {area.nombreOpcion}
                </Heading>
              </CardHeader>
              <CardBody>
                <Text fontWeight="bold" mb={2}>
                  Cod. Área: {area.id}
                </Text>
                <Text mb={4}>
                  <b>Encargado:</b> {area.encargadoNombre}
                </Text>
                <Button
                  colorScheme="green"
                  w="100%"
                  onClick={() => navigate(`/asignacion-areas/${area.id}`)}
                >
                  Administrar Área
                </Button>
              </CardBody>
            </Card>
          ))
        ) : (
          <Text textAlign="center" gridColumn="1 / -1">
            No hay áreas creadas o asignadas.
          </Text>
        )}
      </SimpleGrid>
    </Box>
  );
};

export default PageAsignacionAreas;
