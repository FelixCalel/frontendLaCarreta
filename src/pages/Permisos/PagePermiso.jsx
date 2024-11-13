import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPermisos } from '../../store/Permisos/thunks'; // Importa la acción que obtiene los permisos
import { ListarDatos } from "../../components/Genericos/Crud/listas/listarDatos.jsx";
import { Box, Button, useColorModeValue, Spinner } from "@chakra-ui/react";
import ModalEditOpciones from "../../components/Genericos/Crud/Modal/modalEditOpciones"; // Asegúrate de que este archivo exista
import { fetchPermisosMetadata } from '../../store/Permisos/thunks';

export const PagePermiso = () => {
  const bgColor = useColorModeValue('gray.50', '#1e1e2e');
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado del modal
  const [selectedOpcion, setSelectedOpcion] = useState(null);    // Opción seleccionada para edición

  const { Permisos, loading, error, metadata } = useSelector(state => state.Permisos);

  // Cargar los permisos al montar el componente
  useEffect(() => {
    if (!Permisos || Permisos.length === 0) {
      dispatch(fetchPermisos());
      dispatch(fetchPermisosMetadata());
    }
  }, [dispatch, Permisos]);

  if (loading) {
    return <Spinner />;  // Muestra un spinner mientras se cargan los datos
  }

  if (error) {
    return <p>Error: {error}</p>;  // Muestra el mensaje de error si existe
  }

  if (!Permisos || Permisos.length === 0) {
    return <p>No hay Permisos disponibles.</p>;  // Muestra este mensaje si no hay datos
  }

  const columnasPermisos = [
    { nombre: 'Nombre', acceso: 'nombre' },
    { nombre: 'Descripción', acceso: 'descripcion' },
    { nombre: 'Estado', acceso: 'estado' },
    { nombre: 'Acciones', acceso: 'acciones' }, // Columna para las acciones
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
        nombre="Lista de Permisos"
        columnas={columnasPermisos}
        datos={Permisos}
        nombreBoton="Crear Permisos"
        onCrear={() => console.log("Creando nueva opción")}
        metadata={metadata}
        renderCustomCell={(columnKey, rowData) => {
          if (columnKey === 'estado') {
            // Si el valor de 'estado' es verdadero, mostrar "Activo", de lo contrario "Inactivo"
            return rowData.estado ? "Activo" : "Inactivo";
          }
          if (columnKey === 'acciones') {
            return (
              <Button
                colorScheme="green"  // Cambiado a verde
                variant="outline" 
                size="sm" 
                borderRadius="md"
                _hover={{ bg: "green.500", color: "white" }}  // Hover ahora usa verde
                onClick={() => handleEditarOpcion(rowData)}
              >
                Editar
              </Button>
            );
          }
          return rowData[columnKey];
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

export default PagePermiso;
