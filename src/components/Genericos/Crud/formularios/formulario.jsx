import { FormControl, FormLabel, Grid, GridItem, Input, Switch, Button, Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import iconCatalog from '../../../Iconos/IconCatalog'; // Asegúrate de que la ruta es correcta

export const Formulario = ({ formData = {}, metadata, onClose, onSubmit }) => {
    const [formDataState, setFormDataState] = useState(formData); // Si no hay datos, iniciamos con objeto vacío
    const [showIconCatalog, setShowIconCatalog] = useState(false); // Estado para el catálogo de íconos
    const [selectedIcon, setSelectedIcon] = useState(''); // Estado del ícono seleccionado

    // Manejar el cambio en los inputs
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormDataState({ ...formDataState, [id]: value });
    };

    // Manejar el cambio del switch (booleano)
    const handleSwitchChange = (e) => {
        const { id, checked } = e.target;
        setFormDataState({ ...formDataState, [id]: checked });
    };

    // Manejar la selección del ícono
    const handleIconSelect = (iconName) => {
        setSelectedIcon(iconName);
        setFormDataState({ ...formDataState, icono: iconName }); // Guardar el ícono seleccionado en el formData
        setShowIconCatalog(false);  // Ocultar el catálogo después de seleccionar
    };

    // Manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formDataState);  // Pasar los datos del formulario a la función onSubmit proporcionada
    };

    return (
        <FormControl as="form" onSubmit={handleSubmit}>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                {/* Renderizar dinámicamente los campos basados en los metadatos */}
                {Array.isArray(metadata) && metadata.map((campo, index) => {
                    if (campo.name === "estado") {
                        // Switch para campos booleanos
                        return (
                            <GridItem key={index}>
                                <FormLabel htmlFor={campo.name}>{campo.label || campo.name}</FormLabel>
                                <Switch
                                    id={campo.name}
                                    isChecked={formDataState[campo.name] || false}
                                    onChange={handleSwitchChange}
                                    colorScheme="green"
                                />
                            </GridItem>
                        );
                    } else if (campo.name !== "icono") {
                        // Input para los campos de texto
                        return (
                            <GridItem key={index}>
                                <FormLabel htmlFor={campo.name}>{campo.label || campo.name}</FormLabel>
                                <Input
                                    value={formDataState[campo.name] || ''} // Inicia vacío si no hay valor
                                    onChange={handleInputChange}
                                    type={campo.type || 'text'}
                                    id={campo.name}
                                    placeholder={`Introduce ${campo.label || campo.name}`}
                                />
                            </GridItem>
                        );
                    }
                    return null;
                })}

                {/* Verificar si el campo "icono" está en los metadatos */}
                {metadata.some(campo => campo.name === 'icono') && (
                    <GridItem colSpan={1} display="flex-end" flexDirection="column" alignItems="flex-end">
                        <FormLabel htmlFor="icono">Icono</FormLabel>
                        <Button colorScheme="blue" onClick={() => setShowIconCatalog(!showIconCatalog)}>
                            {showIconCatalog ? "Ocultar Íconos" : selectedIcon ? (
                                <Box as={iconCatalog[selectedIcon]} w={6} h={6} />
                            ) : "Seleccionar Ícono"}
                        </Button>
                    </GridItem>
                )}
            </Grid>

            {/* Mostrar el catálogo de íconos si está activado */}
            {showIconCatalog && (
                <Grid templateColumns="repeat(6, 1fr)" gap={4} mt={4}>
                    {Object.keys(iconCatalog).map(iconName => (
                        <Box
                            key={iconName}
                            as={iconCatalog[iconName]}
                            w={10} h={10}
                            onClick={() => handleIconSelect(iconName)}
                            cursor="pointer"
                            border={selectedIcon === iconName ? "2px solid blue" : "1px solid gray"}
                            borderRadius="md"
                            p={2}
                            _hover={{ bg: "gray.100" }}
                            transition="0.3s"
                        />
                    ))}
                </Grid>
            )}

            <Flex mt={6} justify="space-between">
                <Button colorScheme="red" size="lg" onClick={onClose}>
                    Cerrar
                </Button>
                <Button type="submit" colorScheme="green" size="lg">
                    Enviar
                </Button>
            </Flex>
        </FormControl>
    );
};
