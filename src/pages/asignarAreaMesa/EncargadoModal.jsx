import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  Text,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsuariosEncargadosThunk,
  actualizarEncargadoThunk,
} from "../../store/asignacionAM/thunks";
import PropTypes from "prop-types";

const EncargadoModal = ({ isOpen, onClose, areaId, currentEncargado }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const dispatch = useDispatch();
  const toast = useToast();

  const { usuariosEncargados } = useSelector((state) => state.AsignacionAreaMesa);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchUsuariosEncargadosThunk());
      if (currentEncargado?.id) {
        setSelectedUserId(currentEncargado.id.toString()); 
      } else {
        setSelectedUserId("");
      }
    }
  }, [dispatch, isOpen, currentEncargado]);



  const handleUpdate = async () => {
      
    if (!selectedUserId) return;

    try {
      await dispatch(
        actualizarEncargadoThunk({
          id: areaId,
          encargado: Number(selectedUserId),
          update_by: Number(localStorage.getItem("usuarioId")),
        })
      ).unwrap();

      toast({
        title: "Encargado actualizado correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
      window.location.reload(); 
    } catch (error) {
      toast({
        title: "Error al actualizar encargado",
        description: error?.message || "Ocurrió un error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Información del Encargado</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={4}>
            <Text fontWeight="bold">Encargado actual:</Text>
            <Text>
              {currentEncargado
                ? `${currentEncargado.nombre} ${currentEncargado.apellido}`
                : "Ninguno asignado"}
            </Text>
          </Box>

          <Select
            placeholder="Seleccione un encargado"
            onChange={(e) => {
                setSelectedUserId(e.target.value);
            }}
            value={selectedUserId || ""}
            >
            {usuariosEncargados.map((u) => (
                <option key={u.id} value={u.id}>
                {u.nombre} {u.apellido} ({u.correo})
                </option>
            ))}
            </Select>

        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Cancelar
          </Button>
          <Button colorScheme="green" onClick={handleUpdate}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

EncargadoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  areaId: PropTypes.number.isRequired,
  currentEncargado: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    apellido: PropTypes.string,
  }),
};

export default EncargadoModal;
