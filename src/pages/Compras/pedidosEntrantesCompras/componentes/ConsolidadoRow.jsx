import React, { useState } from "react";
import {
  Tr,
  Td,
  IconButton,
  Box,
  Text,
  Badge,
  Collapse,
  Flex,
  Hide,
  Table,
  Thead,
  Tbody,
  Th,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { m } from "framer-motion";
import PropTypes from "prop-types";

const MotionIcon = m.create(IconButton);

export const ConsolidadoRow = ({
  item,
  codeColor,
  rowHover,
  isExpanded,
  onToggle,
  innerBg,
  borderColor,
  desgloseColor,
  cardBg,
  innerHeadBg,
  innerRowHover,
  innerRowColor,
}) => {
  const key = `${item.productoId}_${item.deudorId}_${item.fechaOrden}`;

  return (
    <React.Fragment>
      <Tr
        _hover={{ bg: rowHover }}
        transition="all 0.2s"
        cursor="pointer"
        onClick={onToggle}
        borderBottomWidth={isExpanded ? "0px" : "1px"}
      >
        <Td fontWeight="semibold" color={codeColor}>
          {item.codigo}
        </Td>
        <Td whiteSpace="normal" fontWeight="bold">
          <Text noOfLines={2}>{item.nombreProducto}</Text>
        </Td>
        <Td whiteSpace="normal" color="gray.600" fontSize="sm">
          {item.nombreDeudor} <br />
          <Text as="span" fontSize="xs" color="green.600">
            {item.nombreCorrelativo}
          </Text>
        </Td>
        <Td isNumeric>
          <Badge
            colorScheme="green"
            variant="solid"
            rounded="md"
            px={2}
            py={0.5}
            fontSize="0.85em"
          >
            {item.cantidadTotal}
          </Badge>
        </Td>
        <Hide below="md">
          <Td fontWeight="medium" color="gray.500">
            {item.fechaOrden
              ? new Date(item.fechaOrden).toLocaleDateString()
              : "N/A"}
          </Td>
        </Hide>
        <Td>
          <MotionIcon
            size="sm"
            variant="ghost"
            colorScheme="green"
            icon={<ChevronDownIcon fontSize="lg" />}
            aria-label="Ver ítems"
            _focus={{ outline: "none" }}
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          />
        </Td>
      </Tr>

      <Tr m={0} p={0}>
        <Td colSpan={6} p={0} border="none">
          <Collapse in={isExpanded} animateOpacity>
            <Box
              bg={innerBg}
              borderBottomWidth="1px"
              borderColor={borderColor}
              p={3}
              m={0}
              rounded="none"
              shadow="inner"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Text
                  fontWeight="bold"
                  fontSize="xs"
                  color={desgloseColor}
                  textTransform="uppercase"
                >
                  Desglose de Pedidos
                </Text>
              </Flex>

              <Box
                bg={cardBg}
                rounded="sm"
                shadow="none"
                overflow="hidden"
                border="1px solid"
                borderColor={borderColor}
              >
                <Table size="sm" variant="simple">
                  <Thead bg={innerHeadBg}>
                    <Tr>
                      <Th color="gray.500" w="50%">
                        Proveedor asignado / Nombre
                      </Th>
                      <Th isNumeric color="gray.500">
                        Cant.
                      </Th>
                      <Hide below="md">
                        <Th color="gray.500" fontSize="xs">
                          Fecha de Ingreso
                        </Th>
                      </Hide>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {item.proveedoresAsignados &&
                    item.proveedoresAsignados.length > 0 ? (
                      item.proveedoresAsignados.map((d, index) => (
                        <Tr
                          key={`${d.proveedorId || index}`}
                          _hover={{ bg: innerRowHover }}
                        >
                          <Td fontWeight="medium" color={innerRowColor}>
                            {d.nombre || "Proveedor no asignado"}
                          </Td>
                          <Td isNumeric fontWeight="bold" color="green.600">
                            {d.cantidad}
                          </Td>
                          <Hide below="md">
                            <Td color="gray.500" fontSize="sm">
                              {d.fecha_ingreso
                                ? new Date(d.fecha_ingreso).toLocaleString()
                                : item.fechaOrden
                                  ? new Date(item.fechaOrden).toLocaleDateString()
                                  : "N/A"}
                            </Td>
                          </Hide>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={3} textAlign="center" color="gray.400" py={4} fontStyle="italic">
                          Sin proveedores asignados.
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </Collapse>
        </Td>
      </Tr>
    </React.Fragment>
  );
};

ConsolidadoRow.propTypes = {
  item: PropTypes.object.isRequired,
  codeColor: PropTypes.string,
  rowHover: PropTypes.string,
  isExpanded: PropTypes.bool,
  onToggle: PropTypes.func,
  innerBg: PropTypes.string,
  borderColor: PropTypes.string,
  desgloseColor: PropTypes.string,
  cardBg: PropTypes.string,
  innerHeadBg: PropTypes.string,
  innerRowHover: PropTypes.string,
  innerRowColor: PropTypes.string,
};
