import { useState, useMemo } from "react";
import {
  Box,
  Center,
  Spinner,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  Checkbox,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import {
  useGetAllPedidosProduccionQuery,
  useAvanzarEtapaMutation,
  useAvanzarMultiEtapaDetalleMutation,
} from "../../../services/pedidoProductionApi";

import FilterPanelFabricacion from "../../../components/production/fabricacion/FilterPanelFabricacion";
import { FabricacionRow } from "../../../components/production/fabricacion/FabricacionRow";

const FabricacionPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    data: pedidos = [],
    isLoading,
    error,
  } = useGetAllPedidosProduccionQuery();

  const [avanzarEtapa, { isLoading: sendingPedido }] =
    useAvanzarEtapaMutation();
  const [avanzarMultiDetalle, { isLoading: sendingDetalles }] =
    useAvanzarMultiEtapaDetalleMutation();

  const [term, setTerm] = useState("");
  const [estado, setEstado] = useState("");
  const [mesa, setMesa] = useState("");
  const [comment, setComment] = useState("");
  const [noComment, setNoComment] = useState(false);
  const isSending = sendingPedido || sendingDetalles;

  const filtered = useMemo(
    () =>
      pedidos
        .filter((o) => {
          const byText =
            !term ||
            o.itemCode?.toLowerCase().includes(term.toLowerCase()) ||
            o.productoNombre?.toLowerCase().includes(term.toLowerCase());
          const byEstado =
            !estado || (o.completo ? "Completado" : "Pendiente") === estado;
          const byMesa = !mesa || String(o.id_asigArea) === mesa;
          return byText && byEstado && byMesa;
        })
        .sort((a, b) => a.id - b.id),
    [pedidos, term, estado, mesa]
  );

  const handleOpenModal = () => {
    if (!filtered.length) {
      toast({
        title: "Sin ítems",
        description: "No hay ítems filtrados para enviar.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setComment("");
    setNoComment(false);
    onOpen();
  };

  const handleCargarSAP = async () => {
    const usuarioId = Number(localStorage.getItem("usuarioId") ?? 1);
    const comentario = noComment ? null : comment.trim();

    const detalleIds = filtered.map((o) => o.id_detallePedido);
    const pedidoId = Number(filtered[0]?.pedidoId ?? 0);
    const nuevaEtapaId = 3;

    try {
      if (detalleIds.length) {
        await avanzarMultiDetalle({
          detalleOrdenIds: detalleIds,
          usuarioId,
          nuevaEtapaId,
          comentario,
        }).unwrap();
      }

      await avanzarEtapa({
        pedidoId,
        usuarioId,
        nuevaEtapaId,
        comentario,
      }).unwrap();

      toast({
        title: "Pedido enviado a SAP",
        description: "Se avanzó a la etapa 3 correctamente.",
        status: "success",
        duration: 3500,
        isClosable: true,
      });

      onClose();
      navigate(-1);
    } catch (err) {
      toast({
        title: "Error",
        description: err?.data?.error || "No se pudo cargar a SAP.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Center py={20}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center py={20}>
        <Text color="red.500">Error al cargar órdenes de fabricación.</Text>
      </Center>
    );
  }

  return (
    <Box p={6}>
      <FilterPanelFabricacion
        term={term}
        onTermChange={setTerm}
        estado={estado}
        onEstadoChange={setEstado}
        mesa={mesa}
        onMesaChange={setMesa}
      />

      <Table
        variant="simple"
        size="sm"
        border="1px solid"
        borderColor="gray.200"
      >
        <Thead>
          <Tr>
            <Th />
            <Th>ITEM</Th>
            <Th>Descripción artículo/serv</Th>
            <Th>Pedido</Th>
            <Th>Completar despacho</Th>
            <Th>Despacho</Th>
            <Th>Faltante</Th>
            <Th>Unidad de medida</Th>
            <Th>Cantidad</Th>
            <Th>No. Trazabilidad</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtered.map((o) => (
            <FabricacionRow key={o.id} order={o} />
          ))}
        </Tbody>
      </Table>

      <Flex
        mt={8}
        justify="space-between"
        align="center"
        flexWrap="wrap"
        gap={3}
      >
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="outline"
          colorScheme="green"
          w="fit-content"
          onClick={() => navigate("/fabricacion/orden")}
        >
          Regresar
        </Button>

        <Button
          colorScheme="green"
          w="fit-content"
          onClick={handleOpenModal}
          isDisabled={!filtered.length}
        >
          Cargar a SAP
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cargar a SAP</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>Comentario:</Text>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              isDisabled={noComment}
              placeholder="Escribe un comentario..."
              mb={3}
            />
            <Checkbox
              isChecked={noComment}
              onChange={(e) => setNoComment(e.target.checked)}
            >
              No agregar comentario
            </Checkbox>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              onClick={handleCargarSAP}
              isLoading={isSending}
            >
              Aceptar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FabricacionPage;
