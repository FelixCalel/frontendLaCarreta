import React, { useState } from 'react';
import { Input, Box, InputGroup, InputLeftElement, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';

export const BuscadorGenerico = ({ onSearch }) => {
    const [searchValue, setSearchValue] = useState('');

    const inputBg = useColorModeValue('gray.50', 'gray.800');
    const inputBorderColor = useColorModeValue('teal.400', 'teal.300');
    const iconColor = useColorModeValue('gray.500', 'gray.400');
    const placeholderColor = useColorModeValue('gray.500', 'gray.400');
    const inputTextColor = useColorModeValue('gray.800', 'gray.100');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        onSearch(value);
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
                    size="lg"
                    borderRadius="full"
                    focusBorderColor={inputBorderColor}
                    _placeholder={{ color: placeholderColor }}
                    _hover={{ borderColor: inputBorderColor }}
                    color={inputTextColor}
                    bg={inputBg}
                    transition="all 0.2s ease-in-out"
                    boxShadow="lg"
                    border="2px solid transparent"
                />
            </InputGroup>
        </Box>
    );
};

export default BuscadorGenerico;
