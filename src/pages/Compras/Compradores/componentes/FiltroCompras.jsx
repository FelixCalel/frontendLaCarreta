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
import moment from "moment";

const FiltrosCompras = ({ onAplicarFiltros }) => {
  const [fechaOrden, setFechaOrden] = useState("");
  const [palabrasClave, setPalabrasClave] = useState("");

  const containerBg = useColorModeValue("gray.50", "gray.700");
  const containerHoverBg = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAplicarFiltros({ fechaOrden, palabrasClave });
  };

  return (
    <Box
      as="form"
      mb={6}
      p={4}
      bg={containerBg}
      color={textColor}
      boxShadow="md"
      rounded="md"
      onSubmit={handleSubmit}
      transition="background-color 0.2s"
      _hover={{ backgroundColor: containerHoverBg }}
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
