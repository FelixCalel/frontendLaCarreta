import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  Flex,
  FormControl,
  Box,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { tablaDeudores } from "../../../store/Deus/thunks";

const CHUNK_SIZE = 20;

const DeuSelector = ({ onSelect, reset }) => {
  const dispatch = useDispatch();
  const allDeudores = useSelector((s) => s.deudores.deudores);
  const { status } = useSelector((state) => state.auth);

  const [inputValue, setInputValue] = useState("");
  const [visible, setVisible] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [show, setShow] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (status === "authenticated") {
      dispatch(tablaDeudores());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (allDeudores.length) {
      setVisible(allDeudores.slice(0, CHUNK_SIZE));
    }
  }, [allDeudores]);

  useEffect(() => {
    const term = inputValue.trim().toLowerCase();
    if (!term) {
      setFiltered(visible);
    } else {
      const matches = allDeudores.filter((d) =>
        `${d.correlativo} - ${d.nombre}`.toLowerCase().includes(term)
      );
      setFiltered(matches.slice(0, 200));
    }
  }, [inputValue, visible, allDeudores]);

  useEffect(() => {
    if (reset) {
      setInputValue("");
      onSelect({ id: null, correlativo: null, nombre: null });
      setShow(true);
    }
  }, [reset, onSelect]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      visible.length < allDeudores.length
    ) {
      const next = Math.min(visible.length + CHUNK_SIZE, allDeudores.length);
      setVisible(allDeudores.slice(0, next));
    }
  };

  const pick = (d) => {
    setInputValue(`${d.correlativo} - ${d.nombre}`);
    setShow(false);
    onSelect({ id: d.id, correlativo: d.correlativo, nombre: d.nombre });
  };
  const clear = (e) => {
    e.stopPropagation();
    setInputValue("");
    setShow(true);
    onSelect({ id: null, correlativo: null, nombre: null });
    ref.current?.focus();
  };

  return (
    <Flex w="full" flexDir="column" align="start">
      <FormControl mb="2">
        <Box position="relative">
          <AutoComplete
            openOnFocus
            isOpen={show}
            onClose={() => setShow(false)}
          >
            <AutoCompleteInput
              ref={ref}
              placeholder="Seleccione un deudor"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShow(true);
              }}
              onFocus={() => setShow(true)}
            />
            {inputValue && (
              <IconButton
                aria-label="Limpiar"
                icon={<CloseIcon />}
                size="sm"
                position="absolute"
                right="4px"
                top="50%"
                transform="translateY(-50%)"
                onClick={clear}
              />
            )}

            <AutoCompleteList
              maxH="50vh"
              overflowY="auto"
              bg={useColorModeValue("white", "gray.800")}
              onScroll={handleScroll}
            >
              {filtered.length > 0 ? (
                filtered.map((d) => (
                  <AutoCompleteItem
                    key={d.id}
                    value={`${d.correlativo} - ${d.nombre}`}
                    onClick={() => pick(d)}
                  >
                    {`${d.correlativo} - ${d.nombre}`}
                  </AutoCompleteItem>
                ))
              ) : (
                <AutoCompleteItem isDisabled>
                  {inputValue
                    ? "No se encontraron deudores"
                    : "Cargando deudores..."}
                </AutoCompleteItem>
              )}
            </AutoCompleteList>
          </AutoComplete>
        </Box>
      </FormControl>
    </Flex>
  );
};

DeuSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
  reset: PropTypes.bool,
};

export default DeuSelector;
