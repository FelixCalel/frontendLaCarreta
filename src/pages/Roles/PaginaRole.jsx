import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchrole } from '../../store/PaginaRole/thunks'; // Importa las acciones necesarias
import { ListarDatos } from '../../components/Genericos/Crud/listas/listarDatos.jsx';
import { Box, useColorModeValue, Spinner, Button } from '@chakra-ui/react';
import ModalEditOpciones from "../../components/Genericos/Crud/Modal/modalEditOpciones"; // Asegúrate de que este archivo exista
import { fetchRolesMetadata } from '../../store/PaginaRole/thunks';

export const PaginaRole = () => {
    const bgColor = useColorModeValue('gray.50', '#1e1e2e');
    const dispatch = useDispatch();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado del modal
    const [selectedOpcion, setSelectedOpcion] = useState(null);    // Opción seleccionada para edición

    // Accediendo al estado de los roles desde Redux
    const { roles, loading, error, metadata } = useSelector(state => state.roles);

    // Cargar los roles al montar el componente

    useEffect(() => {
        if (!roles || roles.length === 0) {
            dispatch(fetchrole());
            dispatch(fetchRolesMetadata());
        }
    }, [dispatch, roles]);


    if (loading) {
        return <Spinner />;  // Muestra un spinner mientras se cargan los datos
    }

    if (error) {
        return <p>Error: {error}</p>;  // Muestra el mensaje de error si existe
    }

    if (!roles || roles.length === 0) {
        return <p>No hay usuarios disponibles.</p>;  // Muestra este mensaje si no hay datos
    }

    // Columnas para la lista de roles
    const columnasRoles = [
        { nombre: 'ID', acceso: 'id' },
        { nombre: 'Nombre', acceso: 'nombre' },
        { nombre: 'Descripción', acceso: 'descripcion' },
        { nombre: 'Acciones', acceso: 'acciones' },  // Columna para el botón de edición
    ];


    // Manejar la edición de un rol
    const handleEditarOpcion = (opcion) => {
        setSelectedOpcion(opcion);
        setIsEditModalOpen(true);
    };

    // Manejar el guardado de cambios en el modal
    const handleGuardarCambios = () => {
        setIsEditModalOpen(false);  // Cierra el modal
    };

    return (
        <Box p={8} bg={bgColor} minH="100vh">
          <ListarDatos
            nombre="Listado de Roles"
            columnas={columnasRoles}
            datos={roles}
            nombreBoton="Crear Rol"
            onCrear={() => console.log("Creando nuevo Rol")}
            metadata={metadata}
            renderCustomCell={(columnKey, rowData) => {
              if (columnKey === 'activo') {
                // Ajustado para manejar 'activo' en lugar de 'estado'
                return rowData.activo ? "Activo" : "Inactivo";
              }
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

export default PaginaRole; 
