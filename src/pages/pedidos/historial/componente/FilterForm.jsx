import { Box, FormControl, FormLabel, Button, Select as ChakraSelect } from "@chakra-ui/react";
import Select from "react-select";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import PropTypes from "prop-types";

export const FilterForm = ({
  filters,
  onFilterChange,
  tiendaOptions,
  deudorOptions,
  usuarioOptions,
  estadoOptions,
  selectedDates,
  showUserFilter,
  customStyles,
  bg,
  borderColor,
  isMobile,
  onClose
}) => {
  const handleSelectChange = (field, selectedOption) => {
    onFilterChange({ ...filters, [field]: selectedOption ? selectedOption.value : "" });
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    onFilterChange({
      ...filters,
      fechaInicio: start ? start.toISOString().split("T")[0] : "",
      fechaFin: end ? end.toISOString().split("T")[0] : "",
    });
  };

  return (
    <>
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

      <FormControl flex="1" minW={{ base: "100%", lg: "200px" }}>
        <FormLabel fontSize="xs" fontWeight="bold" mb={1}>Estado</FormLabel>
        <Select
          options={estadoOptions}
          value={estadoOptions.find((opt) => opt.value === filters.estado) || null}
          onChange={(opt) => handleSelectChange("estado", opt)}
          placeholder="Todos los estados"
          isClearable
          isSearchable
          styles={customStyles}
        />
      </FormControl>

      <FormControl flex="1" minW={{ base: "100%", lg: "250px" }}>
        <FormLabel fontSize="xs" fontWeight="bold" mb={1}>Rango de Fechas</FormLabel>
        <Box sx={{ "& input": { height: "32px", fontSize: "0.875rem", bg, borderColor } }}>
          <RangeDatepicker
            selectedDates={selectedDates}
            onDateChange={handleDateChange}
            monthsToDisplay={1}
            configs={{
              dateFormat: "dd/MM/yyyy",
              dayNames: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
              monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            }}
            propsConfigs={{ inputProps: { placeholder: "Seleccionar rango...", size: "sm" } }}
          />
        </Box>
      </FormControl>

      <Box pt={{ base: 0, lg: 6 }}>
        <Button
          size="sm"
          height="32px"
          colorScheme="gray"
          width={{ base: "100%", lg: "auto" }}
          onClick={() => {
            onFilterChange({ tienda: "", deudor: "", usuario: "", estado: "", fechaInicio: "", fechaFin: "" });
            if (isMobile) onClose();
          }}
        >
          Limpiar
        </Button>
      </Box>
    </>
  );
};

FilterForm.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  tiendaOptions: PropTypes.array.isRequired,
  deudorOptions: PropTypes.array.isRequired,
  usuarioOptions: PropTypes.array.isRequired,
  estadoOptions: PropTypes.array.isRequired,
  selectedDates: PropTypes.array.isRequired,
  showUserFilter: PropTypes.bool,
  customStyles: PropTypes.object.isRequired,
  bg: PropTypes.string.isRequired,
  borderColor: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
  onClose: PropTypes.func
};
