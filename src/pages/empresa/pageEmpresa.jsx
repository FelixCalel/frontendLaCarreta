import { Box } from '@chakra-ui/react';
import TablaEmpresa from './pageFormEmpresa';
import SEO from '../../components/SEO';

export const PageEmpresa= () => {
    return (
      <>
      <SEO title="Gestión de Empresas" description="Administración de empresas clientes." />
      <Box p={9}>
      <TablaEmpresa />
    </Box>
      </>
    )
  }

  