import React, { useState, useRef } from "react";
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Box,
  List,
  ListItem,
  useColorModeValue,
  Fade,
} from "@chakra-ui/react";
import { FiSearch, FiX } from "react-icons/fi";
import PropTypes from "prop-types";

const EMPTY_ARRAY = [];
const SearchBar = ({
  placeholder,
  onSearch,
  suggestions = EMPTY_ARRAY,
  onSuggestionClick,
  initialValue = "",
}) => {
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onSearch(newValue);
  };

  const handleClear = () => {
    onSearch("");
  };


  const inputBg = useColorModeValue("white", "gray.800");
  const inputColor = useColorModeValue("gray.800", "white");
  const iconColor = useColorModeValue("gray.400", "gray.500");
  const suggestionsBg = useColorModeValue("white", "gray.700");
  const suggestionsHoverBg = useColorModeValue("blue.50", "blue.600");
  const focusBorderColor = useColorModeValue("blue.500", "blue.300");
  const shadow = useColorModeValue("md", "dark-lg");
  const listBorderColor = useColorModeValue("gray.100", "gray.600");

  return (
    <Box position="relative" width="100%" maxW="600px" mx="auto">
      <Flex alignItems="center">
        <InputGroup size="md">
          <InputLeftElement pointerEvents="none">
            <FiSearch color={iconColor} />
          </InputLeftElement>
          <Input
            type="text"
            placeholder={placeholder || "Buscar..."}
            value={initialValue}
            onChange={handleInputChange}
            focusBorderColor={focusBorderColor}
            bg={inputBg}
            color={inputColor}
            borderRadius="full"
            boxShadow={shadow}
            _hover={{ boxShadow: "lg" }}
            _focus={{ boxShadow: "outline" }}
            transition="all 0.2s"
            pr="3rem"
          />
          {initialValue && (
            <InputRightElement>
              <IconButton
                aria-label="Limpiar búsqueda"
                icon={<FiX />}
                size="sm"
                variant="ghost"
                color={iconColor}
                onClick={handleClear}
                borderRadius="full"
                _hover={{ bg: "transparent", color: "red.500" }}
              />
            </InputRightElement>
          )}
        </InputGroup>
      </Flex>

      {suggestions && suggestions.length > 0 && (
        <Fade in={suggestions.length > 0}>
          <Box
            position="absolute"
            top="calc(100% + 8px)"
            width="100%"
            bg={suggestionsBg}
            borderRadius="xl"
            boxShadow="xl"
            zIndex="1000"
            maxHeight="300px"
            overflowY="auto"
            border="1px solid"
            borderColor={listBorderColor}
          >
            <List spacing={0}>
              {suggestions.slice(0, 5).map((item, index) => (
                <ListItem
                  key={item.id || index}
                  p={3}
                  cursor="pointer"
                  _hover={{ bg: suggestionsHoverBg }}
                  onClick={() => onSuggestionClick(item)}
                  borderBottomWidth={
                    index === suggestions.length - 1 ? 0 : "1px"
                  }
                  borderColor={listBorderColor}
                  transition="background-color 0.2s"
                >
                  {item.label}
                </ListItem>
              ))}
            </List>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  suggestions: PropTypes.array,
  onSuggestionClick: PropTypes.func,
  initialValue: PropTypes.string,
};

export default SearchBar;
