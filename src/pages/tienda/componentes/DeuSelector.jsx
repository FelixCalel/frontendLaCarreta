import { useEffect } from "react";
import { Flex, FormHelperText } from "@chakra-ui/react";
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
    <Flex pt="4" justify="start" align="center" w="full" flexDir="column">
      <AutoComplete openOnFocus>
        <AutoCompleteInput variant="outline" placeholder="Seleccione un deudor" />
        <AutoCompleteList>
          {deus.deudores.map((deu) => (
            <AutoCompleteItem
              key={`option-${deu.id}`}
              value={`${deu.nombre} - ${deu.correlativo}`}
              textTransform="capitalize"
            >
              {`${deu.nombre} - ${deu.correlativo}`}
            </AutoCompleteItem>
          ))}
        </AutoCompleteList>
      </AutoComplete>
      <FormHelperText mt="2">Seleccione el deudor para esta tienda</FormHelperText>
    </Flex>
  );
};

export default DeuSelector;
