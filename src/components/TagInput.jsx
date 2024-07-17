import React, { useState, useEffect } from 'react';
import { Box, Input, Tag, TagLabel, TagCloseButton, Wrap, List, ListItem, Button } from '@chakra-ui/react';

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    // Cargar etiquetas guardadas desde el almacenamiento local
    const savedTags = JSON.parse(localStorage.getItem('tags')) || [];
    setAllTags(savedTags);
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value.trim() !== '') {
      const filteredSuggestions = allTags.filter(tag =>
        tag.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions(allTags);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  const handleInputFocus = () => {
    setSuggestions(allTags);
  };

  const handleInputBlur = () => {
    setTimeout(() => setSuggestions([]), 100); // Pequeño retraso para permitir clics en sugerencias
  };

  const addTag = (tag) => {
    if (!tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      saveTag(tag);
    }
    setInputValue('');
    setSuggestions([]);
  };

  const saveTag = (tag) => {
    const savedTags = JSON.parse(localStorage.getItem('tags')) || [];
    if (!savedTags.includes(tag)) {
      savedTags.push(tag);
      localStorage.setItem('tags', JSON.stringify(savedTags));
      setAllTags(savedTags);
    }
  };

  const handleTagRemove = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const clearRecentTags = () => {
    localStorage.removeItem('tags');
    setAllTags([]);
    setSuggestions([]);
  };

  return (
    <Box>
      <Wrap spacing={2} mb={2}>
        {tags.map((tag, index) => (
          <Tag key={index} borderRadius="full" variant="solid" colorScheme="green"> {/* Cambia el colorScheme a 'green' */}
            <TagLabel>{tag}</TagLabel>
            <TagCloseButton onClick={() => handleTagRemove(tag)} />
          </Tag>
        ))}
      </Wrap>
      <Input
        placeholder="Productos principales"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        mt={2}
      />
      {suggestions.length > 0 && (
        <List mt={2} borderWidth="1px" borderRadius="md" maxH="100px" overflowY="auto">
          {suggestions.map((suggestion, index) => (
            <ListItem
              key={index}
              p={2}
              cursor="pointer"
              _hover={{ backgroundColor: 'teal.100' }}
              onClick={() => addTag(suggestion)}
            >
              {suggestion}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default TagInput;
