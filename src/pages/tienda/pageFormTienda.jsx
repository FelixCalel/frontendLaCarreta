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
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  tablaTienda,
  addNewTienda,
  deleteTienda,
  updateTienda,
  toggleTiendaStatus,
} from "../../store/Tienda/thunks";
import TiendaTable from "./componentes/TiendaTable";
import TiendaModal from "./componentes/TiendaModal";

const PageFormTienda = () => {
  const dispatch = useDispatch();
  const { data, status, error, ciudadesStatus, rutasStatus, deudoresStatus } =
    useSelector((state) => state.tiendas);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingTienda, setEditingTienda] = useState(null);
  const [isToggling, setIsToggling] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (status === "idle") {
      dispatch(tablaTienda());
    }
  }, [dispatch, status]);

  const handleAdd = () => {
    setEditingTienda(null);
    onOpen();
  };

  const handleEdit = (tienda) => {
    setEditingTienda(tienda);
    onOpen();
  };

  const handleSave = async (tiendaData) => {
    try {
      if (editingTienda) {
        await dispatch(updateTienda(tiendaData)).unwrap();
        toast({ title: "Tienda actualizada correctamente", status: "success" });
      } else {
        await dispatch(addNewTienda(tiendaData)).unwrap();
        toast({ title: "Tienda creada correctamente", status: "success" });
      }
      dispatch(tablaTienda());
    } catch (err) {
      toast({
        title: "Error al guardar",
        description: err.message || "Ocurrió un error inesperado",
        status: "error",
      });
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta tienda?")) return;
    try {
      await dispatch(deleteTienda(id)).unwrap();
      toast({ title: "Tienda eliminada", status: "info" });
      dispatch(tablaTienda());
    } catch (err) {
      toast({
        title: "Error al eliminar",
        description: err.message,
        status: "error",
      });
    }
  };

  const handleToggleStatus = async (tienda) => {
    try {
      setIsToggling(true);
      await dispatch(
        toggleTiendaStatus({ id: tienda.id, estaActivo: !tienda.estaActivo })
      ).unwrap();
      
      toast({
        title: `Tienda ${!tienda.estaActivo ? "activada" : "desactivada"}`,
        status: "success",
        duration: 2000,
      });
      dispatch(tablaTienda());
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado.",
        status: "error",
      });
    } finally {
      setIsToggling(false);
    }
  };

  if (
    status === "loading" ||
    ciudadesStatus === "loading" ||
    rutasStatus === "loading" ||
    deudoresStatus === "loading"
  ) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" color="green.500" thickness="4px" />
      </Flex>
    );
  }

  if (status === "failed") {
    return (
      <Flex justify="center" align="center" h="100vh" direction="column">
        <Text fontSize="2xl" color="red.500" mb={4}>
          Error al cargar los datos
        </Text>
        <Text color="gray.600">{error}</Text>
        <Button mt={4} onClick={() => dispatch(tablaTienda())}>
          Reintentar
        </Button>
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={0} mt={-4}>
      <Flex justify="space-between" align="center" mb={0}>
        <Box>
          <Heading size="lg" color="gray.700">Gestión de Tiendas</Heading>
          <Text color="gray.500" mt={1}>Administra las tiendas, rutas y asignaciones.</Text>
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
          Nueva Tienda
        </Button>
      </Flex>

      <TiendaTable
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        isToggling={isToggling}
      />

      <TiendaModal
        isOpen={isOpen}
        onClose={onClose}
        initialData={editingTienda}
        onSave={handleSave}
      />
    </Container>
  );
};

export default PageFormTienda;
