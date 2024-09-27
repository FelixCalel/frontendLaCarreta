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

const DeuSelector = ({ tiendaId, onSelect }) => {
  const [inputValue, setInputValue] = useState(""); // Estado para controlar el valor del input
  const [filteredDeudor, setFilteredDeudor] = useState(null); // Estado para el deudor filtrado por tienda

  // Obtener todas las tiendas del estado de Redux
  const tiendas = useSelector((state) => state.tiendas?.data || []); // Si tiendas es undefined, lo reemplazamos con un array vacío

  useEffect(() => {
    if (tiendaId && tiendas.length > 0) {
      // Encuentra la tienda seleccionada
      const tiendaSeleccionada = tiendas.find((tienda) => tienda.id === tiendaId);

      // Si la tienda tiene un deudor asociado (deudorId) y nombreDeu
      if (tiendaSeleccionada && tiendaSeleccionada.deudorId && tiendaSeleccionada.nombreDeu) {
        setFilteredDeudor({
          id: tiendaSeleccionada.deudorId,
          nombre: tiendaSeleccionada.nombreDeu,
        });
        setInputValue(tiendaSeleccionada.nombreDeu); // Mostrar el nombre del deudor en el input
        onSelect(tiendaSeleccionada.deudorId); // Pasar el deudorId al componente padre
      } else {
        setFilteredDeudor(null); // No hay deudor para esta tienda
        setInputValue(""); // Limpiar el input si no hay deudor
        onSelect(null); // Resetear la selección en el componente padre
      }
    } else {
      setFilteredDeudor(null); // Si no hay tienda seleccionada, limpiar el deudor filtrado
    }
  }, [tiendaId, tiendas, onSelect]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Actualizamos el valor del input cuando el usuario escribe
  };

  const handleClearInput = () => {
    setInputValue(""); // Limpiar el valor del input
    onSelect(null); // Resetea la selección en el componente padre
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
            onBlur={() => {
              if (!inputValue) handleClearInput(); // Limpiamos el input si está vacío cuando se sale del campo
            }}
          />
          <AutoCompleteList>
            {filteredDeudor && (
              <AutoCompleteItem
                key={`option-${filteredDeudor.id}`}
                value={filteredDeudor.nombre}
                textTransform="capitalize"
              >
                {filteredDeudor.nombre}
              </AutoCompleteItem>
            )}
          </AutoCompleteList>
        </AutoComplete>
        <FormHelperText mt="2">El deudor está relacionado con la tienda seleccionada</FormHelperText>
      </FormControl>
    </Flex>
  );
};

// Validación de PropTypes
DeuSelector.propTypes = {
  tiendaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSelect: PropTypes.func.isRequired, // Función para manejar la selección del deudor
};

export default DeuSelector;
