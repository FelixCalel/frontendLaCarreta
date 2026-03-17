import PropTypes from "prop-types";
import { Flex, Icon, Heading, Text } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

export const EmptyState = ({ cardBg, cardBorder, message, heading }) => (
  <Flex
    direction="column"
    align="center"
    justify="center"
    p={10}
    mt={6}
    bg={cardBg}
    borderRadius="lg"
    border="1px dashed"
    borderColor={cardBorder}
  >
    <Icon as={ViewIcon} boxSize={10} color="gray.400" mb={4} />
    <Heading size="md" color="gray.500" mb={2}>
      {heading || "Sin resultados"}
    </Heading>
    <Text color="gray.500" textAlign="center">
      {message}
    </Text>
  </Flex>
);

EmptyState.propTypes = {
  cardBg: PropTypes.string.isRequired,
  cardBorder: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  heading: PropTypes.string,
};

