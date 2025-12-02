import { Button, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from '@chakra-ui/react'; // Importar los componentes de Chakra UI
import { FaPlus } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { ModalV1 } from '../Modal/modalV1';
import { useDisclosure } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { createModulo } from '../../../../store/Modulos/thunks'; // Asegúrate de importar todas las acciones necesarias
import { createOpciones } from '../../../../store/Opciones/thunks';
import { useState, useRef } from 'react';
import { createpermisos } from '../../../../store/Permisos/thunks';
import { createRol } from '../../../../store/PaginaRole/thunks';
import { createUser } from '../../../../store/usuarios/thunks';
import { createasignacionPermisosRoles } from '../../../../store/AsignarPermisosAroles/thunks';
// import { createProcesos } from '../../../../store/Procesos/thunks';
// import { createEtapa } from '../../../../store/Etapas';

export const BotonCrear = ({ nombreBoton, metadata }) => {
    const { isOpen, onOpen, onClose } = useDisclosure(); // Hook para manejar el estado del modal
    const dispatch = useDispatch();
    const toast = useToast();  // Hook para mostrar notificaciones
    const [isAlertOpen, setIsAlertOpen] = useState(false); // Estado para el AlertDialog
    const cancelRef = useRef(); // Referencia para el botón de cancelar en el AlertDialog

    // Función para manejar el envío de datos al API adecuado
    const handleSubmit = (formData) => {


        switch (nombreBoton) {
            case 'Crear Usuario':
                dispatch(createUser(formData))
                    .then((result) => {
                        if (result.meta.requestStatus === 'fulfilled') {
                            setIsAlertOpen(true); // Abrir el AlertDialog de éxito
                            onClose();  // Cerrar el modal
                        } else {
                            console.error('Error al crear usuario:', result.payload);
                            mostrarToastError('usuario');
                        }
                    });
                break;

            case 'Crear Módulo':
                dispatch(createModulo(formData))
                    .then((result) => {
                        if (result.meta.requestStatus === 'fulfilled') {
                            setIsAlertOpen(true);
                            onClose();
                        } else {
                            console.error('Error al crear módulo:', result.payload);
                            mostrarToastError('módulo');
                        }
                    });
                break;

            case 'Crear Opción':
                dispatch(createOpciones(formData))
                    .then((result) => {
                        if (result.meta.requestStatus === 'fulfilled') {
                            setIsAlertOpen(true);
                            onClose();
                        } else {
                            console.error('Error al crear opciones:', result.payload);
                            mostrarToastError('opciones');
                        }
                    });
                break;

            case 'Crear Rol':
                dispatch(createRol(formData))
                    .then((result) => {
                        if (result.meta.requestStatus === 'fulfilled') {
                            setIsAlertOpen(true);
                            onClose();
                        } else {
                            console.error('Error al crear rol:', result.payload);
                            mostrarToastError('rol');
                        }
                    });
                break;

            case 'Crear Permiso':
                dispatch(createpermisos(formData))
                    .then((result) => {
                        if (result.meta.requestStatus === 'fulfilled') {
                            setIsAlertOpen(true);
                            onClose();
                        } else {
                            console.error('Error al crear permisos:', result.payload);
                            mostrarToastError('permisos');
                        }
                    });
                break;

            case 'Crear Permisos Roles':
                dispatch(createasignacionPermisosRoles(formData))
                    .then((result) => {
                        if (result.meta.requestStatus === 'fulfilled') {
                            setIsAlertOpen(true);
                            onClose();
                        } else {
                            console.error('Error al crear permisos roles:', result.payload);
                            mostrarToastError('permisos roles');
                        }
                    });
                break;

            // case 'Crear Proceso':
            //     dispatch(createProcesos(formData))
            //         .then((result) => {
            //             if (result.meta.requestStatus === 'fulfilled') {
            //                 setIsAlertOpen(true);
            //                 onClose();
            //             } else {
            //                 console.error('Error al crear el proceso', result.payload);
            //                 mostrarToastError('proceso');
            //             }
            //         });
            //     break;

            default:
                console.log('Acción no reconocida:', nombreBoton);
                break;

            // case 'Crear Etapas':
            //     dispatch(createEtapa(formData))
            //         .then((result) => {
            //             if (result.meta.requestStatus === 'fulfilled') {
            //                 setIsAlertOpen(true);
            //                 onClose();
            //             } else {
            //                 console.error('Error al crear etapa:', result.payload);
            //                 mostrarToastError('etapa');
            //             }
            //         });
            //     break;
        }
    };

    // Función para mostrar el mensaje de error
    const mostrarToastError = (entidad) => {
        toast({
            title: `Error al crear ${entidad}.`,
            description: `Hubo un problema al crear el ${entidad}.`,
            status: "error",
            duration: 3000,
            isClosable: true,
        });
    };

    // Función para manejar el botón de aceptar en la ventana de éxito
    const onAlertClose = () => {
        setIsAlertOpen(false); // Cerrar el AlertDialog
        window.location.reload(); // Recargar la página
    };

    return (
        <>
            <Button
                leftIcon={<FaPlus />}
                colorScheme="teal"
                variant="outline"
                size="md"
                borderRadius="full"
                onClick={onOpen} // Abre el modal
                mt={4} // Margen superior para alineación estética
            >
                {nombreBoton} {/* Texto dinámico del botón */}
            </Button>
            {/* Renderiza el Modal y pasa las funciones onClose, isOpen y handleSubmit */}
            <ModalV1
                isOpen={isOpen}
                onClose={onClose}
                titulo={nombreBoton}
                metadata={metadata || []}
                onSubmit={handleSubmit} // Pasamos la función de envío
            />

            {/* AlertDialog para el mensaje de éxito */}
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
                            {`El ${nombreBoton.toLowerCase()} ha sido creado exitosamente.`}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onAlertClose} colorScheme="teal"
                                variant="outline"
                                size="md"
                                borderRadius="full">
                                Aceptar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

// Definición de PropTypes
BotonCrear.propTypes = {
    nombreBoton: PropTypes.string.isRequired, // El texto del botón
    metadata: PropTypes.arrayOf(PropTypes.object), // Metadatos opcionales
};

export default BotonCrear;
