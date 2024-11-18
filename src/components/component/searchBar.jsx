import React, { useState } from "react";
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Box,
  List,
  ListItem,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import PropTypes from "prop-types";

const SearchBar = ({ placeholder, onSearch, suggestions, onSuggestionClick }) => {
  const [query, setQuery] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <Box position="relative" width="100%">
      <Flex>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.500" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder={placeholder || "Buscar..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            focusBorderColor="blue.500"
            bg="white"
            borderRadius="full"
            boxShadow="sm"
          />
        </InputGroup>
        <IconButton
          aria-label="Buscar"
          icon={<FiSearch />}
          ml={2}
          colorScheme="blue"
          borderRadius="full"
          onClick={() => onSearch(query.trim())}
        />
      </Flex>
      {/* Sugerencias dinámicas */}
      {suggestions && suggestions.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          width="100%"
          bg="white"
          borderRadius="md"
          boxShadow="md"
          zIndex="1000"
          maxHeight="200px"
          overflowY="auto"
        >
          <List spacing={2}>
            {suggestions.slice(0, 5).map((item) => (
              <ListItem
                key={item.id}
                p={2}
                cursor="pointer"
                _hover={{ bg: "blue.50" }}
                onClick={() => onSuggestionClick(item)}
              >
                {item.nombre} - {item.correlativo}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  suggestions: PropTypes.array,
  onSuggestionClick: PropTypes.func.isRequired,
};

export default SearchBar;
