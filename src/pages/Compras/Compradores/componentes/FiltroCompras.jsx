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
import { SearchIcon } from "@chakra-ui/icons";

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
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={4}
        align="flex-end"
      >
        <FormControl w={{ base: "100%", md: "160px" }}>
          <FormLabel fontSize="sm">Fecha</FormLabel>
          <Input
            size="sm"
            type="date"
            value={fechaOrden}
            onChange={(e) =>
              setFechaOrden(moment.utc(e.target.value).format("YYYY-MM-DD"))
            }
          />
        </FormControl>

        <FormControl w={{ base: "100%", md: "300px" }}>
          <FormLabel fontSize="sm">Palabras clave</FormLabel>
          <Input
            size="sm"
            type="text"
            placeholder="Ej: apio, zanahoria..."
            value={palabrasClave}
            onChange={(e) => setPalabrasClave(e.target.value)}
          />
        </FormControl>

        <Button
          size="sm"
          type="submit"
          colorScheme="blue"
          leftIcon={<SearchIcon />}
          transition="transform 0.2s"
          _hover={{ transform: "scale(1.05)" }}
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
