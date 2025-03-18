import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchrole, fetchRolesMetadata } from '../../store/PaginaRole/thunks'; // Importa las acciones necesarias
import { ListarDatos } from '../../components/Genericos/Crud/listas/listarDatos';
import { Box, useColorModeValue, Spinner } from '@chakra-ui/react';
import { BotonEditar } from '../../components/Genericos/Crud/listas/botonEditar'; // Botón de editar genérico
import { BotonEliminar } from '../../components/Genericos/Crud/listas/botonEliminar'; // Botón de eliminar genérico

export const PaginaRole = () => {
    const bgColor = useColorModeValue('gray.50', '#1e1e2e');
    const dispatch = useDispatch();

    const [datosConIconos, setDatosConIconos] = useState([]);
    const [metadataProcesada, setMetadataProcesada] = useState([]); // Estado local para la metadata procesada
    const [filtroBusqueda, setFiltroBusqueda] = useState(''); // Estado para la búsqueda

    // Accediendo al estado de los roles desde Redux
    const { roles, loading, error, metadata } = useSelector(state => state.roles);

    // Cargar los roles al montar el componente
    useEffect(() => {
        dispatch(fetchrole());
        dispatch(fetchRolesMetadata());
    }, [dispatch]);

    // Filtrar los datos con base en la búsqueda
    useEffect(() => {
        if (roles && roles.length > 0) {
            const datosFiltrados = roles
                .filter(role => role.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()));
            setDatosConIconos(datosFiltrados); // Actualizamos los datos una vez filtrados
        }
    }, [roles, filtroBusqueda]);
    

    // Procesar la metadata cuando cambie
    useEffect(() => {
        if (metadata && metadata.length > 0) {
            const metadataTransformada = metadata.map(item => ({
                ...item,
            }));
            setMetadataProcesada(metadataTransformada);  // Guardamos el valor transformado en el estado
        }
    }, [metadata]);

    // Mostrar un spinner mientras se cargan los datos
    if (loading) {
        return <Spinner />;
    }

    // Mostrar un mensaje de error si hay algún problema
    if (error) {
        return <p>Error: {error}</p>;
    }

    // Mostrar un mensaje si no hay roles disponibles
    if (!roles || roles.length === 0) {
        return <p>No hay roles disponibles.</p>;
    }

    // Columnas para la lista de roles
    const columnasRoles = [
        { nombre: 'Nombre', acceso: 'nombre' },
        { nombre: 'Descripción', acceso: 'descripcion' },
        { nombre: 'Estado', acceso: 'estado' },
        { nombre: 'Acciones', acceso: 'acciones' },
    ];

    return (
        <Box p={8} bg={bgColor} minH="100vh">
            <ListarDatos
                nombre="Lista de Roles"
                columnas={columnasRoles}
                datos={datosConIconos}
                nombreBoton="Crear Rol"
                onCrear={() => console.log("Creando nuevo Rol")}
                metadata={metadataProcesada.length > 0 ? metadataProcesada : []}
                onSearch={setFiltroBusqueda} // Pasa la función de búsqueda
                renderCustomCell={(columnKey, rowData) => {
                    if (columnKey === 'estado') {
                        return rowData.estado ? "Activo" : "Inactivo"; // Verifica si estado es true o false
                    }
                    if (columnKey === 'acciones') {
                        return (
                            <>
                                <BotonEditar
                                    nombreBoton="Editar Rol"
                                    metadata={metadataProcesada}
                                    formData={rowData}
                                />
                                <BotonEliminar
                                    nombreBoton="Eliminar Rol"
                                    formData={rowData}
                                />
                            </>
                        );
                    }
                    return rowData[columnKey];
                }}
            />
        </Box>
    );
};

export default PaginaRole;
