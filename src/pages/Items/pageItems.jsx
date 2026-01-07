import { Box } from '@chakra-ui/react';
import TablaItem from './pageFormItems';
import SEO from '../../components/SEO';

export const PageItems= () => {
    return (
      <>
      <SEO title="Gestión de Items" description="Catálogo de productos e items." />
      <Box p={4}>
      <TablaItem />
    </Box>
      </>
    )
  }

  export default PageItems;
  