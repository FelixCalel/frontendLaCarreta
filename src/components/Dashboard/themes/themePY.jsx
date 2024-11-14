import { extendTheme } from '@chakra-ui/react';
import { colors } from './coloresPY'

export const theme = extendTheme({
    colors,
  components: {
    Button: {
      // Aquí puedes definir variantes para el botón, por ejemplo
      variants: {
        solid: (props) => ({
          bg: props.colorMode === 'dark' ? 'brand.500' : 'brand.600',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'brand.500' : 'brand.700',
            color: 'black'
          },
        
        }),
      },
    },
    // Puedes personalizar más componentes aquí
  },
});
