import PropTypes from "prop-types"; // Importar PropTypes
import { Box, VStack, HStack, Badge, Text, Button } from "@chakra-ui/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const PedidosCardList = ({ pedidos, roleId, onVerDetalles }) => (
  <VStack spacing={4} align="stretch">
    {pedidos.map((pedido) => (
      <Box
        key={pedido.id}
        p={3}
        borderWidth="1px"
        borderColor="gray.200"
        rounded="md"
        bg="white"
        shadow="sm"
        _hover={{ shadow: "md" }}
      >
        <HStack justifyContent="space-between">
          <Text fontWeight="bold">Pedido ID: {pedido.id}</Text>
          <Badge colorScheme={pedido.estadoId === 3 ? "green" : "red"}>
            {pedido.estadoId === 3 ? "Aprobado" : "Cancelado"}
          </Badge>
        </HStack>
        <Text>
          <strong>Deudor:</strong>{" "}
          {`${pedido.nombreCorrelativo} - ${pedido.nombreDeu || "N/A"}`}
        </Text>
        <Text>
          <strong>Tienda:</strong> {pedido.nombreTienda || "N/A"}
        </Text>
        {roleId === 1 || roleId === 3 ? (
          <Text>
            <strong>Usuario:</strong> {pedido.nombreUsuario || "N/A"}
          </Text>
        ) : null}
        <Text>
          <strong>Fecha:</strong>{" "}
          {format(new Date(pedido.fechaOrden), "dd MMM yyyy, HH:mm", {
            locale: es,
          })}
        </Text>
        <Button
          mt={2}
          colorScheme="blue"
          size="sm"
          onClick={() => onVerDetalles(pedido)}
        >
          Ver Detalles
        </Button>
      </Box>
    ))}
  </VStack>
);

// Validación de PropTypes
PedidosCardList.propTypes = {
  pedidos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombreCorrelativo: PropTypes.string.isRequired,
      nombreDeu: PropTypes.string,
      nombreTienda: PropTypes.string,
      estadoId: PropTypes.number.isRequired,
      fechaOrden: PropTypes.string.isRequired,
      nombreUsuario: PropTypes.string,
    })
  ).isRequired,
  roleId: PropTypes.number.isRequired,
  onVerDetalles: PropTypes.func.isRequired,
};

export default PedidosCardList;
