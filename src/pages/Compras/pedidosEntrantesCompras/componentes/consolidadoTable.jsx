import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Box,
  Text,
  Spinner,
  Flex,
  Hide,
  Badge,
  Collapse,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const MotionIcon = motion.create(IconButton);

const ConsolidadoTable = ({ data, status = "succeeded", error }) => {
  const [expanded, setExpanded] = useState({});

  const toggle = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  // Dynamic branding colors
  const headerBg = useColorModeValue("gray.100", "gray.900");
  const rowHover = useColorModeValue("green.50", "whiteAlpha.100");
  const cardBg = useColorModeValue("white", "gray.800");
  const innerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (status === "loading")
    return (
      <Flex direction="column" justify="center" align="center" py={20}>
        <Spinner
          size="xl"
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
        />
        <Text mt={4} color="gray.500" fontWeight="medium">
          Cargando consolidaciones...
        </Text>
      </Flex>
    );
  if (status === "failed")
    return (
      <Box
        textAlign="center"
        py={10}
        bg="red.50"
        rounded="md"
        border="1px solid"
        borderColor="red.200"
      >
        <Text color="red.600" fontWeight="bold">
          Ups, ocurrió un error:
        </Text>
        <Text color="red.500">{error}</Text>
      </Box>
    );

  if (data.length === 0) {
    return (
      <Flex
        direction="column"
        justify="center"
        align="center"
        py={20}
        color="gray.400"
      >
        <Text fontSize="lg" fontWeight="semibold">
          No se encontraron pedidos consolidados
        </Text>
      </Flex>
    );
  }

  return (
    <Box
      overflowX="auto"
      bg={cardBg}
      rounded="md"
      shadow="sm"
      borderWidth="1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Table variant="simple" size="sm">
        <Thead bg={headerBg} position="sticky" top={0} zIndex={1}>
          <Tr>
            <Th
              color="gray.500"
              fontSize="xs"
              fontWeight="bold"
              letterSpacing="wider"
            >
              Código
            </Th>
            <Th
              color="gray.500"
              fontSize="xs"
              fontWeight="bold"
              letterSpacing="wider"
            >
              Nombre ítem
            </Th>
            <Th
              color="gray.500"
              fontSize="xs"
              fontWeight="bold"
              letterSpacing="wider"
            >
              Deudor
            </Th>
            <Th
              isNumeric
              color="gray.500"
              fontSize="xs"
              fontWeight="bold"
              letterSpacing="wider"
            >
              Cant.
            </Th>
            <Hide below="md">
              <Th
                color="gray.500"
                fontSize="xs"
                fontWeight="bold"
                letterSpacing="wider"
              >
                F. Entrega
              </Th>
            </Hide>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item) => {
            const key = `${item.productoId}_${item.deudorId}_${item.fechaOrden}`;
            const isExpanded = expanded[key];

            return (
              <React.Fragment key={key}>
                <Tr
                  _hover={{ bg: rowHover }}
                  transition="all 0.2s"
                  cursor="pointer"
                  onClick={() => toggle(key)}
                  borderBottomWidth={isExpanded ? "0px" : "1px"}
                >
                  <Td
                    fontWeight="semibold"
                    color={useColorModeValue("gray.700", "gray.200")}
                  >
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
                        toggle(key);
                      }}
                    />
                  </Td>
                </Tr>

                {/* EXPANDED SECTION */}
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
                            color={useColorModeValue("green.700", "green.300")}
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
                            <Thead
                              bg={useColorModeValue("gray.100", "gray.800")}
                            >
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
                                    _hover={{
                                      bg: useColorModeValue(
                                        "green.50",
                                        "whiteAlpha.100",
                                      ),
                                    }}
                                  >
                                    <Td
                                      fontWeight="medium"
                                      color={useColorModeValue(
                                        "gray.700",
                                        "white",
                                      )}
                                    >
                                      {d.nombre || "Proveedor no asignado"}
                                    </Td>
                                    <Td
                                      isNumeric
                                      fontWeight="bold"
                                      color="green.600"
                                    >
                                      {d.cantidad}
                                    </Td>
                                    <Hide below="md">
                                      <Td color="gray.500" fontSize="sm">
                                        {d.fecha_ingreso
                                          ? new Date(
                                              d.fecha_ingreso,
                                            ).toLocaleString()
                                          : item.fechaOrden
                                            ? new Date(
                                                item.fechaOrden,
                                              ).toLocaleDateString()
                                            : "N/A"}
                                      </Td>
                                    </Hide>
                                  </Tr>
                                ))
                              ) : (
                                <Tr>
                                  <Td
                                    colSpan={3}
                                    textAlign="center"
                                    color="gray.400"
                                    py={4}
                                    fontStyle="italic"
                                  >
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
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

ConsolidadoTable.propTypes = {
  data: PropTypes.array.isRequired,
  status: PropTypes.string,
  error: PropTypes.string,
};

export default ConsolidadoTable;
