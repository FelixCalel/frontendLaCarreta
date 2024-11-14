import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchasignacionMO } from '../../store/asignacionMO/thunks'; // Importa la acción que obtiene los asignacionMO
import { ListarDatos } from "../../components/Genericos/Crud/listas/listarDatos.jsx";
import { Box, Button, useColorModeValue, Spinner } from "@chakra-ui/react";
import ModalEditOpciones from "../../components/Genericos/Crud/Modal/modalEditOpciones"; // Asegúrate de que este archivo exista
import { fetchasignacionMOMetadata } from '../../store/asignacionMO/thunks'; // Importa las acciones necesarias

export const PageasignacionMO = () => {
  const bgColor = useColorModeValue('gray.50', '#1e1e2e');
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado del modal
  const [selectedOpcion, setSelectedOpcion] = useState(null);    // Opción seleccionada para edición

  const { asignacionMO, loading, error, metadata } = useSelector(state => state.asignacionMO);

  // Cargar los asignacionMO al montar el componente
  useEffect(() => {
    if (!asignacionMO || asignacionMO.length === 0) {
      dispatch(fetchasignacionMO());
      dispatch(fetchasignacionMOMetadata());
    }
  }, [dispatch, asignacionMO]);

  if (loading) {
    return <Spinner />;  // Muestra un spinner mientras se cargan los datos
  }

  if (error) {
    return <p>Error: {error}</p>;  // Muestra el mensaje de error si existe
  }

  if (!asignacionMO || asignacionMO.length === 0) {
    return <p>No hay asignacionMO disponibles.</p>;  // Muestra este mensaje si no hay datos
  }

  const columnasasignacionMO = [
    { nombre: 'Módulo', acceso: 'modulo.nombre' },
    { nombre: 'Opción', acceso: 'opcion.nombre' },
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
        nombre="Lista de asignacion MO"
        columnas={columnasasignacionMO}
        datos={asignacionMO}
        nombreBoton="Crear asignacion MO"
        onCrear={() => console.log("Creando nueva opción")}
        metadata={metadata}
        renderCustomCell={(columnKey, rowData) => {
          if (columnKey === 'modulo.nombre') {
            // Mostrar el nombre del módulo
            return rowData.modulo.nombre;
          }
          if (columnKey === 'opcion.nombre') {
            // Mostrar el nombre de la opción
            return rowData.opcion.nombre;
          }
          if (columnKey === 'estado') {
            // Si el valor de 'estado' está en el objeto 'modulo', 'opcion' o 'asignacionMO', accede a la propiedad correcta
            const estado = rowData.estado ?? rowData.modulo?.estado ?? rowData.opcion?.estado;
            return estado ? "Activo" : "Inactivo";
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

export default PageasignacionMO;
