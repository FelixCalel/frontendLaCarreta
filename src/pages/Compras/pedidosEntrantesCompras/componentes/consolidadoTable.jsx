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
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";

const MotionIcon = m.create(IconButton);

import { ConsolidadoRow } from "./ConsolidadoRow";

const ConsolidadoTable = ({ data, status = "succeeded", error }) => {
  const [expanded, setExpanded] = useState({});

  const toggle = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
    
  const headerBg = useColorModeValue("gray.100", "gray.900");
  const rowHover = useColorModeValue("green.50", "whiteAlpha.100");
  const cardBg = useColorModeValue("white", "gray.800");
  const innerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const codeColor = useColorModeValue("gray.700", "gray.200");
  const desgloseColor = useColorModeValue("green.700", "green.300");
  const innerHeadBg = useColorModeValue("gray.100", "gray.800");
  const innerRowHover = useColorModeValue("green.50", "whiteAlpha.100");
  const innerRowColor = useColorModeValue("gray.700", "white");

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
    <LazyMotion features={domAnimation}>
      <Box
        overflowX="auto"
        bg={cardBg}
        rounded="md"
        shadow="sm"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Table variant="simple" size="sm">
          <Thead bg={headerBg} position="sticky" top={0} zIndex={1}>
            <Tr>
              <Th color="gray.500" fontSize="xs" fontWeight="bold" letterSpacing="wider">Código</Th>
              <Th color="gray.500" fontSize="xs" fontWeight="bold" letterSpacing="wider">Nombre ítem</Th>
              <Th color="gray.500" fontSize="xs" fontWeight="bold" letterSpacing="wider">Deudor</Th>
              <Th isNumeric color="gray.500" fontSize="xs" fontWeight="bold" letterSpacing="wider">Cant.</Th>
              <Hide below="md">
                <Th color="gray.500" fontSize="xs" fontWeight="bold" letterSpacing="wider">F. Entrega</Th>
              </Hide>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item) => {
              const key = `${item.productoId}_${item.deudorId}_${item.fechaOrden}`;
              return (
                <ConsolidadoRow
                  key={key}
                  item={item}
                  codeColor={codeColor}
                  rowHover={rowHover}
                  isExpanded={expanded[key]}
                  onToggle={() => toggle(key)}
                  innerBg={innerBg}
                  borderColor={borderColor}
                  desgloseColor={desgloseColor}
                  cardBg={cardBg}
                  innerHeadBg={innerHeadBg}
                  innerRowHover={innerRowHover}
                  innerRowColor={innerRowColor}
                />
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </LazyMotion>
  );
};

ConsolidadoTable.propTypes = {
  data: PropTypes.array.isRequired,
  status: PropTypes.string,
  error: PropTypes.string,
};

export default ConsolidadoTable;
