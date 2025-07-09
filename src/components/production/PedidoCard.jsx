import PropTypes from "prop-types";
import { SimpleGrid } from "@chakra-ui/react";
import { OrderCard } from "./OrderCard";

export const CardGrid = ({ pedidos, selected, onSelect }) => (
  <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4} mb={6}>
    {pedidos.map((p) => (
      <OrderCard
        key={p.id}
        pedido={p}
        isSelected={p.id === selected}
        onToggle={() => onSelect(p.id)}
      />
    ))}
  </SimpleGrid>
);

CardGrid.propTypes = {
  pedidos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      correlativo: PropTypes.string.isRequired,
      cliente: PropTypes.string.isRequired,
      fechaEntrega: PropTypes.string.isRequired,
      estado: PropTypes.string.isRequired,
    })
  ).isRequired,
  selected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSelect: PropTypes.func,
};

CardGrid.defaultProps = {
  selected: null,
  onSelect: () => {},
};
