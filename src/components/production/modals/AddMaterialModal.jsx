import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Box,
  Text,
  HStack,
  Badge,
  useColorMode,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { AsyncPaginate } from "react-select-async-paginate";
import {
  useCreateRecetaLineaMutation,
  useLazyGetItemsQuery,
  useGetAlmacenesQuery,
  useLazyGetStockSAPQuery,
} from "../../../services/pedidoProductionApi";

const AddMaterialModal = ({ isOpen, onClose, pedidoId }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [cantidadBase, setCantidadBase] = useState("");
  const [cantidadRequerida, setCantidadRequerida] = useState("");
  const [almacenId, setAlmacenId] = useState("");
  const [unidad, setUnidad] = useState("");

  const toast = useToast();

  const [createRecetaLinea, { isLoading }] = useCreateRecetaLineaMutation();
  const [triggerGetItems] = useLazyGetItemsQuery();
  const { data: almacenes } = useGetAlmacenesQuery();
  const [triggerGetStockSAP, { data: stockData, isFetching: isFetchingStock }] =
    useLazyGetStockSAPQuery();

  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const selectBg = isDark ? "#2D3748" : "white";
  const selectColor = isDark ? "white" : "black";
  const selectBorderColor = isDark ? "#4A5568" : "#E2E8F0";
  const selectHoverBg = isDark ? "#4A5568" : "#EDF2F7";
  const selectActiveBg = isDark ? "#2C5282" : "#EBF8FF";
  const greenHoverBg = isDark ? "green.900" : "green.50";
  const subTextColor = isDark ? "gray.300" : "gray.600";
  const placeholderColor = isDark ? "#718096" : "#A0AEC0";

  const stockRedBg = isDark ? "rgba(227, 83, 83, 0.12)" : "red.50";
  const stockGreenBg = isDark ? "rgba(72, 187, 120, 0.12)" : "green.50";
  const stockGrayBg = isDark ? "rgba(160, 174, 192, 0.12)" : "gray.50";

  const customStyles = useMemo(
    () => ({
      control: (provided) => ({
        ...provided,
        backgroundColor: selectBg,
        borderColor: selectBorderColor,
        color: selectColor,
        minHeight: "40px",
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: selectBg,
        zIndex: 9999,
        border: `1px solid ${selectBorderColor}`,
      }),
      menuList: (provided) => ({
        ...provided,
        backgroundColor: selectBg,
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused
          ? selectHoverBg
          : state.isSelected
            ? selectActiveBg
            : selectBg,
        color: selectColor,
        cursor: "pointer",
        "&:active": {
          backgroundColor: selectActiveBg,
        },
      }),
      singleValue: (provided) => ({
        ...provided,
        color: selectColor,
      }),
      input: (provided) => ({
        ...provided,
        color: selectColor,
      }),
      placeholder: (provided) => ({
        ...provided,
        color: placeholderColor,
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        color: selectColor,
      }),
    }),
    [
      selectBg,
      selectBorderColor,
      selectColor,
      selectHoverBg,
      selectActiveBg,
      placeholderColor,
    ],
  );

  const loadOptions = async (search, loadedOptions, { page }) => {
    try {
      const response = await triggerGetItems({
        page: page,
        pageSize: 10,
        nombre: search,
        codigo: search,
      }).unwrap();

      const options = response.items.map((item) => ({
        label: `${item.codigo} - ${item.nombre}`,
        value: item.id,
        item: item,
      }));

      return {
        options: options,
        hasMore: response.items.length === 10,
        additional: {
          page: page + 1,
        },
      };
    } catch (err) {
      console.error(err);
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const handleItemChange = (option) => {
    setSelectedItem(option);
    setAlmacenId("");
    if (option && option.item) {
      setUnidad(option.item.unidadMedida || "UNIDAD");
      setCantidadBase("1");
      setCantidadRequerida("1");
      triggerGetStockSAP({
        itemcode: option.item.codigo,
        pedidoId: Number(pedidoId),
      })
        .unwrap()
        .catch((err) => console.error("Error al obtener stock SAP:", err));
    }
  };

  React.useEffect(() => {
    if (
      stockData &&
      Array.isArray(stockData) &&
      almacenes &&
      !isFetchingStock
    ) {
      if (!almacenId) {
        const availableStocks = stockData.filter((s) => Number(s.stock) > 0);
        if (availableStocks.length > 0) {
          const matchedWarehouse = almacenes.find(
            (a) => a.name === availableStocks[0].almacen,
          );
          if (matchedWarehouse) {
            setAlmacenId(matchedWarehouse.id.toString());
          }
        }
      }
    }
  }, [stockData, almacenes, isFetchingStock]);

  const selectedWarehouseName = almacenes?.find(
    (a) => a.id === Number(almacenId),
  )?.name;
  const currentStockInfo =
    stockData && Array.isArray(stockData)
      ? stockData.find((s) => s.almacen === selectedWarehouseName)
      : null;

  const stockOnHand = currentStockInfo
    ? Number(currentStockInfo.stock || 0)
    : 0;
  const stockCommited = currentStockInfo
    ? Number(currentStockInfo.comprometido || 0)
    : 0;
  const reqQty = Number(cantidadRequerida) || 0;

  let stockStatus = "gray";
  if (!isFetchingStock && selectedItem && almacenId) {
    if (
      !currentStockInfo ||
      stockOnHand <= 0 ||
      (reqQty > 0 && stockOnHand < reqQty)
    ) {
      stockStatus = "red";
    } else {
      stockStatus = "green";
    }
  }

  const handleSubmit = async () => {
    if (!selectedItem || !cantidadRequerida || !almacenId) {
      toast({
        title: "Error",
        description:
          "Por favor complete los campos obligatorios (Item, Cantidad Requerida, Almacén).",
        status: "error",
      });
      return;
    }

    try {
      await createRecetaLinea({
        data: {
          pedido_produccionid: Number(pedidoId),
          item: selectedItem.item.codigo,
          descripcion: selectedItem.item.nombre,
          cantidad_base: Number(cantidadBase) || 0,
          cantidad_requerida: Number(cantidadRequerida),
          nombre_unidad: unidad || "UNIDAD",
          id_almacen: Number(almacenId),
          mpUtilizada: null,
        },
      }).unwrap();

      toast({
        title: "Éxito",
        description: "Material agregado correctamente.",
        status: "success",
      });
      onClose();
      setSelectedItem(null);
      setCantidadBase("");
      setCantidadRequerida("");
      setAlmacenId("");
      setUnidad("");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudo agregar el material.",
        status: "error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agregar Material a Receta</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Buscar Item</FormLabel>
              <AsyncPaginate
                debounceTimeout={300}
                value={selectedItem}
                loadOptions={loadOptions}
                onChange={handleItemChange}
                placeholder="Escriba nombre o código..."
                styles={customStyles}
                additional={{
                  page: 1,
                }}
                noOptionsMessage={() => "No se encontraron items"}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Almacén</FormLabel>
              <Select
                placeholder="Seleccione Almacén"
                value={almacenId}
                onChange={(e) => setAlmacenId(e.target.value)}
              >
                {almacenes?.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            {(isFetchingStock || (stockData && Array.isArray(stockData))) &&
              selectedItem && (
                <Box w="100%">
                  <Flex align="center" mb={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color={subTextColor}
                    >
                      Opciones de Almacén desde SAP:
                    </Text>
                    {isFetchingStock && (
                      <Spinner
                        size="sm"
                        ml={3}
                        thickness="2px"
                        color="blue.500"
                        emptyColor="gray.200"
                      />
                    )}
                  </Flex>
                  {!isFetchingStock && stockData && (
                    <Flex wrap="wrap" gap={2}>
                      {stockData.map((s, idx) => {
                        const matchedWarehouse = almacenes?.find(
                          (a) => a.name === s.almacen,
                        );
                        if (!matchedWarehouse) return null;

                        const hasStock = Number(s.stock) > 0;
                        const isSelected =
                          almacenId === matchedWarehouse.id.toString();

                        return (
                          <Button
                            key={idx}
                            size="sm"
                            variant={
                              isSelected
                                ? "solid"
                                : hasStock
                                  ? "outline"
                                  : "ghost"
                            }
                            colorScheme={
                              isSelected ? "blue" : hasStock ? "green" : "gray"
                            }
                            onClick={() =>
                              setAlmacenId(matchedWarehouse.id.toString())
                            }
                            opacity={hasStock ? 1 : 0.6}
                            borderWidth={isSelected ? "2px" : "1px"}
                            _hover={{
                              bg:
                                hasStock && !isSelected
                                  ? greenHoverBg
                                  : undefined,
                            }}
                            h="auto"
                            py={1}
                            px={3}
                          >
                            <VStack spacing={0} align="center">
                              <Text fontWeight="bold" fontSize="xs">
                                {s.almacen}
                              </Text>
                              <Text fontSize="2xs">
                                Stock: {Number(s.stock).toFixed(2)}
                              </Text>
                            </VStack>
                          </Button>
                        );
                      })}
                    </Flex>
                  )}
                </Box>
              )}

            <FormControl isRequired>
              <FormLabel>Cantidad Requerida</FormLabel>
              <Input
                type="number"
                value={cantidadRequerida}
                onChange={(e) => setCantidadRequerida(e.target.value)}
              />
            </FormControl>

            {selectedItem && almacenId && (
              <Box
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                borderColor={`${stockStatus}.300`}
                bg={
                  stockStatus === "red"
                    ? stockRedBg
                    : stockStatus === "green"
                      ? stockGreenBg
                      : stockGrayBg
                }
                w="100%"
                shadow="sm"
                transition="all 0.2s"
              >
                {isFetchingStock ? (
                  <Text
                    color={`${stockStatus}.500`}
                    fontWeight="semibold"
                    fontSize="sm"
                  >
                    Consultando stock en SAP...
                  </Text>
                ) : currentStockInfo ? (
                  <VStack align="start" spacing={2}>
                    <Text
                      color={`${stockStatus}.600`}
                      fontWeight="bold"
                      fontSize="md"
                    >
                      Disponibilidad en Almacén ({selectedWarehouseName})
                    </Text>
                    <HStack spacing={4}>
                      <Badge
                        colorScheme={stockStatus}
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="sm"
                      >
                        Stock: {parseFloat(stockOnHand).toFixed(2)}
                      </Badge>
                      <Badge
                        colorScheme="orange"
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="sm"
                      >
                        Comprometido: {parseFloat(stockCommited).toFixed(2)}
                      </Badge>
                    </HStack>
                    {reqQty > 0 && stockOnHand < reqQty && (
                      <Text
                        color="red.500"
                        fontSize="sm"
                        fontWeight="semibold"
                        display="flex"
                        alignItems="center"
                      >
                        <WarningIcon mr={2} /> Stock insuficiente para requerir{" "}
                        {reqQty}
                      </Text>
                    )}
                  </VStack>
                ) : (
                  <Text color="red.500" fontSize="sm" fontWeight="bold">
                    No hay información de stock para este ítem en el almacén
                    seleccionado.
                  </Text>
                )}
              </Box>
            )}

            <FormControl>
              <FormLabel>Cantidad Base (Opcional)</FormLabel>
              <Input
                type="number"
                value={cantidadBase}
                onChange={(e) => setCantidadBase(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Unidad de Medida</FormLabel>
              <Input
                value={unidad}
                onChange={(e) => setUnidad(e.target.value)}
                placeholder="Ej. KG, UNIDAD"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Agregar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

AddMaterialModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pedidoId: PropTypes.number.isRequired,
};

export default AddMaterialModal;
