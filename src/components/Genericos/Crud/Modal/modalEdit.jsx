import React from 'react';
import { 
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalCloseButton, 
    FormControl, 
    FormLabel, 
    Input, 
    Switch, 
    Grid, 
    GridItem, 
    Box, 
    Button, 
    Flex 
} from "@chakra-ui/react";
import iconCatalog from '../../../Iconos/IconCatalog.jsx'; // Importamos el catálogo de íconos

const ModalEdit = ({ 
    isOpen, 
    onClose, 
    selectedModulo, 
    setSelectedModulo, 
    selectedIcon, 
    setSelectedIcon, 
    handleGuardarCambios, 
    showIconCatalog, 
    setShowIconCatalog 
}) => {

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar Módulo</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {/* Formulario para editar los campos */}
                    <FormControl mb={4}>
                        <FormLabel>Nombre</FormLabel>
                        <Input
                            value={selectedModulo?.nombre || ''}
                            onChange={(e) => setSelectedModulo({ ...selectedModulo, nombre: e.target.value })}
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Descripción</FormLabel>
                        <Input
                            value={selectedModulo?.descripcion || ''}
                            onChange={(e) => setSelectedModulo({ ...selectedModulo, descripcion: e.target.value })}
                        />
                    </FormControl>
                    <FormControl display="flex" alignItems="center" mb={4}>
                        <FormLabel mb="0">Estado</FormLabel>
                        <Switch
                            isChecked={selectedModulo?.estado === 'Activo'}
                            onChange={(e) => setSelectedModulo({ ...selectedModulo, estado: e.target.checked ? 'Activo' : 'Inactivo' })}
                            colorScheme="green"
                        />
                    </FormControl>
                    
                    {/* Botón para abrir el catálogo de íconos */}
                    <Button mb={4} colorScheme="blue" onClick={() => setShowIconCatalog(!showIconCatalog)}>
                        {showIconCatalog ? "Ocultar Íconos" : "Ver Íconos"}
                    </Button>

                    {/* Catálogo de íconos (se muestra solo si está activado) */}
                    {showIconCatalog && (
                        <Grid templateColumns="repeat(6, 1fr)" gap={4}>
                            {Object.keys(iconCatalog).map((iconName) => (
                                <GridItem key={iconName}>
                                    <Box
                                        as={iconCatalog[iconName]}
                                        w={10} h={10}
                                        onClick={() => setSelectedIcon(iconName)} // Actualizamos el ícono seleccionado
                                        cursor="pointer"
                                        border={selectedIcon === iconName ? "2px solid blue" : "1px solid gray"}
                                        borderRadius="md"
                                        p={2}
                                        _hover={{ bg: "gray.100" }}
                                    />
                                </GridItem>
                            ))}
                        </Grid>
                    )}

                    <Flex justify="flex-end">
                        {/* Botón de Guardar Cambios estilizado */}
                        <Button 
                            mt={4} 
                            colorScheme="green" 
                            variant="outline" 
                            borderRadius="md" 
                            paddingX={6} 
                            _hover={{ bg: "green.500", color: "white" }} 
                            onClick={handleGuardarCambios}
                        >
                            Guardar Cambios
                        </Button>
                    </Flex>
                </ModalBody>
            </ModalContent> 
        </Modal>
    );
};

export default ModalEdit;
