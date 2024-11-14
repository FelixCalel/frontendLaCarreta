import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPermisosRoles } from '../../store/AsignarPermisosAroles/thunks'; // Importa las acciones necesarias
import { ListarDatos } from "../../components/Genericos/Crud/listas/listarDatos.jsx";
import { Box, Button, useColorModeValue, Spinner } from "@chakra-ui/react";
import ModalEditOpciones from "../../components/Genericos/Crud/Modal/modalEditOpciones"; // Asegúrate de que este archivo exista
import { fetchPermisosRolesMetadata } from '../../store/AsignarPermisosAroles/thunks'; // Importa las acciones necesarias

export const PagePermisosRoles = () => {
  const bgColor = useColorModeValue('gray.50', '#1e1e2e');
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado del modal
  const [selectedOpcion, setSelectedOpcion] = useState(null);    // Opción seleccionada para edición

  const { PermisosRoles, loading, error, metadata } = useSelector(state => state.PermisosRoles);

  // Cargar los PermisosRoles al montar el componente
  useEffect(() => {
    if (!PermisosRoles || PermisosRoles.length === 0) {
      dispatch(fetchPermisosRoles());
      dispatch(fetchPermisosRolesMetadata());
    }
  }, [dispatch, PermisosRoles]);

  if (loading) {
    return <Spinner />;  // Muestra un spinner mientras se cargan los datos
  }

  if (error) {
    return <p>Error: {error}</p>;  // Muestra el mensaje de error si existe
  }

  if (!PermisosRoles || PermisosRoles.length === 0) {
    return <p>No hay PermisosRoles disponibles.</p>;  // Muestra este mensaje si no hay datos
  }

  // Preparar los datos para visualización
  const permisosRolesData = PermisosRoles.map(permisoRole => ({
    modulo: permisoRole.modulo.nombre,
    opcion: permisoRole.opcion.nombre,
    permiso: permisoRole.permiso.nombre,
    estado: permisoRole.permiso.estado ? "Activo" : "Inactivo",
    acciones: permisoRole // Pasar el objeto completo para acciones
  }));

  const columnasPermisosRoles = [
    { nombre: 'Módulo', acceso: 'modulo' },
    { nombre: 'Opción', acceso: 'opcion' },
    { nombre: 'Permiso', acceso: 'permiso' },
    { nombre: 'Estado', acceso: 'estado' },
    { nombre: 'Acciones', acceso: 'acciones' } // Columna para las acciones
  ];

  const handleEditarOpcion = (opcion) => {
    setSelectedOpcion(opcion);
    setIsEditModalOpen(true);
  };

  const handleGuardarCambios = () => {
    // Implementa la lógica para guardar los cambios de la opción editada
    setIsEditModalOpen(false);  // Cerrar el modal después de guardar
  };

  return (
    <Box p={8} bg={bgColor} minH="100vh">
      <ListarDatos
        nombre="Lista de asignación de permisos a roles"
        columnas={columnasPermisosRoles}
        datos={permisosRolesData}
        nombreBoton="Crear Permisos Roles"
        onCrear={() => console.log("Creando nueva opción")}
        metadata={metadata}
        renderCustomCell={(columnKey, rowData) => {
          if (columnKey === 'acciones') {
            return (
              <Button
                colorScheme="green"
                variant="outline"
                size="sm"
                borderRadius="md"
                _hover={{ bg: "green.500", color: "white" }}
                onClick={() => handleEditarOpcion(rowData)}
              >
                Editar
              </Button>
            );
          }
          return rowData[columnKey]; // Renderizar los datos como texto para los demás campos
        }}
      />
      {isEditModalOpen && (
        <ModalEditOpciones
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          selectedOpcion={selectedOpcion}
          setSelectedOpcion={setSelectedOpcion}
          handleGuardarCambios={handleGuardarCambios}
        />
      )}
    </Box>
  );
};

export default PagePermisosRoles;
