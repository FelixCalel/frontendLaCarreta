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
  useColorModeValue,
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

  // Colores dinámicos según modo claro/oscuro
  const inputBg = useColorModeValue("white", "gray.800");
  const inputColor = useColorModeValue("gray.800", "white");
  const iconColor = useColorModeValue("gray.500", "gray.400");
  const suggestionsBg = useColorModeValue("white", "gray.700");
  const suggestionsHoverBg = useColorModeValue("blue.50", "blue.800");
  const focusBorderColor = useColorModeValue("blue.500", "blue.200");

  return (
    <Box position="relative" width="100%">
      <Flex>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch color={iconColor} />
          </InputLeftElement>
          <Input
            type="text"
            placeholder={placeholder || "Buscar..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            focusBorderColor={focusBorderColor}
            bg={inputBg}
            color={inputColor}
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
          bg={suggestionsBg}
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
                _hover={{ bg: suggestionsHoverBg }}
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
