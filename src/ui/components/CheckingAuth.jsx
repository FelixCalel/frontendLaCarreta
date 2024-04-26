import { Text, Box, CircularProgress, CircularProgressLabel, useColorModeValue,Center } from '@chakra-ui/react'
import React from 'react'

const CheckingAuth = () => {
  return (
    <div>
     <Center height="100vh" justifyContent="center" alignItems="center">
  <Box
    p={8}
    width="full"
    maxWidth="500px"
    borderRadius="lg"
    boxShadow="lg"
    padding={4}
    backgroundColor={useColorModeValue('brand.500', 'gray.700')}
  >
    <Center>
      <Text mb={4}
        color={'whitesmoke'}
      >
        Cargando...
      </Text>
    </Center>
    <Center>
      <CircularProgress isIndeterminate color='green.300' />
    </Center>
  </Box>
</Center>


      
    </div>
  )
}

export default CheckingAuth
