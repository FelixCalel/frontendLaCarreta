import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPermisos, fetchPermisosMetadata } from '../../store/Permisos/thunks'; // Importa las acciones que obtienen los permisos y la metadata
import { ListarDatos } from "../../components/Genericos/Crud/listas/listarDatos";
import { Box, useColorModeValue, Spinner } from "@chakra-ui/react";
import { BotonEditar } from '../../components/Genericos/Crud/listas/botonEditar'; // Botón de editar genérico
import { BotonEliminar } from '../../components/Genericos/Crud/listas/botonEliminar'; // Botón de eliminar genérico
import iconCatalog from '../../components/Iconos/IconCatalog';

export const PagePermiso = () => {
    const bgColor = useColorModeValue('gray.50', '#1e1e2e');
    const dispatch = useDispatch();

    const [datosConIconos, setDatosConIconos] = useState([]);
    const [metadataProcesada, setMetadataProcesada] = useState([]); // Estado local para la metadata procesada
    const [filtroBusqueda, setFiltroBusqueda] = useState(''); // Estado para la búsqueda

    const { Permisos, loading, error, metadata } = useSelector(state => state.Permisos);

    // Cargar los permisos al montar el componente
    useEffect(() => {
        dispatch(fetchPermisos());
        dispatch(fetchPermisosMetadata());
    }, [dispatch]);

    // Filtrar los datos con base en la búsqueda
    useEffect(() => {
        if (Permisos && Permisos.length > 0) {
            const datosFiltrados = Permisos
                .filter(permiso => permiso.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()))
                .map(permiso => ({
                    ...permiso,
                    estado: permiso.estado ? 'Activo' : 'Inactivo',
                }));
            setDatosConIconos(datosFiltrados); // Actualizamos los datos una vez filtrados
        }
    }, [Permisos, filtroBusqueda]);

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

    // Mostrar un mensaje si no hay permisos disponibles
    if (!Permisos || Permisos.length === 0) {
        return <p>No hay Permisos disponibles.</p>;
    }

    const columnasPermisos = [
        { nombre: 'Nombre', acceso: 'nombre' },
        { nombre: 'Descripción', acceso: 'descripcion' },
        { nombre: 'Estado', acceso: 'estado' },
        { nombre: 'Acciones', acceso: 'acciones' },
    ];

    const renderIcono = (iconName) => {
        const IconComponent = iconCatalog[iconName];
        if (!IconComponent) {
            return <p>Icono no disponible</p>;
        }
        return <IconComponent style={{ width: '24px', height: '24px' }} />;
    };

    return (
        <Box p={8} bg={bgColor} minH="100vh">
            <ListarDatos
                nombre="Lista de Permisos"
                columnas={columnasPermisos}
                datos={datosConIconos}
                nombreBoton="Crear Permiso"
                onCrear={() => console.log("Creando nuevo permiso")}
                metadata={metadataProcesada.length > 0 ? metadataProcesada : []}
                onSearch={setFiltroBusqueda} // Pasa la función de búsqueda
                renderCustomCell={(columnKey, rowData) => {
                    if (columnKey === 'estado') {
                        return rowData.estado === true || rowData.estado === "Activo" || rowData.estado === "true" ? "Activo" : "Inactivo";
                    }
                    
                    if (columnKey === 'acciones') {
                        return (
                            <>
                                <BotonEditar
                                    nombreBoton="Editar Permiso"
                                    metadata={metadataProcesada}
                                    formData={rowData}
                                />
                                <BotonEliminar
                                    nombreBoton="Eliminar Permiso"
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

export default PagePermiso;
