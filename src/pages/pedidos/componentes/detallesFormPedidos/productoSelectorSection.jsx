import { Box, HStack, IconButton, Tooltip } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ProductoSelector from "../pageFormPedidos/productoSelector";
import CantidadInput from "../pageFormPedidos/cantidadInput";
import MotionBox from "./motionBox";
import PropTypes from "prop-types";

const ProductoSelectorSection = ({
  newProducto,
  setNewProducto,
  onAddProducto,
  resetFields,
}) => {
  return (
    <Box mt={4}>
      <MotionBox
        p={2}
        boxShadow="sm"
        borderWidth="1px"
        rounded="md"
        bg="teal.50"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <HStack spacing={2} justifyContent="space-between">
          <ProductoSelector
            onSelect={(
              productoId,
              nombreProducto,
              cantidadDisponible,
              codigo
            ) =>
              setNewProducto((prev) => ({
                ...prev,
                productoId,
                nombreProducto,
                cantidad: "",
                cantidadDisponible,
                codigo,
              }))
            }
            reset={resetFields}
          />
          <CantidadInput
            value={newProducto.cantidad}
            onChange={(e) =>
              setNewProducto((prev) => ({
                ...prev,
                cantidad: e.target.value,
              }))
            }
            placeholder="Cantidad"
          />
          <Tooltip label="Agregar producto" hasArrow>
            <IconButton
              icon={<AddIcon />}
              colorScheme="teal"
              onClick={onAddProducto}
              size="sm"
            />
          </Tooltip>
        </HStack>
      </MotionBox>
    </Box>
  );
};

ProductoSelectorSection.propTypes = {
  newProducto: PropTypes.object.isRequired,
  setNewProducto: PropTypes.func.isRequired,
  onAddProducto: PropTypes.func.isRequired,
  resetFields: PropTypes.bool.isRequired,
};

export default ProductoSelectorSection;
