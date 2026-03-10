import { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  useBreakpointValue,
  Flex,
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
  SimpleGrid,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { m, LazyMotion, domAnimation } from "framer-motion";
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
} from "../../store/Empresa/thunks";
import EmpresaCard from "./componentes/EmpresaCard";
import EmpresaFormModal from "./componentes/EmpresaFormModal";


const MotionBox = m(Box);

const PageFormEmpresa = () => {
  const dispatch = useDispatch();
  const { data, status, error, paises, paisesStatus, paisesError } =
    useSelector((state) => state.empresas);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditMode, setIsEditMode] = useState(false);
  const [warehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [warehouses, setWarehouses] = useState("");

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
  const [deleteId, setDeleteId] = useState(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = useRef();

  useEffect(() => {
    if (status === "idle") {
      dispatch(tablaEmpresa());
    }
    if (paisesStatus === "idle") {
      dispatch(tablaPais());
    }
  }, [dispatch, status, paisesStatus]);

  const buildWarehousesParam = (str = "") =>
    str
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean)
      .map((w) => `'${w}'`)
      .join(",");

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
            currentEmpresa.ipBaseDatos,
          );
        } else {
          console.error(
            "Error: No se pudo obtener el ID de la empresa creada.",
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
        }),
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

  const handleSyncWithWarehouses = async () => {
    const empresa = data.find((emp) => emp.id === currentEmpresa.id);
    if (!empresa) return;

    const formattedWarehouses = buildWarehousesParam(warehouses);
    if (!formattedWarehouses) {
      toast({ title: "Ingresa al menos un almacén", status: "warning" });
      return;
    }

    setSyncDisabled((prev) => ({ ...prev, [empresa.id]: true }));
    toast({
      title: "Sincronización en progreso...",
      description: "Por favor, espera mientras se sincronizan los datos.",
      status: "info",
      duration: 15000,
      isClosable: true,
    });

    try {
      const syncResult = await dispatch(
        sincronizarItems({
          dbsap: empresa.baseDatos,
          ipsap: empresa.ipBaseDatos,
          empresaId: empresa.id,
          warehouses: formattedWarehouses,
        }),
      );

      if (syncResult.error) throw syncResult.error;

      toast({
        title: "Sincronización completada.",
        description: "La sincronización se completó correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (e) {
      console.error("Error en la sincronización:", e);
      toast({
        title: "Error en la sincronización.",
        description: "Ocurrió un error inesperado. Intente nuevamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setTimeout(() => {
        setSyncDisabled((prev) => ({ ...prev, [empresa.id]: false }));
      }, 5000);
      setWarehouseModalOpen(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    onDeleteOpen();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await dispatch(deleteEmpresa(deleteId));
    dispatch(tablaEmpresa());
    toast({
      title: "Empresa eliminada.",
      description: "La empresa ha sido eliminada correctamente.",
      status: "info",
      duration: 2500,
      isClosable: true,
    });
    setDeleteId(null);
    onDeleteClose();
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

  const handleOpenWarehouseModal = (empresa) => {
    setCurrentEmpresa(empresa);
    setWarehouseModalOpen(true);
  };

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
    <LazyMotion features={domAnimation}>
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
            <EmpresaCard
              key={empresa.id}
              empresa={empresa}
              paisNombre={paisMap[empresa.paisId]}
              formatDate={formatDate}
              syncDisabled={syncDisabled}
              handleEdit={handleEdit}
              confirmDelete={confirmDelete}
              handleSync={handleSync}
              handleOpenWarehouseModal={handleOpenWarehouseModal}
            />
          ))}
        </SimpleGrid>

        <EmpresaFormModal
          isOpen={isOpen}
          onClose={onClose}
          isMobile={isMobile}
          isEditMode={isEditMode}
          currentEmpresa={currentEmpresa}
          handleInputChange={handleInputChange}
          errors={errors}
          paises={paises}
          handleSubmit={handleSubmit}
        />
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

        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => {
            setDeleteId(null);
            onDeleteClose();
          }}
          isCentered
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Eliminar empresa
              </AlertDialogHeader>

              <AlertDialogBody>
                ¿Seguro que deseas eliminar esta empresa? Esta acción no se
                puede deshacer.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Cancelar
                </Button>
                <Button colorScheme="red" ml={3} onClick={handleDelete}>
                  Sí, eliminar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </LazyMotion>
  );
};

export default PageFormEmpresa;
