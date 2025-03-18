import { Button, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useDisclosure } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useState, useRef } from 'react';
import { deleteModulo } from '../../../../store/Modulos/thunks';
import { deleteOpciones } from '../../../../store/Opciones/thunks';
// import { deleteProcesos } from '../../../../store/Procesos/thunks';
import { deleteRol } from '../../../../store/PaginaRole/thunks';
import { deletepermisos } from '../../../../store/Permisos/thunks';

export const BotonEliminar = ({ nombreBoton, formData }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const toast = useToast();
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const cancelRef = useRef();

    const handleEliminar = () => {
        // Maneja el dispatch dependiendo de la entidad que se va a eliminar
        switch (nombreBoton) {
            case 'Eliminar Módulo':
                dispatch(deleteModulo(formData.id))
                    .then((result) => {
                        if (result.meta.requestStatus === 'fulfilled') {
                            setIsAlertOpen(true);
                            onClose();
                        } else {
                            console.error('Error al eliminar módulo:', result.payload);
                            mostrarToastError('módulo');
                        }
                    });
                break;

            case 'Eliminar Opción':
                dispatch(deleteOpciones(formData.id))
                    .then((result) => {
                        if (result.meta.requestStatus === 'fulfilled') {
                            setIsAlertOpen(true);
                            onClose();
                        } else {
                            console.error('Error al eliminar opción:', result.payload);
                            mostrarToastError('opción');
                        }
                    });
                break;

            // case 'Eliminar Proceso':
            //     dispatch(deleteProcesos(formData.id))
            //         .then((result) => {
            //             if (result.meta.requestStatus === 'fulfilled') {
            //                 setIsAlertOpen(true);
            //                 onClose();
            //             } else {
            //                 console.error('Error al eliminar proceso:', result.payload);
            //                 mostrarToastError('proceso');
            //             }
            //         });
            //     break;

            case 'Eliminar Rol':
                dispatch(deleteRol(formData.id))
                    .then((result) => {
                        if (result.meta.requestStatus === 'fulfilled') {
                            setIsAlertOpen(true);
                            onClose();
                        } else {
                            console.error('Error al eliminar rol:', result.payload);
                            mostrarToastError('rol');
                        }
                    });
                break;

            case 'Eliminar Permiso':
                dispatch(deletepermisos(formData.id))
                    .then((result) => {
                        if (result.meta.requestStatus === 'fulfilled') {
                            setIsAlertOpen(true);
                            onClose();
                        } else {
                            console.error('Error al eliminar permiso:', result.payload);
                            mostrarToastError('permiso');
                        }
                    });
                break;

            default:
                console.log('Acción no reconocida:', nombreBoton);
        }
    };

    const mostrarToastError = (entidad) => {
        toast({
            title: `Error al eliminar ${entidad}.`,
            description: `Hubo un problema al eliminar el ${entidad}.`,
            status: "error",
            duration: 3000,
            isClosable: true,
        });
    };

    const onAlertClose = () => {
        setIsAlertOpen(false);
        window.location.reload();  // Si es necesario recargar la página
    };

    return (
        <>
            <Button
                colorScheme="red"
                variant="outline"
                size="sm"
                borderRadius="full"
                onClick={onOpen}
                mt={1}
                justifyContent="center"
                alignItems="center"
            > Eliminar
                <FaTrash fontSize="15px" style={{ marginLeft: '8px' }} />
            </Button>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Confirmar Eliminación
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            ¿Estás seguro de que desea eliminar este registro?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button
                                colorScheme="teal"
                                variant="outline"
                                size="md"
                                borderRadius="full" ref={cancelRef} onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button colorScheme="red" onClick={handleEliminar} ml={3}
                             variant="outline"
                             size="md"
                             borderRadius="full">
                                Eliminar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            {/* Alerta de éxito al eliminar */}
            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={onAlertClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            {nombreBoton} Exitoso
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {`El ${nombreBoton.toLowerCase()} ha sido eliminado exitosamente.`}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onAlertClose} colorScheme="green">
                                Aceptar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

BotonEliminar.propTypes = {
    nombreBoton: PropTypes.string.isRequired,
    formData: PropTypes.object.isRequired,
};

export default BotonEliminar;
