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

import { tablaDeudores } from "../../../store/Deus/thunks"; // Actualiza tu ruta según tu estructura

const DeuSelector = ({ ciudadId, onSelect }) => {
  const dispatch = useDispatch();
  const { deudores, status } = useSelector((state) => state.deudores);

  useEffect(() => {
    // Si hay una ciudad seleccionada, obtener los deudores vinculados a esa ciudad
    if (ciudadId) {
      dispatch(tablaDeudores({ ciudadId })); // Filtra los deudores por ciudadId
    }
  }, [dispatch, ciudadId]);

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
          {deudores.length > 0 ? (
            deudores.map((deu) => (
              <AutoCompleteItem
                key={`option-${deu.id}`}
                value={`${deu.correlativo} - ${deu.nombre}`}
                textTransform="capitalize"
                onClick={() => handleSelectDeudor(deu)}
              >
                {`${deu.correlativo} - ${deu.nombre}`}
              </AutoCompleteItem>
            ))
          ) : (
            <AutoCompleteItem
              key="no-deudores"
              value="No hay deudores disponibles"
              isDisabled
            >
              No hay deudores disponibles
            </AutoCompleteItem>
          )}
        </AutoCompleteList>
      </AutoComplete>
      <FormHelperText mt="2">
        {deudores.length > 0
          ? "Seleccione el deudor para esta tienda"
          : "No hay deudores vinculados a esta ciudad"}
      </FormHelperText>
    </Flex>
  );
};

// Validación de PropTypes
DeuSelector.propTypes = {
  ciudadId: PropTypes.string.isRequired,  // Verifica que el ID de la ciudad es requerido
  onSelect: PropTypes.func.isRequired,  // La función onSelect es requerida
};

export default DeuSelector;
