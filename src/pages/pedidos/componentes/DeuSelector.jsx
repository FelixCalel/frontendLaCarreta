import { useEffect } from "react";
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

  useEffect(() => {
    dispatch(tablaDeudores()); // Despachamos la acción para obtener los deudores
  }, [dispatch]);

  const handleSelectDeudor = (deudor) => {
    onSelect(deudor.id); // Pasar el id del deudor seleccionado al componente padre
  };

  return (
    <Flex pt="4" justify="start" align="center" w="full" flexDir="column">
      <FormControl>
        <AutoComplete openOnFocus>
          <AutoCompleteInput variant="outline" placeholder="Seleccione un deudor" />
          <AutoCompleteList>
            {deus.map((deu) => (
              <AutoCompleteItem
                key={`option-${deu.id}`}
                value={`${deu.correlativo} - ${deu.nombre}`}
                textTransform="capitalize"
                onClick={() => handleSelectDeudor(deu)}
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
