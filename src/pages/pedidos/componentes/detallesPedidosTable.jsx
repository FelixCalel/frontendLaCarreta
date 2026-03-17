import {
  Box,
  Text,
  Spinner,
  HStack,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { DetallesPedidosListMobile } from "./detallesPedidosTableComps/DetallesPedidosListMobile";
import { DetallesPedidosTableDesktop } from "./detallesPedidosTableComps/DetallesPedidosTableDesktop";
import { AddProductoSection } from "./detallesPedidosTableComps/AddProductoSection";
import PropTypes from "prop-types";
import { useProductosTable } from "./hooks/useProductosTable";

const MotionBox = m.create(Box);

const ProductosTable = ({ pedidoId, deudorId, tiendaId }) => {
  const addBoxBgColor = useColorModeValue("gray.50", "gray.700");
  const subtitleColor = useColorModeValue("teal.600", "teal.300");
  const emptyBorder = useColorModeValue("gray.200", "gray.600");
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;

  const {
    dataState,
    newProducto,
    setNewProducto,
    resetFields,
    onAddProducto,
    onUpdateCantidad,
    onDeleteProducto,
  } = useProductosTable(pedidoId, deudorId, tiendaId);

  return (
    <LazyMotion features={domAnimation}>
      <MotionBox
        mt={2}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Encabezado compacto */}
        <HStack mb={2} spacing={2} align="center" justify="center">
          <Text
            fontSize="xs"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wide"
            color={subtitleColor}
          >
            Detalles del Pedido
          </Text>
          {dataState.isLoading && <Spinner size="xs" color="teal.400" />}
        </HStack>

        {dataState.isLoading ? null : dataState.productos.length > 0 ? (
          isMobile ? (
            <DetallesPedidosListMobile
              detalles={dataState.productos}
              onUpdateCantidad={onUpdateCantidad}
              onDelete={onDeleteProducto}
            />
          ) : (
            <DetallesPedidosTableDesktop
              detalles={dataState.productos}
              onUpdateCantidad={onUpdateCantidad}
              onDelete={onDeleteProducto}
            />
          )
        ) : (
          !dataState.isLoading && (
            <Box
              py={4}
              border="1px dashed"
              borderColor={emptyBorder}
              borderRadius="md"
              textAlign="center"
            >
              <Text fontSize="sm" color="gray.400">
                Sin productos aún.
              </Text>
            </Box>
          )
        )}

        <AddProductoSection
          pedidoId={pedidoId}
          tiendaId={tiendaId}
          newProducto={newProducto}
          setNewProducto={setNewProducto}
          handleAddProducto={onAddProducto}
          resetFields={resetFields}
          deudorId={deudorId}
          addBoxBgColor={addBoxBgColor}
          handleProductoChange={(id, name, stock, code) => {
            setNewProducto((prev) => ({
              ...prev,
              productoId: id,
              nombreProducto: name,
              cantidadDisponible: stock,
              codigo: code,
            }));
          }}
        />
      </MotionBox>
    </LazyMotion>
  );
};

ProductosTable.propTypes = {
  pedidoId: PropTypes.number,
  deudorId: PropTypes.number,
  tiendaId: PropTypes.number,
};

export default ProductosTable;
