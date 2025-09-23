// src/components/empresa/BotonSincronizarReceta.jsx

import { useState } from "react";
import {
  Button,
  IconButton,
  Input,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  useDisclosure,
  useToast,
  Text,
} from "@chakra-ui/react";
import { FaSyncAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { importarRecetas } from "../../store/Empresa/thunks";
import { selectRecetasState } from "../../store/Empresa"; // Importar selectRecetasState
import PropTypes from "prop-types";

// Esta función auxiliar también la movemos aquí
const buildWarehousesParam = (str = "") =>
  str
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean);

const BotonSincronizarReceta = ({ empresa }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [warehousesReceta, setWarehousesReceta] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const { data: allEmpresas } = useSelector((state) => state.empresas);
  const { lastSync } = useSelector(selectRecetasState);

  const handleSyncReceta = async () => {
    const empresaToUse = empresa || (allEmpresas && allEmpresas[0]);

    if (!empresaToUse) {
      toast({
        title: "No hay empresa disponible",
        description:
          "No se pudo determinar la empresa para sincronizar. Intente seleccionar un país.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formattedWarehouses = buildWarehousesParam(warehousesReceta);
    if (!formattedWarehouses) {
      toast({ title: "Ingresa al menos un almacén", status: "warning" });
      return;
    }

    setIsSyncing(true);

    try {
      const result = await dispatch(
        importarRecetas({
          dbsap: empresaToUse.baseDatos,
          ipsap: empresaToUse.ipBaseDatos,
          warehouses: formattedWarehouses,
        })
      );
      if (result.error) throw result.error;

      toast({
        title: "Recetas sincronizadas",
        status: "success",
        duration: 5000,
      });
    } catch (e) {
      toast({
        title: "Error al sincronizar recetas",
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsSyncing(false);
      onClose();
      setWarehousesReceta(""); // Limpiar input al cerrar
    }
  };

  return (
    <>
      <Tooltip label="Sincronizar Recetas">
        <IconButton
          icon={<FaSyncAlt />}
          onClick={onOpen}
          variant="outline"
          colorScheme="purple"
          isDisabled={isSyncing}
          isLoading={isSyncing}
        />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sincronizar Recetas</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {lastSync && (
              <Text fontSize="sm" color="gray.500" mb={4}>
                Última sincronización: {new Date(lastSync).toLocaleString()}
              </Text>
            )}
            <FormControl>
              <FormLabel>Almacenes para receta (separados por coma)</FormLabel>
              <Input
                placeholder="CA-0300, CA-0100, ..."
                value={warehousesReceta}
                onChange={(e) => setWarehousesReceta(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="purple"
              mr={3}
              onClick={handleSyncReceta}
              isDisabled={isSyncing}
              isLoading={isSyncing}
            >
              Sincronizar Recetas
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

BotonSincronizarReceta.propTypes = {
  empresa: PropTypes.shape({
    baseDatos: PropTypes.string,
    ipBaseDatos: PropTypes.string,
    paisId: PropTypes.number,
  }),
};

export default BotonSincronizarReceta;
