import { useState } from "react";
import PropTypes from "prop-types";
import {
  Tr,
  Td,
  Checkbox,
  IconButton,
  Collapse,
  Box,
  Input,
  Spinner,
  Center,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetRecetaByPedidoQuery } from "../../../services/pedidoProductionApi";
import { FabricacionDetailsTable } from "./FabricacionDetailsTable";
import { RecetaTable } from "../RecetaTable";

export const FabricacionRow = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const stripeBg = useColorModeValue("gray.50", "gray.800");
  const hoverBg = useColorModeValue("gray.200", "gray.600");
  const panelBg = useColorModeValue("white", "gray.700");
  const panelBorder = useColorModeValue("gray.200", "gray.600");
  const titleColor = useColorModeValue("gray.600", "gray.300");
  const recetaArg = isExpanded ? order.id : skipToken;
  const { data: receta = [], isLoading: loadingReceta } =
    useGetRecetaByPedidoQuery(recetaArg);

  return (
    <>
      <Tr bg={stripeBg} _hover={{ bg: hoverBg }} transition="background 0.2s">
        <Td px={2} py={1}>
          <IconButton
            size="sm"
            variant="ghost"
            icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            aria-label={isExpanded ? "Contraer" : "Expandir"}
            onClick={() => setIsExpanded((v) => !v)}
          />
        </Td>
        <Td px={2} py={1}>
          {order.itemCode}
        </Td>
        <Td px={2} py={1}>
          {order.productoNombre}
        </Td>
        <Td px={2} py={1} isNumeric>
          {order.cantidadUnidad ?? "-"}
        </Td>
        <Td px={2} py={1} textAlign="center">
          <Checkbox isChecked={!!order.completo} isReadOnly size="sm" />
        </Td>
        <Td px={2} py={1} isNumeric>
          {order.despacho ?? "-"}
        </Td>
        <Td px={2} py={1} isNumeric>
          {order.faltante ?? "-"}
        </Td>
        <Td px={2} py={1}>
          {order.unidadMedida ?? "-"}
        </Td>
        <Td px={2} py={1}>
          <Input
            size="xs"
            h="24px"
            w="56px"
            textAlign="center"
            value={order.cantidad ?? ""}
            isReadOnly
          />
        </Td>
        <Td px={2} py={1}>
          {order.trazabilidad_Prod ?? "-"}
        </Td>
      </Tr>

      <Tr>
        <Td colSpan={10} p={0} border="none">
          <Collapse in={isExpanded} animateOpacity>
            <Box
              bg={panelBg}
              border="1px solid"
              borderColor={panelBorder}
              borderRadius="md"
              p={2}
              mt={0}
            >
              <Box mb={2}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={titleColor}
                  mb={-12}
                  align="center"
                >
                  Detalles de fabricación
                </Text>
                <FabricacionDetailsTable details={order.details || []} />
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={titleColor}
                  mb={2}
                >
                  Receta
                </Text>

                {loadingReceta ? (
                  <Center py={2}>
                    <Spinner size="sm" />
                  </Center>
                ) : receta.length > 0 ? (
                  <Box mt={-2} mb={2}>
                    <RecetaTable
                      pedidoId={order.id}
                      receta={receta}
                      isLoading={false}
                    />
                  </Box>
                ) : (
                  <Center py={2}>
                    <Text
                      color={useColorModeValue("gray.600", "gray.400")}
                      fontSize="sm"
                    >
                      — No hay receta para este pedido —
                    </Text>
                  </Center>
                )}
              </Box>
            </Box>
          </Collapse>
        </Td>
      </Tr>
    </>
  );
};

FabricacionRow.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    itemCode: PropTypes.string,
    productoNombre: PropTypes.string,
    cantidadUnidad: PropTypes.number,
    completo: PropTypes.bool,
    despacho: PropTypes.number,
    faltante: PropTypes.number,
    unidadMedida: PropTypes.string,
    cantidad: PropTypes.number,
    trazabilidad_Prod: PropTypes.string,
    details: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};
