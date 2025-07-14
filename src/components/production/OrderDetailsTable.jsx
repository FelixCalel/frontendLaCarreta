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
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

export const OrderDetailsTable = ({
  details,
  isLoading,
  isPTMQ,
  onTogglePTMQ,
}) => {
  if (isLoading) {
    return (
      <Center py={4}>
        <Spinner size="md" />
      </Center>
    );
  }

  if (!details || details.length === 0) {
    return (
      <Box my={4}>
        <Center
          border="1px dashed"
          borderColor="gray.500"
          borderRadius="md"
          py={6}
          px={4}
          bg="gray.700"
          _dark={{ bg: "gray.800" }}
        >
          <Checkbox
            isChecked={isPTMQ}
            onChange={(e) => onTogglePTMQ?.(e.target.checked)}
            colorScheme="green"
            size="lg"
          >
            <Text ml={2} fontWeight="semibold">
              Producto PTMQ&nbsp;
              <Text as="span" fontSize="sm" color="gray.300">
                (sin receta)
              </Text>
            </Text>
          </Checkbox>
        </Center>
      </Box>
    );
  }

  return (
    <Box my={4}>
      <Text mb={2} fontWeight="bold" fontSize="lg">
        Receta
      </Text>

      <Table size="sm" variant="simple">
        <Thead bg="green.50" _dark={{ bg: "green.800" }}>
          <Tr>
            <Th>No.</Th>
            <Th>Descripción</Th>
            <Th isNumeric>Cantidad base</Th>
            <Th isNumeric>Ctd. requerida</Th>
            <Th>Unidad</Th>
            <Th>Almacén</Th>
          </Tr>
        </Thead>
        <Tbody>
          {details.map((d) => (
            <Tr key={d.detalleId}>
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
  ).isRequired,

  isPTMQ: PropTypes.bool,
  onTogglePTMQ: PropTypes.func,
};

OrderDetailsTable.defaultProps = {
  details: [],
  isPTMQ: false,
  onTogglePTMQ: undefined,
};
