import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Flex, FormControl, FormHelperText, HStack, IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useSelector } from "react-redux";

const DeuSelector = ({ ciudadId, onSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedDeudor, setSelectedDeudor] = useState(null); // Estado para manejar el deudor seleccionado
  const [filteredDeudores, setFilteredDeudores] = useState([]);

  // Obtener tiendas del estado (los deudores están asociados a las tiendas)
  const tiendas = useSelector((state) => state.tiendas?.data || []);

  // Filtrar deudores cuando cambia la ciudad seleccionada
  useEffect(() => {
    if (ciudadId && tiendas.length > 0) {
      const deudoresFiltrados = tiendas
        .filter((tienda) => tienda.ciudadId === ciudadId) // Filtrar tiendas por ciudad
        .map((tienda) => ({
          id: tienda.deudorId,
          nombre: tienda.nombreDeu,
          correlativo: tienda.nombreCorrelativo,
        }))
        .filter(
          (deudor, index, self) =>
            deudor.id && self.findIndex((d) => d.id === deudor.id) === index // Evitar duplicados
        );
      setFilteredDeudores(deudoresFiltrados);
    } else {
      setFilteredDeudores([]);
    }
  }, [ciudadId, tiendas]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

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

  return (
    <Flex pt="4" justify="start" align="center" w="full" flexDir="column">
      <FormControl>
        <HStack spacing={2} w="100%" maxW="600px" align="center">
          <AutoComplete openOnFocus flex="1">
            <AutoCompleteInput
              variant="outline"
              placeholder="Seleccione un deudor"
              value={inputValue}
              onChange={handleInputChange}
              size="lg"
              w="full"
            />
            <AutoCompleteList>
              {filteredDeudores.length > 0 ? (
                filteredDeudores
                  .filter((deu) =>
                    `${deu.correlativo} - ${deu.nombre}`
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  )
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
                  Selecciona primero una tienda
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
        <FormHelperText mt="2">Seleccione el deudor</FormHelperText>
      </FormControl>
    </Flex>
  );
};

DeuSelector.propTypes = {
  ciudadId: PropTypes.number.isRequired, 
  onSelect: PropTypes.func.isRequired,
};

export default DeuSelector;
