import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { chakra } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProveedores } from "../../../../store/Proveedor/thunks"; // Ajusta la ruta según tu estructura

const ChakraReactSelect = chakra(Select);

const ProveedorSelector = ({ value, onChange }) => {
  const dispatch = useDispatch();
  const fetchedRef = useRef(false);
  
  const { data: proveedores, loading } = useSelector((state) => ({
    data: state.proveedores.data,
    loading: state.proveedores.loading,
  }));

  useEffect(() => {
    if (fetchedRef.current || proveedores.length > 0) return;
    fetchedRef.current = true;
    dispatch(fetchProveedores());
  }, [dispatch, proveedores.length]);

  const options = proveedores.map((prov) => ({
    value: prov.id,
    label: prov.nombre,
  }));

  const selectedOption = options.find((opt) => opt.value === value) || null;

  return (
    <ChakraReactSelect
      placeholder={loading ? "Cargando proveedores..." : "Seleccionar proveedor"}
      isLoading={loading}
      options={options}
      value={selectedOption}
      onChange={(selected) => onChange(selected ? selected.value : null)}
      isClearable
      menuPlacement="auto"
      menuPosition="fixed"
      chakraStyles={{
        container: (provided) => ({
          ...provided,
          width: "100%",
        }),
        control: (provided) => ({
          ...provided,
          borderColor: "gray.300",
          _hover: { borderColor: "gray.400" },
        }),
      }}
      noOptionsMessage={() => "No se encontraron proveedores"}
      loadingMessage={() => "Cargando proveedores..."}
    />
  );
};

ProveedorSelector.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

export default ProveedorSelector;