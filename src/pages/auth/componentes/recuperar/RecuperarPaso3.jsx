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
  InputRightElement,
} from "@chakra-ui/react";

export const RecuperarPaso3 = ({
  handlePasswordResetSubmit,
  showPassword,
  setShowPassword,
  newPassword,
  setNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  confirmPassword,
  setConfirmPassword,
  isLoading,
  textColor,
  subTextColor,
  inputBg,
  inputBorder,
}) => (
  <VStack spacing={6} as="form" onSubmit={handlePasswordResetSubmit} w="full">
    <VStack spacing={2} textAlign="center">
      <Heading size="lg" color={textColor} fontWeight="bold">
        Nueva Contraseña
      </Heading>
      <Text color={subTextColor} fontSize="md">
        Ingresa y confirma tu nueva contraseña segura.
      </Text>
    </VStack>

    <FormControl isRequired>
      <FormLabel color={textColor} fontWeight="medium">
        Nueva Contraseña
      </FormLabel>
      <InputGroup>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="********"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            variant="ghost"
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>

    <FormControl isRequired>
      <FormLabel color={textColor} fontWeight="medium">
        Confirmar Contraseña
      </FormLabel>
      <InputGroup>
        <Input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="********"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            variant="ghost"
          >
            {showConfirmPassword ? "Ocultar" : "Mostrar"}
          </Button>
        </InputRightElement>
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
      loadingText="Actualizando..."
      fontWeight="bold"
    >
      Restablecer Contraseña
    </Button>
  </VStack>
);

RecuperarPaso3.propTypes = {
  handlePasswordResetSubmit: PropTypes.func.isRequired,
  showPassword: PropTypes.bool.isRequired,
  setShowPassword: PropTypes.func.isRequired,
  newPassword: PropTypes.string.isRequired,
  setNewPassword: PropTypes.func.isRequired,
  showConfirmPassword: PropTypes.bool.isRequired,
  setShowConfirmPassword: PropTypes.func.isRequired,
  confirmPassword: PropTypes.string.isRequired,
  setConfirmPassword: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  textColor: PropTypes.string.isRequired,
  subTextColor: PropTypes.string.isRequired,
  inputBg: PropTypes.string.isRequired,
  inputBorder: PropTypes.string.isRequired,
};
