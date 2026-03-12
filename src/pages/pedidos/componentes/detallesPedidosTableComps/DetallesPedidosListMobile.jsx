import PropTypes from "prop-types";
import {
  VStack,
  Box,
  HStack,
  Text,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { m } from "framer-motion";
import CantidadInput from "../pageFormPedidos/cantidadInput";

const MotionBox = m.div || m("div");

export const DetallesPedidosListMobile = ({
  productos,
  mobileCardBg,
  getUniqueKey,
  setProductos,
  handleCantidadChange,
  handleRemoveProducto,
}) => {
  return (
    <VStack spacing={1} align="stretch">
      {productos.map((producto) => (
        <MotionBox
          key={getUniqueKey(producto)}
          p={2}
          style={{
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            borderWidth: "1px",
            borderRadius: "0.375rem",
            backgroundColor: mobileCardBg,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <HStack justifyContent="space-between" spacing={2}>
            <Box flex="1">
              <Text fontWeight="bold" fontSize="sm">
                {producto.nombreProducto || "N/A"}
              </Text>
              <CantidadInput
                value={producto.cantidad}
                onChange={(e) =>
                  setProductos((prevProductos) =>
                    prevProductos.map((prod) =>
                      prod.detallePedidoId === producto.detallePedidoId
                        ? {
                            ...prod,
                            cantidad: parseFloat(e.target.value) || 0,
                          }
                        : prod,
                    ),
                  )
                }
                onBlur={() => {
                  handleCantidadChange(
                    producto.detallePedidoId,
                    producto.cantidad,
                  );
                }}
                placeholder="0"
                size="sm"
                width="60px"
                maxWidth="60px"
              />
            </Box>
            <Tooltip label="Eliminar producto" hasArrow>
              <IconButton
                icon={<DeleteIcon />}
                colorScheme="red"
                onClick={() => handleRemoveProducto(producto.detallePedidoId)}
                size="xs"
              />
            </Tooltip>
          </HStack>
        </MotionBox>
      ))}
    </VStack>
  );
};

DetallesPedidosListMobile.propTypes = {
  productos: PropTypes.array.isRequired,
  mobileCardBg: PropTypes.string.isRequired,
  getUniqueKey: PropTypes.func.isRequired,
  setProductos: PropTypes.func.isRequired,
  handleCantidadChange: PropTypes.func.isRequired,
  handleRemoveProducto: PropTypes.func.isRequired,
};

