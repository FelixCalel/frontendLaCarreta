import { Box, Heading, List, ListItem, ListIcon, Text } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

export const ListaFacturas = ({ invoices }) => {
  return (
    <Box boxShadow="md" p="6" rounded="md" bg="white">
      <Heading size="md" mb="4">Facturas Registradas</Heading>
      <List spacing={3}>
        {invoices.map((invoice) => (
          <ListItem key={invoice.id}>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <Text display="inline">Factura #{invoice.numero} - {invoice.proveedor} - ${invoice.monto}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
