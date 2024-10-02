import { useEffect } from "react";
import PropTypes from "prop-types"; // Importar PropTypes para la validación de props
import { Flex, FormHelperText } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

import { tablaDeudores } from "../../../store/Deus/thunks";

const DeuSelector = ({ onSelect }) => {
  const dispatch = useDispatch();
  const deus = useSelector((state) => state.deudores);

  useEffect(() => {
    dispatch(tablaDeudores());
  }, [dispatch]);

  const handleSelectDeudor = (deudor) => {
    onSelect({
      id: deudor.id,
      correlativo: deudor.correlativo, // Pasar correlativo
      nombre: deudor.nombre, // Pasar nombre
    });
  };  

  return (
    <Flex pt="4" justify="start" align="center" w="full" flexDir="column">
      <AutoComplete openOnFocus>
        <AutoCompleteInput variant="outline" placeholder="Seleccione un deudor" />
        <AutoCompleteList>
          {deus.deudores.map((deu) => (
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
      <FormHelperText mt="2">Seleccione el deudor para esta tienda</FormHelperText>
    </Flex>
  );
};

// Validación de PropTypes
DeuSelector.propTypes = {
  onSelect: PropTypes.func.isRequired, 
};

export default DeuSelector;
