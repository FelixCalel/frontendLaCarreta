import React from "react";
import { Box, Button, Heading, Text, VStack, Icon } from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Global Error Boundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      retryCount: this.state.retryCount + 1,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.hasError &&
      prevState.hasError !== this.state.hasError &&
      this.state.retryCount === 0
    ) {
      setTimeout(() => {
        this.handleRetry();
      }, 100);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.state.retryCount === 0) {
        return null;
      }

      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          h="100vh"
          bg="gray.50"
          p={4}
        >
          <VStack spacing={6} textAlign="center" maxW="md">
            <Icon as={WarningTwoIcon} w={20} h={20} color="red.500" />
            <Heading as="h1" size="xl" color="gray.800">
              Algo salió mal
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Ha ocurrido un error inesperado. Hemos intentado recuperarnos
              automáticamente pero no fue posible.
            </Text>
            <Button
              colorScheme="teal"
              size="lg"
              onClick={() => window.location.reload()}
              _hover={{ transform: "scale(1.05)" }}
            >
              Recargar Página
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
