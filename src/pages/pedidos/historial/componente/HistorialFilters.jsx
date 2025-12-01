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

const HistorialFilters = ({
  filters,
  onFilterChange,
  uniqueValues,
  roleId,
}) => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, lg: false });

  // React Select Styles - Compact
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: bg,
      borderColor: borderColor,
      minHeight: "32px", // Compact height
      height: "32px",
      fontSize: "0.875rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "gray.400",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "32px",
      padding: "0 8px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
      color: useColorModeValue("gray.800", "white"),
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "32px",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: useColorModeValue("#ffffff", "#1A202C"), // Solid background (white / gray.900)
      zIndex: 9999,
      fontSize: "0.875rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // Add shadow
      border: `1px solid ${borderColor}`,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: useColorModeValue("gray.800", "white"),
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? useColorModeValue("blue.50", "gray.700")
        : "transparent", // Default to transparent so it shows menu bg
      color: useColorModeValue("gray.800", "white"),
      fontSize: "0.875rem",
      cursor: "pointer",
      "&:active": {
        backgroundColor: useColorModeValue("blue.100", "gray.600"),
      },
    }),
  };

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleSelectChange = (field, selectedOption) => {
    handleChange(field, selectedOption ? selectedOption.value : "");
  };

  const handleDateChange = (selectedDates) => {
    const [start, end] = selectedDates;
    onFilterChange({
      ...filters,
      fechaInicio: start ? start.toISOString().split("T")[0] : "",
      fechaFin: end ? end.toISOString().split("T")[0] : "",
    });
  };

  // Convert unique values to options for React Select
  const tiendaOptions = uniqueValues.tiendas.map((t) => ({ value: t, label: t }));
  const deudorOptions = uniqueValues.deudores.map((d) => ({ value: d, label: d }));
  const usuarioOptions = uniqueValues.usuarios.map((u) => ({ value: u, label: u }));

  const selectedDates = [
    filters.fechaInicio ? new Date(filters.fechaInicio) : null,
    filters.fechaFin ? new Date(filters.fechaFin) : null,
  ].filter(Boolean);

  // Show User Filter only for Sales (Role 3) or Admin (Role 1 - assumption)
  const showUserFilter = [1, 3].includes(roleId);

  const FilterContent = (
    <>
      {/* Filtro por Tienda */}
      <FormControl flex="1" minW={{ base: "100%", lg: "200px" }}>
        <FormLabel fontSize="xs" fontWeight="bold" mb={1}>Tienda</FormLabel>
        <Select
          options={tiendaOptions}
          value={tiendaOptions.find((opt) => opt.value === filters.tienda) || null}
          onChange={(opt) => handleSelectChange("tienda", opt)}
          placeholder="Todas las tiendas"
          isClearable
          isSearchable
          styles={customStyles}
        />
      </FormControl>

      {/* Filtro por Deudor */}
      <FormControl flex="1" minW={{ base: "100%", lg: "200px" }}>
        <FormLabel fontSize="xs" fontWeight="bold" mb={1}>Deudor</FormLabel>
        <Select
          options={deudorOptions}
          value={deudorOptions.find((opt) => opt.value === filters.deudor) || null}
          onChange={(opt) => handleSelectChange("deudor", opt)}
          placeholder="Todos los deudores"
          isClearable
          isSearchable
          styles={customStyles}
        />
      </FormControl>

      {/* Filtro por Usuario (Condicional) */}
      {showUserFilter && (
        <FormControl flex="1" minW={{ base: "100%", lg: "200px" }}>
          <FormLabel fontSize="xs" fontWeight="bold" mb={1}>Usuario</FormLabel>
          <Select
            options={usuarioOptions}
            value={usuarioOptions.find((opt) => opt.value === filters.usuario) || null}
            onChange={(opt) => handleSelectChange("usuario", opt)}
            placeholder="Todos los usuarios"
            isClearable
            isSearchable
            styles={customStyles}
          />
        </FormControl>
      )}

      {/* Filtro por Rango de Fechas */}
      <FormControl flex="1" minW={{ base: "100%", lg: "250px" }}>
        <FormLabel fontSize="xs" fontWeight="bold" mb={1}>Rango de Fechas</FormLabel>
        <Box
            sx={{
              "& input": {
                height: "32px",
                fontSize: "0.875rem",
                paddingTop: "4px",
                paddingBottom: "4px",
                backgroundColor: bg,
                borderColor: borderColor,
              }
            }}
        >
          <RangeDatepicker
            selectedDates={selectedDates}
            onDateChange={handleDateChange}
            configs={{
              dateFormat: "dd/MM/yyyy",
              dayNames: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
              monthNames: [
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
              ],
            }}
            propsConfigs={{
              inputProps: {
                placeholder: "Seleccionar rango...",
                size: "sm",
              },
            }}
          />
        </Box>
      </FormControl>

      {/* Botón Limpiar Filtros */}
      <Box pt={{ base: 0, lg: 6 }}>
        <Button
          size="sm"
          height="32px"
          colorScheme="gray"
          width={{ base: "100%", lg: "auto" }}
          onClick={() => {
            onFilterChange({
              tienda: "",
              deudor: "",
              usuario: "",
              fechaInicio: "",
              fechaFin: "",
            });
            if (isMobile) onClose();
          }}
        >
          Limpiar
        </Button>
      </Box>
    </>
  );

  if (isMobile) {
    return (
      <Box mb={4}>
        <Button
          leftIcon={<Icon as={FaFilter} />}
          onClick={onOpen}
          colorScheme="teal"
          variant="outline"
          size="sm"
          w="100%"
        >
          Filtrar Pedidos
        </Button>

        <Modal isOpen={isOpen} onClose={onClose} size="full">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Filtrar Pedidos</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch" mt={2}>
                {FilterContent}
                <Button colorScheme="teal" onClick={onClose} mt={4}>
                  Aplicar Filtros
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    );
  }

  return (
    <Box
      bg={bg}
      p={3}
      rounded="lg"
      shadow="sm"
      borderWidth="1px"
      borderColor={borderColor}
      mb={2}
    >
      <Flex
        direction={{ base: "column", lg: "row" }}
        gap={4}
        alignItems={{ base: "stretch", lg: "flex-start" }} // Changed to flex-start for better alignment with label
        wrap="wrap"
      >
        {FilterContent}
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
