import { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  useToast,
  Heading,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { MdPrecisionManufacturing, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import axios from "axios";
import {
  fetchAsignacionesThunk,
  asignarTipoGrupoThunk,
  desasignarTipoGrupoThunk,
  fetchClasificacionesThunk,
  bulkAsignarThunk,
  bulkDesasignarThunk,
} from "../../store/asignacionAM/thunks";

const BASE_URL = import.meta.env.VITE_API_URL;

const AsignacionesTipoGrupo = ({ areaId }) => {
  const dispatch = useDispatch();
  const usuarioId = Number(localStorage.getItem("usuarioId"));
  const toast = useToast();
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeoutRef = useRef(null);
  const { asignaciones, clasificaciones } = useSelector(
    (state) => state.AsignacionAreaMesa,
  );
  const [selectedFilters, setSelectedFilters] = useState({
    empaque: null,
    marca: null,
    tipo: null,
    grupo: null,
    subgrupo: null,
  });
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  useEffect(() => {
    if (areaId) {
      dispatch(fetchAsignacionesThunk(areaId));
      dispatch(fetchClasificacionesThunk());
    }
  }, [dispatch, areaId]);

  const fetchProductsPage = async (currentPage, search) => {
    setIsLoadingProducts(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/items/todos?page=${currentPage}&pageSize=10&nombre=${search}`,
      );
      const newItems = res.data.items || res.data;

      const newOptions = newItems.map((p) => ({
        value: p.id,
        label: `${p.codigo} - ${p.nombre}`,
      }));

      if (currentPage === 1) {
        setProductOptions(newOptions);
      } else {
        setProductOptions((prev) => [...prev, ...newOptions]);
      }

      if (newItems.length < 10) setHasMore(false);
      else setHasMore(true);
    } catch (err) {
      console.error("Error cargando productos paginados:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProductsPage(page, searchTerm);
  }, [page, searchTerm]);

  const handleScrollToBottom = () => {
    if (!isLoadingProducts && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleInputChange = (inputValue, { action }) => {
    if (action === "input-change") {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        setSearchTerm(inputValue);
        setPage(1);
      }, 500);
    }
  };

  const filteredAsignaciones = (
    Array.isArray(asignaciones) ? asignaciones : []
  ).filter((a) => a?.state);

  const handleAsignar = () => {
    if (selectedProducto) {
      dispatch(
        asignarTipoGrupoThunk({
          id_area: areaId,
          productoId: Number(selectedProducto.value),
          create_by: usuarioId,
          state: true,
        }),
      ).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast({
            title: "Línea asignada",
            description: "La línea de producción fue asignada.",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top-right",
          });
        }
        setSelectedProducto(null);
        dispatch(fetchAsignacionesThunk(areaId));
      });
    }
  };

  const handleDesasignar = (id) => {
    dispatch(desasignarTipoGrupoThunk({ id, update_by: usuarioId })).then(
      (res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast({
            title: "Línea removida",
            description: "La línea de producción fue quitada exitosamente.",
            status: "info",
            duration: 2000,
            isClosable: true,
            position: "top-right",
          });
        }
        dispatch(fetchAsignacionesThunk(areaId));
      },
    );
  };
  const colorTh = useColorModeValue("white", "green.200");
  const colorThead = useColorModeValue("green.600", "gray.700");
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const iconBg = useColorModeValue("blue.50", "blue.900");
  const iconColor = useColorModeValue("blue.600", "blue.300");
  const headingColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const listBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const listBorderColor = useColorModeValue("gray.300", "gray.600");
  const tagBg = useColorModeValue("white", "gray.700");
  const tagBorderColor = useColorModeValue("blue.200", "blue.800");
  const tagLabelColor = useColorModeValue("gray.700", "whiteAlpha.800");
  const selectBg = useColorModeValue("white", "#1A202C");
  const selectBorderColor = useColorModeValue("#E2E8F0", "#4A5568");
  const selectHoverBorderColor = useColorModeValue("#CBD5E0", "#718096");
  const selectFocusedOptionBg = useColorModeValue("#EBF8FF", "#2D3748");
  const selectTextColor = useColorModeValue("#2D3748", "#E2E8F0");
  const selectPlaceholderColor = useColorModeValue(
    "gray.400",
    "whiteAlpha.400",
  );
  const selectMenuBg = useColorModeValue("white", "#1A202C");
  const selectMenuShadow = useColorModeValue(
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
  );

  const hoverBg = useColorModeValue("blue.50", "whiteAlpha.100");
  const theadBg = useColorModeValue("gray.100", "gray.700");
  const theadThColor = useColorModeValue("gray.600", "gray.300");

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: selectBg,
      borderColor: state.isFocused ? "#3182CE" : selectBorderColor,
      "&:hover": {
        borderColor: state.isFocused ? "#3182CE" : selectHoverBorderColor,
      },
      boxShadow: state.isFocused ? "0 0 0 1px #3182CE" : "none",
      borderRadius: "0.5rem",
      padding: "2px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#3182CE"
        : state.isFocused
          ? selectFocusedOptionBg
          : "transparent",
      color: state.isSelected ? "white" : selectTextColor,
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#2B6CB0",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: selectMenuBg,
      borderRadius: "0.5rem",
      boxShadow: selectMenuShadow,
      overflow: "hidden",
      zIndex: 10,
    }),
    singleValue: (base) => ({
      ...base,
      color: selectTextColor,
    }),
    input: (base) => ({
      ...base,
      color: selectTextColor,
    }),
    placeholder: (base) => ({
      ...base,
      color: selectPlaceholderColor,
    }),
  };

  const handleBulkAsignar = () => {
    const activeFilters = Object.entries(selectedFilters).reduce(
      (acc, [key, val]) => {
        if (val) acc[key] = val.value;
        return acc;
      },
      {},
    );

    if (Object.keys(activeFilters).length === 0) {
      toast({
        title: "Seleccione un filtro",
        description:
          "Debe seleccionar al menos una clasificación para la asignación masiva.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsBulkLoading(true);
    dispatch(
      bulkAsignarThunk({
        id_area: areaId,
        create_by: usuarioId || 0,
        ...activeFilters,
      }),
    ).then((res) => {
      setIsBulkLoading(false);
      if (res.meta.requestStatus === "fulfilled") {
        toast({
          title: "Asignación masiva completada",
          description: res.payload.message,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setSelectedFilters({
          empaque: null,
          marca: null,
          tipo: null,
          grupo: null,
          subgrupo: null,
        });
        dispatch(fetchAsignacionesThunk(areaId));
      }
    });
  };

  const handleBulkDesasignar = () => {
    const activeFilters = Object.entries(selectedFilters).reduce(
      (acc, [key, val]) => {
        if (val) acc[key] = val.value;
        return acc;
      },
      {},
    );

    if (Object.keys(activeFilters).length === 0) {
      toast({
        title: "Seleccione un filtro",
        description:
          "Debe seleccionar al menos una clasificación para quitar masivamente.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsBulkLoading(true);
    dispatch(
      bulkDesasignarThunk({
        id_area: areaId,
        update_by: usuarioId || 0,
        ...activeFilters,
      }),
    ).then((res) => {
      setIsBulkLoading(false);
      if (res.meta.requestStatus === "fulfilled") {
        toast({
          title: "Quitado masivo completado",
          description: res.payload.message,
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setSelectedFilters({
          empaque: null,
          marca: null,
          tipo: null,
          grupo: null,
          subgrupo: null,
        });
        dispatch(fetchAsignacionesThunk(areaId));
      }
    });
  };

  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  const classificationOptions = (key) => {
    const list = clasificaciones[key] || [];
    return list.map((item) => ({ value: item, label: item }));
  };

  return (
    <Box
      mt={2}
      w="100%"
      mx="auto"
      p={4}
      borderWidth={1}
      borderRadius="xl"
      boxShadow="sm"
      bg={bgColor}
      borderColor={borderColor}
    >
      <Box mt={2} mb={4}>
        <Flex align="center" gap={2} mb={2}>
          <Flex bg="orange.50" p={2} borderRadius="md" color="orange.600">
            <Icon as={MdPrecisionManufacturing} boxSize={4} />
          </Flex>
          <Heading size="xs" color={headingColor} fontWeight="semibold">
            Asignación Masiva por Clasificación
          </Heading>
        </Flex>

        <Flex
          gap={2}
          wrap="wrap"
          p={2}
          borderWidth={1}
          borderColor={borderColor}
          borderRadius="lg"
          bg={listBg}
          align="center"
          justify="center"
        >
          <Box flex="1" minW="150px">
            <Select
              placeholder="Empaque"
              value={selectedFilters.empaque}
              onChange={(val) => handleFilterChange("empaque", val)}
              options={classificationOptions("empaques")}
              isClearable
              styles={customSelectStyles}
            />
          </Box>
          <Box flex="1" minW="150px">
            <Select
              placeholder="Marca"
              value={selectedFilters.marca}
              onChange={(val) => handleFilterChange("marca", val)}
              options={classificationOptions("marcas")}
              isClearable
              styles={customSelectStyles}
            />
          </Box>
          <Box flex="1" minW="150px">
            <Select
              placeholder="Tipo"
              value={selectedFilters.tipo}
              onChange={(val) => handleFilterChange("tipo", val)}
              options={classificationOptions("tipos")}
              isClearable
              styles={customSelectStyles}
            />
          </Box>
          <Box flex="1" minW="150px">
            <Select
              placeholder="Grupo"
              value={selectedFilters.grupo}
              onChange={(val) => handleFilterChange("grupo", val)}
              options={classificationOptions("grupos")}
              isClearable
              styles={customSelectStyles}
            />
          </Box>
          <Box flex="1" minW="150px">
            <Select
              placeholder="Subgrupo"
              value={selectedFilters.subgrupo}
              onChange={(val) => handleFilterChange("subgrupo", val)}
              options={classificationOptions("subgrupos")}
              isClearable
              styles={customSelectStyles}
            />
          </Box>
          <Flex gap={2}>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={handleBulkDesasignar}
              isLoading={isBulkLoading}
              loadingText="..."
              size="sm"
              boxShadow="sm"
            >
              Quitar
            </Button>
            <Button
              colorScheme="orange"
              onClick={handleBulkAsignar}
              isLoading={isBulkLoading}
              loadingText="..."
              size="sm"
              boxShadow="sm"
            >
              Asignar
            </Button>
          </Flex>
        </Flex>
      </Box>

      <Box>
        <Flex
          align="center"
          gap={2}
          mb={3}
          borderBottom="1px solid"
          borderColor={borderColor}
          pb={2}
        >
          <Flex bg={iconBg} p={2} borderRadius="md" color={iconColor}>
            <Icon as={MdPrecisionManufacturing} boxSize={5} />
          </Flex>
          <Heading size="md" color={headingColor} fontWeight="semibold">
            Líneas de Producción Asignadas
          </Heading>
          <Tag
            size="sm"
            colorScheme="blue"
            borderRadius="full"
            variant="solid"
            ml="auto"
          >
            {filteredAsignaciones.length} ítems
          </Tag>
        </Flex>

        <Box
          bg={listBg}
          borderRadius="lg"
          border="1px solid"
          borderColor={borderColor}
          mb={3}
          maxH="300px"
          overflowY="auto"
          position="relative"
        >
          <Table variant="simple" size="sm">
            <Thead bg={theadBg} position="sticky" top={0} zIndex={1}>
              <Tr>
                <Th color={theadThColor}>Código</Th>
                <Th color={theadThColor}>Nombre de Producto</Th>
                <Th w="50px" textAlign="center" color={theadThColor}>
                  Acciones
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredAsignaciones.length === 0 ? (
                <Tr>
                  <Td
                    colSpan={3}
                    textAlign="center"
                    py={8}
                    color="gray.500"
                    fontStyle="italic"
                  >
                    No hay líneas asignadas a esta área.
                  </Td>
                </Tr>
              ) : (
                filteredAsignaciones.map((a) => (
                  <Tr
                    key={a.id}
                    _hover={{
                      bg: hoverBg,
                    }}
                    transition="background 0.2s"
                  >
                    <Td fontWeight="bold" color="blue.600">
                      {a.productoCodigo || "---"}
                    </Td>
                    <Td color={tagLabelColor}>
                      {a.productoNombre || "Cargando..."}
                    </Td>
                    <Td textAlign="center">
                      <IconButton
                        aria-label="Remover línea"
                        icon={<MdDelete />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDesasignar(a.id)}
                      />
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>

        <Flex
          align="center"
          gap={3}
          wrap="wrap"
          p={2}
          borderWidth={1}
          borderColor={borderColor}
          borderRadius="lg"
          bg={listBg}
        >
          <Box flex="1" minW="250px">
            <Select
              placeholder="Buscar línea de producción..."
              value={selectedProducto}
              onChange={setSelectedProducto}
              options={productOptions}
              onInputChange={handleInputChange}
              onMenuScrollToBottom={handleScrollToBottom}
              isLoading={isLoadingProducts}
              isClearable
              filterOption={null}
              noOptionsMessage={() =>
                isLoadingProducts ? "Buscando..." : "No se encontraron opciones"
              }
              styles={customSelectStyles}
            />
          </Box>
          <Button
            colorScheme="blue"
            onClick={handleAsignar}
            isDisabled={!selectedProducto}
            px={8}
            boxShadow="sm"
          >
            Asignar Línea
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

AsignacionesTipoGrupo.propTypes = {
  areaId: PropTypes.number.isRequired,
};

export default AsignacionesTipoGrupo;
