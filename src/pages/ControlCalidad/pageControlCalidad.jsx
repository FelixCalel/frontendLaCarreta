import { Box } from '@chakra-ui/react';
import TablaDeus from './pageFormDeus';
import SEO from '../../components/SEO';

export const PageDeu= () => {
    return (
      <Box p={5}>
      <SEO title="Control de Calidad" description="Gestión de control de calidad." />
      <TablaDeus />
    </Box>
    )
  }

  export default PageDeu;
  