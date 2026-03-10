import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

import { SearchIcon } from "@chakra-ui/icons";

const FiltrosCompras = ({ onAplicarFiltros }) => {
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [palabrasClave, setPalabrasClave] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAplicarFiltros({ fechaIngreso, palabrasClave });
  };

  return (
    <Box
      as="form"
      mb={4}
      onSubmit={handleSubmit}
      bg={useColorModeValue("gray.50", "gray.700")}
      p={4}
      borderRadius="md"
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={4}
        align="flex-end"
      >
        <FormControl w={{ base: "100%", md: "200px" }}>
          <FormLabel fontSize="sm">Fecha de Ingreso a planta</FormLabel>
          <Input
            size="sm"
            type="date"
            value={fechaIngreso}
            onChange={(e) => setFechaIngreso(e.target.value)}
          />
        </FormControl>

        <FormControl w={{ base: "100%", md: "300px" }}>
          <FormLabel fontSize="sm">Items que contengan las palabras</FormLabel>
          <Input
            size="sm"
            type="text"
            placeholder="Palabras clave"
            value={palabrasClave}
            onChange={(e) => setPalabrasClave(e.target.value)}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="sm"
          leftIcon={<SearchIcon />}
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
