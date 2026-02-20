import { useState, useMemo, useEffect } from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { useUpdatePedidoProduccionMutation } from "../../services/pedidoProductionApi";

export const OrderWarehouseSelector = ({ order, almacenes }) => {
  const [updatePedido] = useUpdatePedidoProduccionMutation();

  const defaultAlmacenId = useMemo(() => {
    if (order.id_almacen) return String(order.id_almacen);
    if (order.almacen?.id) return String(order.almacen.id);

    if (order.codigoAlmacen && almacenes.length > 0) {
      const code = String(order.codigoAlmacen).trim();
      const match = almacenes.find(
        (a) => String(a.name).trim() === code || String(a.name).includes(code),
      );
      if (match) return String(match.id);
    }
    return "";
  }, [order.id_almacen, order.almacen, order.codigoAlmacen, almacenes]);

  const [almacenId, setAlmacenId] = useState(defaultAlmacenId);

  useEffect(() => {
    setAlmacenId(defaultAlmacenId);
  }, [defaultAlmacenId]);

  const handleChange = async (e) => {
    const newId = e.target.value;
    setAlmacenId(newId);
    try {
      await updatePedido({
        id: order.id,
        data: { id_almacen: newId ? Number(newId) : null },
      }).unwrap();
    } catch {
      setAlmacenId(order.id_almacen ? String(order.id_almacen) : "");
    }
  };

  const borderColor = useColorModeValue("#E2E8F0", "#4A5568");
  const color = useColorModeValue("#2D3748", "#EDF2F7");
  const bg = useColorModeValue("#fff", "#2D3748");
  const optionColor = useColorModeValue("#222", "#fff");
  const optionBg = useColorModeValue("#fff", "#222");

  return (
    <Box display="inline-flex" flexDirection="column" alignItems="flex-end">
      <Text
        fontSize="2xs"
        mb={0.5}
        fontWeight="bold"
        color="gray.500"
        textTransform="uppercase"
      >
        Almacén Destino
      </Text>
      <select
        value={almacenId}
        onChange={handleChange}
        style={{
          fontSize: "12px",
          padding: "2px 6px",
          borderRadius: "4px",
          border: "1px solid",
          borderColor: borderColor,
          color: color,
          background: bg,
          cursor: "pointer",
          outline: "none",
        }}
      >
        <option value="">-- Seleccionar --</option>
        {almacenes.map((almacen) => (
          <option
            key={almacen.id}
            value={almacen.id}
            style={{
              color: optionColor,
              background: optionBg,
            }}
          >
            {almacen.nombre || almacen.name}
          </option>
        ))}
      </select>
    </Box>
  );
};
