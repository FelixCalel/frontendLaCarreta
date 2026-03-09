import { useEffect, useMemo, useState, useDeferredValue } from "react";
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
import { tablaItems } from "../../../../store/items/thunks";

const CHUNK_SIZE = 20;

const ProductoSelector = ({ deudorId, onSelect, reset }) => {
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState("");
  const deferredQuery = useDeferredValue(inputValue);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState("");
  const [renderItems, setRenderItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const itemsAll = useSelector((state) => state.items.items);

  const listBg = useColorModeValue("white", "gray.800");
  const listBorderColor = useColorModeValue("gray.200", "gray.600");
  const itemHoverBg = useColorModeValue("gray.100", "gray.600");

  useEffect(() => {
    dispatch(tablaItems({ pageSize: 10000 }));
  }, [dispatch]);

  const sourceItems = useMemo(() => {
    const dId = Number(deudorId) || null;
    if (!dId) return [];

    const list = Array.isArray(itemsAll) ? itemsAll : [];
    return list
      .filter((it) => {
        if (it.deudores && it.deudores.length > 0) {
          return it.deudores.some((d) => d.id === dId);
        }
        const singleDeudorId = it.deuId ?? it.deudor?.id ?? null;
        return singleDeudorId === dId;
      })
      .filter((it) => Boolean(it.estaActivo));
  }, [itemsAll, deudorId]);

  useEffect(() => {
    if (sourceItems.length > 0) {
      setVisibleItems(sourceItems.slice(0, CHUNK_SIZE));
    } else {
      setVisibleItems([]);
    }
  }, [sourceItems]);

  useEffect(() => {
    setInputValue("");
    setSelectedItem(null);
    setError("");
  }, [reset, deudorId]);

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  useEffect(() => {
    const term = normalizeText(deferredQuery.trim());
    if (term === "") {
      setRenderItems(visibleItems);
      return;
    }
    const matches = sourceItems.filter(
      (it) =>
        normalizeText(it.nombre).includes(term) ||
        normalizeText(it.codigo).includes(term),
    );
    setRenderItems(matches.slice(0, 200));
  }, [deferredQuery, sourceItems, visibleItems]);

  const handleSelectItem = (item) => {
    setInputValue(item.nombre);
    setSelectedItem(item);
    onSelect(item.id, item.nombre, item.cantidadDisponible, item.codigo);

    setError(item.cantidadDisponible === 0 ? "Cantidad disponible: 0" : "");
  };

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleClearInput = () => {
    setInputValue("");
    setSelectedItem(null);
    setError("");
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMoreItems();
    }
  };

  const loadMoreItems = () => {
    if (visibleItems.length < sourceItems.length) {
      const newLength = Math.min(
        visibleItems.length + CHUNK_SIZE,
        sourceItems.length,
      );
      setVisibleItems(sourceItems.slice(0, newLength));
    }
  };

  const disabled = !deudorId;
  const isMobile = window.innerWidth <= 768;

  return (
    <Flex
      pt="2"
      justify="start"
      align="center"
      w="auto"
      maxW={isMobile ? "100%" : "300px"}
      flexDir="column"
    >
      <FormControl w="100%">
        <HStack spacing={2} w="100%" align="center" position="relative">
          <Box
            position="relative"
            w={isMobile ? "260px" : "300px"}
            minW={isMobile ? "220px" : "300px"}
            maxW={isMobile ? "100%" : "300px"}
          >
            <AutoComplete openOnFocus filter={() => true}>
              <AutoCompleteInput
                variant="outline"
                placeholder={
                  disabled
                    ? "Seleccione un deudor primero"
                    : "Seleccione un item"
                }
                value={inputValue}
                onChange={handleInputChange}
                size={isMobile ? "md" : "lg"}
                w={isMobile ? "260px" : "300px"}
                fontSize={isMobile ? "1.1rem" : "1.15rem"}
                height={isMobile ? "44px" : "48px"}
                position="relative"
                isDisabled={disabled}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                translate="no"
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
                minW={isMobile ? "220px" : "300px"}
                maxW={isMobile ? "100%" : "300px"}
                maxHeight="50vh"
                overflowY="auto"
                overflowX="hidden"
                w={isMobile ? "260px" : "300px"}
              >
                {renderItems.length === 0 ? (
                  <Box px={3} py={2}>
                    <Text fontSize="sm" color="gray.500">
                      {disabled
                        ? "Seleccione un deudor para ver sus items."
                        : "Sin resultados para este deudor."}
                    </Text>
                  </Box>
                ) : (
                  renderItems.map((item) => (
                    <AutoCompleteItem
                      key={`option-${item.id}`}
                      value={`${item.codigo} - ${item.nombre}`}
                      textTransform="capitalize"
                      onClick={() => handleSelectItem(item)}
                      _hover={{ bg: itemHoverBg }}
                      sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                    >
                      <Text fontSize="sm">{item.nombre}</Text>
                    </AutoCompleteItem>
                  ))
                )}
              </AutoCompleteList>
            </AutoComplete>
          </Box>
          <IconButton
            aria-label="Limpiar campo"
            icon={<CloseIcon />}
            size={isMobile ? "md" : "sm"}
            onClick={handleClearInput}
            colorScheme="red"
            variant="outline"
            isDisabled={disabled}
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

ProductoSelector.propTypes = {
  deudorId: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  reset: PropTypes.bool.isRequired,
};

export default ProductoSelector;
