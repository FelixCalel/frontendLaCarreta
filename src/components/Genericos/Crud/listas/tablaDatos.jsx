import {
    Table, Thead, Tbody, Tr, Th, Td, Box, useColorModeValue, IconButton, Tooltip, Flex, Button
} from '@chakra-ui/react';
import { useState, useCallback } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';

// Función reutilizable para ordenar datos
const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
        if (a[key] === undefined || b[key] === undefined) return 0;
        if (direction === 'asc') {
            return a[key] > b[key] ? 1 : -1;
        } else {
            return a[key] < b[key] ? 1 : -1;
        }
    });
};

export const TablaDatos = ({ columnas, datos, renderCustomCell, metadata }) => {
    const [sortBy, setSortBy] = useState(null);  // Columna por la que se ordena
    const [sortDirection, setSortDirection] = useState('asc');  // Dirección de la ordenación
    const [selectedRow, setSelectedRow] = useState(null);  // Fila seleccionada

    // Estilos personalizados según el modo de color
    const tableBg = useColorModeValue('#f9f9f9', '#1A202C');  // Color de fondo claro/oscuro
    const headerBg = useColorModeValue('#e5e5e5', '#1A202C');  // Cabecera con contraste suave
    const headerTextColor = useColorModeValue('#1c1c1e', '#f1f1f1');  // Texto en el header
    const cellTextColor = useColorModeValue('#1c1c1e', '#f1f1f1');  // Texto en las celdas
    const borderColor = useColorModeValue('#dddddd', '#444444');  // Bordes suaves
    const rowHoverBg = useColorModeValue('#c8f6d0', 'Teal');  // Hover suave
    const selectedRowBg = useColorModeValue('#d1e7dd', '#2F855A');  // Fila seleccionada en tonos verdes
    const oddRowBg = useColorModeValue('#ffffff', '#2D3748 ');  // Color alterno claro
    const evenRowBg = useColorModeValue('#f7f7f7', '#3E4A5A ');  // Color alterno oscuro

    // Función para manejar la ordenación de columnas
    const handleSort = useCallback((columna) => {
        const isSameColumn = sortBy === columna.acceso;
        const newDirection = isSameColumn && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortBy(columna.acceso);
        setSortDirection(newDirection);
    }, [sortBy, sortDirection]);

    // Ordena los datos según la columna y dirección seleccionada
    const sortedData = sortBy ? sortData(datos, sortBy, sortDirection) : datos;

    return (
        <Box
            borderRadius="md"
            overflowX="auto"  // Asegura que sea responsive para pantallas pequeñas
            boxShadow="xl"  // Sombra más marcada para destacar la tabla
            mt={6}
            border="1px solid"
            borderColor={borderColor}
            maxWidth="100%"  // Asegurando que se ajuste al tamaño del contenedor padre
        >
            <Table variant="simple" bg={tableBg} size="md" maxWidth="100%">
                <Thead bg={headerBg} position="sticky" top="0" zIndex="1">
                    <Tr>
                        {columnas.map((columna, index) => (
                            <Th
                                key={index}
                                color={headerTextColor}
                                fontWeight="bold"
                                fontSize="sm"  // Fuente más pequeña y delicada
                                cursor="pointer"
                                onClick={() => handleSort(columna)}
                                isNumeric={columna.isNumeric}
                                borderBottom="2px solid"
                                borderColor={borderColor}
                            >
                                <Flex align="center" justify={columna.isNumeric ? 'flex-end' : 'flex-start'}>
                                    {columna.nombre}
                                    {sortBy === columna.acceso && (
                                        <IconButton
                                            size="xs"
                                            ml={2}
                                            aria-label="Sort direction"
                                            icon={sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                            variant="ghost"
                                            color={headerTextColor}
                                        />
                                    )}
                                </Flex>
                            </Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {sortedData.map((fila, rowIndex) => (
                        <Tr
                            key={rowIndex}
                            _hover={{ bg: rowHoverBg }}
                            bg={rowIndex % 2 === 0 ? evenRowBg : oddRowBg}
                            onClick={() => setSelectedRow(rowIndex)}
                            transition="background-color 0.2s"
                            role="row"
                        >
                            {columnas.map((columna, colIndex) => (
                                <Td
                                    key={colIndex}
                                    color={cellTextColor}
                                    borderColor={borderColor}
                                    isNumeric={columna.isNumeric}
                                    aria-label={`Fila ${rowIndex + 1}, Columna ${columna.nombre}`}
                                    paddingY="10px"
                                    fontSize="sm"  // Fuente ajustada a un tamaño más cómodo
                                >
                                    {renderCustomCell ? (
                                        renderCustomCell(columna.acceso, fila)
                                    ) : (
                                        <Tooltip
                                            label={fila[columna.acceso]}
                                            hasArrow
                                            aria-label={`Valor completo: ${fila[columna.acceso]}`}
                                        >
                                            <span>
                                                {fila[columna.acceso]?.length > 20
                                                    ? `${fila[columna.acceso].substring(0, 20)}...`
                                                    : fila[columna.acceso]
                                                }
                                            </span>
                                        </Tooltip>
                                    )}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

// Definición de PropTypes mejorada con más validaciones
TablaDatos.propTypes = {
    columnas: PropTypes.arrayOf(PropTypes.shape({
        nombre: PropTypes.string.isRequired,   // Nombre visible de la columna
        acceso: PropTypes.string.isRequired,    // Clave para acceder al dato correspondiente en las filas
        isNumeric: PropTypes.bool,              // Si es columna numérica
    })).isRequired,
    datos: PropTypes.arrayOf(PropTypes.object).isRequired,  // Array de objetos que representan las filas
    renderCustomCell: PropTypes.func,  // Función opcional para renderizar contenido personalizado en las celdas
    metadata: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    }))
};

export default TablaDatos;
