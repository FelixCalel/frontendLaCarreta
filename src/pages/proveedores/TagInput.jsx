import React, { useState, useEffect } from 'react';
import { Box, Input, Tag, TagLabel, TagCloseButton, Wrap, List, ListItem } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { saveTag } from '../../store/proveedores/InfoProveedor/thunks';

const TagInput = ({ tags, setTags, availableTags }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setSuggestions([]);
  }, [availableTags]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value.trim() !== '') {
      const filteredSuggestions = availableTags.filter(tag =>
        tag.label.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions(availableTags);
    }
  };

  const handleInputKeyDown = async (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      await addTag({ label: inputValue.trim(), value: null });
    }
  };

  const handleInputFocus = () => {
    setSuggestions(availableTags);
  };

  const handleInputBlur = () => {
    setTimeout(() => setSuggestions([]), 100); // Pequeño retraso para permitir clics en sugerencias
  };

  const addTag = async (tag) => {
    if (!tags.some(t => t.label === tag.label)) {
      // Check if the tag already exists in availableTags before saving
      let existingTag = availableTags.find(t => t.label === tag.label);
      if (!existingTag) {
        const result = await dispatch(saveTag(tag.label)).unwrap();
        tag.value = result.id;
      } else {
        tag.value = existingTag.value;
      }
      setTags([...tags, tag]);
    }
    setInputValue('');
    setSuggestions([]);
  };

  const handleTagRemove = (tag) => {
    setTags(tags.filter(t => t.value !== tag.value));
  };

  return (
    <Box>
      <Wrap spacing={2} mb={2}>
        {tags.map((tag) => (
          <Tag key={tag.value || tag.label} borderRadius="full" variant="solid" colorScheme="green">
            <TagLabel>{tag.label}</TagLabel>
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
      {(inputValue.trim() !== '' || suggestions.length > 0) && (
        <List mt={2} borderWidth="1px" borderRadius="md" maxH="100px" overflowY="auto">
          {inputValue.trim() && !suggestions.some(s => s.label.toLowerCase() === inputValue.trim().toLowerCase()) && (
            <ListItem
              key={`new-${inputValue}`}
              p={2}
              cursor="pointer"
              _hover={{ backgroundColor: 'teal.100' }}
              onMouseDown={() => addTag({ label: inputValue.trim(), value: null })}
            >
              {inputValue} (Nuevo Tag)
            </ListItem>
          )}
          {suggestions.map((suggestion) => (
            <ListItem
              key={suggestion.value || suggestion.label}
              p={2}
              cursor="pointer"
              _hover={{ backgroundColor: 'teal.100' }}
              onMouseDown={() => addTag(suggestion)}
            >
              {suggestion.label}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default TagInput;
