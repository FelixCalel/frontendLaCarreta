import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast, useDisclosure } from "@chakra-ui/react";
import {
  tablaEmpresa,
  addNewEmpresa,
  deleteEmpresa,
  updateEmpresa,
  tablaPais,
  sincronizarClientes,
  sincronizarItems,
} from "../../../store/Empresa/thunks";

export const useEmpresaForm = () => {
  const dispatch = useDispatch();
  const { data, status, error, paises, paisesStatus, paisesError } =
    useSelector((state) => state.empresas);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditMode, setIsEditMode] = useState(false);
  const [warehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [warehouses, setWarehouses] = useState("");
  const [currentEmpresa, setCurrentEmpresa] = useState({
    id: "", nombre: "", alias: "", estaActivo: true, baseDatos: "", ipBaseDatos: "", serie: "", paisId: "",
  });
  const [errors, setErrors] = useState({});
  const [syncDisabled, setSyncDisabled] = useState({});
  const toast = useToast();
  const [deleteId, setDeleteId] = useState(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  useEffect(() => {
    if (status === "idle") dispatch(tablaEmpresa());
    if (paisesStatus === "idle") dispatch(tablaPais());
  }, [dispatch, status, paisesStatus]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : name === "paisId" ? parseInt(value, 10) : value;
    setCurrentEmpresa({ ...currentEmpresa, [name]: newValue });
    setErrors({ ...errors, [name]: "" });
  };

  const validateFields = () => {
    let formErrors = {};
    if (!currentEmpresa.nombre) formErrors.nombre = "El nombre es obligatorio";
    if (!currentEmpresa.alias) formErrors.alias = "El alias es obligatorio";
    if (!currentEmpresa.baseDatos) formErrors.baseDatos = "La base de datos es obligatoria";
    if (!currentEmpresa.ipBaseDatos) formErrors.ipBaseDatos = "La IP SAP es obligatoria";
    if (!currentEmpresa.serie) formErrors.serie = "La serie es obligatoria;";
    if (!currentEmpresa.paisId) formErrors.paisId = "El país es obligatorio";
    return formErrors;
  };

  const handleSync = async (empresaId, baseDatos, ipBaseDatos) => {
    try {
      setSyncDisabled((prevState) => ({ ...prevState, [empresaId]: true }));
      const syncResult = await dispatch(sincronizarClientes({ dbsap: baseDatos, ipsap: ipBaseDatos, empresaId })).unwrap();
      toast({ title: "Sincronización completada.", status: "success" });
    } catch (error) {
      toast({ 
        title: "Error en la sincronización.", 
        description: typeof error === 'string' ? error : error.error || error.msg || "Error desconocido",
        status: "error" 
      });
    } finally {
      setSyncDisabled((prevState) => ({ ...prevState, [empresaId]: false }));
    }
  };

  const handleSubmit = async () => {
    const formErrors = validateFields();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (isEditMode) {
      await dispatch(updateEmpresa(currentEmpresa));
      onClose();
      dispatch(tablaEmpresa());
    } else {
      try {
        const result = await dispatch(addNewEmpresa(currentEmpresa));
        if (result.payload?.id) {
          await handleSync(result.payload.id, currentEmpresa.baseDatos, currentEmpresa.ipBaseDatos);
        }
        onClose();
        dispatch(tablaEmpresa());
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await dispatch(deleteEmpresa(deleteId));
    dispatch(tablaEmpresa());
    toast({ title: "Empresa eliminada.", status: "info" });
    setDeleteId(null);
    onDeleteClose();
  };

  const handleSyncWithWarehouses = async () => {
    const empresa = data.find((emp) => emp.id === currentEmpresa.id);
    if (!empresa) return;

    const formattedWarehouses = warehouses.split(",").map(w => w.trim()).filter(Boolean).map(w => `'${w}'`).join(",");
    if (!formattedWarehouses) {
      toast({ title: "Ingresa al menos un almacén", status: "warning" });
      return;
    }

    setSyncDisabled((prev) => ({ ...prev, [empresa.id]: true }));
    try {
      const syncResult = await dispatch(sincronizarItems({
        dbsap: empresa.baseDatos, ipsap: empresa.ipBaseDatos, empresaId: empresa.id, warehouses: formattedWarehouses
      })).unwrap();
      toast({ title: "Sincronización completada.", status: "success" });
    } catch (e) {
      toast({ 
        title: "Error en la sincronización.", 
        description: typeof e === 'string' ? e : e.error || e.msg || "Error desconocido",
        status: "error",
        duration: 10000,
        isClosable: true
      });
    } finally {
      setTimeout(() => setSyncDisabled((prev) => ({ ...prev, [empresa.id]: false })), 5000);
      setWarehouseModalOpen(false);
    }
  };

  return {
    data, status, error, paises, paisesStatus, paisesError,
    isOpen, onOpen, onClose,
    isEditMode, setIsEditMode,
    currentEmpresa, setCurrentEmpresa,
    errors, setErrors,
    handleInputChange, handleSubmit,
    handleSync, handleSyncWithWarehouses,
    warehouseModalOpen, setWarehouseModalOpen,
    warehouses, setWarehouses,
    isDeleteOpen, onDeleteOpen, onDeleteClose,
    deleteId, setDeleteId, handleDelete,
    syncDisabled,
  };
};
