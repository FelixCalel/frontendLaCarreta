import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  useColorModeValue,
  Stack,
  Divider,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import useQaAggregated from "../../hooks/QA/useQaAggregated";
import QaSearchBar from "../../components/QA/QaSearchBar";
import QaDateFilter from "../../components/QA/QaDateFilter";
import QaStatCard from "../../components/QA/QaStatCard";
import QaLotList from "../../components/QA/QaLotList";

const MotionBox = motion(Box);

export default function QADashboard() {
  const nav = useNavigate();
  const {
    search,
    setSearch,
    date,
    setDate,
    recibidos,
    pendientesQA,
    listosSAP,
    isLoading,
  } = useQaAggregated();

  const goToIntake = (pedidoId) => nav(`/qa/intake/${pedidoId}`);

  const bg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box w="full" minH="100vh" bg={bg} py={{ base: 2, md: 2 }}>
      <Container maxW="7xl">
        <MotionBox
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Heading size="lg" textAlign="center" mb={2} letterSpacing="wide">
            Dashboard de Calidad (QA)
          </Heading>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={4}
            maxW="5xl"
            mx="auto"
            mb={3}
          >
            <QaSearchBar value={search} onChange={setSearch} />
            <QaDateFilter value={date} onChange={setDate} />
          </SimpleGrid>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
        >
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={6}
            maxW="6xl"
            mx="auto"
          >
            <QaStatCard title="Lotes Recibidos" value={recibidos.length} />
            <QaStatCard title="Pendientes en QA" value={pendientesQA.length} />
            <QaStatCard title="Listos a SAP" value={listosSAP.length} />
          </SimpleGrid>
        </MotionBox>

        <Stack spacing={2} mt={2}>
          <Divider />
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={8}
            maxW="6xl"
            mx="auto"
          >
            <QaLotList
              title="Lotes Recibidos"
              items={recibidos}
              onOpenIntake={goToIntake}
              loading={isLoading}
            />
            <QaLotList
              title="Pendientes en QA"
              items={pendientesQA}
              onOpenIntake={goToIntake}
              loading={isLoading}
            />
            <QaLotList
              title="Listos a SAP"
              items={listosSAP}
              onOpenIntake={goToIntake}
              loading={isLoading}
            />
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}
