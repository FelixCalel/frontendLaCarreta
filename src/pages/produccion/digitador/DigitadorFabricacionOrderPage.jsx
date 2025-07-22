import { useState, useMemo } from "react";
import {
  Box,
  Center,
  Spinner,
  Text,
  Flex,
  InputGroup,
  Input,
  InputLeftElement,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FaFileUpload } from "react-icons/fa";
import { useGetPedidosAgrupadosQuery } from "../../../services/pedidoProductionApi";
import { GroupCardGrid } from "../../../components/production/digitador/FabricacionCardGrid";

const DigitadorFabricacionOrdersPage = () => {
  const { data: groups = [], isLoading, error } = useGetPedidosAgrupadosQuery();

  const base = useMemo(
    () => groups.filter((g) => g.items.some((it) => it.etapaId === 2)),
    [groups]
  );

  const [term, setTerm] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const bgColor = useColorModeValue("white", "gray.800");

  const filtered = useMemo(
    () =>
      base.filter((g) => {
        const byText = !term || g.pedidoId.toString().includes(term);
        const byDate =
          !date ||
          (g.fechaEntrega &&
            new Date(g.fechaEntrega).toISOString().slice(0, 10) === date);
        const byStatus = !status || g.estado === status;
        return byText && byDate && byStatus;
      }),
    [base, term, date, status]
  );

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
        <Text color="red.500">Error al cargar órdenes.</Text>
      </Center>
    );
  }

  return (
    <Box p={4}>
      <Flex
        wrap="wrap"
        gap={4}
        mb={6}
        align="center"
        bg={bgColor}
        p={3}
        borderRadius="md"
      >
        <InputGroup maxW="240px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="DEU"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </InputGroup>

        <Input
          type="date"
          placeholder="Fecha de entrega"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          maxW="200px"
        />

        <Select
          placeholder="Estado"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          maxW="200px"
        >
          <option value="Pendiente">Pendiente</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Completado">Completado</option>
        </Select>
      </Flex>

      <GroupCardGrid
        groups={filtered}
        IconComponent={FaFileUpload}
        title="Orden de fabricación"
      />
    </Box>
  );
};

export default DigitadorFabricacionOrdersPage;
