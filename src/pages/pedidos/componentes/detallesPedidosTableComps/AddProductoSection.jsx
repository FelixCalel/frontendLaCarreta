import PropTypes from "prop-types";
import { Box, Stack, Tooltip, IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { m } from "framer-motion";
import ProductoSelector from "../pageFormPedidos/productoSelector";
import CantidadInput from "../pageFormPedidos/cantidadInput";

const MotionBox = m.div || m("div");

export const AddProductoSection = ({
  deudorId,
  addBoxBgColor,
  resetFields,
  newProducto,
  handleProductoChange,
  setNewProducto,
  handleAddProducto,
}) => {
  return (
    <Box mt={4}>
      <MotionBox
        p={1}
        bg={addBoxBgColor}
        style={{
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          borderWidth: "1px",
          borderRadius: "0.375rem",
          width: "100%",
          maxWidth: "460px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={2}
          width="100%"
          align="stretch"
        >
          <Box w="100%">
            <ProductoSelector
              deudorId={Number(deudorId)}
              onSelect={(
                productoId,
                nombreProducto,
                cantidadDisponible,
                codigo,
              ) =>
                handleProductoChange(
                  productoId,
                  nombreProducto,
                  cantidadDisponible,
                  codigo,
                )
              }
              reset={resetFields}
            />
          </Box>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            justifyContent="flex-end"
            w={{ base: "100%", md: "auto" }}
            mt={{ base: 1, md: 0 }}
          >
            <CantidadInput
              value={newProducto.cantidad}
              onChange={(e) =>
                setNewProducto({
                  ...newProducto,
                  cantidad:
                    e.target.value === "" ? "" : parseFloat(e.target.value),
                })
              }
              placeholder="0"
              size="sm"
              width="60px"
              maxWidth="60px"
              style={{ margin: 0, padding: "2px", fontSize: "0.95rem" }}
            />
            <Tooltip label="Agregar producto" hasArrow>
              <IconButton
                icon={<AddIcon />}
                colorScheme="teal"
                onClick={handleAddProducto}
                size="sm"
                style={{ margin: 0, padding: "2px" }}
              />
            </Tooltip>
          </Box>
        </Stack>
      </MotionBox>
    </Box>
  );
};

AddProductoSection.propTypes = {
  deudorId: PropTypes.number.isRequired,
  addBoxBgColor: PropTypes.string.isRequired,
  resetFields: PropTypes.bool.isRequired,
  newProducto: PropTypes.object.isRequired,
  handleProductoChange: PropTypes.func.isRequired,
  setNewProducto: PropTypes.func.isRequired,
  handleAddProducto: PropTypes.func.isRequired,
};

