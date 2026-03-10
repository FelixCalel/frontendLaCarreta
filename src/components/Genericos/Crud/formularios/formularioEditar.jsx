import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  FormLabel,
  Box,
  Switch,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import iconCatalog from "../../../Iconos/IconCatalog";

export const FormularioNuevoEditar = ({
  formData,
  onSubmit,
  onClose,
  metadata,
}) => {
  const [formValues, setFormValues] = useState({});
  const [showIconCatalog, setShowIconCatalog] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [isIconFieldPresent, setIsIconFieldPresent] = useState(false); // Nuevo estado para controlar la visibilidad del campo de íconos

  useEffect(() => {
    if (formData) {
      setFormValues({
        ...formData,
        estado:
          formData.estado === "Activo" || formData.estado === true
            ? true
            : false, // Acepta "Activo" o un valor booleano
      });
      setSelectedIcon(formData.icono || "");
    }
  }, [formData]);

  // Revisa si el campo "icono" está presente en la metadata
  useEffect(() => {
    if (metadata && metadata.some((campo) => campo.name === "icono")) {
      setIsIconFieldPresent(true);
    } else {
      setIsIconFieldPresent(false);
    }
  }, [metadata]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSwitchChange = (e) => {
    const { checked } = e.target;
    setFormValues({
      ...formValues,
      estado: checked, // Actualiza con el valor booleano
    });
  };

  const handleIconSelect = (iconName) => {
    setSelectedIcon(iconName);
    setFormValues({
      ...formValues,
      icono: iconName,
    });
    setShowIconCatalog(false);
  };

  const handleSubmit = () => {
    const updatedValues = {
      ...formValues,
      estado: !!formValues.estado, // Asegura que sea booleano
    };
    console.log("Valores enviados:", updatedValues); // Agrega este log para verificar los datos
    onSubmit(updatedValues);
  };

  return (
    <Box>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        {Array.isArray(metadata) &&
          metadata.map((campo) => {
            if (campo.name === "estado") {
              return (
                <GridItem key={campo.name}>
                  <FormLabel htmlFor="estado">Estado</FormLabel>
                  <Switch
                    id="estado"
                    name="estado"
                    isChecked={formValues.estado === true}
                    onChange={handleSwitchChange}
                    colorScheme="green"
                  />
                </GridItem>
              );
            } else if (campo.name !== "icono") {
              return (
                <GridItem key={campo.name}>
                  <FormLabel htmlFor={campo.name}>
                    {campo.label || campo.name}
                  </FormLabel>
                  <Input
                    name={campo.name}
                    value={formValues[campo.name] || ""}
                    onChange={handleInputChange}
                    type={campo.type || "text"}
                    placeholder={`Introduce ${campo.label || campo.name}`}
                  />
                </GridItem>
              );
            }
            return null;
          })}

        {/* Solo mostrar el campo de íconos si la metadata contiene el campo "icono" */}
        {isIconFieldPresent && (
          <GridItem colSpan={1}>
            <FormLabel htmlFor="icono">Ícono</FormLabel>
            <Button
              colorScheme="blue"
              onClick={() => setShowIconCatalog(!showIconCatalog)}
            >
              {showIconCatalog ? (
                "Ocultar Íconos"
              ) : selectedIcon ? (
                <Box as={iconCatalog[selectedIcon]} w={6} h={6} />
              ) : (
                "Seleccionar Ícono"
              )}
            </Button>
          </GridItem>
        )}
      </Grid>

      {showIconCatalog && (
        <Grid templateColumns="repeat(6, 1fr)" gap={4} mt={4}>
          {Object.keys(iconCatalog).map((iconName) => (
            <Box
              key={iconName}
              as={iconCatalog[iconName]}
              w={10}
              h={10}
              onClick={() => handleIconSelect(iconName)}
              cursor="pointer"
              border={
                selectedIcon === iconName ? "2px solid blue" : "1px solid gray"
              }
              borderRadius="md"
              p={2}
              _hover={{ bg: "gray.100" }}
              transition="0.3s"
            />
          ))}
        </Grid>
      )}

      <Box mt={6}>
        <Button
          colorScheme="teal"
          variant="outline"
          size="md"
          borderRadius="full"
          onClick={handleSubmit}
        >
          Guardar Cambios
        </Button>
        <Button
          ml={4}
          colorScheme="teal"
          variant="outline"
          size="md"
          borderRadius="full"
          onClick={onClose}
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};
