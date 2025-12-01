import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Flex,
  FormControl,
  Box,
  Text,
  IconButton,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { tablaItems } from "../../store/items/thunks";

const CHUNK_SIZE = 20;

const ItemSelector = ({ onSelect, reset }) => {
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState("");
  const [renderItems, setRenderItems] = useState([]);
  const itemsAll = useSelector((state) => state.items.items);
  const [visibleItems, setVisibleItems] = useState([]);
  const listBg = useColorModeValue("white", "gray.800");
  const listBorderColor = useColorModeValue("gray.200", "gray.600");
  const itemHoverBg = useColorModeValue("gray.100", "gray.600");

  useEffect(() => {
    dispatch(tablaItems());
  }, [dispatch]);

  useEffect(() => {
    if (itemsAll.length > 0) {
      const firstChunk = itemsAll.slice(0, CHUNK_SIZE);
      setVisibleItems(firstChunk);
    } else {
      setVisibleItems([]);
    }
  }, [itemsAll]);

  const handleSelectItem = (item) => {
    setInputValue(item.nombre);
    setSelectedItem(item);
    onSelect(item.id, item.nombre, item.cantidadDisponible, item.codigo);

    if (item.cantidadDisponible === 0) {
      setError("Cantidad disponible: 0");
    } else {
      setError("");
    }
  };

  useEffect(() => {
    const term = inputValue.trim().toLowerCase();

    if (term === "") {
      setRenderItems(visibleItems);
      return;
    }

    const matches = itemsAll.filter(
      (it) =>
        it.nombre.toLowerCase().includes(term) ||
        it.codigo.toLowerCase().includes(term)
    );

    setRenderItems(matches.slice(0, 200));
  }, [inputValue, itemsAll, visibleItems]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClearInput = () => {
    setInputValue("");
    setSelectedItem(null);
    setError("");
  };

  useEffect(() => {
    if (reset) {
      handleClearInput();
    }
  }, [reset]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMoreItems();
    }
  };

  const loadMoreItems = () => {
    if (visibleItems.length < itemsAll.length) {
      const newLength = Math.min(
        visibleItems.length + CHUNK_SIZE,
        itemsAll.length
      );
      const moreItems = itemsAll.slice(0, newLength);
      setVisibleItems(moreItems);
    }
  };

  return (
    <Flex pt="2" justify="start" align="center" w="full" flexDir="column">
      <FormControl>
        <HStack spacing={2} w="full" align="center" position="relative">
          <Box position="relative">
            <AutoComplete openOnFocus filter={() => true}>
              <AutoCompleteInput
                variant="outline"
                placeholder="Seleccione un item"
                value={inputValue}
                onChange={handleInputChange}
                size="sm"
                w={{ base: "full", md: "480px" }}
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
                minW="300px"
                maxW="calc(100vw - 20px)"
                maxHeight="50vh"
                overflowY="auto"
                overflowX="hidden"
                w="full"
              >
                {renderItems.map((item) => (
                  <AutoCompleteItem
                    key={`option-${item.id}`}
                    value={`${item.codigo} - ${item.nombre}`}
                    textTransform="capitalize"
                    onClick={() => handleSelectItem(item)}
                    _hover={{ bg: itemHoverBg }}
                    sx={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    <Text fontSize="sm">{item.nombre}</Text>
                  </AutoCompleteItem>
                ))}
              </AutoCompleteList>
            </AutoComplete>
          </Box>
          <IconButton
            aria-label="Limpiar campo"
            icon={<CloseIcon />}
            size="sm"
            onClick={handleClearInput}
            colorScheme="red"
            variant="outline"
          />
        </HStack>
      </FormControl>

      {selectedItem && (
        <FormControl mt="4">
          {error && <Text color="red.500">{error}</Text>}
        </FormControl>
      )}
    </Flex>
  );
};

ItemSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired,
};

export default ItemSelector;
