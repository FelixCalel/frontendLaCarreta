import {
  Button,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import PropTypes from "prop-types";
import { ModalEditGeneric } from "../Modal/ModalEditGeneric";
import { useDisclosure } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useState, useRef } from "react";
import { updateModulo } from "../../../../store/Modulos/thunks";
import { updateOpciones } from "../../../../store/Opciones/thunks";
import { updatePermiso } from "../../../../store/Permisos/thunks";
import { updateRol } from "../../../../store/PaginaRole/thunks";
// import { updateEtapa } from '../../../../store/Etapas';

export const BotonEditar = ({ nombreBoton, metadata, formData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const toast = useToast();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = useRef();
  const [, setUpdatedData] = useState({}); // Guarda los datos actualizados

  const handleSubmit = (formData) => {
    const updatedFormData = {
      ...formData,
      estado: !!formData.estado,
      proceso_id: parseInt(formData.proceso_id, 10),
      anterior: parseInt(formData.anterior, 10),
    };

    console.log("Datos actualizados:", updatedFormData);
    setUpdatedData(updatedFormData); // Actualizamos el estado con los nuevos datos
    // Aquí manejamos el `dispatch` en el botón
    switch (nombreBoton) {
      case "Editar Módulo":
        dispatch(updateModulo(updatedFormData)).then((result) => {
          if (result.meta.requestStatus === "fulfilled") {
            setIsAlertOpen(true);
            onClose();
          } else {
            console.error("Error al editar módulo:", result.payload);
            mostrarToastError("módulo");
          }
        });
        break;

      case "Editar Opción":
        dispatch(updateOpciones(updatedFormData)).then((result) => {
          if (result.meta.requestStatus === "fulfilled") {
            setIsAlertOpen(true);
            onClose();
          } else {
            console.error("Error al editar módulo:", result.payload);
            mostrarToastError("opción");
          }
        });

        break;

      case "Editar Permiso":
        dispatch(updatePermiso(updatedFormData)).then((result) => {
          if (result.meta.requestStatus === "fulfilled") {
            setIsAlertOpen(true);
            onClose();
          } else {
            console.error("Error al editar permisos:", result.payload);
            mostrarToastError("permisos");
          }
        });
        break;

      case "Editar Rol":
        dispatch(updateRol(updatedFormData)).then((result) => {
          if (result.meta.requestStatus === "fulfilled") {
            setIsAlertOpen(true);
            onClose();
          } else {
            console.error("Error al editar rol:", result.payload);
            mostrarToastError("rol");
          }
        });
        break;

      // case 'Editar Etapas':
      //     dispatch(updateEtapa({ EtapaData: updatedFormData, id: updatedFormData.id }))
      //         .then((result) => {
      //             if (result.meta.requestStatus === 'fulfilled') {
      //                 setIsAlertOpen(true);
      //                 onClose();
      //             } else {
      //                 console.error('Error al editar etapa:', result.payload);
      //                 mostrarToastError('etapa');
      //             }
      //         });
      //     break;

      default:
        console.log("Acción no reconocida:", nombreBoton);
    }
  };

  const mostrarToastError = (entidad) => {
    toast({
      title: `Error al editar ${entidad}.`,
      description: `Hubo un problema al editar el ${entidad}.`,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const onAlertClose = () => {
    setIsAlertOpen(false); // Cambia el estado para cerrar la alerta
    window.location.reload(); // Si es necesario recargar la página después
  };

  return (
    <>
      <Button
        marginRight={3}
        colorScheme="green"
        variant="outline"
        size="sm"
        borderRadius="full"
        onClick={onOpen}
        mt={1}
        justifyContent="center"
        alignItems="center"
      >
        Editar
        <FaEdit fontSize="15px" style={{ marginLeft: "8px" }} />{" "}
        {/* Margen izquierdo para separar el icono */}
      </Button>

      <ModalEditGeneric
        isOpen={isOpen}
        onClose={onClose}
        selectedData={formData || {}}
        metadata={metadata || []}
        onSubmit={handleSubmit} // Aquí se envían los datos al hacer submit
      />

      {/* Agrega este log para verificar cuándo se activa la alerta */}
      {isAlertOpen && console.log("Alerta activada con estado: ", isAlertOpen)}

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
        isCentered // Asegura que la alerta esté centrada
        zIndex={1500} // Incrementa el z-index si es necesario
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {nombreBoton} Exitoso
            </AlertDialogHeader>

            <AlertDialogBody>
              {`El ${nombreBoton.toLowerCase()} ha sido editado exitosamente.`}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onAlertClose}
                colorScheme="teal"
                variant="outline"
                size="md"
                borderRadius="full"
              >
                Aceptar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

BotonEditar.propTypes = {
  nombreBoton: PropTypes.string.isRequired,
  metadata: PropTypes.arrayOf(PropTypes.object),
  formData: PropTypes.object,
};

