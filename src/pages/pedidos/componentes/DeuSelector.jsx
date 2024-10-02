import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Flex, FormControl, FormHelperText } from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useSelector } from "react-redux";

const DeuSelector = ({ ciudadId, onSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredDeudores, setFilteredDeudores] = useState([]);

  // Obtener tiendas del estado (los deudores están asociados a las tiendas)
  const tiendas = useSelector((state) => state.tiendas?.data || []);

  // Filtrar deudores cuando cambia la ciudad seleccionada
  useEffect(() => {
    if (ciudadId) {
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
    setInputValue(`${deu.correlativo} - ${deu.nombre}`); // Actualizar el valor del input con el deudor seleccionado
    onSelect(deu.id); // Llamar a la función onSelect con el id del deudor seleccionado
  };

  return (
    <Flex pt="4" justify="start" align="center" w="full" flexDir="column">
      <FormControl>
        <AutoComplete openOnFocus>
          <AutoCompleteInput
            variant="outline"
            placeholder="Seleccione un deudor"
            value={inputValue}
            onChange={handleInputChange}
          />
          <AutoCompleteList>
            {filteredDeudores
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
              ))}
          </AutoCompleteList>
        </AutoComplete>
        <FormHelperText mt="2">Seleccione el deudor de la ciudad</FormHelperText>
      </FormControl>
    </Flex>
  );
};

DeuSelector.propTypes = {
  ciudadId: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default DeuSelector;
