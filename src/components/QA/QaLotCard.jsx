import PropTypes from "prop-types";
import {
  Box,
  HStack,
  Text,
  Button,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);

export default function QaLotCard({ data }) {
  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const nav = useNavigate();

  const traz = (data.trazabilidad ?? "").toString().trim();

  const lotesTxt = data.lotes?.length
    ? ` · Lote${data.lotes.length > 1 ? "s" : ""}: ${data.lotes
        .map((l) => l.tarima ?? l.id)
        .join(", ")}`
    : "";
  const provTxt = data.proveedores?.length
    ? ` · Prov.: ${data.proveedores.map((p) => p.nombre).join(", ")}`
    : "";

  return (
    <MotionBox
      bg={bg}
      border="1px solid"
      borderColor={border}
      rounded="xl"
      p={4}
      shadow="sm"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
    >
      <HStack justify="space-between" mb={1}>
        <Text fontWeight="semibold">Pedido #{data.pedidoId}</Text>
        <Button
          size="sm"
          colorScheme="green"
          rightIcon={<ExternalLinkIcon />}
          onClick={() => nav(`/qa/agrupados/${data.pedidoId}`, { state: data })}
        >
          Abrir
        </Button>
      </HStack>

      <Text fontSize="sm" opacity={0.8}>
        {data.tienda} · {data.pais}
      </Text>

      <Text fontSize="xs" mt={1} opacity={0.8} noOfLines={2} fontFamily="mono">
        Trazab.: {traz || "—"}
        {lotesTxt}
        {provTxt}
      </Text>

      <Badge mt={2} variant="subtle" colorScheme="green">
        {data.items?.length || 0} ítems
      </Badge>
    </MotionBox>
  );
}

QaLotCard.propTypes = {
  data: PropTypes.object.isRequired,
};
