import { Box, HStack, IconButton, Tooltip } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import MotionBox from "./motionBox"; // Un contenedor con animaciones (ya estaba definido)
import ProductoSelector from "../pageFormPedidos/productoSelector"; // Selector de productos existente
import CantidadInput from "../pageFormPedidos/cantidadInput"; // Input para cantidad
import PropTypes from "prop-types";

const ProductoSelectorSection = ({ newProducto, setNewProducto, onAddProducto, resetFields }) => {
  const handleAdd = () => {
    if (newProducto.productoId && newProducto.cantidad > 0) {
      onAddProducto(newProducto);
    } else {
      console.error("Debe seleccionar un producto y una cantidad válida");
    }
  };

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
            onSelect={(productoId, nombreProducto, cantidadDisponible, codigo) =>
              setNewProducto((prev) => ({
                ...prev,
                productoId,
                nombreProducto,
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
                cantidad: parseFloat(e.target.value),
              }))
            }
            placeholder="Cantidad"
            size="sm"
            width="60px"
          />
          <Tooltip label="Agregar producto" hasArrow>
            <IconButton
              icon={<AddIcon />}
              colorScheme="teal"
              onClick={handleAdd}
              size="sm"
            />
          </Tooltip>
        </HStack>
      </MotionBox>
    </Box>
  );
};

ProductoSelectorSection.propTypes = {
  newProducto: PropTypes.shape({
    productoId: PropTypes.string.isRequired,
    nombreProducto: PropTypes.string.isRequired,
    cantidad: PropTypes.number.isRequired,
    cantidadDisponible: PropTypes.number.isRequired,
    codigo: PropTypes.string,
  }).isRequired,
  setNewProducto: PropTypes.func.isRequired,
  onAddProducto: PropTypes.func.isRequired,
  resetFields: PropTypes.bool.isRequired,
};

export default ProductoSelectorSection;
