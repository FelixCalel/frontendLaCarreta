import PropTypes from "prop-types";
import { Box, Heading, VStack, Spinner, Text } from "@chakra-ui/react";
import QaLotCard from "./QaLotCard";

export default function QaLotList({ title, items, onOpenIntake, loading }) {
  return (
    <Box>
      <Heading size="md" mb={3}>
        {title}
      </Heading>
      <VStack align="stretch" spacing={3}>
        {loading && (
          <Box opacity={0.75}>
            <Spinner size="sm" mr={2} /> Cargando…
          </Box>
        )}
        {!loading && items?.length === 0 && (
          <Text opacity={0.7}>Sin datos.</Text>
        )}
        {!loading &&
          items?.map((p) => (
            <QaLotCard
              key={p.pedidoId}
              data={p}
              onOpen={() => onOpenIntake(p.pedidoId)}
            />
          ))}
      </VStack>
    </Box>
  );
}
QaLotList.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array,
  onOpenIntake: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
