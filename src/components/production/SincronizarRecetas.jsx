import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Box,
  Text,
  useToast,
  Flex,
  Tag,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import {
  tablaEmpresa,
  importarRecetas,
  tablaPais,
} from "../../store/Empresa/thunks";
import { selectRecetasState } from "../../store/Empresa/empresaSlice";
import PropTypes from "prop-types";

const SincronizarRecetas = ({ country = "" }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warehouses, setWarehouses] = useState("");

  const { paisId: userPaisId } = useSelector((state) => state.auth);
  const {
    data: empresas,
    status: empresasStatus,
    paises,
    paisesStatus,
  } = useSelector((state) => state.empresas);
  const { status, lastSync, error, registrosInsertados, filasWS, errores } =
    useSelector(selectRecetasState);

  useEffect(() => {
    if (empresasStatus === "idle") {
      dispatch(tablaEmpresa());
    }
    if (paisesStatus === "idle") {
      dispatch(tablaPais());
    }
  }, [dispatch, empresasStatus, paisesStatus]);

  const countryToUse = useMemo(() => {
    if (country) {
      return country;
    }
    if (userPaisId && paises && paises.length > 0) {
      const userPais = paises.find((p) => p.id === parseInt(userPaisId, 10));
      return userPais ? userPais.nombre : null;
    }
    return null;
  }, [country, userPaisId, paises]);

  const empresa = useMemo(() => {
    if (
      !countryToUse ||
      !empresas ||
      empresas.length === 0 ||
      !paises ||
      paises.length === 0
    )
      return null;

    const paisSeleccionado = paises.find((p) => p.nombre === countryToUse);
    if (!paisSeleccionado) return null;

    return empresas.find((e) => e.paisId === paisSeleccionado.id);
  }, [countryToUse, empresas, paises]);

  const buildWarehousesParam = (str = "") =>
    str
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean)
      .map((w) => `'''${w}'''`)
      .join(",");

  const handleSync = () => {
    const formattedWarehouses = buildWarehousesParam(warehouses);
    if (!formattedWarehouses) {
      toast({
        title: "Almacenes requeridos",
        description: "Por favor ingrese al menos un almacén.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (empresa && empresa.baseDatos && empresa.ipBaseDatos) {
      const { baseDatos, ipBaseDatos } = empresa;
      dispatch(
        importarRecetas({
          dbsap: baseDatos,
          ipsap: ipBaseDatos,
          warehouses: formattedWarehouses,
        })
      );
      setIsModalOpen(false);
      setWarehouses("");
    } else {
      toast({
        title: "No se puede sincronizar",
        description:
          "La configuración de la empresa para el país seleccionado es incorrecta.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const openSyncModal = () => {
    if (empresa && empresa.baseDatos && empresa.ipBaseDatos) {
      setIsModalOpen(true);
    } else {
      let errorDescription =
        "Seleccione un país o verifique la configuración de la empresa.";
      if (empresa) {
        const missingFields = [];
        if (!empresa.baseDatos) missingFields.push("Base de Datos");
        if (!empresa.ipBaseDatos) missingFields.push("IP SAP");
        if (missingFields.length > 0) {
          errorDescription = `La configuración de la empresa es incompleta. Faltan los siguientes campos: ${missingFields.join(
            ", "
          )}.`;
        }
      }
      toast({
        title: "No se puede sincronizar",
        description: errorDescription,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (status === "succeeded") {
      toast({
        title: "Sincronización de recetas completada",
        description: `Se procesaron ${filasWS} filas y se insertaron ${registrosInsertados} registros.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
    if (status === "failed") {
      toast({
        title: "Error en la sincronización de recetas",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [status, toast, filasWS, registrosInsertados, error]);

  const lastSyncDate = lastSync ? new Date(lastSync) : null;

  return (
    <>
      <Box borderWidth="1px" borderRadius="lg" p={4} mb={4}>
        <Flex justify="space-between" align="center">
          <Box>
            <Text fontWeight="bold">Sincronización de Recetas</Text>
            {lastSyncDate ? (
              <Text fontSize="sm" color="gray.500">
                Última sincronización: {lastSyncDate.toLocaleString()}
              </Text>
            ) : (
              <Text fontSize="sm" color="gray.500">
                No se ha sincronizado.
              </Text>
            )}
          </Box>
          <Button
            onClick={openSyncModal}
            disabled={!empresa || status === "loading"}
            isLoading={status === "loading"}
            loadingText="Sincronizando"
          >
            Sincronizar Recetas
          </Button>
        </Flex>
        {status === "succeeded" && (
          <Flex mt={2}>
            <Tag colorScheme="green" mr={2}>
              Insertados: {registrosInsertados}
            </Tag>
            <Tag colorScheme="blue">Filas WS: {filasWS}</Tag>
          </Flex>
        )}
        {errores && errores.length > 0 && (
          <Box mt={2}>
            <Text color="red.500" fontSize="sm">
              Errores: {errores.join(", ")}
            </Text>
          </Box>
        )}
      </Box>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sincronizar Recetas</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Almacenes (separados por comas)</FormLabel>
              <Input
                placeholder="Ej: ALM01,ALM02"
                value={warehouses}
                onChange={(e) => setWarehouses(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSync}>
              Sincronizar
            </Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

SincronizarRecetas.propTypes = {
  country: PropTypes.string,
};

export default SincronizarRecetas;