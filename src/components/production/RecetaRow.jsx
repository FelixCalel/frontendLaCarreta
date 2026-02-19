import React, { useEffect, useState, memo } from "react";
import PropTypes from "prop-types";
import {
  Tr,
  Td,
  Box,
  Text,
  Input,
  Checkbox,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { useLazyGetStockSAPQuery } from "../../services/pedidoProductionApi";
import { StockStatusBadge } from "./StockStatusBadge";

const CustomInput = memo(function CustomInput({
  value,
  onChange,
  onBlur,
  inputBorderColor,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e) => {
    setInternalValue(e.target.value);
    onChange(e);
  };

  return (
    <Input
      value={
        internalValue === 0 || internalValue === "0"
          ? ""
          : (internalValue ?? "")
      }
      placeholder="0"
      onChange={handleChange}
      onBlur={onBlur}
      size="xs"
      variant="outline"
      bg={useColorModeValue("white", "gray.800")}
      borderWidth="1px"
      borderColor={inputBorderColor}
      borderRadius="sm"
      _hover={{ borderColor: "blue.400" }}
      type="number"
      textAlign="center"
      focusBorderColor="blue.400"
      fontWeight="medium"
      w="56px"
      {...props}
    />
  );
});

CustomInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  inputBorderColor: PropTypes.string,
};

const OptimisticCheckbox = memo(({ isChecked, onChange }) => {
  const [checked, setChecked] = useState(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handleChange = (e) => {
    const newValue = e.target.checked;
    setChecked(newValue);
    onChange(newValue);
  };

  return (
    <Checkbox
      isChecked={checked}
      onChange={handleChange}
      size="sm"
      colorScheme="green"
      borderColor={useColorModeValue("gray.300", "gray.500")}
    />
  );
});

export const RecetaRow = memo(function RecetaRow({
  r,
  idx,
  stripeBg,
  hoverBg,
  inputBorderColor,
  handleLocalChange,
  updateField,
  almacenes,
  pedidoId,
}) {
  const optionBg = useColorModeValue("white", "gray.700");
  const baseBg = idx % 2 === 0 ? "transparent" : stripeBg;

  const [triggerGetStockSAP, { data: stockData, isFetching }] =
    useLazyGetStockSAPQuery();

  useEffect(() => {
    if (r.item && pedidoId) {
      triggerGetStockSAP({
        itemcode: r.item.split(" - ")[0].trim(),
        pedidoId: Number(pedidoId),
      })
        .unwrap()
        .catch((err) => console.error("Error SAP", err));
    }
  }, [r.item, r.id_almacen, pedidoId, triggerGetStockSAP]);

  const selectedWarehouse = almacenes.find(
    (a) => a.id === Number(r.id_almacen),
  )?.name;

  const currentStockInfo =
    stockData && Array.isArray(stockData)
      ? stockData.find((s) => s.almacen === selectedWarehouse)
      : null;

  const stockOnHand = currentStockInfo
    ? Number(currentStockInfo.stock || 0)
    : 0;
  const stockCommited = currentStockInfo
    ? Number(currentStockInfo.comprometido || 0)
    : 0;
  const reqQty = Number(r.cantidad_requerida) || 0;

  const alternativeWarehouses =
    stockData && Array.isArray(stockData)
      ? stockData.filter(
          (s) => s.almacen !== selectedWarehouse && Number(s.stock) > 0,
        )
      : [];

  let rowBg = baseBg;
  if (!isFetching && selectedWarehouse && currentStockInfo) {
    if (stockOnHand <= 0 || (reqQty > 0 && stockOnHand < reqQty)) {
      rowBg = useColorModeValue("red.50", "rgba(227, 83, 83, 0.12)");
    } else {
      rowBg = useColorModeValue("green.50", "rgba(72, 187, 120, 0.12)");
    }
  }

  return (
    <Tr bg={rowBg} _hover={{ bg: hoverBg }} transition="all 0.2s">
      <Td px={2} py={2} textAlign="center">
        <OptimisticCheckbox
          isChecked={!!r.state}
          onChange={(newValue) => {
            setTimeout(() => {
              handleLocalChange(r.id, "state", newValue);
              updateField(r.id, "state", newValue);
            }, 50);
          }}
        />
      </Td>
      <Td px={2} py={2}>
        <Box>
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color={useColorModeValue("gray.700", "white")}
          >
            {r.item}
          </Text>
          {r.descripcion && (
            <Text fontSize="xs" color="gray.500" title={r.descripcion}>
              {r.descripcion}
            </Text>
          )}
          <StockStatusBadge
            isFetching={isFetching}
            stockOnHand={stockOnHand}
            stockCommited={stockCommited}
            reqQty={reqQty}
            selectedWarehouse={selectedWarehouse}
            alternativeWarehouses={alternativeWarehouses}
            currentStockInfo={currentStockInfo}
          />
        </Box>
      </Td>
      {["mpUtilizada", "cantidad_real"].map((field) => (
        <Td key={field} px={1} py={2} isNumeric>
          <CustomInput
            inputBorderColor={inputBorderColor}
            value={r[field]}
            onChange={(e) => handleLocalChange(r.id, field, e.target.value)}
            onBlur={(e) => updateField(r.id, field, e.target.value)}
          />
        </Td>
      ))}
      <Td px={1} py={2} textAlign="center">
        <Text fontSize="xs" color="gray.600">
          {r.cantidad_base}
        </Text>
      </Td>
      <Td px={1} py={2} textAlign="center">
        <Text fontSize="xs" fontWeight="bold" color="blue.600">
          {r.cantidad_requerida}
        </Text>
      </Td>
      <Td px={1} py={2}>
        <Select
          size="xs"
          h="24px"
          fontSize="xs"
          value={r.nombre_unidad}
          onChange={(e) => updateField(r.id, "nombre_unidad", e.target.value)}
          bg={useColorModeValue("white", "gray.700")}
          borderRadius="md"
          variant="filled"
          _focus={{ borderColor: "blue.400" }}
          width="70px"
        >
          {["Unidad", "Libra", "KG", "Gramos", "Litro", "ML", "Onza"].map(
            (unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ),
          )}
        </Select>
      </Td>
      <Td px={1} py={2} textAlign="center">
        <Select
          size="xs"
          h="24px"
          fontSize="xs"
          value={r.id_almacen}
          onChange={(e) => updateField(r.id, "id_almacen", e.target.value)}
          isDisabled={!almacenes.length}
          bg={optionBg}
          borderRadius="md"
          variant="filled"
          _focus={{ bg: optionBg, borderColor: "blue.400" }}
          textAlign="center"
          sx={{ textAlignLast: "center" }}
        >
          {almacenes.map((almacen) => (
            <option key={almacen.id} value={almacen.id}>
              {almacen.name}
            </option>
          ))}
        </Select>
      </Td>
    </Tr>
  );
});

RecetaRow.propTypes = {
  r: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  stripeBg: PropTypes.string.isRequired,
  hoverBg: PropTypes.string.isRequired,
  inputBorderColor: PropTypes.string.isRequired,
  handleLocalChange: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  almacenes: PropTypes.arrayOf(PropTypes.object).isRequired,
  pedidoId: PropTypes.number.isRequired,
};
