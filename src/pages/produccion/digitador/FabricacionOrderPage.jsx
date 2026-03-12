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
  Input,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import FilterPanelFabricacion from "../../../components/production/fabricacion/FilterPanelFabricacion";
import { FabricacionRow } from "../../../components/production/fabricacion/FabricacionRow";

import { useFabricacionPage } from "./hooks/useFabricacionPage";

const FabricacionPage = () => {
  const {
    pedidoId, navigate, toast,
    term, setTerm, estado, setEstado, mesa, setMesa,
    comment, setComment, noComment, setNoComment, dateSAP, setDateSAP,
    isLoading, error, isSending,
    filtered, receta, cargandoReceta,
    isOpen, onOpen, onClose,
    handleCargarSAP
  } = useFabricacionPage();

  const headBg = useColorModeValue("gray.50", "gray.800");
  const tableBorder = useColorModeValue("gray.200", "gray.700");
  const modalBg = useColorModeValue("white", "gray.700");
  const tableBg = useColorModeValue("white", "gray.800");

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
    setDateSAP("");
    onOpen();
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
      <Flex
        mb={4}
        align="center"
        justify="space-between"
        direction={{ base: "column", md: "row" }}
        gap={4}
      >
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={() => navigate("/fabricacion/orden")}
        >
          Volver
        </Button>
        <Heading size="md" textAlign="center">
          Fabricación - Pedido #{pedidoId}
        </Heading>
        <Box>
          <Button
            colorScheme="green"
            onClick={handleOpenModal}
            isDisabled={!filtered.length}
          >
            Cargar a SAP
          </Button>
        </Box>
      </Flex>

      <FilterPanelFabricacion
        term={term}
        onTermChange={setTerm}
        estado={estado}
        onEstadoChange={setEstado}
        mesa={mesa}
        onMesaChange={setMesa}
      />

      <Box
        w="100%"
        border="1px solid"
        borderColor={tableBorder}
        borderRadius="md"
        shadow="sm"
        overflowX="auto"
        bg={tableBg}
      >
        <Table variant="simple" size="sm">
          <Thead bg={headBg}>
            <Tr>
              <Th w="50px" />
              <Th>PRODUCTO</Th>
              <Th>Mesa/Pedido</Th>
              <Th textAlign="center">Completado</Th>
              <Th textAlign="center">Despacho</Th>
              <Th textAlign="center">Faltante</Th>
              <Th>Unidad</Th>
              <Th textAlign="center">Procesado</Th>
              <Th>Trazabilidad</Th>
              <Th>Almacén</Th>
              <Th>Acción</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((o, idx) => (
              <FabricacionRow
                key={o.id_detallePedido ?? o.id}
                order={o}
                pedidoId={pedidoId}
                receta={receta}
                cargandoReceta={cargandoReceta}
                mostrarReceta={idx === 0}
                index={idx}
              />
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader>Cargar a SAP</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2} fontWeight="bold">
              Fecha de Orden (Obligatorio):
            </Text>
            <Input
              type="date"
              value={dateSAP}
              onChange={(e) => setDateSAP(e.target.value)}
              mb={4}
            />
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
              isDisabled={!dateSAP}
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
