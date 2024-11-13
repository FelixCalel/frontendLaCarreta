import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsuarios } from '../../store/usuarios/usuariosSlice'; // Importa la acción que obtiene los usuarios
import { ListarDatos } from '../../components/Genericos/Crud/listas/listarDatos.jsx';
import { Box, Button, useColorModeValue, Spinner } from '@chakra-ui/react';
import ModalEditOpciones from '../../components/Genericos/Crud/Modal/modalEditOpciones';
import { fetchUsuariosMetadata } from '../../store/usuarios/usuariosSlice'; // Asegúrate de que este archivo exista

export const PageListarUsuarios = () => {
  const bgColor = useColorModeValue('gray.50', '#1e1e2e');
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado del modal
  const [selectedOpcion, setSelectedOpcion] = useState(null);    // Opción seleccionada para edición

  // Utiliza 'items' aquí para referirse a los usuarios
  const { items: usuarios, loading, error, metadata } = useSelector(state => state.usuarios);

  // Cargar los usuarios al montar el componente
  useEffect(() => {
    if (!usuarios || usuarios.length === 0) {
      dispatch(fetchUsuarios());
      dispatch(fetchUsuariosMetadata());
    }
  }, [dispatch, usuarios]);  // Dependencias correctas aquí

  if (loading) {
    return <Spinner />;  // Muestra un spinner mientras se cargan los datos
  }

  if (error) {
    return <p>Error: {error}</p>;  // Muestra el mensaje de error si existe
  }

  if (!usuarios || usuarios.length === 0) {
    return <p>No hay usuarios disponibles.</p>;  // Muestra este mensaje si no hay datos
  }

  // Columnas de la tabla, incluyendo el acceso a role.nombre
  const columnasUsuarios = [
    { nombre: 'ID', acceso: 'id' },
    { nombre: 'Nombre', acceso: 'nombres' },
    { nombre: 'Apellido', acceso: 'apellidos' },
    { nombre: 'Correo Electrónico', acceso: 'correo_electronico' },
    { nombre: 'Rol', acceso: 'role.nombre' },
    { nombre: 'Estado', acceso: 'estado' },
    { nombre: 'Acciones', acceso: 'acciones' }, // Columna para las acciones
  ];

  // Función para editar usuario
  const handleEditarOpcion = (opcion) => {
    setSelectedOpcion(opcion);
    setIsEditModalOpen(true);
  };

  // Guardar cambios en el modal de edición
  const handleGuardarCambios = () => {
    // Implementa la lógica para guardar los cambios de la opción editada
    setIsEditModalOpen(false);  // Cerrar el modal después de guardar
  };

  return (
    <Box p={8} bg={bgColor} minH="100vh">
      <ListarDatos
        nombre="Lista de Usuarios"
        columnas={columnasUsuarios}
        datos={usuarios}
        nombreBoton="Crear Usuario"
        onCrear={() => console.log("Creando nuevo usuario")}
        metadata={metadata}
        renderCustomCell={(columnKey, rowData) => {
          // Mostrar "Activo" o "Inactivo" según el estado
          if (columnKey === 'estado') {
            return rowData.estado ? "Activo" : "Inactivo";
          }
          // Renderizar las acciones (botón de editar)
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
          // Renderizar el nombre del rol de manera segura (si existe role)
          if (columnKey === 'role.nombre') {
            return rowData.role ? rowData.role.nombre : 'Sin Rol';
          }
          // Renderizar el resto de los campos normalmente
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

export default PageListarUsuarios;
