import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Select from "react-select";
import { chakra } from "@chakra-ui/react";

const BASE_URL = import.meta.env.VITE_API_URL;

const ChakraReactSelect = chakra(Select);

const ProveedorSelector = ({ value, onChange }) => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProveedores = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/proveedor/listar`);
        if (response?.data?.data) {
          setProveedores(response.data.data);
        } else {
          setProveedores([]);
        }
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        setProveedores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProveedores();
  }, []);

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
