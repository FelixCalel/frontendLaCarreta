import React from "react";
import {
  Box,
  Flex,
  useColorModeValue,
  FormControl,
  FormLabel,
  Button,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  VStack,
  HStack,
  Text,
  Icon,
} from "@chakra-ui/react";
import { FaFilter } from "react-icons/fa";
import Select from "react-select";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import PropTypes from "prop-types";

import { FilterForm } from "./FilterForm";

const HistorialFilters = ({
  filters,
  onFilterChange,
  uniqueValues,
  roleId,
}) => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputColor = useColorModeValue("gray.800", "white");
  const menuBg = useColorModeValue("#ffffff", "#1A202C");
  const singleValueColor = useColorModeValue("gray.800", "white");
  const optionFocusedBg = useColorModeValue("blue.50", "gray.700");
  const optionColor = useColorModeValue("gray.800", "white");
  const optionActiveBg = useColorModeValue("blue.100", "gray.600");
  const modalBgColor = useColorModeValue("rgba(255, 255, 255, 0.85)", "rgba(26, 32, 44, 0.85)");
  const modalBorderColor = useColorModeValue("gray.200", "gray.700");
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const customStyles = {
    control: (provided) => ({
      ...provided, backgroundColor: bg, borderColor: borderColor, minHeight: "32px", height: "32px", fontSize: "0.875rem", boxShadow: "none",
      "&:hover": { borderColor: "gray.400" },
    }),
    valueContainer: (provided) => ({ ...provided, height: "32px", padding: "0 8px" }),
    input: (provided) => ({ ...provided, margin: "0px", color: inputColor }),
    indicatorsContainer: (provided) => ({ ...provided, height: "32px" }),
    menu: (provided) => ({
      ...provided, backgroundColor: menuBg, zIndex: 9999, fontSize: "0.875rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      border: `1px solid ${borderColor}`,
    }),
    singleValue: (provided) => ({ ...provided, color: singleValueColor }),
    option: (provided, state) => ({
      ...provided, backgroundColor: state.isFocused ? optionFocusedBg : "transparent", color: optionColor, fontSize: "0.875rem", cursor: "pointer",
      "&:active": { backgroundColor: optionActiveBg },
    }),
  };

  const tiendaOptions = uniqueValues.tiendas.map((t) => ({ value: t, label: t }));
  const deudorOptions = uniqueValues.deudores.map((d) => ({ value: d, label: d }));
  const usuarioOptions = uniqueValues.usuarios.map((u) => ({ value: u, label: u }));
  const estadoOptions = [
    { value: 2, label: "Pendiente" },
    { value: 3, label: "Aprobado" },
    { value: 4, label: "Cancelado" },
    { value: 5, label: "Exportado" },
  ];

  const selectedDates = [
    filters.fechaInicio ? new Date(filters.fechaInicio) : null,
    filters.fechaFin ? new Date(filters.fechaFin) : null,
  ].filter(Boolean);

  const filterFormProps = {
    filters, onFilterChange, tiendaOptions, deudorOptions, usuarioOptions, estadoOptions,
    selectedDates, showUserFilter: [1, 3].includes(roleId), customStyles, bg, borderColor, isMobile, onClose
  };

  if (isMobile) {
    return (
      <Box mb={4}>
        <Button leftIcon={<Icon as={FaFilter} />} onClick={onOpen} colorScheme="teal" variant="outline" size="sm" w="100%" display="block">
          Filtrar Pedidos
        </Button>
        <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
          <ModalOverlay />
          <ModalContent mx={4} bg={modalBgColor} backdropFilter="blur(10px)" borderWidth="1px" borderColor={modalBorderColor} boxShadow="xl">
            <ModalHeader>Filtrar Pedidos</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch" mt={2}>
                <FilterForm {...filterFormProps} />
                <Button colorScheme="teal" onClick={onClose} mt={4}>Aplicar Filtros</Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    );
  }

  return (
    <Box bg={bg} p={3} rounded="lg" shadow="sm" borderWidth="1px" borderColor={borderColor} mb={2}>
      <Flex direction={{ base: "column", lg: "row" }} gap={4} alignItems={{ base: "stretch", lg: "flex-start" }} wrap="wrap">
        <FilterForm {...filterFormProps} />
      </Flex>
    </Box>
  );
};

HistorialFilters.propTypes = {
  filters: PropTypes.shape({
    tienda: PropTypes.string,
    deudor: PropTypes.string,
    usuario: PropTypes.string,
    fechaInicio: PropTypes.string,
    fechaFin: PropTypes.string,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  uniqueValues: PropTypes.shape({
    tiendas: PropTypes.arrayOf(PropTypes.string),
    deudores: PropTypes.arrayOf(PropTypes.string),
    usuarios: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  roleId: PropTypes.number,
};

export default HistorialFilters;
