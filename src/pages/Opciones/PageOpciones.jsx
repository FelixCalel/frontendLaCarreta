import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOpciones } from '../../store/Opciones/thunks';  // Importa la acción que obtiene las opciones
import { ListarDatos } from "../../components/Genericos/Crud/listas/listarDatos.jsx";
import { Box, Button, useColorModeValue, Spinner } from "@chakra-ui/react";
import ModalEditOpciones from "../../components/Genericos/Crud/Modal/modalEditOpciones";
import {fetchOpcionesMetadata} from '../../store/Opciones/thunks';

export const PageOpciones = () => {
    const bgColor = useColorModeValue('gray.50', '#1e1e2e');
    const dispatch = useDispatch();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado del modal
    const [selectedOpcion, setSelectedOpcion] = useState(null);    // Opción seleccionada para edición

    const { opciones, loading, error, metadata } = useSelector((state) => state.opciones);



    useEffect(() => {
        dispatch(fetchOpciones());
        dispatch(fetchOpcionesMetadata());
    }, [dispatch]);

    

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!opciones || opciones.length === 0) {
        return <p>No hay opciones disponibles.</p>;
    }

    const columnasOpciones = [
        { nombre: 'Nombre', acceso: 'nombre' },
        { nombre: 'Descripción', acceso: 'descripcion' },
        { nombre: 'Ruta', acceso: 'ruta' },
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
                nombre="Lista de Opciones"
                columnas={columnasOpciones}
                datos={opciones}
                nombreBoton="Crear Opciones"
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
            <ModalEditOpciones
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                selectedOpcion={selectedOpcion}
                setSelectedOpcion={setSelectedOpcion}
                handleGuardarCambios={handleGuardarCambios}
            />
        </Box>
    );
};

export default PageOpciones;
