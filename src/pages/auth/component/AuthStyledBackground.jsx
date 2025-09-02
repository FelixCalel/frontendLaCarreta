import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const AuthStyledBackground = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const patternColor = useColorModeValue('rgba(0, 0, 0, 0.04)', 'rgba(255, 255, 255, 0.04)');

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg={bgColor}
      zIndex="-1"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke={patternColor} strokeWidth="0.5"/>
          </pattern>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill="url(#smallGrid)"/>
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke={patternColor} strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </Box>
  );
};

export default React.memo(AuthStyledBackground);
