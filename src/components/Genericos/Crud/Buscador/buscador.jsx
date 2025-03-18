import React, { useState } from 'react';
import { Input, Box, InputGroup, InputLeftElement, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';

export const BuscadorGenerico = ({ onSearch }) => {
    const [searchValue, setSearchValue] = useState('');

    // Valores que cambiarán según el modo claro u oscuro
    const inputBg = useColorModeValue('gray.50', 'gray.800');
    const inputBorderColor = useColorModeValue('teal.400', 'teal.300');
    const iconColor = useColorModeValue('gray.500', 'gray.400');
    const placeholderColor = useColorModeValue('gray.500', 'gray.400');
    const inputTextColor = useColorModeValue('gray.800', 'gray.100');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        onSearch(value);  // Pasamos el valor de búsqueda al componente padre
    };

    return (
        <Box mb={4}>
            <InputGroup>
                <InputLeftElement
                    pointerEvents="none"
                    children={<Icon as={FaSearch} color={iconColor} />}
                />
                <Input
                    placeholder="Buscar..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    size="lg"  // Aumentamos el tamaño del input
                    borderRadius="full"  // Hacemos que el borde sea completamente redondeado
                    focusBorderColor={inputBorderColor}
                    _placeholder={{ color: placeholderColor }}
                    _hover={{ borderColor: inputBorderColor }}  // Cambiamos el borde al pasar el mouse
                    color={inputTextColor}  // Color del texto en el input
                    bg={inputBg}
                    transition="all 0.2s ease-in-out"  // Suave transición para cuando se enfoca el input
                    boxShadow="lg"  // Más sombra para destacar
                    border="2px solid transparent"  // Borde predeterminado transparente
                />
            </InputGroup>
        </Box>
    );
};

export default BuscadorGenerico;
