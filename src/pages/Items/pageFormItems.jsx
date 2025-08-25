import { useEffect, useState, memo, useCallback } from "react";
import PropTypes from "prop-types";
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
  Switch,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  tablaItems,
  actualizarStatusProducto,
  actualizarDeudorProducto,
} from "../../store/items/thunks";
import { tablaDeudores } from "../../store/Deus/thunks";
import { patchItem } from "../../store/items/itemSlice";
import Pagination from "../../components/pagination";
import DeudorSelector from "./components/DeudorSelector";

const ItemRow = memo(
  ({ item, handleStatusChange, handleDeudorChange, deudoresDisponibles }) => {
    const rowHoverBg = useColorModeValue("blue.50", "blue.900");
    const currentDeudor =
      item?.deudor ||
      deudoresDisponibles?.find((d) => d.id === item.deuId) ||
      null;
    const initialLabel = currentDeudor
      ? `${currentDeudor.correlativo} - ${currentDeudor.nombre}`
      : "";

    return (
      <Tr _hover={{ backgroundColor: rowHoverBg }}>
        <Td>{item.id}</Td>
        <Td fontWeight="bold">{item.nombre}</Td>
        <Td>{item.codigo}</Td>
        <Td>{item.codigoAlmacen}</Td>
        <Td>{item.cantidadDisponible}</Td>
        <Td>
          <Switch
            isChecked={item.estaActivo}
            onChange={() => handleStatusChange(item.id, !item.estaActivo)}
            colorScheme="teal"
          />
        </Td>
        <Td>
          <DeudorSelector
            initialValue={initialLabel}
            onSelect={(deuId) => handleDeudorChange(item.id, deuId)}
            width={{ base: "120px", md: "220px" }}
          />
        </Td>
      </Tr>
    );
  }
);

ItemRow.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    codigo: PropTypes.string,
    codigoAlmacen: PropTypes.string,
    cantidadDisponible: PropTypes.number,
    estaActivo: PropTypes.bool,
    deuId: PropTypes.number,
    deudor: PropTypes.shape({
      id: PropTypes.number,
      correlativo: PropTypes.string,
      nombre: PropTypes.string,
    }),
  }).isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  handleDeudorChange: PropTypes.func.isRequired,
  deudoresDisponibles: PropTypes.array.isRequired,
};

ItemRow.displayName = "ItemRow";

const PageItems = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.items);
  const { deudores: deudoresDisponibles } = useSelector(
    (state) => state.deudores
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 15;

  useEffect(() => {
    dispatch(tablaItems());
    dispatch(tablaDeudores());
  }, [dispatch]);

  const filteredData =
    items?.filter(
      (item) =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tableBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleStatusChange = useCallback(
    (id, estaActivo) => {
      dispatch(patchItem({ id, changes: { estaActivo } }));
      dispatch(actualizarStatusProducto({ id, estaActivo }))
        .unwrap()
        .catch(() => {
          dispatch(patchItem({ id, changes: { estaActivo: !estaActivo } }));
        });
    },
    [dispatch]
  );

  const handleDeudorChange = useCallback(
    (id, deuId) => {
      dispatch(patchItem({ id, changes: { deuId } }));

      dispatch(actualizarDeudorProducto({ id, deuId }))
        .unwrap()
        .catch(() => {
          dispatch(patchItem({ id, changes: { deuId: null } }));
        });
    },
    [dispatch]
  );

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
    <Box
      w="100%"
      maxW={{ base: "100%", lg: "1280px", xl: "1360px" }}
      mx="auto"
      px={{ base: 2, md: 4 }}
      py={2}
    >
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

      <Table
        variant="simple"
        bg={tableBg}
        rounded="md"
        shadow="lg"
        border={`1px solid ${borderColor}`}
        overflowY="visible"
        overflowX="auto"
        position="relative"
      >
        <Thead bg="blue.600">
          <Tr>
            <Th color="white">ID</Th>
            <Th color="white">Nombre</Th>
            <Th color="white">Código</Th>
            <Th color="white">Código Almacén</Th>
            <Th color="white">Cantidad Disponible</Th>
            <Th color="white">Estado</Th>
            <Th color="white">Deudor</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedData.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              handleStatusChange={handleStatusChange}
              handleDeudorChange={handleDeudorChange}
              deudoresDisponibles={deudoresDisponibles}
            />
          ))}
        </Tbody>
      </Table>

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
