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
  Grid,
  GridItem,
  useColorModeValue,
} from "@chakra-ui/react";
import useQaIntakeForm from "../../hooks/QA/useQaAggregated";
import ProviderSelect from "../../components/QA/ProviderSelect";
import QaProductTable from "../../components/QA/QaProductTable";
import MuestreoPanel from "../../components/QA/MuestreoPanel";
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
    openMuestreo,
    closeMuestreo,
    onSaveMuestreo,
    savingMuestreo,
    onFinalize,
  } = useQaIntakeForm(pedidoId);

  const [finalizing, setFinalizing] = useState(false);

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
            {pedido.pais} · {pedido.trazabilidad_Prod || "—"}
            {pedido.lote ? ` · Lote ${pedido.lote}` : ""}
          </Text>
        </HStack>

        <HStack gap={4} mb={6} align="center" flexWrap="wrap">
          <ProviderSelect
            value={provider}
            onChange={setProvider}
            placeholder={pedido.proveedor || "Proveedor…"}
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

        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 380px" }}
          gap={6}
          alignItems="start"
        >
          <GridItem bg={panelBg} rounded="xl" p={4} shadow="sm">
            <QaProductTable items={items} onMuestreoClick={openMuestreo} />
          </GridItem>

          <GridItem bg={panelBg} rounded="xl" p={4} shadow="sm">
            <MuestreoPanel
              selected={selectedQa}
              onClose={closeMuestreo}
              onSave={onSaveMuestreo}
              saving={savingMuestreo}
            />
          </GridItem>
        </Grid>
      </Container>

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
