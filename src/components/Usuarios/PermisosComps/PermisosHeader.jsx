import { Flex, HStack, Text, Select } from "@chakra-ui/react";
import iconCatalog from "../../Iconos/IconCatalog";

export const PermisosHeader = ({
  modulosTabla,
  selectedModulo,
  onModuloChange,
  selectedOpcion,
  onOpcionChange,
  opciones,
  asignacionMO,
  textColor,
  selectBg,
  selectBorderBg,
  optBg,
  optColor,
  optionBgColor,
  optionTextColor,
}) => {
  const getArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  };

  const modulosUnicos = Array.from(
    new Map(
      getArray(modulosTabla).map((modulo) => [Number(modulo.id), modulo]),
    ).values(),
  );

  const opcionesPermitidas = getArray(opciones).filter((opcion) =>
    getArray(asignacionMO).some(
      (a) =>
        Number(a.modulo_id) === Number(selectedModulo) &&
        Number(a.opcion_id) === Number(opcion.id),
    ),
  );

  const opcionesUnicas = Array.from(
    new Map(
      opcionesPermitidas.map((opcion) => [Number(opcion.id), opcion]),
    ).values(),
  );

  return (
    <HStack spacing={8} align="center" justify="center" w="100%" mb={6}>
      <Flex align="center" justify="center" w="50%">
        <Text fontWeight="bold" color={textColor} mr={2}>
          Módulo:
        </Text>
        <Select
          placeholder="Selecciona un módulo"
          value={selectedModulo || ""}
          onChange={(e) => onModuloChange(e.target.value)}
          bg={selectBg}
          borderColor={selectBorderBg}
          color={textColor}
          borderRadius="md"
          w="450px"
          _hover={{ borderColor: "#512da8" }}
          _focus={{ borderColor: "#311b92", boxShadow: "0 0 5px #673ab7" }}
        >
          {modulosUnicos
            .slice()
            .sort((a, b) => a.nombre.localeCompare(b.nombre))
            .map((modulo) => (
              <option
                key={modulo.id}
                value={modulo.id}
                style={{ backgroundColor: optBg, color: optColor }}
              >
                {modulo.nombre}
              </option>
            ))}
        </Select>
      </Flex>

      <Flex align="center" justify="center" w="50%">
        <Text fontWeight="bold" color={textColor} mr={2}>
          Opción:
        </Text>
        <Select
          placeholder="Selecciona una opción"
          value={selectedOpcion || ""}
          onChange={(e) => onOpcionChange(e.target.value)}
          bg={selectBg}
          border="1px solid"
          borderColor={selectBorderBg}
          color={textColor}
          borderRadius="md"
          w="450px"
          fontWeight="bold"
          transition="all 0.2s ease-in-out"
          _hover={{ borderColor: "#512da8" }}
          _focus={{ borderColor: "#311b92", boxShadow: "0 0 5px #673ab7" }}
          isDisabled={!selectedModulo}
        >
          {opcionesUnicas
            .sort((a, b) => a.nombre.localeCompare(b.nombre))
            .map((opcion) => (
              <option
                key={opcion.id}
                value={opcion.id}
                style={{
                  backgroundColor: optionBgColor,
                  color: optionTextColor,
                }}
              >
                {opcion.nombre}
              </option>
            ))}
        </Select>
      </Flex>
    </HStack>
  );
};
