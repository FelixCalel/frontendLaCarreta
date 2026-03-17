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
  InputGroup,
  InputLeftElement,
  Button,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  tablaItems,
  actualizarStatusProducto,
  addDeudoresItem,
  removeDeudoresItem,
} from "../../store/items/thunks";
import { obtenerDeudoresActivos } from "../../store/Deus/thunks";
import { patchItem } from "../../store/items/itemSlice";
import Pagination from "../../components/pagination";
import { DeudorSelector } from "./components/DeudorSelector.jsx";

const ItemRow = memo(
  ({
    item,
    itemId,
    handleStatusChange,
    handleAddDeudor,
    handleRemoveDeudor,
    ensureDeudoresLoaded,
    isLoadingDeudores,
  }) => {
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const rowHoverBg = useColorModeValue("blue.50", "blue.900");
    const triggerBorder = useColorModeValue("gray.300", "gray.600");
    const triggerText = useColorModeValue("gray.500", "gray.400");
    const triggerHover = useColorModeValue("gray.50", "whiteAlpha.100");

    const handleToggleSelector = () => {
      if (!isSelectorOpen) ensureDeudoresLoaded(itemId);
      setIsSelectorOpen((prev) => !prev);
    };

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
            {isSelectorOpen ? (
              <DeudorSelector
                key={`${item.id}-selector`}
                onSelect={(deuId) => {
                  if (!item.deudores.some((d) => d.id === deuId)) {
                    handleAddDeudor(item.id, deuId);
                  }
                  setIsSelectorOpen(false);
                }}
                onRemove={() => {}}
                width={{ base: "150px", md: "220px" }}
              />
            ) : (
              <Button
                leftIcon={<AddIcon />}
                size="sm"
                width={{ base: "150px", md: "220px" }}
                alignSelf="flex-start"
                justifyContent="flex-start"
                variant="outline"
                borderColor={triggerBorder}
                color={triggerText}
                fontWeight="normal"
                bg="transparent"
                onClick={handleToggleSelector}
                isLoading={isLoadingDeudores}
                _hover={{ bg: triggerHover, borderColor: "blue.300" }}
                _active={{ bg: triggerHover }}
              >
                Buscar y agregar deudor...
              </Button>
            )}
            <Flex wrap="wrap" gap={1}>
              {item.deudores &&
                item.deudores.map((deudor) => (
                  <Tooltip
                    label={deudor.nombre}
                    aria-label={deudor.nombre}
                    key={deudor.id}
                  >
                    <Badge
                      variant="subtle"
                      colorScheme="blue"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      px={2}
                      py={1}
                      borderRadius="full"
                      cursor="default"
                      maxW="300px"
                      fontSize="xs"
                      boxShadow="sm"
                      border="1px solid"
                      borderColor="blue.200"
                      _hover={{ borderColor: "blue.400", bg: "blue.50" }}
                    >
                      <Text isTruncated maxW="220px">
                        {deudor.correlativo} - {deudor.nombre}
                      </Text>
                      <IconButton
                        aria-label="Eliminar deudor"
                        icon={<CloseIcon />}
                        size="xs"
                        variant="ghost"
                        ml={1}
                        colorScheme="red"
                        onClick={() => handleRemoveDeudor(item.id, deudor.id)}
                        borderRadius="full"
                        _hover={{ bg: "red.100" }}
                      />
                    </Badge>
                  </Tooltip>
                ))}
            </Flex>
          </Flex>
        </Td>
      </Tr>
    );
  },
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
      }),
    ),
  }).isRequired,
  itemId: PropTypes.number.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  handleAddDeudor: PropTypes.func.isRequired,
  handleRemoveDeudor: PropTypes.func.isRequired,
  ensureDeudoresLoaded: PropTypes.func.isRequired,
  isLoadingDeudores: PropTypes.bool.isRequired,
};

ItemRow.displayName = "ItemRow";

const PageItems = () => {
  const dispatch = useDispatch();
  const { items, totalItems, status, error } = useSelector(
    (state) => state.items,
  );
  const { deudores: deudoresDisponibles, status: deudoresStatus } = useSelector(
    (state) => state.deudores,
  );

  const [searchState, setSearchState] = useState({
    debouncedSearch: "",
    currentPage: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDeudorLoaderItemId, setActiveDeudorLoaderItemId] = useState(null);
  const itemsPerPage = 15;

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchState((prev) => {
        if (prev.debouncedSearch === searchTerm && prev.currentPage === 1) {
          return prev;
        }

        return {
          debouncedSearch: searchTerm,
          currentPage: 1,
        };
      });
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { debouncedSearch, currentPage } = searchState;

  useEffect(() => {
    dispatch(
      tablaItems({
        page: currentPage,
        pageSize: itemsPerPage,
        nombre: debouncedSearch,
        codigo: debouncedSearch,
      }),
    );
  }, [dispatch, currentPage, debouncedSearch]);

  const paginatedData = items || [];

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
    [dispatch],
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
            patchItem({ id: itemId, changes: { deudores: originalDeudores } }),
          );
        });
    },
    [dispatch, items, deudoresDisponibles],
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
            patchItem({ id: itemId, changes: { deudores: originalDeudores } }),
          );
        });
    },
    [dispatch, items],
  );

  const ensureDeudoresLoaded = useCallback(() => {
    if (deudoresDisponibles?.length > 0 || deudoresStatus === "loading") {
      return;
    }

    dispatch(obtenerDeudoresActivos());
  }, [deudoresDisponibles?.length, deudoresStatus, dispatch]);

  const handleEnsureDeudoresLoaded = useCallback(
    (itemId) => {
      if (deudoresDisponibles?.length > 0) return;
      setActiveDeudorLoaderItemId(itemId);
      ensureDeudoresLoaded();
    },
    [deudoresDisponibles?.length, ensureDeudoresLoaded]
  );

  useEffect(() => {
    if (deudoresStatus !== "loading") {
      setActiveDeudorLoaderItemId(null);
    }
  }, [deudoresStatus]);

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
        <Flex gap={4} alignItems="center">
          {status === "loading" && <Spinner size="sm" color="blue.500" />}
          <InputGroup width="350px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar por nombre o código"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              borderColor="gray.300"
              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
              borderRadius="lg"
            />
          </InputGroup>
        </Flex>
      </Flex>

      <Table
        variant="simple"
        bg={tableBg}
        rounded="xl"
        shadow="xl"
        border={`1px solid ${borderColor}`}
        overflowY="visible"
        overflowX="auto"
        position="relative"
        style={{ borderCollapse: 'separate', borderSpacing: 0 }}
      >
        <Thead bg="blue.600">
          <Tr>
            <Th color="white" py={4} borderTopLeftRadius="xl">ID</Th>
            <Th color="white" py={4}>Nombre</Th>
            <Th color="white" py={4}>Código</Th>
            <Th color="white" py={4}>Código Almacén</Th>
            <Th color="white" py={4}>Disponible</Th>
            <Th color="white" py={4}>Estado</Th>
            <Th color="white" py={4} borderTopRightRadius="xl">Deudor</Th>
          </Tr>
        </Thead>
        <Tbody>
          {status === "loading" && paginatedData.length === 0 ? (
            <Tr>
              <Td colSpan={7} textAlign="center" py={10}>
                <Spinner size="xl" />
              </Td>
            </Tr>
          ) : status === "failed" ? (
            <Tr>
              <Td colSpan={7} textAlign="center" py={10}>
                <Text fontSize="lg" color="red.500">
                  Error al cargar los datos: {error}
                </Text>
              </Td>
            </Tr>
          ) : paginatedData.length === 0 ? (
            <Tr>
              <Td colSpan={7} textAlign="center" py={10}>
                <Text fontSize="lg" color="gray.500">
                  No se encontraron items
                </Text>
              </Td>
            </Tr>
          ) : (
            paginatedData.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                itemId={item.id}
                handleStatusChange={handleStatusChange}
                handleAddDeudor={handleAddDeudor}
                handleRemoveDeudor={handleRemoveDeudor}
                ensureDeudoresLoaded={handleEnsureDeudoresLoaded}
                isLoadingDeudores={
                  deudoresStatus === "loading" &&
                  activeDeudorLoaderItemId === item.id
                }
              />
            ))
          )}
        </Tbody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems || 0}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setSearchState(prev => ({ ...prev, currentPage: page }))}
      />
    </Box>
  );
};

export default PageItems;
