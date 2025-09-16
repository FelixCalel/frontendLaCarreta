import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Button,
    Input,
    Textarea,
    FormControl,
    FormLabel,
    Alert,
    AlertIcon,
    Box,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useGetRechazoByPedidoProduccionIdQuery } from "../../services/pedidoProductionApi";
import PropTypes from "prop-types";

export const RechazoModal = ({ isOpen, onClose, pedidoProduccionId, onSave, isLoading }) => {
    console.log("[RechazoModal] isOpen:", isOpen, "pedidoProduccionId:", pedidoProduccionId);
    const [formData, setFormData] = useState({
        fechaRechazo: '',
        cantidadRechazada: '',
        comentario: '',
        trazabilidad: '',
        usuarioId: 1, // TODO: Get from logged in user
    });
    const [error, setError] = useState(null);

    const { data: rechazoData, isFetching, refetch } = useGetRechazoByPedidoProduccionIdQuery(pedidoProduccionId, { skip: !pedidoProduccionId });

    const initialFormData = {
        fechaRechazo: '',
        cantidadRechazada: '',
        comentario: '',
        trazabilidad: '',
        usuarioId: 1, // TODO: Get from logged in user
    };

    useEffect(() => {
        console.log("[RechazoModal] rechazoData changed:", rechazoData);
        if (rechazoData) {
            setFormData({
                fechaRechazo: new Date(rechazoData.fechaRechazo).toISOString().split('T')[0],
                cantidadRechazada: rechazoData.cantidadRechazada,
                comentario: rechazoData.comentario || '',
                trazabilidad: rechazoData.trazabilidad || '',
                usuarioId: rechazoData.usuarioId,
            });
        } else {
            setFormData(initialFormData);
        }
    }, [rechazoData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.fechaRechazo || !formData.cantidadRechazada) {
            setError('Fecha de Rechazo and Cantidad Rechazada are required');
            return;
        }

        try {
            // Pass both form data and the existing rechazo data (if any)
            await onSave({ formData, existingRechazo: rechazoData });
            refetch(); // Refetch data after save
        } catch (error) {
            console.error("Failed to save:", error)
            setError('Failed to save rechazo.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{rechazoData ? 'Editar Rechazo' : 'Nuevo Rechazo'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {isFetching ? (
                        <p>Loading...</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <FormControl isRequired mb={3}>
                                <FormLabel>Fecha de Rechazo</FormLabel>
                                <Input type="date" name="fechaRechazo" onChange={handleChange} value={formData.fechaRechazo} />
                            </FormControl>
                            <FormControl isRequired mb={3}>
                                <FormLabel>Cantidad Rechazada</FormLabel>
                                <Input type="number" name="cantidadRechazada" onChange={handleChange} value={formData.cantidadRechazada} />
                            </FormControl>
                            <FormControl mb={3}>
                                <FormLabel>Comentario</FormLabel>
                                <Textarea name="comentario" onChange={handleChange} value={formData.comentario} />
                            </FormControl>
                            <FormControl mb={3}>
                                <FormLabel>Trazabilidad</FormLabel>
                                <Input name="trazabilidad" onChange={handleChange} value={formData.trazabilidad} />
                            </FormControl>

                            {error && (
                                <Box width="full" pb={4} pt={4}>
                                    <Alert status="error" variant="subtle">
                                        <AlertIcon />
                                        {error}
                                    </Alert>
                                </Box>
                            )}

                            <Button colorScheme="teal" mr={3} type="submit" isLoading={isLoading}>
                                Guardar
                            </Button>
                            <Button onClick={onClose}>Cancelar</Button>
                        </form>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

RechazoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    pedidoProduccionId: PropTypes.number,
    onSave: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
};