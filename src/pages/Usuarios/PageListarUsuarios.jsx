import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsuarios, fetchUsuariosMetadata } from '../../store/usuarios/usuariosSlice'; // Importa la acción que obtiene los usuarios y la metadata
import { ListarDatos } from '../../components/Genericos/Crud/listas/listarDatos';
import { Box, useColorModeValue, Spinner } from '@chakra-ui/react';
import { BotonEditar } from '../../components/Genericos/Crud/listas/botonEditar'; // Botón de editar genérico
import { BotonEliminar } from '../../components/Genericos/Crud/listas/botonEliminar'; // Botón de eliminar genérico
import iconCatalog from '../../components/Iconos/IconCatalog';

export const PageListarUsuarios = () => {
    const bgColor = useColorModeValue('gray.50', '#1e1e2e');
    const dispatch = useDispatch();
    const [datosConIconos, setDatosConIconos] = useState([]);
    const [metadataProcesada, setMetadataProcesada] = useState([]); // Estado local para la metadata procesada
    const [filtroBusqueda, setFiltroBusqueda] = useState(''); // Estado para la búsqueda

    // Utiliza 'items' aquí para referirse a los usuarios
    const { items: usuarios, loading, error, metadata } = useSelector(state => state.usuarios);

    // Cargar los usuarios al montar el componente
    useEffect(() => {
        dispatch(fetchUsuarios());
        dispatch(fetchUsuariosMetadata());
    }, [dispatch]);

    // Filtrar los datos con base en la búsqueda
    useEffect(() => {
        if (usuarios && usuarios.length > 0) {
            const datosFiltrados = usuarios
                .filter(usuario => usuario.nombres.toLowerCase().includes(filtroBusqueda.toLowerCase()))
                .map(usuario => ({
                    ...usuario,
                    estado: usuario.estado ? 'Activo' : 'Inactivo',
                }));
            setDatosConIconos(datosFiltrados); // Actualizamos los datos una vez filtrados
        }
    }, [usuarios, filtroBusqueda]);

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

    // Mostrar un mensaje si no hay usuarios disponibles
    if (!usuarios || usuarios.length === 0) {
        return <p>No hay usuarios disponibles.</p>;
    }

    // Definimos explícitamente la columna 'acciones' junto con otras columnas
    const columnasUsuarios = [
        { nombre: 'Nombre', acceso: 'nombres' },
        { nombre: 'Apellido', acceso: 'apellidos' },
        { nombre: 'Correo Electrónico', acceso: 'correo_electronico' },
        { nombre: 'Rol', acceso: 'role.nombre' },
        { nombre: 'Estado', acceso: 'estado' },
        { nombre: 'Acciones', acceso: 'acciones' }, // Columna para las acciones
    ];

    // Renderizar íconos si es necesario (en este caso no hay íconos asociados a usuarios, pero lo dejo por consistencia)
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
                nombre="Lista de Usuarios"
                columnas={columnasUsuarios}
                datos={datosConIconos}
                nombreBoton="Crear Usuario"
                onCrear={() => console.log("Creando nuevo usuario")}
                metadata={metadataProcesada.length > 0 ? metadataProcesada : []}
                onSearch={setFiltroBusqueda} // Pasa la función de búsqueda
                renderCustomCell={(columnKey, rowData) => {
                    if (columnKey === 'role.nombre') {
                        return rowData.role ? rowData.role.nombre : 'Sin Rol';
                    }
                    if (columnKey === 'acciones') {
                        return (
                            <>
                                <BotonEditar
                                    nombreBoton="Editar Usuario"
                                    metadata={metadataProcesada}
                                    formData={rowData}
                                />
                                <BotonEliminar
                                    nombreBoton="Eliminar Usuario"
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

export default PageListarUsuarios;
