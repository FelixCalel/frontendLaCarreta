import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  HStack,
  Text,
  IconButton,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import CantidadInput from "../pageFormPedidos/cantidadInput";

const EMPTY_DETALLES = [];

export const DetallesPedidosListMobile = ({
  detalles = EMPTY_DETALLES,
  onUpdateCantidad = () => {},
  onDelete = () => {},
}) => {
  const [cantidadesEditadas, setCantidadesEditadas] = useState({});
  const productos = Array.isArray(detalles) ? detalles : [];
  const nameFg = useColorModeValue("gray.800", "gray.100");

  const getUniqueKey = (producto, index) =>
    producto?.detallePedidoId ??
    producto?.id ??
    `${producto?.productoId ?? "p"}-${index}`;

  return (
    <Box>
      {productos.map((producto, index) => {
        const productoKey = getUniqueKey(producto, index);
        const cantidadActual =
          cantidadesEditadas[productoKey] ?? producto?.cantidad ?? 0;

        return (
          <Box key={productoKey}>
            <HStack py={2} px={1} spacing={2} align="center">
              {/* Nombre */}
              <Text
                flex="1"
                fontSize="sm"
                fontWeight="medium"
                color={nameFg}
                noOfLines={2}
              >
                {producto?.nombreProducto || "N/A"}
              </Text>

              {/* Input cantidad */}
              <CantidadInput
                value={cantidadActual}
                onChange={(e) => {
                  const v = Number.parseFloat(e.target.value) || 0;
                  setCantidadesEditadas((prev) => ({
                    ...prev,
                    [productoKey]: v,
                  }));
                }}
                onBlur={() =>
                  onUpdateCantidad(
                    producto,
                    Number.parseFloat(cantidadActual) || 0
                  )
                }
                placeholder="0"
                size="sm"
                width="60px"
                maxWidth="60px"
              />

              {/* Eliminar */}
              <IconButton
                aria-label="Eliminar"
                icon={<DeleteIcon />}
                colorScheme="red"
                variant="ghost"
                size="sm"
                onClick={() => onDelete(producto)}
              />
            </HStack>

            {index < productos.length - 1 && <Divider />}
          </Box>
        );
      })}
    </Box>
  );
};

DetallesPedidosListMobile.propTypes = {
  detalles: PropTypes.array,
  onUpdateCantidad: PropTypes.func,
  onDelete: PropTypes.func,
};
