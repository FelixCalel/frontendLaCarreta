import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchModulosTabla, fetchMetadataModulos } from '../../store/Modulos/thunks';
import { ListarDatos } from "../../components/Genericos/Crud/listas/listarDatos.jsx";
import { Box, Button, useColorModeValue, Spinner } from "@chakra-ui/react";
import iconCatalog from '../../components/Iconos/IconCatalog.jsx'; // Importamos el catálogo de íconos
import ModalEdit from '../../components/Genericos/Crud/Modal/modalEdit';

export const PageModulos = () => {
    const bgColor = useColorModeValue('gray.50', '#1e1e2e');
    const dispatch = useDispatch();

    // Estados locales
    const [datosConIconos, setDatosConIconos] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Controla el estado del modal de edición
    const [selectedModulo, setSelectedModulo] = useState(null);    // Módulo seleccionado para edición
    const [selectedIcon, setSelectedIcon] = useState('');          // Ícono seleccionado en el modal
    const [showIconCatalog, setShowIconCatalog] = useState(false); // Controla si se muestra el catálogo de íconos
    const [metadataProcesada, setMetadataProcesada] = useState([]); // Estado local para la metadata procesada

    const { modulosTabla, loading, error, metadata } = useSelector((state) => state.modulos);

    // Cargar los datos y metadata al montar el componente
    useEffect(() => {
        dispatch(fetchModulosTabla());
        dispatch(fetchMetadataModulos());
    }, [dispatch]);

    // Procesar los datos para agregar el estado y preparar los datos con íconos
    useEffect(() => {
        if (modulosTabla && modulosTabla.length > 0) {
            const datosTransformados = modulosTabla.map(modulo => ({
                ...modulo,
                estado: modulo.estado ? 'Activo' : 'Inactivo',
            }));

            setDatosConIconos(datosTransformados); // Actualizamos los datos una vez procesados
        }
    }, [modulosTabla]);

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

    // Definimos explícitamente la columna 'acciones' junto con otras columnas
    const columnasModulos = [
        { nombre: 'Nombre', acceso: 'nombre' },
        { nombre: 'Descripción', acceso: 'descripcion' },
        { nombre: 'Ícono', acceso: 'icono' },
        { nombre: 'Estado', acceso: 'estado' },
        { nombre: 'Acciones', acceso: 'acciones' }, // Columna para las acciones
    ];

    // Función para renderizar íconos
    const renderIcono = (iconName) => {
        const IconComponent = iconCatalog[iconName];
        if (!IconComponent) {
            return <p>Icono no disponible</p>;
        }
        return <IconComponent style={{ width: '24px', height: '24px' }} />;
    };

    // Abrir el modal de edición
    const handleEditarModulo = (modulo) => {
        setSelectedModulo(modulo);
        setSelectedIcon(modulo.icono); // Seteamos el ícono actual del módulo
        setIsEditModalOpen(true);      // Abrimos el modal
    };

    // Guardar cambios del ícono y otros campos
    const handleGuardarCambios = () => {
        const nuevosDatos = datosConIconos.map((modulo) =>
            modulo.id === selectedModulo.id
                ? { ...modulo, icono: selectedIcon, estado: selectedModulo.estado ? 'Activo' : 'Inactivo' }  // Actualizamos el ícono seleccionado y estado
                : modulo
        );
        setDatosConIconos(nuevosDatos); // Actualizamos el estado
        setIsEditModalOpen(false);      // Cerramos el modal
    };

    return (
        <Box p={8} bg={bgColor} minH="100vh">
            <ListarDatos
                nombre="Lista de Módulos"
                columnas={columnasModulos}
                datos={datosConIconos}
                nombreBoton="Crear Módulo"
                onCrear={() => console.log("Creando nuevo módulo")}
                metadata={metadataProcesada.length > 0 ? metadataProcesada : []}  // Ahora pasamos un array vacío en lugar de null
                renderCustomCell={(columnKey, rowData) => {
                    if (columnKey === 'icono') {
                        return renderIcono(rowData.icono);  // Renderiza el ícono dinámicamente
                    }
                    if (columnKey === 'acciones') {
                        // Renderiza el botón de editar en la columna de acciones
                        return (
                            <Button
                                colorScheme="green"
                                variant="outline"
                                size="sm"
                                borderRadius="md"
                                _hover={{ bg: "green.500", color: "white" }}
                                onClick={() => handleEditarModulo(rowData)}
                            >
                                Editar
                            </Button>
                        );
                    }
                    return rowData[columnKey];
                }}
            />
            <ModalEdit
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                selectedModulo={selectedModulo}
                setSelectedModulo={setSelectedModulo}
                selectedIcon={selectedIcon}
                setSelectedIcon={setSelectedIcon}
                showIconCatalog={showIconCatalog}
                setShowIconCatalog={setShowIconCatalog}
                handleGuardarCambios={handleGuardarCambios}
            />
        </Box>
    );
};

export default PageModulos;
