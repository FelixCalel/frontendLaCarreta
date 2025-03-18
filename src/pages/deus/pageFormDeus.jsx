import { useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Flex,
  Input,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { tablaDeudores } from "../../store/Deus/thunks";
import Pagination from "../../components/pagination";

const PageDeudores = () => {
  const dispatch = useDispatch();
  const { deudores, status, error } = useSelector((state) => state.deudores);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el campo de búsqueda
  const itemsPerPage = 15;

  useEffect(() => {
    if (status === "idle") {
      dispatch(tablaDeudores());
    }
  }, [dispatch, status]);

  // Filtro por búsqueda
  const filteredDeudores = deudores?.filter(
    (deudor) =>
      deudor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deudor.correlativo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredDeudores?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tableBg = useColorModeValue("white", "gray.800");
  const rowHoverBg = useColorModeValue("blue.50", "blue.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Text fontSize="2xl" color="red.500">
          Error al cargar los datos: {error}
        </Text>
      </Box>
    );
  }

  return (
    <Box padding="20px" maxWidth="1200px" margin="0 auto">
      {/* Barra de búsqueda */}
      <Flex justify="space-between" mb="20px" alignItems="center">
        <Text fontSize="2xl" fontWeight="bold" color="blue.600">
          Gestión de Deudores
        </Text>
        <Flex gap={4}>
          <Input
            placeholder="Buscar por nombre o correlativo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            width="300px"
            borderColor="gray.400"
          />
        </Flex>
      </Flex>

      {/* Tabla */}
      <Table
        variant="simple"
        bg={tableBg}
        rounded="md"
        shadow="lg"
        border={`1px solid ${borderColor}`}
        overflow="hidden"
      >
        <Thead bg="blue.600">
          <Tr>
            <Th color="white">ID</Th>
            <Th color="white">Nombre</Th>
            <Th color="white">Correlativo</Th>
            <Th color="white">Estado</Th> {/* Nueva columna para el estado */}
          </Tr>
        </Thead>
        <Tbody>
          {paginatedData?.map((deudor, index) => (
            <Tr
              key={deudor.id}
              _hover={{
                backgroundColor: rowHoverBg,
                transform: "scale(1.02)",
                transition: "all 0.2s ease-in-out",
              }}
            >
              <Td>{index + 1 + (currentPage - 1) * itemsPerPage}</Td>
              <Td fontWeight="bold">{deudor.nombre}</Td>
              <Td>{deudor.correlativo}</Td>
              <Td>{deudor.estaActivo === "Y" ? "Activo" : "Negativo"}</Td> {/* Muestra el estado */}
            </Tr>
          ))}
        </Tbody>
      </Table>
      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredDeudores?.length || 0}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </Box>
  );
};

export default PageDeudores;
