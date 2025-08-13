import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Box,
  HStack,
  VStack,
  Checkbox,
  NumberInput,
  NumberInputField,
  Input,
  Select,
  Textarea,
  Button,
  Spinner,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { useGetMuestreoByIdQuery } from "../../services/controlCalidadAPI";

const defaultState = {
  transporte_inocuidad: false,
  personal_inocuidad: false,
  producto_inocuidad: false,
  temperatura_transporte: false,
  etiquetado: false,
  porcentaje: 0,
  resultado: "",
  brix_promedio: 0,
  temperatura: "-",
  desicion: "PENDIENTE",
};

export default function MuestreoPanel({ selected, onSave, saving }) {
  const muestreoId = selected?.muestreoId;
  const { data, isFetching } = useGetMuestreoByIdQuery(muestreoId, {
    skip: !muestreoId,
  });
  const [form, setForm] = useState(defaultState);

  useEffect(() => {
    if (data) setForm({ ...defaultState, ...data });
    else setForm(defaultState);
  }, [data, muestreoId]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const panelBg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");

  return (
    <Box>
      <HStack justify="space-between" mb={3}></HStack>

      {!selected && (
        <Text opacity={0.7}>Selecciona un producto para muestrear.</Text>
      )}

      {selected && (
        <Box
          border="1px solid"
          borderColor={border}
          rounded="md"
          p={3}
          bg={panelBg}
        >
          {isFetching ? (
            <HStack opacity={0.8}>
              <Spinner size="sm" /> <Text>Cargando…</Text>
            </HStack>
          ) : (
            <VStack align="stretch" spacing={3}>
              <VStack align="stretch" spacing={2}>
                {[
                  ["transporte_inocuidad", "Transporte cumple con inocuidad"],
                  ["personal_inocuidad", "Personal cumple con inocuidad"],
                  ["producto_inocuidad", "Producto cumple con inocuidad"],
                  ["temperatura_transporte", "Temperatura de transporte"],
                  ["etiquetado", "Etiquetado"],
                ].map(([key, label]) => (
                  <Checkbox
                    key={key}
                    isChecked={!!form[key]}
                    onChange={(e) => set(key, e.target.checked)}
                  >
                    {label}
                  </Checkbox>
                ))}
              </VStack>

              <HStack spacing={3}>
                <Box flex="1">
                  <Text fontSize="xs" opacity={0.7} mb={1}>
                    %
                  </Text>
                  <NumberInput
                    value={form.porcentaje}
                    onChange={(_, n) =>
                      set("porcentaje", Number.isNaN(n) ? 0 : n)
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                </Box>
                <Box flex="1">
                  <Text fontSize="xs" opacity={0.7} mb={1}>
                    Brix Promedio
                  </Text>
                  <NumberInput
                    value={form.brix_promedio}
                    onChange={(_, n) =>
                      set("brix_promedio", Number.isNaN(n) ? 0 : n)
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                </Box>
              </HStack>

              <HStack spacing={3}>
                <Box flex="1">
                  <Text fontSize="xs" opacity={0.7} mb={1}>
                    Temperatura
                  </Text>
                  <Input
                    value={form.temperatura}
                    onChange={(e) => set("temperatura", e.target.value)}
                  />
                </Box>
                <Box flex="1">
                  <Text fontSize="xs" opacity={0.7} mb={1}>
                    Decisión
                  </Text>
                  <Select
                    value={form.desicion}
                    onChange={(e) => set("desicion", e.target.value)}
                  >
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="APROBADO">APROBADO</option>
                    <option value="RECHAZADO">RECHAZADO</option>
                  </Select>
                </Box>
              </HStack>

              <Box>
                <Text fontSize="xs" opacity={0.7} mb={1}>
                  Resultado
                </Text>
                <Textarea
                  minH="80px"
                  value={form.resultado}
                  onChange={(e) => set("resultado", e.target.value)}
                />
              </Box>

              <Button
                isDisabled={!selected}
                isLoading={saving}
                colorScheme="green"
                onClick={() => onSave(muestreoId, form)}
              >
                Guardar Muestreo
              </Button>
            </VStack>
          )}
        </Box>
      )}
    </Box>
  );
}

MuestreoPanel.propTypes = {
  selected: PropTypes.shape({
    qaId: PropTypes.number,
    muestreoId: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};
