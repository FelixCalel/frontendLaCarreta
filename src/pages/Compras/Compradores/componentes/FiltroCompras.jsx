import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import moment from "moment";

const FiltrosCompras = ({ onAplicarFiltros }) => {
  const [fechaOrden, setFechaOrden] = useState("");
  const [palabrasClave, setPalabrasClave] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAplicarFiltros({ fechaOrden, palabrasClave });
  };

  return (
    <Box
      as="form"
      mb={6}
      p={4}
      bg="gray.50"
      boxShadow="md"
      rounded="md"
      onSubmit={handleSubmit}
      transition="background-color 0.2s"
      _hover={{ backgroundColor: "gray.100" }}
    >
      <Stack direction={{ base: "column", md: "row" }} spacing={4}>
        <FormControl>
          <FormLabel>Fecha</FormLabel>
          <Input
            type="date"
            value={fechaOrden}
            onChange={(e) =>
              setFechaOrden(moment.utc(e.target.value).format("YYYY-MM-DD"))
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Items que contengan las palabras</FormLabel>
          <Input
            type="text"
            placeholder="Ej: apio, zanahoria..."
            value={palabrasClave}
            onChange={(e) => setPalabrasClave(e.target.value)}
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          alignSelf="flex-end"
          _hover={{ transform: "scale(1.05)" }}
          transition="transform 0.2s"
        >
          Consultar
        </Button>
      </Stack>
    </Box>
  );
};

FiltrosCompras.propTypes = {
  onAplicarFiltros: PropTypes.func.isRequired,
};

export default FiltrosCompras;
