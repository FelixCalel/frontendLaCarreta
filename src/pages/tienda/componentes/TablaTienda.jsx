import PropTypes from 'prop-types'; // Importamos PropTypes
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Box,
  Button, // IMPORTANTE: Asegúrate de importar Button
  Switch, // IMPORTANTE: Asegúrate de importar Switch
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';

const TablaTiendas = ({ filteredData, handleDelete, handleEdit }) => {
  const formatDate = (dateString) => {
    try {
      return dateString
        ? format(new Date(dateString), "dd-MM-yyyy HH:mm:ss")
        : "Fecha inválida";
    } catch (error) {
      console.error("Fecha inválida:", dateString);
      return "Fecha inválida";
    }
  };

  return (
    <Box
      overflowX="auto"
      boxShadow="md"
      borderRadius="lg"
      bg="white"
      p={4}
      maxWidth="100%"
    >
      <Table
        variant="simple"
        size="sm"
        minWidth="800px" // Ancho mínimo para asegurar responsividad
      >
        {/* Encabezado de la tabla */}
        <Thead bg="teal.500">
          <Tr>
            <Th color="white" textAlign="center">ID</Th>
            <Th color="white" textAlign="center">Nombre</Th>
            <Th color="white" textAlign="center">Descuento</Th>
            <Th color="white" textAlign="center">Creación</Th>
            <Th color="white" textAlign="center">Actualización</Th>
            <Th color="white" textAlign="center">Estado</Th>
            <Th color="white" textAlign="center">Deudor</Th>
            <Th color="white" textAlign="center">Ciudad</Th>
            <Th color="white" textAlign="center">Zona</Th>
            <Th color="white" textAlign="center">Ruta</Th>
            <Th color="white" textAlign="center">Acciones</Th>
          </Tr>
        </Thead>

        {/* Cuerpo de la tabla */}
        <Tbody>
          {filteredData.map((tienda) => (
            <Tr key={tienda.id}> {/* Aquí aseguramos que `tienda.id` es único */}
              <Td>{tienda.id}</Td>
              <Td>{tienda.nombre}</Td>
              <Td>{tienda.descuento}</Td>
              <Td>{formatDate(tienda.creadoEl)}</Td>
              <Td>{formatDate(tienda.actualizadoEl)}</Td>
              <Td>
                {/* El Switch ya no tiene onChange, solo visualiza el estado */}
                <Switch
                  isChecked={Boolean(tienda.estaActivo)}
                  colorScheme="teal"
                  size="lg"
                  isReadOnly
                />
              </Td>
              <Td>{`${tienda.nombreCorrelativo || ""} - ${tienda.nombreDeu || ""}`}</Td>
              <Td>{tienda.nombreCiudad}</Td>
              <Td>{tienda.zona}</Td>
              <Td>{tienda.nombreRuta}</Td>
              <Td>
                <Button
                  colorScheme="red"
                  onClick={() => handleDelete(tienda.id)}
                  mr={2}
                >
                  <DeleteIcon /> Eliminar
                </Button>
                <IconButton
                  icon={<EditIcon />}
                  onClick={() => handleEdit(tienda)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

// Agregamos validación de tipos para las props usando PropTypes
TablaTiendas.propTypes = {
  filteredData: PropTypes.array.isRequired,   // Aseguramos que filteredData sea un array y sea requerido
  handleDelete: PropTypes.func.isRequired,    // handleDelete debe ser una función
  handleEdit: PropTypes.func.isRequired,      // handleEdit debe ser una función
};

export default TablaTiendas;
