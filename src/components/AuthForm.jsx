import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const AuthForm = ({ onSubmit, loading, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      p={4}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="none" // Eliminación de sombras
    >
      <VStack spacing={4} align="stretch">
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Ingresa tu correo"
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Contraseña</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Ingresa tu contraseña"
          />
        </FormControl>

        {error && <Text color="red.500">{error}</Text>}

        <Button
          type="submit"
          colorScheme="blue"
          isDisabled={loading}
          _hover={{}} // Eliminación de efectos hover
        >
          {loading ? "Cargando..." : "Iniciar Sesión"}{" "}
          {/* Eliminación de Spinner */}
        </Button>
      </VStack>
    </Box>
  );
};

AuthForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

AuthForm.defaultProps = {
  loading: false,
  error: null,
};

const MemoizedAuthForm = React.memo(AuthForm);
export default MemoizedAuthForm;
