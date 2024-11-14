import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react";
import { FormularioNuevoEditar } from '../formularios/formularioEditar';  // Importa el formulario de edición

export const ModalEditGeneric = ({ isOpen, onClose, selectedData, metadata, onSubmit }) => {

    // Verificar que siempre haya datos seleccionados para la edición
    if (!selectedData) {
        return null;  // No renderiza nada si no hay datos seleccionados
    }

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
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormularioNuevoEditar
                        formData={selectedData}
                        metadata={filteredMetadata}
                        onClose={onClose}
                        onSubmit={onSubmit}  // Pasamos handleGuardarCambios como onSubmit
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ModalEditGeneric;
