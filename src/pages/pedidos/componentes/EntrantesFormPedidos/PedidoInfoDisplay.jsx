import React from "react";
import PropTypes from "prop-types";
import {
  Flex,
  Icon,
  Text,
  Badge,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaCalendarAlt, FaCommentDots } from "react-icons/fa";

const PedidoInfoDisplay = ({ pedido }) => {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const badgeBgDisplay = useColorModeValue("purple.500", "purple.400");
  const bgPurple = useColorModeValue("#F3E8FF", "#6B21A8");
  const commentTextC = useColorModeValue("gray.700", "gray.300");

  let fechaDisplay = null;
  if (pedido.fechaOrdenDisplay) {
    const [yy, mm, dd] = pedido.fechaOrdenDisplay.slice(0, 10).split("-");
    fechaDisplay = `${dd}/${mm}/${yy}`;
  }

  if (!pedido.comentarioDisplay && !pedido.fechaOrdenDisplay) return null;

  return (
    <>
      <Flex
        px={4}
        py={2}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="md"
        bg={bgPurple}
        direction="column"
        gap={2}
      >
        <Flex align="center" gap={2}>
          <Badge colorScheme="purple" bg={badgeBgDisplay}>
            Display
          </Badge>
          {fechaDisplay && (
            <>
              <Icon as={FaCalendarAlt} />
              <Text fontSize="sm">
                <b>Fecha Orden:</b> {fechaDisplay}
              </Text>
            </>
          )}
        </Flex>
        {pedido.comentarioDisplay && (
          <Flex align="flex-start" gap={2}>
            <Icon as={FaCommentDots} />
            <Text fontSize="sm" color={commentTextC}>
              {pedido.comentarioDisplay.trim()}
            </Text>
          </Flex>
        )}
      </Flex>
      <Divider borderColor={borderColor} />
    </>
  );
};

export default PedidoInfoDisplay;

PedidoInfoDisplay.propTypes = {
  pedido: PropTypes.shape({
    id: PropTypes.number,
    fechaOrden: PropTypes.string,
    comentario: PropTypes.string,
    fechaOrdenDisplay: PropTypes.string,
    comentarioDisplay: PropTypes.string,
    deudorId: PropTypes.number,
    tiendaId: PropTypes.number,
  }).isRequired,
};
