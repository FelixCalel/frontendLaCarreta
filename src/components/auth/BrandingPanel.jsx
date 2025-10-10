import React from "react";
import {
  Flex,
  Stack,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { AnimatedBackground } from "./AnimatedBackground";

export const BrandingPanel = React.memo(({ ...props }) => (
  <Flex
    flex={1}
    align={"center"}
    justify={"center"}
    position="relative"
    {...props}
  >
    <AnimatedBackground />
    <Stack spacing={4} w={"full"} maxW={"md"} p={8} zIndex={1}>
      <Heading
        fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
        color={useColorModeValue("teal.700", "teal.200")}
      >
        ¡Bienvenido de Nuevo!
      </Heading>
      <Text
        fontSize={{ base: "md", lg: "lg" }}
        color={useColorModeValue("gray.600", "gray.300")}
      >
        Inicia sesión para continuar gestionando tus pedidos en La Carreta.
      </Text>
    </Stack>
  </Flex>
));

BrandingPanel.displayName = "BrandingPanel";
