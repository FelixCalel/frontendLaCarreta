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
  Stack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useState } from "react";
import { FaUserCheck } from "react-icons/fa";
import ProveedorSelector from "./proveedorSelector";

const ComprasTable = ({ compras, onRegistrarProveedor }) => {
  // Para “Seleccionar todos / Deseleccionar todos”
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedProveedorId, setSelectedProveedorId] = useState(null);

  const handleSelectAll = () => {
    setSelectedAll(!selectedAll);
    if (!selectedAll) {
      setSelectedItems(compras.map((c) => c.id));
    } else {
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
      <Box mb={4}>
        <Stack direction="row" spacing={4} alignItems="center">
          {/* Label antes del selector */}
          <Box fontWeight="bold">Proveedor:</Box>
          <ProveedorSelector
            value={selectedProveedorId}
            onChange={(nuevoValor) => setSelectedProveedorId(nuevoValor)}
          />
          <Tooltip label="Seleccionar todos los items" fontSize="sm">
            <Button size="sm" onClick={handleSelectAll}>
              {selectedAll ? "Deseleccionar todos" : "Seleccionar todos"}
            </Button>
          </Tooltip>

          <Tooltip
            label="Asigna un proveedor a los items seleccionados"
            fontSize="sm"
          >
            <Button size="sm" colorScheme="green" leftIcon={<FaUserCheck />}>
              Asignar proveedor a seleccionados
            </Button>
          </Tooltip>
        </Stack>
      </Box>

      <Table variant="striped" colorScheme="gray">
        <Thead bg={bgHeader}>
          <Tr>
            <Th>ID</Th>
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
              <Td>{compra.id}</Td>
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
              <Td>{compra.nombreProveedor || "—"}</Td>
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
