import PropTypes from "prop-types";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Input,
} from "@chakra-ui/react";
import { useUpdatePedidoProduccionMutation } from "../../../services/pedidoProductionApi";

export const DigitadorItemsTable = ({ items }) => {
  const [updateItem] = useUpdatePedidoProduccionMutation();

  const toggleCompleto = (id, checked) =>
    updateItem({ id, data: { completo: checked } });

  const handleChangeNumber = (id, field, raw) => {
    const value = Math.max(0, Number(raw) || 0);
    updateItem({ id, data: { [field]: value } });
  };

  return (
    <Table size="sm" variant="striped">
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
        {items.map((it) => (
          <Tr key={it.id}>
            {/* <Td>{it.id_asigArea}</Td> */}
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
