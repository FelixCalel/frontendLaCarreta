import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { tablaItems } from "../../store/items/thunks";
import Pagination from "../../components/pagination";

const PageItems = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.items);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    if (status === "idle") {
      dispatch(tablaItems());
    }
  }, [dispatch, status]);

  const filteredData = Array.isArray(items)
    ? items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

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
      <Flex justify="space-between" mb="20px" alignItems="center">
        <Text fontSize="2xl" fontWeight="bold" color="blue.600">
          Gestión de Items
        </Text>
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
          </Tr>
        </Thead>
        <Tbody>
          {filteredData.map((item, index) => (
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
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalItems={items?.length || 0}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </Box>
  );
};

export default PageItems;
