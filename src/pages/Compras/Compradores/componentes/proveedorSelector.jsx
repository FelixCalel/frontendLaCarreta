// ProveedorSelector.jsx
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { chakra, useColorModeValue } from "@chakra-ui/react";
import { createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { fetchProveedores } from "../../../../store/Proveedor/thunks";

const ChakraReactSelect = chakra(Select);

const ProveedorSelector = ({ value, onChange }) => {
  const dispatch = useDispatch();
  const fetchedRef = useRef(false);

  const selectProveedores = createSelector(
    (state) => state.proveedores,
    (proveedores) => ({
      data: proveedores.data,
      loading: proveedores.loading,
    })
  );

  const { data: proveedores, loading } = useSelector(selectProveedores);

  useEffect(() => {
    // Evita re-fetch si ya tenemos proveedores o si ya se ha hecho una petición
    if (fetchedRef.current || proveedores.length > 0) return;
    fetchedRef.current = true;
    dispatch(fetchProveedores());
  }, [dispatch, proveedores.length]);

  const options = proveedores.map((prov) => ({
    value: prov.id,
    label: prov.nombre,
  }));

  const selectedOption = options.find((opt) => opt.value === value) || null;

  // Colores modo claro/oscuro
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const hoverBorderColor = useColorModeValue("gray.400", "gray.500");
  const backgroundColor = useColorModeValue("white", "gray.700");
  const hoverBackgroundColor = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const placeholderColor = useColorModeValue("gray.400", "gray.500");

  return (
    <ChakraReactSelect
      placeholder={
        loading ? "Cargando proveedores..." : "Seleccionar proveedor"
      }
      isLoading={loading}
      options={options}
      value={selectedOption}
      onChange={(selected) => {
        if (selected) {
          onChange(selected.value, selected.label);
        } else {
          onChange(null, "");
        }
      }}
      isClearable
      // Quitar menuPortalTarget y menuPosition para que se dibuje dentro del modal
      // menuPortalTarget={document.body}
      // menuPosition="fixed"
      // menuPlacement="auto"

      noOptionsMessage={() => "No se encontraron proveedores"}
      loadingMessage={() => "Cargando proveedores..."}
      chakraStyles={{
        container: (provided) => ({
          ...provided,
          width: "100%",
        }),
        control: (provided, state) => ({
          ...provided,
          backgroundColor,
          borderColor,
          color: textColor,
          _hover: { borderColor: hoverBorderColor },
          boxShadow: state.isFocused ? "0 0 0 1px #63b3ed" : provided.boxShadow,
        }),
        menu: (provided) => ({
          ...provided,
          // Aseguramos que se vea sobre otros elementos en el modal
          zIndex: 2000,
          backgroundColor,
        }),
        menuList: (provided) => ({
          ...provided,
          backgroundColor,
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isFocused
            ? hoverBackgroundColor
            : backgroundColor,
          color: textColor,
          cursor: "pointer",
        }),
        singleValue: (provided) => ({
          ...provided,
          color: textColor,
        }),
        placeholder: (provided) => ({
          ...provided,
          color: placeholderColor,
        }),
      }}
    />
  );
};

ProveedorSelector.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

export default ProveedorSelector;
