import { Box } from '@chakra-ui/react';

const Content = ({ children }) => {
  return (
    <Box as="main" p={4}>
      {children}
    </Box>
  );
};

export default Content;
