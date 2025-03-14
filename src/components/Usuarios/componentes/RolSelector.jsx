import PropTypes from "prop-types";
import { Select, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const RolSelector = ({ usuario, allRoles }) => {
  const toast = useToast();
  const [selectedRole, setSelectedRole] = useState(usuario.roleId || "");

  const roleEmojis = {
    admin: "👑",
    usuario: "👤",
    ventas: "🛍️",
    compras: "🛒",
    qa: "🔎",
    supervisor: "👔",
  };

  //const roleColors = {
  // admin: { backgroundColor: "#E53E3E", color: "white" },
  //usuario: { backgroundColor: "#3182CE", color: "white" },
  //ventas: { backgroundColor: "#ED8936", color: "white" },
  //compras: { backgroundColor: "#48BB78", color: "white" },
  // qa: { backgroundColor: "#805AD5", color: "white" },
  //};

  const handleSelectChange = async (e) => {
    const newRoleId = parseInt(e.target.value, 10);
    setSelectedRole(newRoleId);

    try {
      await axios.put(`${BASE_URL}/usuarios/actualizar-rol/${usuario.id}`, {
        rolId: newRoleId,
      });
      toast({
        title: "Rol actualizado",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      toast({
        title: "Error al actualizar rol",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!allRoles || allRoles.length === 0) {
    return <Text>No hay roles disponibles.</Text>;
  }

  return (
    <Select
      value={selectedRole}
      onChange={handleSelectChange}
      w="130px"
      size="sm"
      borderColor="gray.300"
      focusBorderColor="green.400"
    >
      <option value="">-- Selecciona un rol --</option>
      {allRoles.map((rol) => {
        const rolNombre = rol.nombre.toLowerCase();
        const emoji = roleEmojis[rolNombre] || "";
        //const style = roleColors[rolNombre] || {};

        return (
          <option key={rol.id} value={rol.id}>
            {emoji ? `${emoji} ` : ""}
            {rol.nombre}
          </option>
        );
      })}
    </Select>
  );
};

RolSelector.propTypes = {
  usuario: PropTypes.shape({
    id: PropTypes.number.isRequired,
    roleId: PropTypes.number,
  }).isRequired,
  allRoles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RolSelector;
