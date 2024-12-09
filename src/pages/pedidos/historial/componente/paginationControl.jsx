import { Flex, Button, Text } from "@chakra-ui/react";

const PaginationControls = ({
  currentPage,
  totalPages,
  deudor,
  onPrevPage,
  onNextPage,
}) => {
  return (
    <Flex justify="space-between" align="center" mt={4}>
      <Button
        colorScheme="teal"
        isDisabled={currentPage === 1}
        onClick={onPrevPage}
      >
        Anterior
      </Button>
      <Text>
        Página {currentPage} de {totalPages} - Deudor: {deudor}
      </Text>
      <Button
        colorScheme="teal"
        isDisabled={currentPage === totalPages}
        onClick={onNextPage}
      >
        Siguiente
      </Button>
    </Flex>
  );
};

export default PaginationControls;
