// src/pages/pedidosEntrantes/componentes/FiltrosPedidos.jsx

import { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Stack } from "@chakra-ui/react";
import PropTypes from "prop-types";

const FiltrosPedidos = ({ onAplicarFiltros }) => {
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [palabrasClave, setPalabrasClave] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAplicarFiltros({ fechaEntrega, palabrasClave });
  };

  return (
    <Box as="form" mb={4} onSubmit={handleSubmit}>
      <Stack direction={{ base: "column", md: "row" }} spacing={4}>
        <FormControl>
          <FormLabel>Fecha de Entrega</FormLabel>
          <Input
            type="date"
            value={fechaEntrega}
            onChange={(e) => setFechaEntrega(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Items que contengan las palabras</FormLabel>
          <Input
            type="text"
            placeholder="Palabras clave"
            value={palabrasClave}
            onChange={(e) => setPalabrasClave(e.target.value)}
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" alignSelf="flex-end">
          Consultar
        </Button>
      </Stack>
    </Box>
  );
};

FiltrosPedidos.propTypes = {
  onAplicarFiltros: PropTypes.func.isRequired,
};

export default FiltrosPedidos;
