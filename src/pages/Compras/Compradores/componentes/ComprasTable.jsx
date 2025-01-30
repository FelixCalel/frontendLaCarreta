import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Button,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useState } from "react";
import { FaUserCheck } from "react-icons/fa"; // Ejemplo de React Icons

const ComprasTable = ({ compras, onRegistrarProveedor }) => {
  // Para “Seleccionar todos / Deseleccionar todos”
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectAll = () => {
    setSelectedAll(!selectedAll);
    if (!selectedAll) {
      // Seleccionar todos
      setSelectedItems(compras.map((c) => c.id));
    } else {
      // Deseleccionar todos
      setSelectedItems([]);
    }
  };

  const handleCheckboxChange = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const bgHeader = useColorModeValue("gray.100", "gray.600");

  return (
    <Box
      bg="white"
      p={4}
      mb={6}
      rounded="md"
      boxShadow="sm"
      transition="all 0.3s"
    >
      {/* Acciones de selección */}
      <Box mb={4}>
        <Tooltip label="Seleccionar todos los items de la tabla" fontSize="sm">
          <Button size="sm" mr={2} onClick={handleSelectAll}>
            {selectedAll ? "Deseleccionar todos" : "Seleccionar todos"}
          </Button>
        </Tooltip>

        <Tooltip
          label="Asigna un proveedor a todos los items seleccionados"
          fontSize="sm"
        >
          <Button size="sm" colorScheme="green" leftIcon={<FaUserCheck />}>
            Asignar proveedor a seleccionados
          </Button>
        </Tooltip>
      </Box>

      {/* Tabla con hover en filas */}
      <Table variant="striped" colorScheme="gray">
        <Thead bg={bgHeader}>
          <Tr>
            <Th>Item</Th>
            <Th>Nombre Item</Th>
            <Th>DEU</Th>
            <Th>Cantidad Solicitada</Th>
            <Th>Cantidad Asignada</Th>
            <Th>Checkbox</Th>
            <Th>Proveedor</Th>
            <Th>Posible cantidad abastecida</Th>
          </Tr>
        </Thead>
        <Tbody>
          {compras.map((compra) => (
            <Tr
              key={compra.id}
              _hover={{
                bg: "blue.50",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              <Td>{compra.codigo}</Td>
              <Td>{compra.nombre}</Td>
              <Td>{`${compra.nombreDeu} - ${compra.nombreCorrelativo}`}</Td>
              <Td>{compra.cantidad || 0}</Td>
              <Td>{compra.cantidadAsignada || 0}</Td>
              <Td>
                <Checkbox
                  colorScheme="teal"
                  isChecked={selectedItems.includes(compra.id)}
                  onChange={() => handleCheckboxChange(compra.id)}
                />
              </Td>
              <Td>{compra.proveedorNombre || "—"}</Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="orange"
                  onClick={() => onRegistrarProveedor(compra)}
                  _hover={{ transform: "scale(1.03)" }}
                  transition="transform 0.2s"
                >
                  Planificar
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

ComprasTable.propTypes = {
  compras: PropTypes.array.isRequired,
  onRegistrarProveedor: PropTypes.func.isRequired,
};

export default ComprasTable;
