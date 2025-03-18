import PropTypes from 'prop-types';
import TablaDatos from './tablaDatos';
import { Box, Heading, Flex, useColorModeValue } from '@chakra-ui/react';
import BotonCrear from './botonCrear';
import { BuscadorGenerico } from '../Buscador/buscador';  // Importa el buscador genérico

export const ListarDatos = ({ nombre, columnas, datos, nombreBoton, onCrear, renderCustomCell, metadata, onSearch }) => {
    const headingColor = useColorModeValue('black', 'white');
    const bgColor = useColorModeValue('gray.50', '#1e1e2e');
    
    return (
        <Box p={8} bg={bgColor} minH="100vh">
            <Heading size="xl" color={headingColor} textAlign="center" fontWeight="bold" mb={5}>
                {nombre} {/* Encabezado dinámico */}
            </Heading>
            <Flex justify="space-between" alignItems="center" mb={1}>  {/* Alineación horizontal */}
                {/* Aumentamos el tamaño del buscador y alineamos */}
                <Box width="60%">  {/* Esto controla el ancho del buscador */}
                    <BuscadorGenerico onSearch={onSearch} />
                </Box>

                 {nombreBoton !== "Crear Progreso" && (
                    <BotonCrear nombreBoton={nombreBoton} onClick={onCrear} metadata={metadata} />
                )}
            </Flex>
            <TablaDatos 
                columnas={columnas} 
                datos={datos} 
                renderCustomCell={renderCustomCell} // Pasamos renderCustomCell a TablaDatos
                metadata={metadata} 
            />
        </Box>
    );
};

// Definición de PropTypes
ListarDatos.propTypes = {
    nombre: PropTypes.string.isRequired,
    columnas: PropTypes.arrayOf(PropTypes.shape({
        nombre: PropTypes.string.isRequired,
        acceso: PropTypes.string.isRequired
    })).isRequired,
    datos: PropTypes.arrayOf(PropTypes.object).isRequired,
    nombreBoton: PropTypes.string.isRequired,
    onCrear: PropTypes.func.isRequired,
    renderCustomCell: PropTypes.func,
    metadata: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    })),
    onSearch: PropTypes.func.isRequired
};
