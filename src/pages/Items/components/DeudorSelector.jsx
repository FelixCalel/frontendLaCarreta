import { useEffect, useMemo, useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  FormControl,
  HStack,
  Text,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  CloseButton,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

const CHUNK_SIZE = 10;

const DeudorSelector = ({ onSelect, initialValue = "", width }) => {
  const deudoresAll = useSelector((state) => state.deudores.deudores || []);
  const [inputValue, setInputValue] = useState(() => initialValue);
  const [renderItems, setRenderItems] = useState([]);

  const listBg = useColorModeValue("white", "gray.800");
  const listBorderColor = useColorModeValue("gray.200", "gray.600");
  const itemHoverBg = useColorModeValue("gray.100", "gray.700");

  const baseItems = useMemo(() => {
    const term = inputValue.trim().toLowerCase();
    if (!term) return deudoresAll;
    return deudoresAll.filter(
      (d) =>
        (d.correlativo || "").toLowerCase().includes(term) ||
        (d.nombre || "").toLowerCase().includes(term),
    );
  }, [inputValue, deudoresAll]);

  useEffect(() => {
    setRenderItems(baseItems.slice(0, CHUNK_SIZE));
  }, [baseItems]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 4) {
      if (renderItems.length < baseItems.length) {
        setRenderItems(baseItems.slice(0, renderItems.length + CHUNK_SIZE));
      }
    }
  };

  const inputW = width || { base: "180px", md: "240px" };

  const handleSelectDeudor = (deuId) => {
    onSelect(deuId);
    setInputValue("");
  };

  return (
    <FormControl>
      <HStack spacing={2} w="full" align="center" position="relative">
        <Box position="relative" w={inputW}>
          <AutoComplete openOnFocus>
            <InputGroup size="xs">
              <AutoCompleteInput
                variant="outline"
                placeholder="Buscar y agregar deudor..."
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
              />
              {inputValue && (
                <InputRightElement>
                  <CloseButton size="md" onClick={() => setInputValue("")} />
                </InputRightElement>
              )}
            </InputGroup>
            <AutoCompleteList
              onScroll={handleScroll}
              bg={listBg}
              borderColor={listBorderColor}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="md"
              maxW="calc(100vw - 20px)"
              maxHeight="50vh"
              overflowY="auto"
            >
              {renderItems.map((d) => (
                <AutoCompleteItem
                  key={`deu-${d.id}`}
                  value={`${d.correlativo} - ${d.nombre}`}
                  onClick={() => handleSelectDeudor(d.id)}
                  _hover={{ bg: itemHoverBg }}
                >
                  <Text fontSize="md">
                    <b>{d.correlativo}</b> — {d.nombre}
                  </Text>
                </AutoCompleteItem>
              ))}
              {renderItems.length === 0 && inputValue.trim() && (
                <Box p={2}>
                  <Text fontSize="md" color="gray.500" align="center">
                    No se encontraron resultados
                  </Text>
                </Box>
              )}
            </AutoCompleteList>
          </AutoComplete>
        </Box>
      </HStack>
    </FormControl>
  );
};

DeudorSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
  initialValue: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default DeudorSelector;
