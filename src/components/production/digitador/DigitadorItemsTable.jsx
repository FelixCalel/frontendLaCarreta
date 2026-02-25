import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";

export const DigitadorItemsTable = ({ items }) => {
  const [updateItem] = useUpdatePedidoProduccionMutation();

  const toggleCompleto = (id, checked) =>
    updateItem({ id, data: { completo: checked } });

  const handleChangeNumber = (id, field, raw) => {
    const value = Math.max(0, Number(raw) || 0);
    updateItem({ id, data: { [field]: value } });
  };

  const bgOdd = useColorModeValue("white", "gray.900");
  const bgEven = useColorModeValue("gray.50", "gray.800");
  const hoverBg = useColorModeValue("gray.200", "gray.600");

  return (
    <Table size="sm" variant="simple">
      <Thead>
        <Tr>
          <Th>ITEM</Th>
          <Th>Descripción artículo/serv</Th>
          <Th isNumeric>Pedido</Th>
          <Th textAlign="center">Completar despacho</Th>
          <Th isNumeric>Despacho</Th>
          <Th isNumeric>Faltante</Th>
          <Th>Unidad</Th>
          <Th isNumeric>Cantidad</Th>
          <Th>No.Trazabilidad</Th>
        </Tr>
      </Thead>
      <Tbody>
        {items.map((it, idx) => (
          <Tr
            key={it.id}
            bg={idx % 2 === 0 ? bgOdd : bgEven}
            _hover={{ bg: hoverBg }}
          >
            <Td>{it.itemCode}</Td>
            <Td>{it.productoNombre}</Td>
            <Td isNumeric>{it.cantidadUnidad ?? 0}</Td>
            <Td textAlign="center">
              <Checkbox
                isChecked={it.completo}
                onChange={(e) => toggleCompleto(it.id, e.target.checked)}
              />
            </Td>
            <Td isNumeric>
              <Input
                size="xs"
                type="number"
                min={0}
                defaultValue={it.despacho ?? 0}
                onBlur={(e) =>
                  handleChangeNumber(it.id, "despacho", e.target.value)
                }
                w="64px"
              />
            </Td>
            <Td isNumeric>{it.faltante ?? 0}</Td>
            <Td>{it.unidadMedida ?? "—"}</Td>
            <Td isNumeric>
              <Input
                size="xs"
                type="number"
                min={0}
                defaultValue={it.cantidad ?? 0}
                onBlur={(e) =>
                  handleChangeNumber(it.id, "cantidad", e.target.value)
                }
                w="64px"
              />
            </Td>
            <Td>{it.trazabilidad_Prod ?? "—"}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

DigitadorItemsTable.propTypes = {
  items: PropTypes.array.isRequired,
};
