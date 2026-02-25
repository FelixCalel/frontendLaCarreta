import React from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const float = keyframes`
  0% { transform: translateY(10vh); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateY(-120vh); opacity: 0; }
`;

export const AnimatedBackground = React.memo(() => {
  const icons = React.useMemo(
    () => ["🍍", "🍎", "🥑", "🥬", "🥦", "🥖", "🍌", "🍓"],
    [],
  );
  const bg = useColorModeValue("teal.50", "gray.900");

  const animatedElements = React.useMemo(() => {
    return Array.from({ length: 15 }).map((_, index) => {
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 10;
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
          zIndex={0}
          willChange="transform, opacity"
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
