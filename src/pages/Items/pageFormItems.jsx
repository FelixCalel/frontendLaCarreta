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
import { tablaItems } from "../../store/items/thunks";
import Pagination from "../../components/pagination";

const PageItems = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.items);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el campo de búsqueda
  const itemsPerPage = 15;

  useEffect(() => {
    if (status === "idle") {
      dispatch(tablaItems());
    }
  }, [dispatch, status]);

  // Filtro por nombre o código
  const filteredData = items?.filter(
    (item) =>
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Paginación
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tableBg = useColorModeValue("white", "gray.800");
  const rowHoverBg = useColorModeValue("blue.50", "blue.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  if (status === "loading") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Text fontSize="2xl" color="red.500">
          Error al cargar los datos: {error}
        </Text>
      </Box>
    );
  }

  return (
    <Box padding="20px" maxWidth="1200px" margin="10 auto">
      {/* Barra de búsqueda */}
      <Flex justify="space-between" mb="20px" alignItems="center">
        <Text fontSize="2xl" fontWeight="bold" color="blue.600">
          Gestión de Items
        </Text>
        <Flex gap={4}>
          <Input
            placeholder="Buscar por nombre o código"
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
            <Th color="white">Código</Th>
            <Th color="white">Código Almacén</Th>
            <Th color="white">Cantidad Disponible</Th>
            <Th color="white">Estado</Th> {/* Nueva columna para el estado */}
          </Tr>
        </Thead>
        <Tbody>
          {paginatedData.map((item, index) => (
            <Tr
              key={item.id}
              _hover={{
                backgroundColor: rowHoverBg,
                transform: "scale(1.02)",
                transition: "all 0.2s ease-in-out",
              }}
            >
              <Td>{index + 1 + (currentPage - 1) * itemsPerPage}</Td>
              <Td fontWeight="bold">{item.nombre}</Td>
              <Td>{item.codigo}</Td>
              <Td>{item.codigoAlmacen}</Td>
              <Td>{item.cantidadDisponible}</Td>
              <Td>{item.estaActivo ? "Activo" : "Inactivo"}</Td> {/* Muestra el estado */}
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredData.length || 0}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </Box>
  );
};

export default PageItems;
