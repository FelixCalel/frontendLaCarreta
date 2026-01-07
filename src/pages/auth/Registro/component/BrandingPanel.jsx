import React from "react";
import {
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  keyframes,
} from "@chakra-ui/react";

const float = keyframes`
  0% { transform: translateY(10vh); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateY(-120vh); opacity: 0; }
`;

const AnimatedBackground = React.memo(() => {
  const icons = React.useMemo(
    () => ["🍍", "🍎", "🛒", "🛍️", "🥦", "🥖", "🧀", "🍇"],
    []
  );
  const bg = useColorModeValue("green.50", "gray.900");

  const animatedElements = React.useMemo(() => {
    return Array.from({ length: 15 }).map((_, index) => {
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 15;
      const animation = `${float} ${duration}s linear ${delay}s infinite`;
      return (
        <Text
          key={index}
          position="absolute"
          bottom="-20%"
          left={`${Math.random() * 95}%`}
          fontSize={`${Math.random() * 1.5 + 0.75}rem`}
          animation={animation}
          opacity={0}
        >
          {icons[Math.floor(Math.random() * icons.length)]}
        </Text>
      );
    });
  }, [icons]);

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflow="hidden"
      bg={bg}
      zIndex={0}
    >
      {animatedElements}
    </Box>
  );
});

AnimatedBackground.displayName = "AnimatedBackground";

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
        fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
        color={useColorModeValue("green.700", "green.200")}
      >
        Gestiona tus Pedidos con La Carreta
      </Heading>
      <Text
        fontSize={{ base: "md", lg: "lg" }}
        color={useColorModeValue("gray.600", "gray.300")}
      >
        Regístrate para acceder a nuestro sistema y optimizar tus pedidos de
        forma rápida, fácil y segura.
      </Text>
    </Stack>
  </Flex>
));

BrandingPanel.displayName = "BrandingPanel";
