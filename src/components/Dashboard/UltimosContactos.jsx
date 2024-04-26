import { Box, Heading, List, ListItem, Text } from '@chakra-ui/react';

export const UltimosContactos = ({ contacts }) => {
  return (
    <Box boxShadow="md" p="6" rounded="md" bg="white">
      <Heading size="md" mb="4">Últimos Contactos</Heading>
      <List spacing={3}>
        {contacts.map((contact) => (
          <ListItem key={contact.id}>
            <Text fontWeight="bold">{contact.nombre}</Text>
            <Text fontSize="sm">{contact.proveedor} - {contact.fecha}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
