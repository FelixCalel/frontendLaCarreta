import React from "react";
import PropTypes from "prop-types";
import { Box, Flex, Button, useColorModeValue } from "@chakra-ui/react";
import ProductoSelector from "../../componentes/pageFormPedidos/productoSelector";

const AgregarProductoBar = ({
  newProducto,
  setNewProducto,
  cantidadAgregar,
  setCantidadAgregar,
  handleAddProducto,
  loading,
  resetFields,
}) => {
  const barBg = useColorModeValue("#f7fafc", "gray.800");
  const barBorder = useColorModeValue("#e2e8f0", "gray.700");
  const inputBg = useColorModeValue("#fff", "gray.900");
  const inputBorder = useColorModeValue("#e2e8f0", "gray.600");
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      gap={6}
      align={{ base: "stretch", md: "center" }}
      mb={2}
      wrap="nowrap"
      width="100%"
      justifyContent="space-between"
      bg={barBg}
      borderRadius="lg"
      boxShadow="md"
      border={`1px solid ${barBorder}`}
      p={3}
      transition="box-shadow 0.2s"
      _hover={{ boxShadow: "lg" }}
    >
      <Box
        flex={{ base: "none", md: "0 0 220px" }}
        minW="120px"
        maxW="220px"
        mr={{ base: 0, md: 4 }}
      >
        <ProductoSelector
          deudorId={newProducto.deudorId}
          onSelect={(
            productoId,
            nombreProducto,
            cantidadDisponible,
            codigo
          ) => {
            setNewProducto((prev) => ({
              ...prev,
              productoId,
              nombreProducto,
              cantidadDisponible,
              codigo,
            }));
          }}
          reset={resetFields}
          style={{
            width: "100%",
            minWidth: "120px",
            maxWidth: "220px",
            background: inputBg,
            borderRadius: "8px",
            border: `1px solid ${inputBorder}`,
            boxShadow: "sm",
          }}
        />
      </Box>
      <Flex gap={4} align="center">
        <Box flex={{ base: "none", md: "0 0 90px" }} minW="70px" maxW="90px">
          <input
            type="number"
            min={1}
            max={newProducto.cantidadDisponible || undefined}
            value={cantidadAgregar}
            onChange={(e) => setCantidadAgregar(e.target.value)}
            placeholder="Cantidad"
            style={{
              width: "100%",
              minWidth: "70px",
              maxWidth: "90px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: `1px solid ${inputBorder}`,
              fontSize: "1rem",
              background: inputBg,
              boxShadow: "sm",
              color: useColorModeValue("black", "white"),
              transition: "border-color 0.2s",
            }}
            disabled={!newProducto.productoId}
            aria-label="Cantidad a agregar"
          />
        </Box>
        <Box
          flex={{ base: "none", md: "0 0 100px" }}
          minW="80px"
          maxW="100px"
          display="flex"
          justifyContent="flex-end"
        >
          <Button
            colorScheme="teal"
            onClick={handleAddProducto}
            isLoading={loading}
            disabled={!newProducto.productoId || !cantidadAgregar}
            width="100%"
            maxWidth="100px"
            fontSize="1rem"
            py={2}
            borderRadius="8px"
            boxShadow="sm"
            transition="box-shadow 0.2s"
            _hover={{ boxShadow: "lg", bg: "teal.400" }}
          >
            Agregar
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

AgregarProductoBar.propTypes = {
  newProducto: PropTypes.shape({
    productoId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    nombreProducto: PropTypes.string,
    cantidad: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    cantidadDisponible: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    codigo: PropTypes.string,
    precio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    deudorId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  setNewProducto: PropTypes.func.isRequired,
  cantidadAgregar: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  setCantidadAgregar: PropTypes.func.isRequired,
  handleAddProducto: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  resetFields: PropTypes.bool.isRequired,
};

export default AgregarProductoBar;
