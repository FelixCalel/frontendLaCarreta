import PropTypes from "prop-types";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
} from "@chakra-ui/react";

export const OrderDetailsTable = ({ details, isLoading }) => {
  if (isLoading) return <Spinner size="sm" />;
  if (!details || details.length === 0) return <Text>No hay detalles.</Text>;

  return (
    <Table size="sm" variant="simple" mt={2}>
      <Thead bg="green.50">
        <Tr>
          <Th>No.</Th>
          <Th>Descripción</Th>
          <Th>Cantidad base</Th>
          <Th>Ctd. Requerida</Th>
          <Th>Nombre de Unidad</Th>
          <Th>Almacén</Th>
        </Tr>
      </Thead>
      <Tbody>
        {details.map((d) => (
          <Tr key={d.detalleId}>
            <Td>{d.numero}</Td>
            <Td>{d.descripcion}</Td>
            <Td>{d.cantidadBase}</Td>
            <Td>{d.cantidadRequerida}</Td>
            <Td>{d.unidad}</Td>
            <Td>{d.almacen}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
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
};

OrderDetailsTable.defaultProps = {
  details: [],
};
