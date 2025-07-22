import PropTypes from "prop-types";
import { SimpleGrid } from "@chakra-ui/react";
import { GroupCard } from "./FabricacionCard";

export const GroupCardGrid = ({ groups, IconComponent, title }) => (
  <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4} mb={6}>
    {groups.map((g) => (
      <GroupCard
        key={g.pedidoId}
        group={g}
        IconComponent={IconComponent}
        title={title}
      />
    ))}
  </SimpleGrid>
);

GroupCardGrid.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.object).isRequired,
  IconComponent: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
};
