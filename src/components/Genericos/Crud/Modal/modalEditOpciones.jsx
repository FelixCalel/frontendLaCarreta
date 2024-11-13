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
    Button,
    Flex
} from "@chakra-ui/react";

const ModalEditOpciones = ({
    isOpen,
    onClose,
    selectedOpcion,
    setSelectedOpcion,
    handleGuardarCambios
}) => {

    const handleEstadoChange = (e) => {
        // Aquí cambiamos el valor del estado a booleano para el Switch
        setSelectedOpcion({ ...selectedOpcion, estado: e.target.checked });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar Opción</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={4}>
                        <FormLabel>Nombre</FormLabel>
                        <Input
                            value={selectedOpcion?.nombre || ''}
                            onChange={(e) => setSelectedOpcion({ ...selectedOpcion, nombre: e.target.value })}
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Descripción</FormLabel>
                        <Input
                            value={selectedOpcion?.descripcion || ''}
                            onChange={(e) => setSelectedOpcion({ ...selectedOpcion, descripcion: e.target.value })}
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Ruta</FormLabel>
                        <Input
                            value={selectedOpcion?.ruta || ''}
                            onChange={(e) => setSelectedOpcion({ ...selectedOpcion, ruta: e.target.value })}
                        />
                    </FormControl>
                    <FormControl display="flex" alignItems="center" mb={4}>
                        <FormLabel mb="0">Estado</FormLabel>
                        <Switch
                            isChecked={selectedOpcion?.estado === true} // Nos aseguramos de que sea booleano
                            onChange={handleEstadoChange}
                            colorScheme="green"
                        />
                    </FormControl>

                    <Flex justify="flex-end">
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

export default ModalEditOpciones;
