import PropTypes from "prop-types";
import { SimpleGrid } from "@chakra-ui/react";
import { GroupCard } from "./DigitadorCard";

export const GroupCardGrid = ({
  groups,
  IconComponent,
  title,
  forceHistory = false,
}) => (
  <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4} mb={6}>
    {groups.map((g, idx) => (
      <GroupCard
        key={g.gridKey || `${g.pedidoId}-${idx}`}
        group={{ ...g, forceHistory }}
        IconComponent={IconComponent}
        title={title}
      />
    ))}
  </SimpleGrid>
);

GroupCardGrid.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.object).isRequired,
  IconComponent: PropTypes.elementType,
  title: PropTypes.string,
  forceHistory: PropTypes.bool,
};
