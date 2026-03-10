import PropTypes from "prop-types";
import { Box, Flex, Text, Button, Stack } from "@chakra-ui/react";

const CurrentAssignments = ({ proveedoresAsignados, handleDesasignar }) => (
  <Box>
    <Text fontWeight="bold" color="gray.700" mb={3}>
      Desglose de Proveedores Actuales
    </Text>
    {proveedoresAsignados.length > 0 ? (
      <Stack spacing={2}>
        {proveedoresAsignados.map((prov) => (
          <Flex
            key={prov.proveedorId}
            justify="space-between"
            p={3}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            alignItems="center"
            shadow="sm"
          >
            <Box>
              <Text fontWeight="medium" color="gray.800">
                {prov.nombre}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Cantidad abastecida:{" "}
                <Text as="span" fontWeight="bold" color="green.600">
                  {prov.cantidad}
                </Text>
              </Text>
            </Box>
            <Button
              colorScheme="red"
              variant="ghost"
              size="sm"
              onClick={() => handleDesasignar(prov.proveedorId)}
            >
              Remover
            </Button>
          </Flex>
        ))}
      </Stack>
    ) : (
      <Box
        p={4}
        textAlign="center"
        bg="white"
        border="1px dashed"
        borderColor="gray.300"
        borderRadius="md"
      >
        <Text color="gray.400" fontSize="sm" fontStyle="italic">
          Aún no hay proveedores asignados para abastecer este producto.
        </Text>
      </Box>
    )}
  </Box>
);

CurrentAssignments.propTypes = {
  proveedoresAsignados: PropTypes.array.isRequired,
  handleDesasignar: PropTypes.func.isRequired,
};

export default CurrentAssignments;
