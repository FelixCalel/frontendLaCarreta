import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Switch,
  Select,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  useBreakpointValue,
  Flex,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  VStack,
  HStack,
  Stack,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { FaSyncAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import {
  tablaEmpresa,
  addNewEmpresa,
  deleteEmpresa,
  updateEmpresa,
  tablaPais,
  sincronizarClientes,
  sincronizarItems,
  importarRecetas,
} from "../../store/Empresa/thunks";

const MotionBox = motion(Box);

const PageFormEmpresa = () => {
  const dispatch = useDispatch();
  const { data, status, error, paises, paisesStatus, paisesError } =
    useSelector((state) => state.empresas);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditMode, setIsEditMode] = useState(false);
  const [warehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [warehouses, setWarehouses] = useState("");
  const [recetaModalOpen, setRecetaModalOpen] = useState(false);
  const [warehousesReceta, setWarehousesReceta] = useState("");
  const [currentEmpresa, setCurrentEmpresa] = useState({
    id: "",
    nombre: "",
    alias: "",
    estaActivo: true,
    baseDatos: "",
    ipBaseDatos: "",
    serie: "",
    paisId: "",
  });
  const [errors, setErrors] = useState({});
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [syncDisabled, setSyncDisabled] = useState({});
  const toast = useToast();

  useEffect(() => {
    if (status === "idle") {
      dispatch(tablaEmpresa());
    }
    if (paisesStatus === "idle") {
      dispatch(tablaPais());
    }
  }, [dispatch, status, paisesStatus]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue =
      type === "checkbox"
        ? checked
        : name === "paisId"
        ? parseInt(value, 10)
        : value;
    setCurrentEmpresa({ ...currentEmpresa, [name]: newValue });
    setErrors({ ...errors, [name]: "" });
  };

  const validateFields = () => {
    let formErrors = {};
    if (!currentEmpresa.nombre) formErrors.nombre = "El nombre es obligatorio";
    if (!currentEmpresa.alias) formErrors.alias = "El alias es obligatorio";
    if (!currentEmpresa.baseDatos)
      formErrors.baseDatos = "La base de datos es obligatoria";
    if (!currentEmpresa.ipBaseDatos)
      formErrors.ipBaseDatos = "La IP SAP es obligatoria";
    if (!currentEmpresa.serie) formErrors.serie = "La serie es obligatoria;";
    if (!currentEmpresa.paisId) formErrors.paisId = "El país es obligatorio";
    return formErrors;
  };

  const handleSubmit = async () => {
    const formErrors = validateFields();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (isEditMode) {
      dispatch(updateEmpresa(currentEmpresa)).then(() => {
        onClose();
        dispatch(tablaEmpresa());
      });
    } else {
      try {
        const result = await dispatch(addNewEmpresa(currentEmpresa));
        const newEmpresaId = result.payload?.id;
        if (newEmpresaId) {
          await handleSync(
            newEmpresaId,
            currentEmpresa.baseDatos,
            currentEmpresa.ipBaseDatos
          );
        } else {
          console.error(
            "Error: No se pudo obtener el ID de la empresa creada."
          );
        }
        onClose();
        dispatch(tablaEmpresa());
      } catch (error) {
        console.error("Error al crear empresa o sincronizar:", error);
      }
    }
  };

  const handleSync = async (empresaId, baseDatos, ipBaseDatos) => {
    try {
      setSyncDisabled((prevState) => ({ ...prevState, [empresaId]: true }));
      const syncResult = await dispatch(
        sincronizarClientes({
          dbsap: baseDatos,
          ipsap: ipBaseDatos,
          empresaId: empresaId,
        })
      );
      if (syncResult.error) {
        console.error("Error en la sincronización:", syncResult.error);
        toast({
          title: "Error en la sincronización.",
          description: "No se pudo completar la sincronización.",
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      } else {
        toast({
          title: "Sincronización completada.",
          description: "La sincronización se completó correctamente.",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error en la sincronización.",
        description: "No se pudo completar la sincronización.",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    } finally {
      setSyncDisabled((prevState) => ({ ...prevState, [empresaId]: false }));
    }
  };

  const handleSyncReceta = async () => {
    const emp = data.find((e) => e.id === currentEmpresa.id);
    if (!emp) return;

    const formattedWarehouses = warehousesReceta
      .split(",")
      .map((w) => `'${w.trim()}'`)
      .join(",");

    setSyncDisabled((prev) => ({ ...prev, [`receta-${emp.id}`]: true }));
    toast({ title: "Sincronizando recetas…", status: "info", duration: 15000 });

    try {
      const result = await dispatch(
        importarRecetas({
          dbsap: emp.baseDatos,
          ipsap: emp.ipBaseDatos,
          warehouses: formattedWarehouses,
        })
      );

      if (result.error) throw result.error;
      toast({
        title: "Recetas sincronizadas",
        status: "success",
        duration: 5000,
      });
    } catch {
      toast({
        title: "Error al sincronizar recetas",
        status: "error",
        duration: 5000,
      });
    } finally {
      setTimeout(() => {
        setSyncDisabled((prev) => ({ ...prev, [`receta-${emp.id}`]: false }));
      }, 5000);
      setRecetaModalOpen(false);
    }
  };

  const handleSyncWithWarehouses = async () => {
    const empresa = data.find((emp) => emp.id === currentEmpresa.id);
    if (!empresa) return;

    setSyncDisabled((prevState) => ({ ...prevState, [empresa.id]: true }));
    toast({
      title: "Sincronización en progreso...",
      description: "Por favor, espera mientras se sincronizan los datos.",
      status: "info",
      duration: 15000,
      isClosable: true,
    });

    try {
      const formattedWarehouses = formatWarehouses(warehouses);

      console.log("Datos enviados:", {
        dbsap: empresa.baseDatos,
        ipsap: empresa.ipBaseDatos,
        empresaId: empresa.id,
        warehouses: formattedWarehouses,
      });

      const syncResult = await dispatch(
        sincronizarItems({
          dbsap: empresa.baseDatos,
          ipsap: empresa.ipBaseDatos,
          empresaId: empresa.id,
          warehouses: formattedWarehouses,
        })
      );

      if (syncResult.error) {
        console.error("Error en la sincronización:", syncResult.error);
        toast({
          title: "Error en la sincronización.",
          description:
            "No se pudo completar la sincronización. Verifique los datos e intente nuevamente.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Sincronización completada.",
          description: "La sincronización se completó correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error en la sincronización:", error);
      toast({
        title: "Error en la sincronización.",
        description: "Ocurrió un error inesperado. Intente nuevamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setTimeout(() => {
        setSyncDisabled((prevState) => ({ ...prevState, [empresa.id]: false }));
      }, 5000);

      setWarehouseModalOpen(false);
    }
  };

  const formatWarehouses = (warehouses) => {
    return warehouses
      .split(",")
      .map((wh) => `'${wh.trim()}'`)
      .join(", ");
  };

  const handleDelete = (id) => {
    dispatch(deleteEmpresa(id)).then(() => {
      dispatch(tablaEmpresa());
      toast({
        title: "Empresa eliminada.",
        description: "La empresa ha sido eliminada correctamente.",
        status: "info",
        duration: 2500,
        isClosable: true,
      });
    });
  };

  const handleEdit = (empresa) => {
    setCurrentEmpresa(empresa);
    setIsEditMode(true);
    onOpen();
  };

  const formatDate = (dateString) => {
    try {
      return dateString
        ? format(new Date(dateString), "dd-MM-yyyy HH:mm:ss")
        : "Fecha inválida";
    } catch (error) {
      return "Fecha inválida";
    }
  };

  const cardBg = useColorModeValue("gray.100", "gray.700");

  if (status === "loading" || paisesStatus === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (status === "failed" || paisesStatus === "failed") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Text fontSize="2xl" color="red.500">
          Error al cargar los datos: {error || paisesError}
        </Text>
      </Box>
    );
  }

  const paisMap = paises.reduce((acc, pais) => {
    acc[pais.id] = pais.nombre;
    return acc;
  }, {});

  return (
    <Box p={0} w="100%" maxW="100vw" overflowX="hidden">
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        mb={4}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="2xl" fontWeight="bold">
            Empresas
          </Text>
          <Button
            colorScheme="teal"
            leftIcon={<AddIcon />}
            onClick={() => {
              setIsEditMode(false);
              setCurrentEmpresa({
                nombre: "",
                alias: "",
                estaActivo: true,
                baseDatos: "",
                ipBaseDatos: "",
                paisId: "",
              });
              onOpen();
            }}
          >
            Agregar Empresa
          </Button>
        </Flex>
      </MotionBox>

      <SimpleGrid
        columns={[1, 2, 3]}
        spacing={4}
        w="100%"
        maxW="100vw"
        overflowX="hidden"
      >
        {data.map((empresa) => (
          <MotionBox
            key={empresa.id}
            p={4}
            bg={cardBg}
            rounded="md"
            shadow="md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            w="100%"
            maxW="100%"
          >
            <VStack align="start" spacing={2} w="100%">
              <HStack justifyContent="space-between" w="100%">
                <Text fontSize="lg" fontWeight="bold">
                  {empresa.nombre}
                </Text>
                <Badge colorScheme={empresa.estaActivo ? "green" : "red"}>
                  {empresa.estaActivo ? "ACTIVO" : "INACTIVO"}
                </Badge>
              </HStack>
              <Text>
                <strong>Alias:</strong> {empresa.alias}
              </Text>
              <Text>
                <strong>Creada:</strong> {formatDate(empresa.creadoEl)}
              </Text>
              <Text>
                <strong>Actualizada:</strong>{" "}
                {formatDate(empresa.actualizadoEl)}
              </Text>
              <Text>
                <strong>Base de Datos:</strong> {empresa.baseDatos}
              </Text>
              <Text>
                <strong>Serie:</strong> {empresa.serie}
              </Text>
              <Text>
                <strong>IP SAP:</strong> {empresa.ipBaseDatos}
              </Text>
              <Text>
                <strong>País:</strong> {paisMap[empresa.paisId] || "Sin país"}
              </Text>
              <Stack direction="row" spacing={2} mt={2} w="100%">
                <Tooltip label="Editar" aria-label="Editar">
                  <IconButton
                    icon={<EditIcon />}
                    onClick={() => handleEdit(empresa)}
                    variant="outline"
                    colorScheme="teal"
                  />
                </Tooltip>
                <Tooltip label="Eliminar" aria-label="Eliminar">
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={() => handleDelete(empresa.id)}
                    variant="outline"
                    colorScheme="red"
                  />
                </Tooltip>
                <Tooltip label="Sincronizar Deus" aria-label="Sincronizar Deus">
                  <IconButton
                    icon={<FaSyncAlt />}
                    onClick={() =>
                      handleSync(
                        empresa.id,
                        empresa.baseDatos,
                        empresa.ipBaseDatos
                      )
                    }
                    variant="outline"
                    colorScheme={syncDisabled[empresa.id] ? "gray" : "blue"}
                    isDisabled={syncDisabled[empresa.id]}
                    isLoading={syncDisabled[empresa.id]}
                  />
                </Tooltip>
                <Tooltip
                  label="Sincronizar Items"
                  aria-label="Sincronizar Items"
                >
                  <IconButton
                    icon={<FaSyncAlt />}
                    onClick={() => {
                      setCurrentEmpresa(empresa);
                      setWarehouseModalOpen(true);
                    }}
                    variant="outline"
                    colorScheme={syncDisabled[empresa.id] ? "gray" : "green"}
                    isDisabled={syncDisabled[empresa.id]}
                  />
                </Tooltip>
                <Tooltip label="Sincronizar Recetas">
                  <IconButton
                    icon={<FaSyncAlt />}
                    onClick={() => {
                      setCurrentEmpresa(empresa);
                      setRecetaModalOpen(true);
                    }}
                    variant="outline"
                    colorScheme="purple"
                    isDisabled={syncDisabled[`receta-${empresa.id}`]}
                    isLoading={syncDisabled[`receta-${empresa.id}`]}
                  />
                </Tooltip>
              </Stack>
            </VStack>
          </MotionBox>
        ))}
      </SimpleGrid>

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
      <Modal
        isOpen={warehouseModalOpen}
        onClose={() => setWarehouseModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sincronizar Items</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Almacenes (separados por comas)</FormLabel>
              <Input
                placeholder="Ejemplo: CA-0300, CA-0100"
                value={warehouses}
                onChange={(e) => setWarehouses(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={handleSyncWithWarehouses}
              isDisabled={syncDisabled[currentEmpresa.id]}
            >
              Sincronizar
            </Button>
            <Button
              variant="ghost"
              onClick={() => setWarehouseModalOpen(false)}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={recetaModalOpen} onClose={() => setRecetaModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sincronizar Recetas</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Almacenes para receta (coma separado)</FormLabel>
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
              isDisabled={syncDisabled[`receta-${currentEmpresa.id}`]}
            >
              Sincronizar Recetas
            </Button>
            <Button variant="ghost" onClick={() => setRecetaModalOpen(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PageFormEmpresa;
