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
import { MaterialSelector } from "./components/MaterialSelector";
import { WarehouseOptions } from "./components/WarehouseOptions";
import { StockInfoCard } from "./components/StockInfoCard";
import {
  useCreateRecetaLineaMutation,
  useLazyGetItemsQuery,
  useGetAlmacenesQuery,
  useLazyGetStockSAPQuery,
} from "../../../services/pedidoProductionApi";

import {
  getMaterialSelectStyles,
  getModalColors,
} from "./styles/MaterialStyles";
import { useAddMaterial } from "./hooks/useAddMaterial";

const AddMaterialModal = ({ isOpen, onClose, pedidoId }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const {
    selectedItem,
    cantidadBase,
    setCantidadBase,
    cantidadRequerida,
    setCantidadRequerida,
    almacenId,
    setAlmacenId,
    unidad,
    setUnidad,
    isLoading,
    loadOptions,
    handleItemChange,
    handleSubmit,
    stockData,
    isFetchingStock,
    isStockError,
    isStockSuccess,
    almacenes,
  } = useAddMaterial(pedidoId, onClose);

  const colors = useMemo(() => getModalColors(isDark), [isDark]);
  const customStyles = useMemo(() => getMaterialSelectStyles(isDark), [isDark]);

  const selectedWarehouseName = useMemo(
    () => almacenes?.find((a) => a.id === Number(almacenId))?.name,
    [almacenes, almacenId],
  );

  const currentStockInfo = useMemo(
    () =>
      stockData && Array.isArray(stockData)
        ? stockData.find((s) => s.almacen === selectedWarehouseName)
        : null,
    [stockData, selectedWarehouseName],
  );

  const stockOnHand = currentStockInfo
    ? Number(currentStockInfo.stock || 0)
    : 0;
  const stockCommited = currentStockInfo
    ? Number(currentStockInfo.comprometido || 0)
    : 0;
  const reqQty = Number(cantidadRequerida) || 0;

  const stockStatus = useMemo(() => {
    if (isFetchingStock || !selectedItem || !almacenId) return "gray";
    if (
      !currentStockInfo ||
      stockOnHand <= 0 ||
      (reqQty > 0 && stockOnHand < reqQty)
    )
      return "red";
    return "green";
  }, [
    isFetchingStock,
    selectedItem,
    almacenId,
    currentStockInfo,
    stockOnHand,
    reqQty,
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agregar Material a Receta</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <MaterialSelector
              selectedItem={selectedItem}
              handleItemChange={handleItemChange}
              loadOptions={loadOptions}
              customStyles={customStyles}
            />

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

            <WarehouseOptions
              isFetchingStock={isFetchingStock}
              stockData={stockData}
              selectedItem={selectedItem}
              subTextColor={colors.subTextColor}
              almacenes={almacenes}
              almacenId={almacenId}
              setAlmacenId={setAlmacenId}
              greenHoverBg={colors.greenHoverBg}
              isStockError={isStockError}
              isStockSuccess={isStockSuccess}
            />

            <FormControl isRequired>
              <FormLabel>Cantidad Requerida</FormLabel>
              <Input
                type="number"
                value={cantidadRequerida}
                onChange={(e) => setCantidadRequerida(e.target.value)}
              />
            </FormControl>

            <StockInfoCard
              selectedItem={selectedItem}
              almacenId={almacenId}
              stockStatus={stockStatus}
              stockRedBg={colors.stockRedBg}
              stockGreenBg={colors.stockGreenBg}
              stockGrayBg={colors.stockGrayBg}
              isFetchingStock={isFetchingStock}
              currentStockInfo={currentStockInfo}
              selectedWarehouseName={selectedWarehouseName}
              stockOnHand={stockOnHand}
              stockCommited={stockCommited}
              reqQty={reqQty}
            />

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
