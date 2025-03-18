import React, { useState } from 'react';
import { Input, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    // Aquí puedes manejar la búsqueda, por ejemplo, filtrando datos o redirigiendo a otra vista
    console.log('Buscando:', searchTerm);
  };

  return (
    <InputGroup ml={20 }>
      <Input
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <InputRightElement >
        <IconButton
       
          aria-label="Buscar"
          icon={<SearchIcon />}
          onClick={handleSearch}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchBar;
