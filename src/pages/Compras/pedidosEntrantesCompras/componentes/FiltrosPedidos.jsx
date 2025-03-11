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

const FiltrosPedidos = ({ onAplicarFiltros }) => {
  const [fecha, setFecha] = useState("");
  const [palabrasClave, setPalabrasClave] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Filtros aplicados:", { fecha, palabrasClave });
    onAplicarFiltros({ fecha, palabrasClave });
  };

  return (
    <Box as="form" mb={4} onSubmit={handleSubmit}>
      <Stack direction={{ base: "column", md: "row" }} spacing={4}>
        <FormControl>
          <FormLabel>Fecha de Entrega</FormLabel>
          <Input
            type="date"
            value={fecha}
            onChange={(e) =>
              setFecha(moment.utc(e.target.value).format("YYYY-MM-DD"))
            }
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
