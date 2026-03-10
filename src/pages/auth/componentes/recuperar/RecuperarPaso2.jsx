import PropTypes from "prop-types";
import {
  VStack,
  Heading,
  Text,
  FormControl,
  HStack,
  PinInput,
  PinInputField,
  Button,
} from "@chakra-ui/react";

export const RecuperarPaso2 = ({
  handleOtpSubmit,
  otp,
  setOtp,
  verifyCode,
  isLoading,
  setStep,
  textColor,
  subTextColor,
  inputBg,
  inputBorder,
}) => (
  <VStack spacing={6} as="form" onSubmit={handleOtpSubmit} w="full">
    <VStack spacing={2} textAlign="center">
      <Heading size="lg" color={textColor} fontWeight="bold">
        Verificar Código
      </Heading>
      <Text color={subTextColor} fontSize="md">
        Ingresa el código de 6 dígitos que enviamos a tu teléfono.
      </Text>
    </VStack>

    <FormControl isRequired display="flex" justifyContent="center">
      <HStack spacing={2}>
        <PinInput
          otp
          type="number"
          size="lg"
          value={otp}
          onChange={(value) => setOtp(value)}
          onComplete={(value) => verifyCode(value)}
          isDisabled={isLoading}
        >
          {[...Array(6)].map((_, i) => (
            <PinInputField
              key={i}
              bg={inputBg}
              borderColor={inputBorder}
              _focus={{ borderColor: "green.400", boxShadow: "outline" }}
              _hover={{ borderColor: "green.400" }}
              w={12}
              h={14}
              fontSize="2xl"
              rounded="lg"
            />
          ))}
        </PinInput>
      </HStack>
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
      Verificar Código
    </Button>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setStep(1)}
      isDisabled={isLoading}
    >
      Cambiar número de teléfono
    </Button>
  </VStack>
);

RecuperarPaso2.propTypes = {
  handleOtpSubmit: PropTypes.func.isRequired,
  otp: PropTypes.string.isRequired,
  setOtp: PropTypes.func.isRequired,
  verifyCode: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setStep: PropTypes.func.isRequired,
  textColor: PropTypes.string.isRequired,
  subTextColor: PropTypes.string.isRequired,
  inputBg: PropTypes.string.isRequired,
  inputBorder: PropTypes.string.isRequired,
};
