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
} from "@chakra-ui/react";
import { MdPrecisionManufacturing, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import axios from "axios";
import {
  fetchAsignacionesThunk,
  asignarTipoGrupoThunk,
  desasignarTipoGrupoThunk,
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
  const { asignaciones } = useSelector((state) => state.AsignacionAreaMesa);

  useEffect(() => {
    if (areaId) {
      dispatch(fetchAsignacionesThunk(areaId));
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

  return (
    <Box
      mt={6}
      w="100%"
      mx="auto"
      p={{ base: 4, md: 6 }}
      borderWidth={1}
      borderRadius="xl"
      boxShadow="sm"
      bg={bgColor}
      borderColor={borderColor}
    >
      <Flex
        align="center"
        gap={3}
        mb={6}
        borderBottom="1px solid"
        borderColor={borderColor}
        pb={4}
      >
        <Flex bg={iconBg} p={2} borderRadius="md" color={iconColor}>
          <Icon as={MdPrecisionManufacturing} boxSize={5} />
        </Flex>
        <Heading size="md" color={headingColor} fontWeight="semibold">
          Líneas de Producción Asignadas
        </Heading>
      </Flex>

      <Box
        p={4}
        bg={listBg}
        borderRadius="lg"
        minH="80px"
        border="1px dashed"
        borderColor={listBorderColor}
        mb={6}
      >
        <HStack spacing={3} wrap="wrap">
          {filteredAsignaciones.length === 0 ? (
            <Text color="gray.500" fontStyle="italic">
              No hay líneas asignadas a esta área.
            </Text>
          ) : (
            filteredAsignaciones.map((a) => {
              return (
                <Tag
                  size="lg"
                  key={a.id}
                  borderRadius="md"
                  variant="subtle"
                  colorScheme="blue"
                  bg={tagBg}
                  border="1px solid"
                  borderColor={tagBorderColor}
                  px={4}
                  py={2}
                  boxShadow="sm"
                  _hover={{
                    shadow: "md",
                    transform: "translateY(-1px)",
                    transition: "all 0.2s",
                  }}
                >
                  <Icon as={MdPrecisionManufacturing} mr={2} color="blue.500" />
                  <TagLabel fontWeight="medium" color={tagLabelColor}>
                    {a.productoCodigo && a.productoNombre
                      ? `${a.productoCodigo} - ${a.productoNombre}`
                      : "Cargando o Sin Detalle..."}
                  </TagLabel>
                  <TagCloseButton
                    ml={3}
                    color="red.400"
                    _hover={{ bg: "red.50", color: "red.600" }}
                    onClick={() => handleDesasignar(a.id)}
                  >
                    <Icon as={MdDelete} />
                  </TagCloseButton>
                </Tag>
              );
            })
          )}
        </HStack>
      </Box>

      <Flex
        align="center"
        gap={4}
        wrap="wrap"
        p={4}
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
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: selectBg,
                borderColor: state.isFocused ? "#3182CE" : selectBorderColor,
                "&:hover": {
                  borderColor: state.isFocused
                    ? "#3182CE"
                    : selectHoverBorderColor,
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
            }}
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
  );
};

AsignacionesTipoGrupo.propTypes = {
  areaId: PropTypes.number.isRequired,
};

export default AsignacionesTipoGrupo;
