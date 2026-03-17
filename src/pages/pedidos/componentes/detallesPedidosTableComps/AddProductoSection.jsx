import PropTypes from "prop-types";
import { Box, HStack, IconButton, useColorModeValue } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ProductoSelector from "../pageFormPedidos/productoSelector";
import CantidadInput from "../pageFormPedidos/cantidadInput";

export const AddProductoSection = ({
  pedidoId,
  tiendaId,
  deudorId,
  addBoxBgColor,
  resetFields,
  newProducto,
  handleProductoChange,
  setNewProducto,
  handleAddProducto,
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      mt={3}
      pt={3}
      borderTop="1px solid"
      borderColor={borderColor}
      bg={addBoxBgColor}
      borderRadius="md"
      px={{ base: 2, md: 3 }}
      pb={{ base: 2, md: 3 }}
    >
      {/* Fila única: selector flex=1, cantidad fija, botón fijo */}
      <HStack spacing={2} align="center" w="100%">
        {/* El Box con flex="1" hace que el selector se expanda y el
            AutoCompleteList (posición absoluta) herede ese ancho */}
        <Box flex="1" minW={0} position="relative">
          <ProductoSelector
            deudorId={Number(deudorId)}
            pedidoId={Number(pedidoId) || undefined}
            tiendaId={Number(tiendaId) || undefined}
            onSelect={(
              productoId,
              nombreProducto,
              cantidadDisponible,
              codigo
            ) =>
              handleProductoChange(
                productoId,
                nombreProducto,
                cantidadDisponible,
                codigo
              )
            }
            reset={resetFields}
          />
        </Box>

        <CantidadInput
          value={newProducto.cantidad}
          onChange={(event) =>
            setNewProducto({
              ...newProducto,
              cantidad:
                event.target.value === ""
                  ? ""
                  : Number.parseFloat(event.target.value),
            })
          }
          placeholder="0"
          size="sm"
          width="68px"
          maxWidth="68px"
          flexShrink={0}
        />

        <IconButton
          aria-label="Agregar producto"
          icon={<AddIcon />}
          colorScheme="teal"
          size="sm"
          flexShrink={0}
          onClick={handleAddProducto}
        />
      </HStack>
    </Box>
  );
};

AddProductoSection.propTypes = {
  pedidoId: PropTypes.number,
  tiendaId: PropTypes.number,
  deudorId: PropTypes.number.isRequired,
  addBoxBgColor: PropTypes.string.isRequired,
  resetFields: PropTypes.bool.isRequired,
  newProducto: PropTypes.object.isRequired,
  handleProductoChange: PropTypes.func.isRequired,
  setNewProducto: PropTypes.func.isRequired,
  handleAddProducto: PropTypes.func.isRequired,
};
