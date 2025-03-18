import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Flex, FormControl, HStack, IconButton, FormHelperText } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useSelector } from "react-redux";

const DeuSelector = ({ deudorId, onSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedDeudor, setSelectedDeudor] = useState(null);

  const tiendas = useSelector((state) => state.tiendas?.data || []);

  useEffect(() => {
    if (deudorId && tiendas.length > 0) {
      const tiendaConDeudor = tiendas.find(
        (t) => t.deudorId === deudorId
      );

      if (tiendaConDeudor) {
        const deudorObj = {
          id: tiendaConDeudor.deudorId,
          nombre: tiendaConDeudor.nombreDeu,
          correlativo: tiendaConDeudor.nombreCorrelativo,
        };
        setSelectedDeudor(deudorObj);
        setInputValue(`${deudorObj.correlativo} - ${deudorObj.nombre}`);
      }
    } else {
      setSelectedDeudor(null);
      setInputValue("");
    }
  }, [deudorId, tiendas]);

  const handleSelectDeudor = (deu) => {
    setInputValue(`${deu.correlativo} - ${deu.nombre}`);
    setSelectedDeudor(deu);
    onSelect(deu.id); 
  };

  const handleClearInput = () => {
    setInputValue("");
    setSelectedDeudor(null);
    onSelect(null);
  };

  const filteredDeudores = (() => {
    if (deudorId && selectedDeudor) {
      return [selectedDeudor];
    }
    return [];
  })();

  return (
    <Flex pt="4" justify="start" align="center" w="full" flexDir="column">
      <FormControl>
        <HStack spacing={2} w="100%" maxW="600px" align="center">
          <AutoComplete openOnFocus flex="1">
            <AutoCompleteInput
              variant="outline"
              placeholder="Seleccione un deudor"
              value={inputValue}
              readOnly
              size="lg"
              w="full"
            />
            <AutoCompleteList>
              {filteredDeudores.length > 0 ? (
                filteredDeudores
                  .map((deu) => (
                    <AutoCompleteItem
                      key={`deudor-${deu.id}`}
                      value={`${deu.correlativo} - ${deu.nombre}`}
                      textTransform="capitalize"
                      onClick={() => handleSelectDeudor(deu)}
                    >
                      {`${deu.correlativo} - ${deu.nombre}`}
                    </AutoCompleteItem>
                  ))
              ) : (
                <AutoCompleteItem value="" disabled>
                  Sin deudor asignado
                </AutoCompleteItem>
              )}
            </AutoCompleteList>
          </AutoComplete>
          {selectedDeudor && (
            <IconButton
              aria-label="Limpiar campo"
              icon={<CloseIcon />}
              size="sm"
              onClick={handleClearInput}
              colorScheme="red"
              variant="outline"
            />
          )}
        </HStack>
        <FormHelperText mt="2">
          Seleccione el deudor
        </FormHelperText>
      </FormControl>
    </Flex>
  );
};

DeuSelector.propTypes = {
  deudorId: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
};

export default DeuSelector;
