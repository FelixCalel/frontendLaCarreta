import PropTypes from "prop-types";
import { Box, Flex, Text } from "@chakra-ui/react";

const HeaderInfo = ({ item }) => (
  <Box
    bg="white"
    p={4}
    rounded="md"
    shadow="sm"
    mb={5}
    borderLeft="4px solid"
    borderColor="green.400"
  >
    <Flex justify="space-between" align="center">
      <Box>
        <Text fontWeight="bold" fontSize="lg" color="gray.700">
          {item.codigo}
        </Text>
        <Text color="gray.600">{item.nombre}</Text>
      </Box>
      <Box textAlign="right">
        <Text fontSize="sm" color="gray.500">
          Cantidad Total Solicitada
        </Text>
        <Text fontSize="2xl" fontWeight="black" color="green.600">
          {item.cantidad || 0}
        </Text>
      </Box>
    </Flex>
  </Box>
);

HeaderInfo.propTypes = {
  item: PropTypes.shape({
    codigo: PropTypes.string,
    nombre: PropTypes.string,
    cantidad: PropTypes.number,
  }).isRequired,
};

export default HeaderInfo;
