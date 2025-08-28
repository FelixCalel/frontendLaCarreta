import { useEffect, useState, useCallback, memo } from "react";
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
  Badge,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  tablaItems,
  actualizarStatusProducto,
  addDeudoresItem,
  removeDeudoresItem,
} from "../../store/items/thunks";
import { tablaDeudores } from "../../store/Deus/thunks";
import { patchItem } from "../../store/items/itemSlice";
import Pagination from "../../components/pagination";
import DeudorSelector from "./components/DeudorSelector";

const ItemRow = memo(
  ({ item, handleStatusChange, handleAddDeudor, handleRemoveDeudor }) => {
    const rowHoverBg = useColorModeValue("blue.50", "blue.900");

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
          <Flex direction="column" gap={2}>
            <DeudorSelector
              onSelect={(deuId) => {
                if (!item.deudores.some((d) => d.id === deuId)) {
                  handleAddDeudor(item.id, deuId);
                }
              }}
              onRemove={() => {}}
              width={{ base: "150px", md: "220px" }}
            />
            <Flex wrap="wrap" gap={1}>
              {item.deudores &&
                item.deudores.map((deudor) => (
                  <Tooltip
                    label={deudor.nombre}
                    aria-label={deudor.nombre}
                    key={deudor.id}
                  >
                    <Badge
                      variant="solid"
                      colorScheme="teal"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      p={1}
                      cursor="pointer"
                      maxW="300px"
                      fontSize="sm"
                    >
                      <Text isTruncated maxW="250px" fontSize="xs">
                        {deudor.correlativo} - {deudor.nombre}
                      </Text>
                      <IconButton
                        aria-label="Eliminar deudor"
                        icon={<CloseIcon />}
                        size="xs"
                        ml={0}
                        colorScheme="red"
                        onClick={() => handleRemoveDeudor(item.id, deudor.id)}
                      />
                    </Badge>
                  </Tooltip>
                ))}
            </Flex>
          </Flex>
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
    deudores: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        correlativo: PropTypes.string,
        nombre: PropTypes.string,
      })
    ),
  }).isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  handleAddDeudor: PropTypes.func.isRequired,
  handleRemoveDeudor: PropTypes.func.isRequired,
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
        (item.codigo &&
          item.codigo.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const handleAddDeudor = useCallback(
    (itemId, deudorId) => {
      const item = items.find((i) => i.id === itemId);
      const originalDeudores = item ? item.deudores : [];
      const newDeudor = deudoresDisponibles.find((d) => d.id === deudorId);

      if (newDeudor) {
        const newDeudores = [...originalDeudores, newDeudor];
        dispatch(patchItem({ id: itemId, changes: { deudores: newDeudores } }));
      }

      dispatch(addDeudoresItem({ itemId, deudorIds: [deudorId] }))
        .unwrap()
        .catch(() => {
          dispatch(
            patchItem({ id: itemId, changes: { deudores: originalDeudores } })
          );
        });
    },
    [dispatch, items, deudoresDisponibles]
  );

  const handleRemoveDeudor = useCallback(
    (itemId, deudorId) => {
      const item = items.find((i) => i.id === itemId);
      const originalDeudores = item ? item.deudores : [];

      const newDeudores = originalDeudores.filter((d) => d.id !== deudorId);
      dispatch(patchItem({ id: itemId, changes: { deudores: newDeudores } }));

      dispatch(removeDeudoresItem({ itemId, deudorIds: [deudorId] }))
        .unwrap()
        .catch(() => {
          dispatch(
            patchItem({ id: itemId, changes: { deudores: originalDeudores } })
          );
        });
    },
    [dispatch, items]
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
              handleAddDeudor={handleAddDeudor}
              handleRemoveDeudor={handleRemoveDeudor}
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
