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
 
 const DeuSelector = () => {
  const dispatch = useDispatch();
  const deus = useSelector((state) => state.deudores);

  useEffect(() => {
    dispatch(tablaDeudores());
  }, [dispatch]);

  return (
    <Flex pt="4" justify="start" align="center" w="full" flexDir="column"> {/* Cambié justify a 'start' y reduje padding top */}
      <AutoComplete openOnFocus>
        <AutoCompleteInput variant="outline" placeholder="Seleccione un deudor" /> {/* Agregué un placeholder */}
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
      <FormHelperText mt="2">Seleccione el deudor para esta tienda</FormHelperText> {/* Cambié el texto para que sea más claro */}
    </Flex>
  );
};



export default DeuSelector;
