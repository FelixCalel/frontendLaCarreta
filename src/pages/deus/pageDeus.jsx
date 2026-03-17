import { Box } from '@chakra-ui/react';
import TablaDeus from './pageFormDeus';
import SEO from '../../components/SEO';

export const PageDeu= () => {
    return (
      <>
      <SEO title="Gestión de Deudores" description="Administración de deudores y créditos." />
      <Box p={5}>
      <TablaDeus />
    </Box>
      </>
    )
  }

  