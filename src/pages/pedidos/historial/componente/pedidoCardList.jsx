import PropTypes from "prop-types";
import {
  Box,
  VStack,
  HStack,
  Badge,
  Text,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const PedidosCardList = ({ pedidos, roleId, onVerDetalles }) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const cardBorderColor = useColorModeValue("gray.300", "gray.600");
  const headingColor = useColorModeValue("gray.700", "gray.100");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const hoverBg = useColorModeValue("gray.50", "gray.600");

  return (
    <VStack spacing={3} align="stretch" w="100%">
      {pedidos.map((pedido) => {
        const showDocIds =
          roleId === 3 && (pedido.estadoId === 5 || pedido.estadoId === 6);

        return (
          <Box
            key={pedido.id}
            p={{ base: 3, sm: 4 }}
            borderWidth="1px"
            borderColor={cardBorderColor}
            rounded="lg"
            bg={cardBg}
            shadow="md"
            transition="all 0.2s"
            w="100%"
            maxW="100%"
            _hover={{
              shadow: "lg",
              transform: "scale(1.02)",
              bg: hoverBg,
            }}
          >
            <HStack justifyContent="space-between" alignItems="center" mb={2}>
              <Text fontWeight="bold" fontSize="lg" color={headingColor}>
                Pedido ID: {pedido.id}
              </Text>
              <Badge
                colorScheme={
                  pedido.estadoId === 2
                    ? "yellow"
                    : pedido.estadoId === 3
                      ? "green"
                      : pedido.estadoId === 5 || pedido.estadoId === 6
                        ? "blue"
                        : "red"
                }
                fontSize="sm"
                px={3}
                py={1}
                rounded="full"
              >
                {pedido.estadoId === 2
                  ? "Pendiente"
                  : pedido.estadoId === 3
                    ? "Aprobado"
                    : pedido.estadoId === 5 || pedido.estadoId === 6
                      ? "Exportado"
                      : "Cancelado"}
              </Badge>
            </HStack>

            <Text color={textColor} fontSize="sm">
              <strong>Deudor:</strong>{" "}
              {`${pedido.nombreCorrelativo} - ${pedido.nombreDeu || "N/A"}`}
            </Text>

            <Text color={textColor} fontSize="sm">
              <strong>Tienda:</strong> {pedido.nombreTienda || "N/A"}
            </Text>

            {showDocIds && (
              <>
                <Text color={textColor} fontSize="sm">
                  <strong>DocNum:</strong> {pedido.docNum ?? "—"}
                </Text>
                <Text color={textColor} fontSize="sm">
                  <strong>DocEntry:</strong> {pedido.docEntry ?? "—"}
                </Text>
              </>
            )}

            {(roleId === 1 || roleId === 3) && (
              <Text color={textColor} fontSize="sm">
                <strong>Usuario:</strong> {pedido.nombreUsuario || "N/A"}
              </Text>
            )}

            <Text color={textColor} fontSize="sm">
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
              fontSize="sm"
            >
              Ver Detalles
            </Button>
          </Box>
        );
      })}
    </VStack>
  );
};

PedidosCardList.propTypes = {
  pedidos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombreCorrelativo: PropTypes.string.isRequired,
      nombreDeu: PropTypes.string,
      nombreTienda: PropTypes.string,
      estadoId: PropTypes.number.isRequired,
      creadoEl: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]).isRequired,
      nombreUsuario: PropTypes.string,
      docNum: PropTypes.number,
      docEntry: PropTypes.number,
    }),
  ).isRequired,
  roleId: PropTypes.number.isRequired,
  onVerDetalles: PropTypes.func.isRequired,
};

export default PedidosCardList;
