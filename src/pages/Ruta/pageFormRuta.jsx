import { useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Text,
  Button,
  useDisclosure,
  useToast,
  Flex,
  Heading,
  Container,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import {
  tablaRuta,
  addNewRuta,
  deleteRuta,
  updateRuta,
  toggleRutaStatus,
} from "../../store/Ruta/thunks";
import RutaTable from "./componente/RutaTable";
import RutaModal from "./componente/RutaModal";

const PageFormRuta = () => {
  const dispatch = useDispatch();
  const { data, status, error, rutasStatus, rutasError } = useSelector(
    (state) => state.rutas
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();
  const [editingRuta, setEditingRuta] = useState(null);
  const [rutaToDelete, setRutaToDelete] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();

  useEffect(() => {
    if (status === "idle") {
      dispatch(tablaRuta());
    }
  }, [dispatch, status]);

  const handleAdd = () => {
    setEditingRuta(null);
    onOpen();
  };

  const handleEdit = (ruta) => {
    setEditingRuta(ruta);
    onOpen();
  };

  const handleSave = async (rutaData) => {
    try {
      if (editingRuta) {
        await dispatch(updateRuta(rutaData)).unwrap();
        toast({ title: "Ruta actualizada correctamente", status: "success" });
      } else {
        await dispatch(addNewRuta(rutaData)).unwrap();
        toast({ title: "Ruta creada correctamente", status: "success" });
      }
      dispatch(tablaRuta());
    } catch (err) {
      toast({
        title: "Error al guardar",
        description: err.message || "Ocurrió un error inesperado",
        status: "error",
      });
      throw err;
    }
  };

  const handleDeleteClick = (id) => {
    setRutaToDelete(id);
    onDeleteOpen();
  };

  const handleConfirmDelete = async () => {
    if (!rutaToDelete) return;
    try {
      await dispatch(deleteRuta(rutaToDelete)).unwrap();
      toast({ title: "Ruta eliminada", status: "info" });
      dispatch(tablaRuta());
      onDeleteClose();
    } catch (err) {
      toast({
        title: "Error al eliminar",
        description: err.message,
        status: "error",
      });
    }
  };

  const handleToggleStatus = async (id, estaActivo) => {
    try {
      await dispatch(toggleRutaStatus({ id, estaActivo })).unwrap();
      toast({
        title: `Ruta ${estaActivo ? "activada" : "desactivada"}`,
        status: "success",
        duration: 2000,
      });
      dispatch(tablaRuta());
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado.",
        status: "error",
      });
    }
  };

  if (status === "loading" || rutasStatus === "loading") {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" color="green.500" thickness="4px" />
      </Flex>
    );
  }

  if (status === "failed" || rutasStatus === "failed") {
    return (
      <Flex justify="center" align="center" h="100vh" direction="column">
        <Text fontSize="2xl" color="red.500" mb={4}>
          Error al cargar los datos
        </Text>
        <Text color="gray.600">{error || rutasError}</Text>
        <Button mt={4} onClick={() => dispatch(tablaRuta())}>
          Reintentar
        </Button>
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={0} mt={-4}>
      <Flex justify="space-between" align="center" mb={2}>
        <Box>
          <Heading size="lg" color="gray.700">Gestión de Rutas</Heading>
          <Text color="gray.500" mt={1}>Administra las rutas de distribución.</Text>
        </Box>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="green"
          size="md"
          onClick={handleAdd}
          boxShadow="md"
          _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
          transition="all 0.2s"
        >
          Nueva Ruta
        </Button>
      </Flex>

      <RutaTable
        data={data}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onToggleStatus={handleToggleStatus}
      />

      <RutaModal
        isOpen={isOpen}
        onClose={onClose}
        initialData={editingRuta}
        onSave={handleSave}
      />

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="xl" boxShadow="2xl">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Ruta
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de que deseas eliminar esta ruta? Esta acción no se puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose} variant="ghost">
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default PageFormRuta;
