import { useState, useEffect, useMemo } from "react";
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
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import RutaSelector from "./RutaSelector";

const EMPTY_ARRAY = [];
const AsignarRutasModal = ({
  isOpen,
  onClose,
  usuario,
  rutas = EMPTY_ARRAY,
  onAssign,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoutes, setSelectedRoutes] = useState(() =>
    usuario && usuario.rutas ? usuario.rutas.map((r) => r.id) : [],
  );
  const modalHeaderColor = useColorModeValue("teal.600", "teal.200");

  useEffect(() => {
    setSelectedRoutes(usuario?.rutas ? usuario.rutas.map((r) => r.id) : []);
  }, [usuario, isOpen]);

  const filteredRutas = useMemo(() => {
    if (!searchTerm) return rutas;
    const lowerTerm = searchTerm.toLowerCase();
    return rutas.filter((ruta) =>
      ruta.nombre.toLowerCase().includes(lowerTerm),
    );
  }, [rutas, searchTerm]);

  const handleAssign = () => {
    if (usuario) {
      onAssign(usuario.id, selectedRoutes);
    }
  };

  const handleSelectAll = () => {
    const allIds = filteredRutas.map((r) => r.id);
    const newSelected = [...new Set([...selectedRoutes, ...allIds])];
    setSelectedRoutes(newSelected);
  };

  const handleDeselectAll = () => {
    const visibleIds = new Set(filteredRutas.map((r) => r.id));
    setSelectedRoutes((prev) => prev.filter((id) => !visibleIds.has(id)));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={modalHeaderColor}>
          Asignar Rutas - {usuario?.nombre} {usuario?.apellido}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Buscar ruta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                mb={2}
              />
            </InputGroup>
            <Flex justify="flex-end" gap={2} size="sm">
              <Button
                size="xs"
                onClick={handleSelectAll}
                colorScheme="blue"
                variant="ghost"
              >
                Seleccionar Visibles
              </Button>
              <Button
                size="xs"
                onClick={handleDeselectAll}
                colorScheme="red"
                variant="ghost"
              >
                Deseleccionar Visibles
              </Button>
            </Flex>
          </Box>

          <RutaSelector
            selectedRoutes={selectedRoutes}
            setSelectedRoutes={setSelectedRoutes}
            filteredRutas={filteredRutas}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="green"
            onClick={handleAssign}
            isLoading={isLoading}
            mr={3}
          >
            Asignar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

AsignarRutasModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  usuario: PropTypes.object,
  rutas: PropTypes.array.isRequired,
  onAssign: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default AsignarRutasModal;
