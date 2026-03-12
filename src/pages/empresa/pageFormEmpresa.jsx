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
import { EmpresaCard } from "./componentes/EmpresaCard";
import { EmpresaFormModal } from "./componentes/EmpresaFormModal";


const MotionBox = m.create ? m.create(Box) : m(Box);

import { useEmpresaForm } from "./hooks/useEmpresaForm";
import { SyncItemsModal } from "./componentes/SyncItemsModal";
import { DeleteEmpresaDialog } from "./componentes/DeleteEmpresaDialog";

const PageFormEmpresa = () => {
  const {
    data, status, error, paises, paisesStatus, paisesError,
    isOpen, onOpen, onClose,
    isEditMode, setIsEditMode,
    currentEmpresa, setCurrentEmpresa,
    errors, 
    handleInputChange, handleSubmit,
    handleSync, handleSyncWithWarehouses,
    warehouseModalOpen, setWarehouseModalOpen,
    warehouses, setWarehouses,
    isDeleteOpen, onDeleteOpen, onDeleteClose,
    handleDelete,
    syncDisabled,
  } = useEmpresaForm();

  const isMobile = useBreakpointValue({ base: true, md: false });
  const cancelRef = useRef();

  const handleEdit = (empresa) => {
    setCurrentEmpresa(empresa);
    setIsEditMode(true);
    onOpen();
  };

  const handleOpenWarehouseModal = (empresa) => {
    setCurrentEmpresa(empresa);
    setWarehouseModalOpen(true);
  };

  const formatDate = (dateString) => {
    try {
      return dateString
        ? format(new Date(dateString), "dd-MM-yyyy HH:mm:ss")
        : "Fecha inválida";
    } catch {
      return "Fecha inválida";
    }
  };

  if (status === "loading" || paisesStatus === "loading") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (status === "failed" || paisesStatus === "failed") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Text fontSize="2xl" color="red.500">Error: {error || paisesError}</Text>
      </Box>
    );
  }

  const paisMap = paises.reduce((acc, p) => ({ ...acc, [p.id]: p.nombre }), {});

  return (
    <LazyMotion features={domAnimation}>
      <Box p={0} w="100%" maxW="100vw" overflowX="hidden">
        <MotionBox initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} mb={4}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="2xl" fontWeight="bold">Empresas</Text>
            <Button
              colorScheme="teal"
              leftIcon={<AddIcon />}
              onClick={() => {
                setIsEditMode(false);
                setCurrentEmpresa({ nombre: "", alias: "", estaActivo: true, baseDatos: "", ipBaseDatos: "", paisId: "" });
                onOpen();
              }}
            >
              Agregar Empresa
            </Button>
          </Flex>
        </MotionBox>

        <SimpleGrid columns={[1, 2, 3]} spacing={4} w="100%">
          {data.map((empresa) => (
            <EmpresaCard
              key={empresa.id}
              empresa={empresa}
              paisNombre={paisMap[empresa.paisId]}
              formatDate={formatDate}
              handleEdit={handleEdit}
              confirmDelete={() => { setCurrentEmpresa(empresa); onDeleteOpen(); }}
              handleSync={handleSync}
              handleOpenWarehouseModal={handleOpenWarehouseModal}
              syncDisabled={syncDisabled}
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

        <SyncItemsModal
          isOpen={warehouseModalOpen}
          onClose={() => setWarehouseModalOpen(false)}
          warehouses={warehouses}
          setWarehouses={setWarehouses}
          handleSyncWithWarehouses={handleSyncWithWarehouses}
          currentEmpresaId={currentEmpresa.id}
          syncDisabled={syncDisabled} // Pass from hook
        />

        <DeleteEmpresaDialog
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          cancelRef={cancelRef}
          handleDelete={handleDelete}
        />
      </Box>
    </LazyMotion>
  );
};

export default PageFormEmpresa;
