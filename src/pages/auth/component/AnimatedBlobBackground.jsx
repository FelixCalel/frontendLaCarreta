import { Box, keyframes, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const blobAnimation = keyframes`
  0% { transform: translate(0%, 0%) scale(1); }
  33% { transform: translate(30%, -20%) scale(1.1); }
  66% { transform: translate(-20%, 20%) scale(0.9); }
  100% { transform: translate(0%, 0%) scale(1); }
`;

const AnimatedBlobBackground = () => {
  const color1 = useColorModeValue('teal.200', 'teal.700');
  const color2 = useColorModeValue('green.200', 'green.700');
  const color3 = useColorModeValue('blue.200', 'blue.700');

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      overflow="hidden"
      zIndex="-1"
      bg={useColorModeValue('gray.50', 'gray.800')} // Base background color
    >
      <Box
        position="absolute"
        top="-10%"
        left="-10%"
        width="60%"
        height="60%"
        borderRadius="50%"
        bgGradient={`radial(${color1}, transparent)`}
        opacity="0.4"
        animation={`${blobAnimation} 20s ease-in-out infinite alternate`}
      />
      <Box
        position="absolute"
        bottom="-10%"
        right="-10%"
        width="70%"
        height="70%"
        borderRadius="50%"
        bgGradient={`radial(${color2}, transparent)`}
        opacity="0.3"
        animation={`${blobAnimation} 25s ease-in-out infinite alternate-reverse`}
      />
      <Box
        position="absolute"
        top="30%"
        right="-5%"
        width="50%"
        height="50%"
        borderRadius="50%"
        bgGradient={`radial(${color3}, transparent)`}
        opacity="0.5"
        animation={`${blobAnimation} 18s ease-in-out infinite alternate`}
      />
    </Box>
  );
};

export default React.memo(AnimatedBlobBackground);
