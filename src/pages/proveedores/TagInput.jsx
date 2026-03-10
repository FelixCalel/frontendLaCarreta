import React, { useState, useRef } from "react";
import {
  Box,
  Input,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  List,
  ListItem,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { saveTag } from "../../store/proveedores/InfoProveedor/thunks";

const TagInput = ({ tags, setTags, availableTags }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const dispatch = useDispatch();

  const prevAvailableTags = useRef(availableTags);
  if (availableTags !== prevAvailableTags.current) {
    prevAvailableTags.current = availableTags;
    setSuggestions([]);
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value.trim() !== "") {
      const filteredSuggestions = availableTags.filter((tag) =>
        tag.label.toLowerCase().includes(e.target.value.toLowerCase()),
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions(availableTags);
    }
  };

  const handleInputKeyDown = async (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      await addTag({ label: inputValue.trim(), value: null });
    }
  };

  const handleInputFocus = () => {
    setSuggestions(availableTags);
  };

  const handleInputBlur = () => {
    setTimeout(() => setSuggestions([]), 100);
  };

  const addTag = async (tag) => {
    let existingTag = availableTags.find((t) => t.label === tag.label);

    if (!existingTag) {
      // El tag no existe, entonces lo guardamos en la base de datos
      const result = await dispatch(saveTag(tag.label)).unwrap();
      tag = { ...tag, value: result.id };
    } else {
      // El tag ya existe, simplemente obtenemos su valor
      tag = { ...tag, value: existingTag.value };
    }

    // Si el tag no está ya en la lista de tags, lo añadimos
    if (!tags.some((t) => t.value === tag.value)) {
      setTags([...tags, tag]);
    }

    setInputValue("");
    setSuggestions([]);
  };

  const handleTagRemove = (tag) => {
    setTags(tags.filter((t) => t.value !== tag.value));
  };

  return (
    <Box>
      <Wrap spacing={2} mb={2}>
        {tags.map((tag) => (
          <Tag
            key={tag.value || tag.label}
            borderRadius="full"
            variant="solid"
            colorScheme="green"
          >
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
      {(inputValue.trim() !== "" || suggestions.length > 0) && (
        <List
          mt={2}
          borderWidth="1px"
          borderRadius="md"
          maxH="100px"
          overflowY="auto"
        >
          {inputValue.trim() &&
            !suggestions.some(
              (s) => s.label.toLowerCase() === inputValue.trim().toLowerCase(),
            ) && (
              <ListItem
                key={`new-${inputValue}`}
                p={2}
                cursor="pointer"
                _hover={{ backgroundColor: "teal.100" }}
                onMouseDown={() =>
                  addTag({ label: inputValue.trim(), value: null })
                }
              >
                {inputValue} (Nuevo Tag)
              </ListItem>
            )}
          {suggestions.map((suggestion) => (
            <ListItem
              key={suggestion.value || suggestion.label}
              p={2}
              cursor="pointer"
              _hover={{ backgroundColor: "teal.100" }}
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
