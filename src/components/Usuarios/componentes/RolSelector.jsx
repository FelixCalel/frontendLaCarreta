import PropTypes from "prop-types";
import { Checkbox, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

const RolSelector = ({ selectedRoles, setSelectedRoles, usuarioId, roles, userRole }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (userRole === "admin") {
      setIsAdmin(true);
    }
  }, [userRole]);

  const handleCheckboxChange = async (roleId, isChecked) => {
    try {
      await actualizarRol(usuarioId, roleId,);

      if (isChecked) {
        setSelectedRoles((prevSelectedRoles) => [...prevSelectedRoles, roleId]);
      } else {
        setSelectedRoles((prevSelectedRoles) => prevSelectedRoles.filter((id) => id !== roleId));
      }
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
    }
  };

  const actualizarRol = async (usuarioId, roleId) => {
    try {
      await axios.put(`${BASE_URL}/usuarios/actualizar-rol/${usuarioId}`, {
        roleId: roleId,
      });
    } catch (error) {
      console.error("Error al actualizar el rol del usuario:", error);
    }
  };

  if (!isAdmin) {
    return <Text>No tienes permiso para asignar roles.</Text>;
  }

  return (
    <Stack spacing={2}>
      {roles.length > 0 ? (
        roles.map((role) => (
          <Checkbox
            key={role.id}
            isChecked={selectedRoles.includes(role.id)}
            onChange={(e) => handleCheckboxChange(role.id, e.target.checked)}
          >
            {role.nombre}
          </Checkbox>
        ))
      ) : (
        <Text>No hay roles disponibles.</Text>
      )}
    </Stack>
  );
};

RolSelector.propTypes = {
  selectedRoles: PropTypes.array.isRequired,
  setSelectedRoles: PropTypes.func.isRequired,
  usuarioId: PropTypes.number.isRequired,
  roles: PropTypes.array.isRequired,
  userRole: PropTypes.string.isRequired, 
};

export default RolSelector;
