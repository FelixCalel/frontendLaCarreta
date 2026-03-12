import { Box } from '@chakra-ui/react';
import TablaPaises from './PageFormPais';
import SEO from '../../components/SEO';

export const PagePais= () => {
    return (
      <>
      <SEO title="Gestión de Países" description="Catálogo de países para la operación." />
      <Box p={4}>
      <TablaPaises />
    </Box>
      </>
    )
  }

  