import PropTypes from "prop-types"; // Importar PropTypes
import { Box, VStack, HStack, Badge, Text, Button } from "@chakra-ui/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const PedidosCardList = ({ pedidos, roleId, onVerDetalles }) => (
  <VStack spacing={4} align="stretch">
    {pedidos.map((pedido) => (
      <Box
        key={pedido.id}
        p={4}
        borderWidth="1px"
        borderColor="gray.300"
        rounded="lg"
        bg="white"
        shadow="md"
        _hover={{ shadow: "lg", transform: "scale(1.02)", transition: "0.2s" }}
        transition="all 0.2s"
      >
        <HStack justifyContent="space-between" alignItems="center" mb={2}>
          <Text fontWeight="bold" fontSize="lg" color="gray.700">
            Pedido ID: {pedido.id}
          </Text>
          <Badge
            colorScheme={
              pedido.estadoId === 3
                ? "green"
                : pedido.estadoId === 2
                ? "yellow"
                : "red"
            }
            fontSize="sm"
            px={3}
            py={1}
            rounded="full"
          >
            {pedido.estadoId === 3
              ? "Aprobado"
              : pedido.estadoId === 2
              ? "Pendiente"
              : "Cancelado"}
          </Badge>
        </HStack>
        <Text color="gray.600" fontSize="sm">
          <strong>Deudor:</strong>{" "}
          {`${pedido.nombreCorrelativo} - ${pedido.nombreDeu || "N/A"}`}
        </Text>
        <Text color="gray.600" fontSize="sm">
          <strong>Tienda:</strong> {pedido.nombreTienda || "N/A"}
        </Text>
        {roleId === 1 || roleId === 3 ? (
          <Text color="gray.600" fontSize="sm">
            <strong>Usuario:</strong> {pedido.nombreUsuario || "N/A"}
          </Text>
        ) : null}
        <Text color="gray.600" fontSize="sm">
          <strong>Fecha:</strong>{" "}
          {format(new Date(pedido.creadoEl), "dd MMM yyyy, HH:mm", {
            locale: es,
          })}
        </Text>
        <Button
          mt={3}
          colorScheme="blue"
          size="sm"
          onClick={() => onVerDetalles(pedido)}
          _hover={{ bg: "blue.600" }}
          fontSize="sm"
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
      creadoEl: PropTypes.string.isRequired,
      nombreUsuario: PropTypes.string,
    })
  ).isRequired,
  roleId: PropTypes.number.isRequired,
  onVerDetalles: PropTypes.func.isRequired,
};

export default PedidosCardList;
