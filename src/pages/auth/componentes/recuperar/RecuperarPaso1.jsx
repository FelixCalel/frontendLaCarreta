import PropTypes from "prop-types";
import {
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  Button,
  Icon,
} from "@chakra-ui/react";
import { FaEnvelope } from "react-icons/fa";

export const RecuperarPaso1 = ({
  handleInitialSubmit,
  identifier,
  setIdentifier,
  isLoading,
  textColor,
  subTextColor,
  inputBg,
  inputBorder,
}) => (
  <VStack spacing={6} as="form" onSubmit={handleInitialSubmit} w="full">
    <VStack spacing={2} textAlign="center">
      <Heading size="lg" color={textColor} fontWeight="bold">
        Recuperar Contraseña
      </Heading>
      <Text color={subTextColor} fontSize="md">
        Ingresa tu correo o teléfono para recibir un código de recuperación.
      </Text>
    </VStack>

    <FormControl isRequired>
      <FormLabel
        color={textColor}
        fontWeight="medium"
        display="flex"
        alignItems="center"
        gap={2}
      >
        <Icon as={FaEnvelope} color="gray.500" /> Correo Electrónico o
        Teléfono
      </FormLabel>
      <InputGroup>
        <Input
          type="text"
          placeholder="ejemplo@correo.com o 3210..."
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          bg={inputBg}
          border="1px solid"
          borderColor={inputBorder}
          color={textColor}
          _hover={{ borderColor: "green.400" }}
          _focus={{
            borderColor: "green.400",
            boxShadow: "0 0 0 1px var(--chakra-colors-green-400)",
          }}
          size="lg"
          rounded="xl"
        />
      </InputGroup>
    </FormControl>

    <Button
      type="submit"
      w="full"
      size="lg"
      colorScheme="green"
      bgGradient="linear(to-r, green.400, teal.500)"
      _hover={{
        bgGradient: "linear(to-r, green.500, teal.600)",
        transform: "translateY(-2px)",
        boxShadow: "lg",
      }}
      rounded="xl"
      isLoading={isLoading}
      loadingText="Verificando..."
      fontWeight="bold"
    >
      Continuar
    </Button>
  </VStack>
);

RecuperarPaso1.propTypes = {
  handleInitialSubmit: PropTypes.func.isRequired,
  identifier: PropTypes.string.isRequired,
  setIdentifier: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  textColor: PropTypes.string.isRequired,
  subTextColor: PropTypes.string.isRequired,
  inputBg: PropTypes.string.isRequired,
  inputBorder: PropTypes.string.isRequired,
};
