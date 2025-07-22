import PropTypes from "prop-types";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Text,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";

export const FabricacionDetailsTable = ({ details }) => {
  const headerBg = useColorModeValue("green.100", "green.800");

  if (!details || details.length === 0) {
    return (
      <Center py={4}>
        <Text color={useColorModeValue("gray.600", "gray.400")}>
          No hay detalles para esta orden.
        </Text>
      </Center>
    );
  }

  return (
    <Table size="sm" variant="simple">
      <Thead bg={headerBg}>
        <Tr>
          <Th>No.</Th>
          <Th>Descripción</Th>
          <Th isNumeric>Cantidad base</Th>
          <Th isNumeric>Ctd. requerida</Th>
          <Th>Nombre de Unidad</Th>
          <Th>Almacén</Th>
        </Tr>
      </Thead>
      <Tbody>
        {details.map((d, i) => (
          <Tr key={i}>
            <Td>
              <Checkbox isChecked={!!d.checked} />
            </Td>
            <Td>{d.descripcion}</Td>
            <Td isNumeric>{d.cantidadBase}</Td>
            <Td isNumeric>{d.cantidadRequerida}</Td>
            <Td>{d.nombreUnidad}</Td>
            <Td>{d.almacen}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

FabricacionDetailsTable.propTypes = {
  details: PropTypes.arrayOf(
    PropTypes.shape({
      descripcion: PropTypes.string,
      cantidadBase: PropTypes.number,
      cantidadRequerida: PropTypes.number,
      nombreUnidad: PropTypes.string,
      almacen: PropTypes.string,
      checked: PropTypes.bool,
    })
  ),
};

FabricacionDetailsTable.defaultProps = {
  details: [],
};
