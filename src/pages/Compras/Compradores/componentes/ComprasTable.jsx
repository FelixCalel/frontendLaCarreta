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
  useToast,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useState } from "react";
import { FaUserCheck } from "react-icons/fa";
import ProveedorSelector from "./proveedorSelector";
import { useDispatch, useSelector } from "react-redux";
import {
  //updateCompra,
  fetchCompras,
  asignarProveedor,
  desasignarProveedor,
} from "../../../../store/Compras/thunks";

const ComprasTable = ({ compras, onRegistrarProveedor }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedProveedorId, setSelectedProveedorId] = useState(null);

  const { loading } = useSelector((state) => state.compras);

  const handleSelectAll = () => {
    if (!selectedAll) {
      const itemsSinProveedor = compras
        .filter((c) => !c.proveedorId)
        .map((c) => c.id);
      setSelectedItems(itemsSinProveedor);
    } else {
      setSelectedItems([]);
    }
    setSelectedAll(!selectedAll);
  };

  const handleCheckboxChange = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const boxBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const tableColorScheme = useColorModeValue("gray", "blue");
  const headerBg = useColorModeValue("gray.100", "gray.600");
  const rowHoverBg = useColorModeValue("green.50", "green.900");

  const sortedCompras = [...compras].sort((a, b) => a.id - b.id);

  const handleAssignProveedor = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Datos incompletos",
        description: "Selecciona al menos un ítem",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (selectedProveedorId) {
        const tieneProveedor = selectedItems.some((id) => {
          const compra = compras.find((c) => c.id === id);
          return (
            Array.isArray(compra.proveedorId) && compra.proveedorId.length > 0
          );
        });

        if (tieneProveedor) {
          toast({
            title: "Ya tiene proveedor asignado",
            description:
              "No puedes asignar un nuevo proveedor. Usa 'Planificar' para modificar.",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        await Promise.all(
          selectedItems.map((id) => {
            const compra = compras.find((c) => c.id === id);

            return dispatch(
              asignarProveedor({
                compraId: id,
                proveedorId: selectedProveedorId,
                cantidad: compra.cantidad || 1,
                selectedProveedorName: "Nombre del proveedor (opcional)",
              })
            );
          })
        );

        toast({
          title: "Operación exitosa",
          description: "Proveedores asignados correctamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await Promise.all(
          selectedItems.map((id) => {
            const compra = compras.find((c) => c.id === id);

            return dispatch(
              desasignarProveedor({
                compraId: id,
                proveedorId: compra.proveedorId?.[0],
              })
            );
          })
        );

        toast({
          title: "Operación exitosa",
          description: "Proveedores removidos correctamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      const roleId = parseInt(localStorage.getItem("roleId") || "0", 10);
      await dispatch(fetchCompras(roleId));

      setSelectedItems([]);
      setSelectedProveedorId(null);
      setSelectedAll(false);
    } catch (error) {
      console.error("Error en operación:", error);
      toast({
        title: "Error al actualizar",
        description: "Ocurrió un error en la operación",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      bg={boxBg}
      color={textColor}
      p={4}
      mb={6}
      rounded="md"
      boxShadow="sm"
      transition="all 0.3s"
    >
      <Box mb={4}>
        <Stack direction="row" spacing={4} alignItems="center">
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
            label={
              selectedProveedorId
                ? "Asigna un proveedor a los items seleccionados"
                : "Remueve el proveedor de los items seleccionados"
            }
            fontSize="sm"
          >
            <Button
              size="sm"
              colorScheme={selectedProveedorId ? "green" : "red"}
              leftIcon={<FaUserCheck />}
              onClick={handleAssignProveedor}
              isLoading={loading}
              disabled={selectedItems.length === 0}
            >
              {selectedProveedorId
                ? "Asignar proveedor a seleccionados"
                : "Quitar proveedor de seleccionados"}
            </Button>
          </Tooltip>
        </Stack>
      </Box>

      <Table variant="striped" colorScheme={tableColorScheme}>
        <Thead bg={headerBg}>
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
          {sortedCompras.map((compra) => (
            <Tr
              key={compra.id}
              _hover={{
                bg: rowHoverBg,
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
