import {
  Box,
  Flex,
  HStack,
  Icon,
  Link,
  Text,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const bgStart = useColorModeValue("green.500", "green.700");
  const bgEnd = useColorModeValue("green.600", "green.800");
  const hover = useColorModeValue("whiteAlpha.900", "green.200");

  return (
    <Box
      bgGradient={`linear(to-r, ${bgStart}, ${bgEnd})`}
      color="whiteAlpha.900"
      py={{ base: 6, md: 4 }}
      px={{ base: 4, md: 10 }}
      shadow="inner"
    >
      <Flex
        maxW="6xl"
        mx="auto"
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
        gap={4}
      >
        <Text fontSize="sm" textAlign={{ base: "center", md: "left" }}>
          &copy; {new Date().getFullYear()} La Carreta · Todos los derechos
          reservados
        </Text>
        <HStack spacing={0}>         
          <Button
            as="a"
            href="https://chat.whatsapp.com/FqaqKawbkrO5yOJUMcvruf"
            target="_blank"
            rel="noopener noreferrer"
            leftIcon={<FaWhatsapp />}
            color="white"
            variant="outline"
            size="sm"
            rounded="full"
            px={4}
            _hover={{ bg: "whiteAlpha.200" }}
          >
             Soporte WhatsApp
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Footer;
