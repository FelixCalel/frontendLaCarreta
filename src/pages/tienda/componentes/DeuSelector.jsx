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

const DeuSelector = ({ ciudadId, onSelect }) => {
  const dispatch = useDispatch();
  const { deudores } = useSelector((state) => state.deudores);

  useEffect(() => {
    // Cargar todos los deudores al iniciar
    dispatch(tablaDeudores());
  }, [dispatch]);

  const handleSelectDeudor = (deudor) => {
    onSelect({
      id: deudor.id,
      correlativo: deudor.correlativo, // Pasar correlativo
      nombre: deudor.nombre, // Pasar nombre
    });
  };

  // Filtrar los deudores si hay ciudadId
  const deudoresFiltrados = ciudadId
    ? deudores.filter((deu) => deu.ciudadId === parseInt(ciudadId, 10))
    : deudores;

  return (
    <Flex pt="4" justify="start" align="center" w="full" flexDir="column">
      <AutoComplete openOnFocus>
        <AutoCompleteInput variant="outline" placeholder="Seleccione un deudor" />
        <AutoCompleteList>
          {deudoresFiltrados.length > 0 ? (
            deudoresFiltrados.map((deu) => (
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
        {deudoresFiltrados.length > 0
          ? "Seleccione el deudor para esta tienda"
          : "No hay deudores disponibles"}
      </FormHelperText>
    </Flex>
  );
};

// Validación de PropTypes
DeuSelector.propTypes = {
  ciudadId: PropTypes.string, // Opcional para que no dependa siempre de `ciudadId`
  onSelect: PropTypes.func.isRequired, // La función onSelect es requerida
};

export default DeuSelector;
