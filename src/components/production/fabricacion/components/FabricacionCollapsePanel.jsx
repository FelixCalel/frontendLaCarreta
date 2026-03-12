import {
  Collapse,
  Box,
  Flex,
  Text,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { FabricacionDetailsTable } from "../FabricacionDetailsTable";
import { RecetaTable } from "../../RecetaTable";

export const FabricacionCollapsePanel = ({
  isExpanded,
  panelBg,
  panelBorder,
  detailsBgColor,
  order,
  loadingReceta,
  receta,
  almacenes,
}) => {
  return (
    <Collapse in={isExpanded} animateOpacity>
      <Box
        bg={panelBg}
        p={3}
        borderBottomWidth="1px"
        borderColor={panelBorder}
      >
        <Flex gap={4} direction={{ base: "column", xl: "row" }}>
          <Box flex="1" maxW={{ xl: "40%" }}>
            <Box
              bg={detailsBgColor}
              p={3}
              borderRadius="md"
              shadow="sm"
              borderWidth="1px"
              borderColor="gray.200"
              h="100%"
            >
              <Text fontSize="sm" fontWeight="bold" color="blue.600" mb={3}>
                Detalles del Pedido
              </Text>
              <FabricacionDetailsTable details={order.details || []} />
            </Box>
          </Box>

          <Box flex="1">
            {loadingReceta ? (
              <Center py={2}>
                <Spinner size="sm" />
              </Center>
            ) : receta.length ? (
              <RecetaTable
                pedidoId={order.id}
                receta={receta}
                almacenes={almacenes}
              />
            ) : (
              <Center py={2}>
                <Text color="gray.500" fontSize="sm">
                  — No hay receta para este pedido —
                </Text>
              </Center>
            )}
          </Box>
        </Flex>
      </Box>
    </Collapse>
  );
};
