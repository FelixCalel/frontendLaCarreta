import {
  Select,
  Text,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const roleEmojis = {
  admin: "👑",
  display: "👤",
  ventas: "🛍️",
  compras: "🛒",
  qa: "🔎",
  supervisor: "👔",
  "rol ejemplo": "🧪",
  "supervisor producción": "🏭",
  "encargado de área": "🛠️",
  digitador: "⌨️",
};

const RolSelector = ({ usuario, allRoles }) => {
  const toast = useToast();
  const [selectedRole, setSelectedRole] = useState(usuario.roleId || "");
  const [pendingRole, setPendingRole] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const handleSelectChange = (e) => {
    const newRoleId = parseInt(e.target.value, 10);
    if (newRoleId === selectedRole) return;
    setPendingRole(newRoleId);
    onOpen();
  };

  const handleConfirm = async () => {
    onClose();
    if (pendingRole == null) return;

    try {
      await axios.put(`${BASE_URL}/usuarios/actualizar-rol/${usuario.id}`, {
        rolId: pendingRole,
      });
      setSelectedRole(pendingRole);

      toast({
        title: "Rol actualizado",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error al actualizar rol",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setPendingRole(null);
    }
  };

  if (!allRoles?.length) return <Text>No hay roles disponibles.</Text>;

  return (
    <>
      <Select
        value={selectedRole}
        onChange={handleSelectChange}
        minW="180px"
        maxW="60"
        size="sm"
        borderColor="gray.300"
        focusBorderColor="green.400"
        sx={{ option: { whiteSpace: "normal" } }}
      >
        <option value="">— Selecciona un rol —</option>
        {allRoles.map((rol) => {
          const emoji = roleEmojis[rol.nombre.toLowerCase()] || "";
          return (
            <option key={rol.id} value={rol.id}>
              {emoji && `${emoji} `}
              {rol.nombre}
            </option>
          );
        })}
      </Select>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          setPendingRole(null);
          onClose();
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cambiar rol
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de asignar este nuevo rol al usuario?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="green" onClick={handleConfirm} ml={3}>
                Aceptar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
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
