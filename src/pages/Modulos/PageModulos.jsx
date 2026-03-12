import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchModulosTabla, fetchMetadataModulos } from '../../store/Modulos/thunks';
import { ListarDatos } from "../../components/Genericos/Crud/listas/listarDatos";
import { Box, useColorModeValue, Spinner } from "@chakra-ui/react";
import { BotonEditar } from '../../components/Genericos/Crud/listas/botonEditar';
import { BotonEliminar } from '../../components/Genericos/Crud/listas/botonEliminar';
import iconCatalog from '../../components/Iconos/IconCatalog';

export const PageModulos = () => {
    const bgColor = useColorModeValue('gray.50', '#1e1e2e');
    const dispatch = useDispatch();

    const [datosConIconos, setDatosConIconos] = useState([]);
    const [metadataProcesada, setMetadataProcesada] = useState([]); // Estado local para la metadata procesada
    const [filtroBusqueda, setFiltroBusqueda] = useState(''); // Estado para la búsqueda

    const { modulosTabla, loading, error, metadata } = useSelector((state) => state.modulos);

    // Cargar los datos y metadata al montar el componente
    useEffect(() => {
        dispatch(fetchModulosTabla());
        dispatch(fetchMetadataModulos());
    }, [dispatch]);

    // Filtrar los datos con base en la búsqueda
    useEffect(() => {
        if (modulosTabla && modulosTabla.length > 0) {
            const datosFiltrados = modulosTabla
                .filter(modulo => modulo.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()))
                .map(modulo => ({
                    ...modulo,
                    estado: modulo.estado ? 'Activo' : 'Inactivo',
                }));
            setDatosConIconos(datosFiltrados); // Actualizamos los datos una vez filtrados
        }
    }, [modulosTabla, filtroBusqueda]);

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

    // Mostrar un mensaje si no hay módulos disponibles
    if (!modulosTabla || modulosTabla.length === 0) {
        return <p>No hay módulos disponibles.</p>;
    }

    const columnasModulos = [
        { nombre: 'Nombre', acceso: 'nombre' },
        { nombre: 'Descripción', acceso: 'descripcion' },
        { nombre: 'Ícono', acceso: 'icono' },
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
                nombre="Lista de Módulos"
                columnas={columnasModulos}
                datos={datosConIconos}
                nombreBoton="Crear Módulo"
                onCrear={() => console.log("Creando nuevo módulo")}
                metadata={metadataProcesada.length > 0 ? metadataProcesada : []}
                onSearch={setFiltroBusqueda} // Pasa la función de búsqueda
                renderCustomCell={(columnKey, rowData) => {
                    if (columnKey === 'icono') {
                        return renderIcono(rowData.icono);
                    }
                    if (columnKey === 'acciones') {
                        return (
                            <>
                                <BotonEditar
                                    nombreBoton="Editar Módulo"
                                    metadata={metadataProcesada}
                                    formData={rowData}
                                />
                                <BotonEliminar
                                    nombreBoton="Eliminar Módulo"
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

