import React from "react";
import PropTypes from "prop-types";
import {
  Tr,
  Td,
  IconButton,
  Checkbox,
  Box,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";

export const OrderMainRow = ({
  order,
  isExpanded,
  onToggle,
  sx,
  index,
  completoLocal,
  onCompletoChange,
  cantidadLocal,
  faltanteLocal,
  almacenId,
  onAlmacenChange,
  almacenes,
}) => {
  const stripeColor = useColorModeValue("gray.50", "gray.800");
  const bgOdd = useColorModeValue("white", "gray.900");
  const bgEven = useColorModeValue("gray.100", "gray.800");
  const rowBg = index % 2 === 0 ? bgOdd : bgEven;
  const hoverBg = useColorModeValue("gray.200", "gray.600");

  return (
    <Tr
      bg={rowBg}
      _hover={{ bg: hoverBg }}
      transition="all 0.2s"
      sx={sx}
      borderBottomWidth="1px"
      borderColor={useColorModeValue("gray.100", "gray.700")}
    >
      <Td px={2} py={2}>
        <IconButton
          size="xs"
          icon={
            isExpanded ? (
              <ChevronDownIcon boxSize={4} />
            ) : (
              <ChevronRightIcon boxSize={4} />
            )
          }
          aria-label="Expandir"
          onClick={() => onToggle(order.id)}
          variant="ghost"
          colorScheme="blue"
          borderRadius="full"
        />
      </Td>
      <Td px={2} py={2}>
        <Box>
          <Text
            fontWeight="bold"
            fontSize="sm"
            color={useColorModeValue("gray.700", "white")}
          >
            {order.productoNombre}
          </Text>
          <Text fontSize="xs" color="gray.500" mt={0.5}>
            {order.itemCode || "N/A"}
          </Text>
        </Box>
      </Td>
      <Td px={2} py={2}>
        <Box>
          <Text fontSize="xs" fontWeight="medium">
            {order.pais}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {order.tienda}
          </Text>
        </Box>
      </Td>
      <Td px={2} py={2} textAlign="center">
        <Box>
          <Text fontWeight="bold" fontSize="md" color="blue.500">
            {order.cantidadUnidad ?? "-"}
          </Text>
          <Text fontSize="2xs" color="gray.400" textTransform="uppercase">
            Solicita
          </Text>
        </Box>
      </Td>
      <Td px={2} py={2} textAlign="center">
        <Checkbox
          isChecked={completoLocal}
          size="md"
          colorScheme="green"
          onChange={(e) => onCompletoChange(e.target.checked)}
        />
      </Td>
      <Td px={2} py={2} textAlign="center">
        <Box>
          <Text fontWeight="bold" fontSize="md" color="green.500">
            {cantidadLocal}
          </Text>
          <Text fontSize="2xs" color="gray.400" textTransform="uppercase">
            Procesado
          </Text>
        </Box>
      </Td>
      <Td px={2} py={2} textAlign="center">
        <Box>
          <Text
            fontWeight="bold"
            fontSize="md"
            color={faltanteLocal > 0 ? "red.400" : "gray.400"}
          >
            {faltanteLocal}
          </Text>
          <Text fontSize="2xs" color="gray.400" textTransform="uppercase">
            Faltante
          </Text>
        </Box>
      </Td>
      <Td px={2} py={2} textAlign="right">
        <Box display="inline-flex" flexDirection="column" alignItems="flex-end">
          <Text
            fontSize="2xs"
            mb={0.5}
            fontWeight="bold"
            color="gray.500"
            textTransform="uppercase"
          >
            Almacén Destino
          </Text>
          <select
            value={almacenId}
            onChange={onAlmacenChange}
            style={{
              fontSize: "12px",
              padding: "2px 6px",
              borderRadius: "4px",
              border: "1px solid",
              borderColor: useColorModeValue("#E2E8F0", "#4A5568"),
              color: useColorModeValue("#2D3748", "#EDF2F7"),
              background: useColorModeValue("#fff", "#2D3748"),
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="">-- Seleccionar --</option>
            {almacenes.map((almacen) => (
              <option
                key={almacen.id}
                value={almacen.id}
                style={{
                  color: useColorModeValue("#222", "#fff"),
                  background: useColorModeValue("#fff", "#222"),
                }}
              >
                {almacen.nombre || almacen.name}
              </option>
            ))}
          </select>
        </Box>
      </Td>
    </Tr>
  );
};

OrderMainRow.propTypes = {
  order: PropTypes.object.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  sx: PropTypes.object,
  index: PropTypes.number,
  completoLocal: PropTypes.bool,
  onCompletoChange: PropTypes.func,
  cantidadLocal: PropTypes.number,
  faltanteLocal: PropTypes.number,
  almacenId: PropTypes.string,
  onAlmacenChange: PropTypes.func,
  almacenes: PropTypes.array,
};
