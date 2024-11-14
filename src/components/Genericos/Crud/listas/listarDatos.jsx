import PropTypes from 'prop-types';
import TablaDatos from './tablaDatos';
import { Box, Heading, Flex, useColorModeValue } from '@chakra-ui/react';
import BotonCrear from './botonCrear';

export const ListarDatos = ({ nombre, columnas, datos, nombreBoton, onCrear, renderCustomCell, metadata }) => {
    const headingColor = useColorModeValue('green.700', 'green.300');
    const bgColor = useColorModeValue('gray.50', '#1e1e2e');
    
    return (
        <Box p={8} bg={bgColor} minH="100vh">
            <Heading size="lg" color={headingColor} textAlign="center" fontWeight="bold">
                {nombre} {/* Encabezado dinámico */}
            </Heading>
            <Flex justify="flex-end" alignItems="center" mb={8}>  {/* Alineación a la derecha */}
                <BotonCrear nombreBoton={nombreBoton} onClick={onCrear}  metadata={metadata} />
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
    nombre: PropTypes.string.isRequired,        // Título de la página
    columnas: PropTypes.arrayOf(PropTypes.shape({
        nombre: PropTypes.string.isRequired,    // Nombre de la columna
        acceso: PropTypes.string.isRequired     // Identificador de acceso para los datos
    })).isRequired,                             // Array de columnas para la tabla
    datos: PropTypes.arrayOf(PropTypes.object).isRequired,  // Array de datos a listar
    nombreBoton: PropTypes.string.isRequired,   // Texto del botón de creación
    onCrear: PropTypes.func.isRequired,         // Función que se ejecutará al hacer clic en el botón de creación
    renderCustomCell: PropTypes.func,    
    metadata: PropTypes.arrayOf(PropTypes.shape({  // Cambiamos aquí para aceptar un array de objetos
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    }))        // Función opcional para renderizado personalizado de celdas
};
