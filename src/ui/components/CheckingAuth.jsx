import { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  Progress,
  useColorModeValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import {
  m,
  LazyMotion,
  domAnimation,
  useAnimation,
  AnimatePresence,
} from "framer-motion";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const MotionBox = m.create(Box);

const CheckingAuth = () => {
  const controls = useAnimation();
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPercent((p) => (p >= 95 ? p : p + 4));
    }, 280);

    controls.start({
      scale: [1, 1.15, 1],
      transition: { repeat: Infinity, duration: 1.4 },
    });

    return () => clearInterval(id);
  }, [controls]);

  const bg = useColorModeValue("white", "gray.800");
  const green1 = useColorModeValue("green.400", "green.300");
  const green2 = useColorModeValue("green.600", "green.500");
  const ringBg = `conic-gradient(${green1} 0% 25%, transparent 25% 50%, ${green1} 50% 75%, transparent 75%)`;

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        <Box
          as={m.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          h="100vh"
          w="100vw"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgGradient={useColorModeValue(
            "linear(to-br, green.50, green.100)",
            "linear(to-br, gray.700, gray.900)",
          )}
        >
          <MotionBox
            bg={bg}
            p={{ base: 8, md: 12 }}
            rounded="2xl"
            boxShadow={useColorModeValue("2xl", "dark-lg")}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 140 }}
          >
            <VStack spacing={8}>
              <Box
                as={m.div}
                animation={`${spin} 1.6s linear infinite`}
                w="120px"
                h="120px"
                borderRadius="full"
                position="relative"
                _before={{
                  content: '""',
                  position: "absolute",
                  inset: "8px",
                  borderRadius: "full",
                  bg: bg,
                }}
                bgImage={ringBg}
                bgSize="cover"
              />
              <Text
                fontSize="xl"
                fontWeight="semibold"
                bgGradient={`linear(to-r, ${green1}, ${green2})`}
                bgClip="text"
                textAlign="center"
              >
                Cargando…
              </Text>
              <Progress
                value={percent}
                w="260px"
                size="sm"
                colorScheme="green"
                rounded="full"
                hasStripe
              />
            </VStack>
          </MotionBox>
        </Box>
      </AnimatePresence>
    </LazyMotion>
  );
};

export default CheckingAuth;
