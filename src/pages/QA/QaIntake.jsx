import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  Spacer,
  Button,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import useQaIntakeForm from "../../hooks/QA/useQaIntakeForm";
import ProviderSelect from "../../components/QA/ProviderSelect";
import QaProductTable from "../../components/QA/QaProductTable";
import MuestreoModal from "../../components/QA/MuestreoModal";
import QaFinalizeModal from "../../components/QA/QaFinalizeModal";

export default function QaIntake() {
  const { pedidoId } = useParams();
  const {
    isLoading,
    pedido,
    items,
    provider,
    setProvider,
    ptmq,
    setPtmq,
    selectedQa,
    selectMuestreo,
    clearSelection,
    onSaveMuestreo,
    savingMuestreo,
    onFinalize,
  } = useQaIntakeForm(pedidoId);

  const [finalizing, setFinalizing] = useState(false);
  const muestreoModal = useDisclosure();

  const pageBg = useColorModeValue("gray.50", "gray.900");
  const panelBg = useColorModeValue("white", "gray.800");

  if (isLoading) return <Box p={6}>Cargando…</Box>;
  if (!pedido) return <Box p={6}>Pedido no encontrado.</Box>;

  return (
    <Box minH="100vh" bg={pageBg} py={{ base: 4, md: 8 }}>
      <Container maxW="7xl">
        <HStack mb={6} align="baseline">
          <Heading size="lg">
            Tarima Entrante / Muestreo — Pedido #{pedido.pedidoId}
          </Heading>
          <Spacer />
          <Text fontSize="sm" opacity={0.8}>
            {pedido.pais} · {pedido.trazabilidad || "—"}
          </Text>
        </HStack>

        <HStack gap={4} mb={6} align="center" flexWrap="wrap">
          <ProviderSelect
            value={provider}
            onChange={setProvider}
            placeholder={"Proveedor…"}
          />
          <HStack>
            <input
              id="ptmq"
              type="checkbox"
              checked={ptmq}
              onChange={(e) => setPtmq(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: "#38A169" }}
            />
            <label htmlFor="ptmq">¿Es PTMQ?</label>
          </HStack>
          <Spacer />
          <Button colorScheme="green" onClick={() => setFinalizing(true)}>
            Finalizar
          </Button>
        </HStack>

        <Box bg={panelBg} rounded="xl" p={4} shadow="sm">
          <QaProductTable
            items={items}
            onMuestreoClick={(qaId, muestreoId) => {
              selectMuestreo(qaId, muestreoId);
              muestreoModal.onOpen();
            }}
          />
        </Box>
      </Container>

      <MuestreoModal
        isOpen={muestreoModal.isOpen}
        onClose={() => {
          muestreoModal.onClose();
          clearSelection();
        }}
        selected={selectedQa}
        onSave={async (muestreoId, form) => {
          await onSaveMuestreo(muestreoId, form);
          muestreoModal.onClose();
          clearSelection();
        }}
        saving={savingMuestreo}
      />

      <QaFinalizeModal
        open={finalizing}
        onCancel={() => setFinalizing(false)}
        onAccept={() => {
          setFinalizing(false);
          onFinalize();
        }}
      />
    </Box>
  );
}
