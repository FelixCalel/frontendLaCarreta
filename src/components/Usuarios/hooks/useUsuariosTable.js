import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDisclosure, useToast } from "@chakra-ui/react";
import {
  fetchRoles,
  toggleUserStatus,
  assignUserRoutes,
} from "../../../store/usuarios/thunks";
import { fetchUsuarios } from "../../../store/usuarios/usuariosSlice";
import { tablaTienda } from "../../../store/Tienda/thunks";
import { tablaRuta } from "../../../store/Ruta/thunks";

export const useUsuariosTable = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [allRoles, setAllRoles] = useState([]);
  const [rutasLocal, setRutasLocal] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAssigning, setIsAssigning] = useState(false);
  const itemsPerPage = 10;

  const { items: usuarios, status } = useSelector((state) => state.usuarios);
  const rutasData = useSelector((state) => state.rutas.data);
  const roleIdLogueado = localStorage.getItem("roleId");

  useEffect(() => {
    const usuarioId = localStorage.getItem("usuarioId");
    dispatch(fetchUsuarios({ id: usuarioId }));
    dispatch(tablaTienda());
    dispatch(tablaRuta());

    const getRoles = async () => {
      try {
        const resultAction = await dispatch(fetchRoles());
        if (fetchRoles.fulfilled.match(resultAction)) {
          const roles = Array.isArray(resultAction.payload)
            ? resultAction.payload
            : Array.isArray(resultAction.payload?.roles)
              ? resultAction.payload.roles
              : Array.isArray(resultAction.payload?.data)
                ? resultAction.payload.data
                : [];
          setAllRoles(roles);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    getRoles();
  }, [dispatch]);

  useEffect(() => {
    if (rutasData) setRutasLocal(rutasData);
  }, [rutasData]);

  const usuariosFiltrados = useMemo(() => {
    return (Array.isArray(usuarios) ? usuarios : [])
      .filter((u) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        const nombre = (u.nombre ?? "").toLowerCase();
        const apellido = (u.apellido ?? "").toLowerCase();
        const correo = (u.correo ?? "").toLowerCase();
        const nombreCompleto = `${nombre} ${apellido}`.trim();
        return (
          nombre.includes(term) ||
          apellido.includes(term) ||
          nombreCompleto.includes(term) ||
          correo.includes(term)
        );
      })
      .sort((a, b) =>
        (a.nombre ?? "")
          .toLowerCase()
          .localeCompare((b.nombre ?? "").toLowerCase()),
      );
  }, [usuarios, searchTerm]);

  const usuariosPagina = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return usuariosFiltrados.slice(start, start + itemsPerPage);
  }, [usuariosFiltrados, currentPage]);

  const toggleUsuarioEstado = async (usuarioId, estaActivo) => {
    const res = await dispatch(toggleUserStatus({ usuarioId, estaActivo }));
    if (toggleUserStatus.fulfilled.match(res)) {
      toast({
        title: `Usuario ${!estaActivo ? "activado" : "desactivado"}`,
        status: "success",
      });
      dispatch(fetchUsuarios({ id: localStorage.getItem("usuarioId") }));
    } else toast({ title: "Error", status: "error" });
  };

  const handleAssignRutas = async (usuarioId, selectedRoutes) => {
    setIsAssigning(true);
    const res = await dispatch(assignUserRoutes({ usuarioId, selectedRoutes }));
    setIsAssigning(false);
    if (assignUserRoutes.fulfilled.match(res)) {
      toast({ title: "Rutas asignadas", status: "success" });
      dispatch(fetchUsuarios({ id: localStorage.getItem("usuarioId") }));
      onClose();
    } else toast({ title: "Error", status: "error" });
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedUser,
    setSelectedUser,
    isOpen,
    onOpen,
    onClose,
    allRoles,
    rutasLocal,
    currentPage,
    setCurrentPage,
    isAssigning,
    status,
    usuariosFiltrados,
    usuariosPagina,
    roleIdLogueado,
    toggleUsuarioEstado,
    handleAssignRutas,
    itemsPerPage,
  };
};
