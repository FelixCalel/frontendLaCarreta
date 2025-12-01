import PropTypes from "prop-types";
import { SimpleGrid, Box, Text, Icon, Flex, useColorModeValue } from "@chakra-ui/react";
import { FiCheckCircle, FiCircle } from "react-icons/fi";

const RutaSelector = ({
  selectedRoutes,
  setSelectedRoutes,
  filteredRutas,
}) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const cardBorder = useColorModeValue("gray.200", "gray.600");
  const selectedBg = useColorModeValue("green.50", "green.900");
  const selectedBorder = useColorModeValue("green.500", "green.400");
  const hoverBg = useColorModeValue("gray.50", "gray.600");

  const handleToggleRoute = (rutaId) => {
    if (selectedRoutes.includes(rutaId)) {
      setSelectedRoutes((prev) => prev.filter((id) => id !== rutaId));
    } else {
      setSelectedRoutes((prev) => [...prev, rutaId]);
    }
  };

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4} maxH="400px" overflowY="auto" p={1}>
      {filteredRutas.length > 0 ? (
        filteredRutas.map((ruta) => {
          const isSelected = selectedRoutes.includes(ruta.id);
          return (
            <Box
              key={ruta.id}
              onClick={() => handleToggleRoute(ruta.id)}
              cursor="pointer"
              bg={isSelected ? selectedBg : cardBg}
              borderWidth="2px"
              borderColor={isSelected ? selectedBorder : cardBorder}
              borderRadius="lg"
              p={3}
              transition="all 0.2s"
              _hover={{ bg: isSelected ? selectedBg : hoverBg, transform: "translateY(-2px)", shadow: "md" }}
            >
              <Flex align="center" justify="space-between">
                <Text fontWeight={isSelected ? "bold" : "normal"} fontSize="sm">
                  {ruta.nombre}
                </Text>
                <Icon 
                  as={isSelected ? FiCheckCircle : FiCircle} 
                  color={isSelected ? "green.500" : "gray.400"} 
                  boxSize={5}
                />
              </Flex>
            </Box>
          );
        })
      ) : (
        <Text color="gray.500" gridColumn="1/-1" textAlign="center">
          No se encontraron rutas.
        </Text>
      )}
    </SimpleGrid>
  );
};

RutaSelector.propTypes = {
  selectedRoutes: PropTypes.array.isRequired,
  setSelectedRoutes: PropTypes.func.isRequired,
  filteredRutas: PropTypes.array.isRequired,
};

export default RutaSelector;
