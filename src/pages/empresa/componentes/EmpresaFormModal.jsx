import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Switch,
  Select,
} from "@chakra-ui/react";

export const EmpresaFormModal = ({
  isOpen,
  onClose,
  isMobile,
  isEditMode,
  currentEmpresa,
  handleInputChange,
  errors,
  paises,
  handleSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={isMobile ? "full" : "md"}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditMode ? "Actualizar Empresa" : "Agregar Empresa"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl isInvalid={errors.nombre} isRequired>
              <FormLabel>Nombre de la Empresa</FormLabel>
              <Input
                name="nombre"
                value={currentEmpresa.nombre}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre de la empresa"
              />
              {errors.nombre && (
                <FormErrorMessage>{errors.nombre}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={errors.alias} isRequired>
              <FormLabel>Alias</FormLabel>
              <Input
                name="alias"
                value={currentEmpresa.alias}
                onChange={handleInputChange}
                placeholder="Ingrese el alias de la empresa"
              />
              {errors.alias && (
                <FormErrorMessage>{errors.alias}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Activo</FormLabel>
              <Switch
                name="estaActivo"
                isChecked={currentEmpresa.estaActivo}
                onChange={handleInputChange}
                colorScheme="green"
              />
            </FormControl>
            <FormControl isInvalid={errors.baseDatos} isRequired>
              <FormLabel>Base de Datos</FormLabel>
              <Input
                name="baseDatos"
                value={currentEmpresa.baseDatos}
                onChange={handleInputChange}
                placeholder="Ingrese la base de datos"
              />
              {errors.baseDatos && (
                <FormErrorMessage>{errors.baseDatos}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={errors.ipBaseDatos} isRequired>
              <FormLabel>IP SAP</FormLabel>
              <Input
                name="ipBaseDatos"
                value={currentEmpresa.ipBaseDatos}
                onChange={handleInputChange}
                placeholder="Ingrese la IP SAP"
              />
              {errors.ipBaseDatos && (
                <FormErrorMessage>{errors.ipBaseDatos}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={errors.serie} isRequired>
              <FormLabel>Serie</FormLabel>
              <Input
                name="serie"
                value={currentEmpresa.serie}
                onChange={handleInputChange}
                placeholder="Ingrese la serie de la empresa"
              />
              {errors.serie && (
                <FormErrorMessage>{errors.serie}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={errors.paisId} isRequired>
              <FormLabel>País</FormLabel>
              <Select
                name="paisId"
                value={currentEmpresa.paisId}
                onChange={handleInputChange}
                placeholder="Seleccione un país"
              >
                {paises.map((pais) => (
                  <option key={pais.id} value={pais.id}>
                    {pais.nombre}
                  </option>
                ))}
              </Select>
              {errors.paisId && (
                <FormErrorMessage>{errors.paisId}</FormErrorMessage>
              )}
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
            {isEditMode ? "Actualizar" : "Guardar"}
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

EmpresaFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  currentEmpresa: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  paises: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

