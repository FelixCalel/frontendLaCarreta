import { Flex, IconButton, Button, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const maxVisiblePages = 10; // Máximo de números visibles
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <Flex mt={6} justify="center" alignItems="center" gap={2}>
      {/* Botón para retroceder */}
      <IconButton
        aria-label="Página anterior"
        icon={<ChevronLeftIcon />}
        isDisabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        size="sm"
        variant="ghost"
        _hover={{ bg: "gray.200" }}
      />

      {/* Números de páginas */}
      {startPage > 1 && (
        <Button
          size="sm"
          onClick={() => onPageChange(1)}
          variant="ghost"
          colorScheme="gray"
        >
          1
        </Button>
      )}
      {startPage > 2 && <Text>...</Text>}
      {pages.map((page) => (
        <Button
          key={page}
          size="sm"
          onClick={() => onPageChange(page)}
          variant={currentPage === page ? "solid" : "ghost"}
          colorScheme={currentPage === page ? "blue" : "gray"}
          _hover={{ bg: "gray.200" }}
        >
          {page}
        </Button>
      ))}
      {endPage < totalPages - 1 && <Text>...</Text>}
      {endPage < totalPages && (
        <Button
          size="sm"
          onClick={() => onPageChange(totalPages)}
          variant="ghost"
          colorScheme="gray"
        >
          {totalPages}
        </Button>
      )}

      {/* Botón para avanzar */}
      <IconButton
        aria-label="Página siguiente"
        icon={<ChevronRightIcon />}
        isDisabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        size="sm"
        variant="ghost"
        _hover={{ bg: "gray.200" }}
      />
    </Flex>
  );
};

// Validación de PropTypes
Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
