import PropTypes from 'prop-types'; // Importamos PropTypes
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Switch,
  Button,
  Icon,
} from "@chakra-ui/react";
import { FaStore, FaPercentage, FaMapMarkerAlt, FaRoad, FaUser } from "react-icons/fa";
import DeuSelector from "./DeuSelector";
import CiudadSelector from "./CiudadSelector";
import RutaSelector from "./RutaSelector";

const ModalFormTienda = ({
  isOpen,
  onClose,
  isEditMode,
  currentTienda,
  setCurrentTienda,
  handleSubmit,
  errors,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="lg" boxShadow="lg">
        <ModalHeader bg="teal.500" color="white" textAlign="center" borderTopRadius="lg">
          {isEditMode ? "Editar Tienda" : "Agregar Tienda"}
        </ModalHeader>
        <ModalCloseButton color="white" />

        <ModalBody px={6} py={4}>
          {/* Campo: Nombre de la tienda */}
          <FormControl mb={4} isInvalid={errors?.nombre} isRequired>
            <FormLabel>
              <Icon as={FaStore} mr={2} /> Nombre de la Tienda
            </FormLabel>
            <Input
              placeholder="Ejemplo: Tienda Central"
              value={currentTienda.nombre}
              onChange={(e) => setCurrentTienda({ ...currentTienda, nombre: e.target.value })}
              focusBorderColor="teal.400"
            />
            {errors?.nombre && <FormErrorMessage>{errors.nombre}</FormErrorMessage>}
          </FormControl>

          {/* Campo: Descuento */}
          <FormControl mb={4} isInvalid={errors?.descuento} isRequired>
            <FormLabel>
              <Icon as={FaPercentage} mr={2} /> Descuento
            </FormLabel>
            <Input
              type="number"
              placeholder="Ejemplo: 10"
              value={currentTienda.descuento}
              onChange={(e) =>
                setCurrentTienda({ ...currentTienda, descuento: parseFloat(e.target.value) || 0 })
              }
              focusBorderColor="teal.400"
            />
            {errors?.descuento && <FormErrorMessage>{errors.descuento}</FormErrorMessage>}
          </FormControl>

          {/* Campo: Activo/Inactivo */}
          <FormControl display="flex" alignItems="center" mb={4}>
            <FormLabel mb="0">
              <Icon as={FaStore} mr={2} /> Activo
            </FormLabel>
            <Switch
              isChecked={currentTienda.estaActivo}
              onChange={(e) =>
                setCurrentTienda({ ...currentTienda, estaActivo: e.target.checked })
              }
              colorScheme="teal"
              size="lg"
            />
          </FormControl>

          {/* Campo: Deudor */}
          <FormControl mb={4} isInvalid={errors?.deudorId} isRequired>
            <FormLabel>
              <Icon as={FaUser} mr={2} /> Deudor
            </FormLabel>
            <DeuSelector
              ciudadId={currentTienda.ciudadId}
              onSelect={(deudor) =>
                setCurrentTienda({ ...currentTienda, deudorId: deudor.id })
              }
            />
            {errors?.deudorId && <FormErrorMessage>{errors.deudorId}</FormErrorMessage>}
          </FormControl>

          {/* Campo: Ciudad */}
          <FormControl mb={4} isInvalid={errors?.ciudadId} isRequired>
            <FormLabel>
              <Icon as={FaMapMarkerAlt} mr={2} /> Ciudad
            </FormLabel>
            <CiudadSelector
              value={currentTienda.ciudadId?.toString()} // Asegura que sea string
              onChange={(e) =>
                setCurrentTienda({ ...currentTienda, ciudadId: e.target.value })
              }
            />
            {errors?.ciudadId && <FormErrorMessage>{errors.ciudadId}</FormErrorMessage>}
          </FormControl>

          {/* Campo: Ruta */}
          <FormControl mb={4} isInvalid={errors?.rutaId} isRequired>
            <FormLabel>
              <Icon as={FaRoad} mr={2} /> Ruta
            </FormLabel>
            <RutaSelector
              value={currentTienda.rutaId?.toString()} // Asegura que sea string
              onChange={(e) =>
                setCurrentTienda({ ...currentTienda, rutaId: e.target.value })
              }
            />
            {errors?.rutaId && <FormErrorMessage>{errors.rutaId}</FormErrorMessage>}
          </FormControl>

          {/* Campo: Zona */}
          <FormControl mb={4}>
            <FormLabel>
              <Icon as={FaMapMarkerAlt} mr={2} /> Zona
            </FormLabel>
            <Input
              placeholder="Ejemplo: Zona 1"
              value={currentTienda.zona}
              onChange={(e) => setCurrentTienda({ ...currentTienda, zona: e.target.value })}
              focusBorderColor="teal.400"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <Button
            colorScheme="teal"
            onClick={handleSubmit}
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(0.95)" }}
          >
            {isEditMode ? "Actualizar" : "Guardar"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            _hover={{ bg: "teal.50" }}
            _active={{ transform: "scale(0.95)" }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Validaciones de las props usando PropTypes
ModalFormTienda.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  currentTienda: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    descuento: PropTypes.number.isRequired,
    estaActivo: PropTypes.bool.isRequired,
    ciudadId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    zona: PropTypes.string,
    rutaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  setCurrentTienda: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default ModalFormTienda;
