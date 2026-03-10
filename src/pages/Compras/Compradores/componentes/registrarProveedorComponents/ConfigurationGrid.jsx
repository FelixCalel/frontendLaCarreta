import PropTypes from "prop-types";
import {
  SimpleGrid,
  Box,
  FormControl,
  FormLabel,
  Input,
  Text,
  Flex,
} from "@chakra-ui/react";
import ProveedorSelector from "../proveedorSelector";

const ConfigurationGrid = ({ state, dispatchAction }) => (
  <SimpleGrid columns={[1, 2]} spacing={5} mb={5}>
    {/* Fecha Box */}
    <Box
      bg="white"
      p={4}
      rounded="md"
      shadow="sm"
      border="1px solid"
      borderColor="gray.200"
    >
      <FormControl>
        <FormLabel fontWeight="semibold" color="gray.700" fontSize="sm">
          Ajustar Fecha Estimada de Ingreso
        </FormLabel>
        <Input
          type="date"
          focusBorderColor="green.400"
          size="sm"
          value={state.fechaIngreso}
          onChange={(e) =>
            dispatchAction({ type: "SET_FIELD", field: "fechaIngreso", value: e.target.value })
          }
        />
      </FormControl>
      <Text fontSize="xs" color="gray.500" mt={2}>
        Modifica la fecha para posponer la llegada general del producto.
      </Text>
    </Box>

    {/* Asignación Box */}
    <Box
      bg="white"
      p={4}
      rounded="md"
      shadow="sm"
      border="1px solid"
      borderColor="gray.200"
    >
      <Text fontWeight="semibold" color="gray.700" fontSize="sm" mb={2}>
        Asignar Nuevo Proveedor
      </Text>
      <FormControl mb={3}>
        <ProveedorSelector
          value={state.selectedProveedorId}
          onChange={(id, name) => {
            dispatchAction({ type: "SET_PROVIDER", payload: { id, name } });
          }}
        />
      </FormControl>
      <FormControl>
        <Flex justify="space-between" align="center" mb={1}>
          <FormLabel m={0} fontSize="sm">
            Cantidad Pactada
          </FormLabel>
          <Text
            fontSize="xs"
            fontWeight="bold"
            color={state.cantidadFaltante > 0 ? "orange.500" : "green.500"}
          >
            Faltante: {state.cantidadFaltante}
          </Text>
        </Flex>
        <Input
          type="number"
          size="sm"
          focusBorderColor="green.400"
          min={1}
          max={state.cantidadFaltante}
          disabled={state.cantidadFaltante === 0}
          value={state.cantidadPactada}
          onChange={(e) =>
            dispatchAction({
              type: "SET_FIELD",
              field: "cantidadPactada",
              value: Number(e.target.value),
            })
          }
        />
      </FormControl>
    </Box>
  </SimpleGrid>
);

ConfigurationGrid.propTypes = {
  state: PropTypes.object.isRequired,
  dispatchAction: PropTypes.func.isRequired,
};

export default ConfigurationGrid;
