import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  Flex,
  FormHelperText,
  InputGroup,
  InputRightElement,
  IconButton,
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

const DeuSelector = ({ onSelect, selectedDeudorId }) => {
  const dispatch = useDispatch();
  const { deudores } = useSelector((state) => state.deudores);
  const [inputValue, setInputValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    dispatch(tablaDeudores());
  }, [dispatch]);

  useEffect(() => {
    if (selectedDeudorId && deudores.length > 0) {
      const selectedDeudor = deudores.find((d) => d.id === selectedDeudorId);
      if (selectedDeudor) {
        setInputValue(
          `${selectedDeudor.correlativo} - ${selectedDeudor.nombre}`
        );
      }
    }
  }, [selectedDeudorId, deudores]);

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
    if (autoCompleteRef.current) {
      autoCompleteRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowOptions(true);
  };

  const filteredDeudores = deudores.filter((deu) => {
    const searchText = `${deu.correlativo} - ${deu.nombre}`.toLowerCase();
    const inputSearch = inputValue.toLowerCase();
    return !inputValue || searchText.includes(inputSearch);
  });

  return (
    <Flex pt="4" justify="start" align="center" w="full" flexDir="column">
      <AutoComplete
        openOnFocus
        isOpen={showOptions}
        onClose={() => setShowOptions(false)}
      >
        <InputGroup>
          <AutoCompleteInput
            ref={autoCompleteRef}
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
        <AutoCompleteList>
          {filteredDeudores.length > 0 ? (
            filteredDeudores.map((deu) => (
              <AutoCompleteItem
                key={`option-${deu.id}`}
                value={`${deu.correlativo} - ${deu.nombre}`}
                onClick={() => handleSelectDeudor(deu)}
              >
                {`${deu.correlativo} - ${deu.nombre}`}
              </AutoCompleteItem>
            ))
          ) : (
            <AutoCompleteItem key="no-results" value="" isDisabled>
              {inputValue
                ? "No se encontraron deudores"
                : "No hay deudores disponibles"}
            </AutoCompleteItem>
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
  //ciudadId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  selectedDeudorId: PropTypes.string,
};

export default DeuSelector;
