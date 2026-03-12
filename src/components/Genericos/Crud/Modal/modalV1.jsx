import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Formulario } from '../formularios/formulario';

export const ModalV1 = ({ isOpen, onClose, titulo, metadata, onSubmit }) => {
    // Filtrar los metadatos si es necesario (puedes ajustarlo según tus requisitos)
    const filteredMetadata = metadata.filter(
        campo => campo.name !== 'id' && 
                 campo.name !== 'updated_at' &&
                 campo.name !== 'created_at' && 
                 campo.name !== 'created_by' &&
                 campo.name !== 'parentId' &&  
                 campo.name !== 'update_at' && 
                 campo.name !== 'update_by' && 
                 campo.name !== 'roleId' &&
                 campo.name !== 'updated_by'
    );

    return (
        <Modal size="2xl" isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent borderRadius="md" boxShadow="lg" p={4}>
                <ModalHeader fontWeight="bold" textAlign="center" fontSize="2xl">
                    {titulo}
                </ModalHeader>
                <ModalCloseButton size="lg" />
                <ModalBody>
                    <Formulario 
                        key={isOpen ? "new-form" : "hidden-form"}
                        formData={{}} // Inicia con formulario vacío
                        metadata={filteredMetadata} // Enviar los metadatos filtrados
                        onClose={onClose} // Función para cerrar el modal
                        onSubmit={onSubmit} // Función para manejar el envío del formulario
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

// Definición de PropTypes
ModalV1.propTypes = {
    isOpen: PropTypes.bool.isRequired, // Estado de apertura del modal
    onClose: PropTypes.func.isRequired, // Función para cerrar el modal
    titulo: PropTypes.string.isRequired, // Título del modal
    metadata: PropTypes.arrayOf(PropTypes.object).isRequired, // Metadatos para el formulario
    onSubmit: PropTypes.func.isRequired, // Función para manejar el envío del formulario
};
