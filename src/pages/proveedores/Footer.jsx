import {
  Box,
  Flex,
  HStack,
  Icon,
  Link,
  Text,
  useColorModeValue,
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
      py={{ base: 6, md: 8 }}
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

        <HStack spacing={8}>
          {[
            { icon: FaFacebookF, href: "#" },
            { icon: FaInstagram, href: "#" },
            { icon: FaWhatsapp, href: "#" },
          ].map(({ icon, href }) => (
            <Link
              key={href}
              href={href}
              isExternal
              transition="transform 0.2s"
              _hover={{ transform: "scale(1.15)", color: hover }}
            >
              <Icon as={icon} boxSize={5} />
            </Link>
          ))}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Footer;
