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
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const MotionIcon = motion.create(IconButton);

const ConsolidadoTable = ({ data, status = "succeeded", error }) => {
  const [expanded, setExpanded] = useState({});

  const toggle = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const headerBg = useColorModeValue("gray.100", "gray.700");
  const rowHover = useColorModeValue("gray.50", "gray.600");
  const cardBg = useColorModeValue("white", "gray.800");

  if (status === "loading")
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="lg" />
      </Box>
    );
  if (status === "failed")
    return (
      <Box textAlign="center" py={10}>
        <Text color="red.500">Error: {error}</Text>
      </Box>
    );
  return (
    <Box
      overflowX="auto"
      bg={cardBg}
      rounded="lg"
      shadow="md"
      border="1px solid"
      // eslint-disable-next-line react-hooks/rules-of-hooks
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Table variant="unstyled" size={{ base: "sm", md: "md" }}>
        <Thead
          bg={headerBg}
          position="sticky"
          top={0}
          zIndex={1}
          shadow="sm"
          _dark={{ shadow: "none" }}
        >
          <Tr>
            <Th minW="90px">Código</Th>
            <Th minW="240px">Nombre ítem</Th>
            <Th minW="240px">Deudor</Th>
            <Th isNumeric minW="120px">
              Cantidad
            </Th>
            <Hide below="md">
              <Th minW="120px">Fecha Entrega</Th>
            </Hide>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item) => {
            const key = `${item.productoId}_${item.deudorId}_${item.fechaOrden}`;
            return (
              <React.Fragment key={key}>
                <Tr
                  _hover={{ bg: rowHover }}
                  transition="background 0.2s"
                  sx={{
                    display: { base: "flex", md: "table-row" },
                    flexDir: { base: "column", md: "row" },
                  }}
                >
                  <Td fontWeight="medium">{item.codigo}</Td>
                  <Td whiteSpace="normal">{item.nombreProducto}</Td>
                  <Td whiteSpace="normal">
                    {item.nombreDeudor} – {item.nombreCorrelativo}
                  </Td>
                  <Td isNumeric>
                    <Flex justify="flex-end" align="center">
                      <Badge
                        mr={2}
                        colorScheme="green"
                        variant="solid"
                        rounded="full"
                        px={3}
                      >
                        {item.cantidadTotal}
                      </Badge>
                      <MotionIcon
                        size="sm"
                        variant="ghost"
                        colorScheme="green"
                        icon={<ChevronDownIcon />}
                        aria-label="Ver ítems"
                        _focus={{ outline: "none" }}
                        animate={{ rotate: expanded[key] ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => toggle(key)}
                      />
                    </Flex>
                  </Td>
                  <Hide below="md">
                    <Td>{new Date(item.fechaOrden).toLocaleDateString()}</Td>
                  </Hide>
                </Tr>
                {expanded[key] && (
                  <Tr>
                    <Td colSpan={5} p={0}>
                      <Box bg={rowHover} p={4}>
                        <Text fontWeight="bold" mb={2}>
                          Detalles de ítems
                        </Text>
                        <Table size="sm" variant="simple">
                          <Thead>
                            <Tr>
                              <Th>ID Proveedor/Nombre</Th>
                              <Th isNumeric>Cant.</Th>
                              <Hide below="md">
                                <Th>Fecha ingreso</Th>
                              </Hide>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {item.items.map((d) => (
                              <Tr key={d.id}>
                                <Td>{d.id}</Td>
                                <Td isNumeric>{d.cantidad}</Td>
                                <Hide below="md">
                                  <Td>
                                    {new Date(d.fecha_ingreso).toLocaleString()}
                                  </Td>
                                </Hide>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Box>
                    </Td>
                  </Tr>
                )}
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
