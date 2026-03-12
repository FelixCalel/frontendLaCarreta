import { Box } from '@chakra-ui/react';
import  TablaRuta  from './pageFormRuta';
import SEO from '../../components/SEO';

export const PageRuta= () => {
    return (
      <>
      <SEO title="Gestión de Rutas" description="Configuración y asignación de rutas logísticas." />
      <Box p={6}>
      <TablaRuta />
    </Box>
      </>
    )
  }

  