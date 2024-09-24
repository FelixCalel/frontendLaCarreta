import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Importar PropTypes para la validación de props
import { Flex, FormControl, FormHelperText } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { tablaDeudores } from "../../../store/Deus/thunks"; // Importa el thunk correcto para obtener los deudores

const DeuSelector = ({ onSelect }) => {
  const dispatch = useDispatch();
  const deus = useSelector((state) => state.deudores.deudores); // Accedemos a los deudores del estado
  const [inputValue, setInputValue] = useState(""); // Estado para controlar el valor del input

  useEffect(() => {
    dispatch(tablaDeudores()); // Despachamos la acción para obtener los deudores
  }, [dispatch]);

  const handleSelectDeudor = (deudor) => {
    setInputValue(`${deudor.correlativo} - ${deudor.nombre}`); // Actualizamos el input con el nombre del deudor seleccionado
    onSelect(deudor.id); // Pasamos el id del deudor seleccionado al componente padre
  };

  // Función para manejar cambios en el input manualmente
  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Actualizamos el valor del input cuando el usuario escribe
  };

  // Función para limpiar el input cuando el usuario borra manualmente
  const handleClearInput = () => {
    setInputValue(""); // Limpia el valor del input
    onSelect(null); // Resetea la selección en el componente padre
  };

  return (
    <Flex pt="4" justify="start" align="center" w="full" flexDir="column">
      <FormControl>
        <AutoComplete openOnFocus>
          <AutoCompleteInput
            variant="outline"
            placeholder="Seleccione un deudor"
            value={inputValue} // Controlamos el valor del input
            onChange={handleInputChange} // Manejamos cambios en el input
            onBlur={() => {
              if (!inputValue) handleClearInput(); // Limpiamos el input si está vacío cuando se sale del campo
            }}
          />
          <AutoCompleteList>
            {deus.map((deu) => (
              <AutoCompleteItem
                key={`option-${deu.id}`}
                value={`${deu.correlativo} - ${deu.nombre}`}
                textTransform="capitalize"
                onClick={() => handleSelectDeudor(deu)} // Selecciona el deudor
              >
                {`${deu.correlativo} - ${deu.nombre}`}
              </AutoCompleteItem>
            ))}
          </AutoCompleteList>
        </AutoComplete>
        <FormHelperText mt="2">Seleccione el deudor para el pedido</FormHelperText>
      </FormControl>
    </Flex>
  );
};

// Validación de PropTypes
DeuSelector.propTypes = {
  onSelect: PropTypes.func.isRequired, 
};

export default DeuSelector;
