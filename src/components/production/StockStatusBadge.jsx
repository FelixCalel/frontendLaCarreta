import React from "react";
import PropTypes from "prop-types";
import { Badge, Tooltip, Flex, Text, Spinner } from "@chakra-ui/react";
import {
  CheckCircleIcon,
  WarningIcon,
  WarningTwoIcon,
  InfoIcon,
} from "@chakra-ui/icons";

export const StockStatusBadge = ({
  isFetching,
  stockOnHand,
  stockCommited,
  reqQty,
  selectedWarehouse,
  alternativeWarehouses = [],
  currentStockInfo,
}) => {
  if (isFetching) {
    return (
      <Flex align="center" mt={1}>
        <Spinner size="xs" mr={2} color="blue.500" />
        <Text fontSize="2xs" color="gray.400" fontStyle="italic">
          Verificando SAP...
        </Text>
      </Flex>
    );
  }

  if (!selectedWarehouse || !currentStockInfo) {
    const mainLabel =
      "No hay compras ni registros previos en SAP para este almacén.";
    const mainText = "Sin Entradas SAP";

    return (
      <Tooltip
        label={mainLabel}
        placement="top"
        bg="gray.600"
        whiteSpace="pre-wrap"
      >
        <Badge
          colorScheme="gray"
          fontSize="2xs"
          mt={1}
          cursor="help"
          display="flex"
          alignItems="center"
          w="fit-content"
        >
          <InfoIcon mr={1} />
          {mainText}
        </Badge>
      </Tooltip>
    );
  }

  const isOutOfStock = stockOnHand <= 0 || (reqQty > 0 && stockOnHand < reqQty);

  if (!isOutOfStock) {
    return (
      <Flex align="center" mt={1} wrap="wrap">
        <Tooltip
          label={`Stock: ${stockOnHand.toFixed(2)} | Comprometido: ${stockCommited.toFixed(2)}`}
          placement="top"
          hasArrow
          bg="green.600"
        >
          <Badge
            colorScheme="green"
            fontSize="2xs"
            cursor="help"
            display="flex"
            alignItems="center"
            w="fit-content"
          >
            <CheckCircleIcon mr={1} />
            Stock: {stockOnHand.toFixed(2)} | Compr: {stockCommited.toFixed(2)}
          </Badge>
        </Tooltip>
      </Flex>
    );
  }

  const hasAlts = alternativeWarehouses.length > 0;
  const altsText = alternativeWarehouses
    .map((s) => `${s.almacen}: ${Number(s.stock).toFixed(2)}`)
    .join(" | ");

  let mainLabel =
    reqQty > stockOnHand
      ? `Total físico: ${stockOnHand.toFixed(2)}`
      : `No hay inventario en ${selectedWarehouse}`;

  let mainText =
    reqQty > stockOnHand
      ? `Faltan: ${(reqQty > stockOnHand ? reqQty - stockOnHand : 0).toFixed(2)}`
      : `Sin Stock`;

  if (hasAlts) {
    mainLabel += `\n Disponible en: ${altsText}`;
    mainText += ` (Hay en otros)`;
  } else {
    mainLabel += `\n Agotado en todos los almacenes`;
    mainText =
      reqQty > stockOnHand
        ? `Faltan: ${(reqQty - stockOnHand).toFixed(2)}`
        : `Totalmente Agotado`;
  }

  return (
    <Tooltip
      label={mainLabel}
      placement="top"
      bg={hasAlts ? "blue.600" : "red.600"}
      whiteSpace="pre-wrap"
    >
      <Badge
        colorScheme={hasAlts ? "orange" : "red"}
        fontSize="2xs"
        mt={1}
        cursor="help"
        display="flex"
        alignItems="center"
        w="fit-content"
      >
        {hasAlts ? <WarningTwoIcon mr={1} /> : <WarningIcon mr={1} />}
        {mainText}
      </Badge>
    </Tooltip>
  );
};

StockStatusBadge.propTypes = {
  isFetching: PropTypes.bool,
  stockOnHand: PropTypes.number,
  stockCommited: PropTypes.number,
  reqQty: PropTypes.number,
  selectedWarehouse: PropTypes.string,
  alternativeWarehouses: PropTypes.array,
  currentStockInfo: PropTypes.object,
};
