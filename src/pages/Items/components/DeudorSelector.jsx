// src/pages/Items/components/DeudorSelector.jsx
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  FormControl,
  Flex,
  HStack,
  Text,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

const CHUNK_SIZE = 30;

const DeudorSelector = ({ onSelect, initialValue = "", width }) => {
  const deudoresAll = useSelector((state) => state.deudores.deudores || []);

  const [inputValue, setInputValue] = useState(initialValue);
  const [renderItems, setRenderItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);

  const listBg = useColorModeValue("white", "gray.800");
  const listBorderColor = useColorModeValue("gray.200", "gray.600");
  const itemHoverBg = useColorModeValue("gray.100", "gray.600");

  useEffect(() => {
    setInputValue(initialValue || "");
  }, [initialValue]);

  const baseItems = useMemo(() => {
    const term = inputValue.trim().toLowerCase();
    if (!term) return deudoresAll;
    return deudoresAll.filter(
      (d) =>
        (d.correlativo || "").toLowerCase().includes(term) ||
        (d.nombre || "").toLowerCase().includes(term)
    );
  }, [inputValue, deudoresAll]);

  useEffect(() => {
    setRenderItems(baseItems.slice(0, visibleCount));
  }, [baseItems, visibleCount]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 8) {
      if (visibleCount < baseItems.length) {
        setVisibleCount((c) => Math.min(c + CHUNK_SIZE, baseItems.length));
      }
    }
  };

  const handleClearInput = () => {
    setInputValue("");
  };

  return (
    <Flex justify="start" align="center" w="full">
      <FormControl>
        <HStack spacing={2} w="full" align="center" position="relative">
          <Box position="relative">
            <AutoComplete openOnFocus>
              <AutoCompleteInput
                variant="outline"
                placeholder="Seleccione un deudor"
                value={inputValue}
                onChange={(e) => {
                  setVisibleCount(CHUNK_SIZE);
                  setInputValue(e.target.value);
                }}
                size="sm"
                w={width || { base: "220px", md: "320px" }}
                position="relative"
              />
              <AutoCompleteList
                onScroll={handleScroll}
                position="relative"
                top="100%"
                left="0"
                zIndex="popover"
                bg={listBg}
                borderColor={listBorderColor}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
                minW="260px"
                maxW="calc(100vw - 20px)"
                maxHeight="50vh"
                overflowY="auto"
                overflowX="hidden"
                w="full"
              >
                {renderItems.map((d) => (
                  <AutoCompleteItem
                    key={`deu-${d.id}`}
                    value={`${d.correlativo} - ${d.nombre}`}
                    onClick={() => {
                      onSelect(d.id);
                      setInputValue(`${d.correlativo} - ${d.nombre}`);
                    }}
                    _hover={{ bg: itemHoverBg }}
                    sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                  >
                    <Text fontSize="sm">
                      <b>{d.correlativo}</b> — {d.nombre}
                    </Text>
                  </AutoCompleteItem>
                ))}
              </AutoCompleteList>
            </AutoComplete>
          </Box>
          <IconButton
            aria-label="Limpiar"
            icon={<CloseIcon />}
            size="sm"
            onClick={handleClearInput}
            colorScheme="gray"
            variant="outline"
          />
        </HStack>
      </FormControl>
    </Flex>
  );
};

DeudorSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
  initialValue: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default DeudorSelector;
