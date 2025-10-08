import PropTypes from "prop-types";
import {
  Box,
  Center,
  Checkbox,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  TableContainer,
  useColorModeValue,
} from "@chakra-ui/react";

export const OrderDetailsTable = ({
  details = [],
  isLoading,
  showPTMQ = true,
  isPTMQ = false,
  onTogglePTMQ,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const stripe = useColorModeValue("gray.50", "gray.700");
  const hover = useColorModeValue("gray.100", "gray.600");
  const bannerBg = useColorModeValue("gray.100", "gray.700");
  const bannerBorder = useColorModeValue("gray.300", "gray.600");
  const bannerMuted = useColorModeValue("gray.600", "gray.300");

  if (isLoading) {
    return (
      <Center py={6}>
        <Spinner size="lg" />
      </Center>
    );
  }

  if ((!details || details.length === 0) && showPTMQ) {
    return (
      <Box my={4}>
        <Center
          border="1px dashed"
          borderColor={bannerBorder}
          borderRadius="md"
          py={6}
          px={4}
          bg={bannerBg}
        >
          <Checkbox
            isChecked={isPTMQ}
            onChange={(e) => onTogglePTMQ?.(e.target.checked)}
            colorScheme="green"
            size="lg"
          >
            <Text ml={2} fontWeight="semibold">
              Producto PTMQ{" "}
              <Text as="span" fontSize="sm" color={bannerMuted}>
                (sin receta)
              </Text>
            </Text>
          </Checkbox>
        </Center>
      </Box>
    );
  }

  return (
    <Box
      my={4}
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="md"
      shadow="sm"
    >
      <Text
        px={1}
        pt={1}
        pb={2}
        fontWeight="bold"
        fontSize="lg"
        textAlign="center"
      >
        Receta
      </Text>

      <TableContainer maxH="320px" overflowY="auto" overflowX="auto">
        <Table size="sm" variant="simple">
          <Tbody>
            {details.map((d, i) => (
              <Tr
                key={d.detalleId}
                bg={i % 2 === 0 ? "transparent" : stripe}
                _hover={{ bg: hover }}
              >
                <Td>{d.numero}</Td>
                <Td>{d.descripcion}</Td>
                <Td isNumeric>{d.cantidadBase}</Td>
                <Td isNumeric>{d.cantidadRequerida}</Td>
                <Td>{d.unidad}</Td>
                <Td>{d.almacen}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

OrderDetailsTable.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  details: PropTypes.arrayOf(
    PropTypes.shape({
      detalleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      numero: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      descripcion: PropTypes.string,
      cantidadBase: PropTypes.number,
      cantidadRequerida: PropTypes.number,
      unidad: PropTypes.string,
      almacen: PropTypes.string,
    })
  ),
  showPTMQ: PropTypes.bool,
  isPTMQ: PropTypes.bool,
  onTogglePTMQ: PropTypes.func,
};


