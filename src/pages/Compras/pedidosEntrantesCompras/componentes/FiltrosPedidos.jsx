import { useState, useCallback } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
  useColorModeValue,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

import { SearchIcon } from "@chakra-ui/icons";

const FiltrosPedidos = ({ onAplicarFiltros }) => {
  const [fecha, setFecha] = useState("");
  const [input, setInput] = useState("");
  const [palabras, setPalabras] = useState([]);

  const sync = useCallback(
    (f, p) => onAplicarFiltros({ fechaOrden: f, palabrasClave: p }),
    [onAplicarFiltros],
  );

  const addPalabra = () => {
    const palabra = input.trim().toLowerCase();
    if (palabra && !palabras.includes(palabra)) {
      const nuevo = [...palabras, palabra];
      setPalabras(nuevo);
      sync(fecha, nuevo);
    }
    setInput("");
  };

  const removePalabra = (word) => {
    const nuevo = palabras.filter((p) => p !== word);
    setPalabras(nuevo);
    sync(fecha, nuevo);
  };

  return (
    <Box>
      <Stack
        as="form"
        direction={{ base: "column", md: "row" }}
        spacing={3}
        align="flex-end"
        onSubmit={(e) => e.preventDefault()}
      >
        <FormControl w={{ base: "100%", md: "200px" }}>
          <FormLabel fontSize="sm">Fecha de Entrega</FormLabel>
          <Input
            size="sm"
            type="date"
            value={fecha}
            onChange={(e) => {
              const f = e.target.value;
              setFecha(f);
              sync(f, palabras);
            }}
          />
        </FormControl>

        <FormControl w={{ base: "100%", md: "400px" }}>
          <FormLabel fontSize="sm">Items que contengan las palabras</FormLabel>
          <Wrap mb={2}>
            {palabras.map((p) => (
              <Tag key={p} size="sm" colorScheme="green" borderRadius="full">
                <TagLabel>{p}</TagLabel>
                <TagCloseButton onClick={() => removePalabra(p)} />
              </Tag>
            ))}
          </Wrap>
          <Input
            size="sm"
            placeholder="Escribe y presiona Enter o coma"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addPalabra();
              }
            }}
            onBlur={addPalabra}
          />
        </FormControl>

        <Button
          colorScheme="green"
          size="sm"
          leftIcon={<SearchIcon />}
          onClick={() => sync(fecha, palabras)}
        >
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
