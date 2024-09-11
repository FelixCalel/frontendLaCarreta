import { useEffect } from "react";
import { Flex, FormHelperText,  } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

import { tablaDeudores } from "../../../store/Deus/thunks";

//const DeuSuggestions = ({ value, onSelect }) => {
 // const [inputValue, setInputValue] = useState(value || '');  // Maneja el valor del input
 // const [isFocused, setIsFocused] = useState(false);  // Estado para manejar el foco en el input
 // const dispatch = useDispatch();

  // Obtener el estado global desde Redux
  //const { deudores = [], status } = useSelector((state) => state.deudores || { deudores: [], status: 'idle' });

  // Cada vez que el input cambia, ejecutamos la búsqueda
 // const handleInputChange = (e) => {
  //  const value = e.target.value;
  //  setInputValue(value);

  //  if (value.trim() !== '') {
    //  dispatch(buscarDeudores(value));
  //  }
 // };

 
  const DeuSelector = () => {
    
    const dispatch = useDispatch();
    const deus = useSelector((state) => state.deudores);
    
    
  console.log('deudores', deus.deudores.nombre);
    useEffect(() => {
      dispatch(tablaDeudores());
    }, [dispatch]);

    
  
  return (
    <Flex pt="48" justify="center" align="center" w="full">
 
      <AutoComplete openOnFocus>
        <AutoCompleteInput variant="filled" />
        <AutoCompleteList>
          {deus.deudores.map((deu) => (
            <AutoCompleteItem
              key={`option-${deu.id}`}
              value={deu.nombre}
              textTransform="capitalize"
            >
              {deu.nombre}
            </AutoCompleteItem>
          ))}
        </AutoCompleteList>
      </AutoComplete>
      <FormHelperText>Who do you support.</FormHelperText>
   
  </Flex>
  );

  };
//DeuSuggestions.propTypes = {
 // value: PropTypes.string,  // El valor inicial es opcional
 // onSelect: PropTypes.func.isRequired,  // onSelect es obligatorio y debe ser una función
//};

export default DeuSelector;
