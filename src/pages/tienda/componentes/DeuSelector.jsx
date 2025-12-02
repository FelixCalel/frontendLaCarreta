import { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Flex,
  FormHelperText,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Box,
  Text,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { tablaDeudores } from "../../../store/Deus/thunks";

const CHUNK_SIZE = 20;

const DeuSelector = ({ onSelect, selectedDeudorId }) => {
  const dispatch = useDispatch();
  const { deudores } = useSelector((state) => state.deudores);
  const { status } = useSelector((state) => state.auth);
  
  const [inputValue, setInputValue] = useState("");
  const [renderItems, setRenderItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  const listBg = useColorModeValue("white", "gray.800");
  const listBorderColor = useColorModeValue("gray.200", "gray.600");
  const itemHoverBg = useColorModeValue("gray.100", "gray.600");

  useEffect(() => {
    if (status === "authenticated" && deudores.length === 0) {
      dispatch(tablaDeudores());
    }
  }, [dispatch, status, deudores.length]);

  const sourceItems = useMemo(() => {
    return deudores || [];
  }, [deudores]);

  useEffect(() => {
    if (selectedDeudorId && sourceItems.length > 0) {
      const selectedDeudor = sourceItems.find((d) => d.id === selectedDeudorId);
      if (selectedDeudor) {
        setInputValue(
          `${selectedDeudor.correlativo} - ${selectedDeudor.nombre}`
        );
      }
    }
  }, [selectedDeudorId, sourceItems]);

  useEffect(() => {
    if (sourceItems.length > 0) {
      setVisibleItems(sourceItems.slice(0, CHUNK_SIZE));
    } else {
      setVisibleItems([]);
    }
  }, [sourceItems]);

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  useEffect(() => {
    const term = normalizeText(inputValue.trim());
    if (term === "") {
      setRenderItems(visibleItems);
      return;
    }

    const matches = sourceItems.filter((deu) => {
        const searchText = `${deu.correlativo} - ${deu.nombre}`;
        return normalizeText(searchText).includes(term);
    });
    setRenderItems(matches.slice(0, 200));
  }, [inputValue, sourceItems, visibleItems]);


  const handleSelectDeudor = (deudor) => {
    setInputValue(`${deudor.correlativo} - ${deudor.nombre}`);
    setShowOptions(false);
    onSelect({
      id: deudor.id,
      correlativo: deudor.correlativo,
      nombre: deudor.nombre,
    });
  };

  const handleClearDeudor = (e) => {
    e.stopPropagation();
    setInputValue("");
    setShowOptions(true);
    onSelect({
      id: null,
      correlativo: null,
      nombre: null,
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowOptions(true);
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
        sourceItems.length
      );
      setVisibleItems(sourceItems.slice(0, newLength));
    }
  };

  return (
    <Flex pt="4" justify="start" align="center" w="full" flexDir="column">
      <AutoComplete
        openOnFocus
        isOpen={showOptions}
        onClose={() => setShowOptions(false)}
      >
        <InputGroup>
          <AutoCompleteInput
            variant="outline"
            placeholder="Seleccione un deudor"
            value={inputValue}
            onChange={handleInputChange}
            onClick={() => setShowOptions(true)}
            onFocus={() => setShowOptions(true)}
          />
          {inputValue && (
            <InputRightElement>
              <IconButton
                size="sm"
                icon={<CloseIcon />}
                onClick={handleClearDeudor}
                aria-label="Limpiar selección"
              />
            </InputRightElement>
          )}
        </InputGroup>
        <AutoCompleteList
            onScroll={handleScroll}
            maxHeight="200px"
            overflowY="auto"
            bg={listBg}
            borderColor={listBorderColor}
        >
          {renderItems.length > 0 ? (
            renderItems.map((deu) => (
              <AutoCompleteItem
                key={`option-${deu.id}`}
                value={`${deu.correlativo} - ${deu.nombre}`}
                onClick={() => handleSelectDeudor(deu)}
                _hover={{ bg: itemHoverBg }}
              >
                {`${deu.correlativo} - ${deu.nombre}`}
              </AutoCompleteItem>
            ))
          ) : (
            <Box p={2}>
                <Text fontSize="sm" color="gray.500">
                    {inputValue
                        ? "No se encontraron deudores"
                        : "No hay deudores disponibles"}
                </Text>
            </Box>
          )}
        </AutoCompleteList>
      </AutoComplete>
      <FormHelperText mt="2">
        {deudores.length > 0
          ? "Seleccione el deudor para esta tienda"
          : "Cargando deudores..."}
      </FormHelperText>
    </Flex>
  );
};

DeuSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selectedDeudorId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default DeuSelector;
