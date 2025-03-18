import { SimpleGrid, Text, Box, Button } from '@chakra-ui/react';
import { ListaOrdenes } from '../components/Dashboard/ListaOrdenes'; // Asume que este es tu componente de órdenes de compra
import { ListaFacturas } from '../components/Dashboard/ListaFacturas'; // Asume que este es tu componente de facturas registradas
import { UltimosContactos } from '../components/Dashboard/UltimosContactos'; // Asume que este es tu componente de últimos contactos
// Importa los datos JSON
import orders from '../assets/datos/orders.json';
import invoices from '../assets/datos/invoices.json';
import contacts from '../assets/datos/contacts.json';
import BarChartComponent from '../components/Dashboard/graficas';
import PieChartComponent from '../components/Dashboard/graficaspie';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const data = [
  {
    name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
  },
  {
    name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
  },
  // Agrega más datos según sea necesario
];

const data2 = [
  { name: 'Grupo A', value: 400 },
  { name: 'Grupo B', value: 300 },
  { name: 'Grupo C', value: 300 },
  { name: 'Grupo D', value: 200 },
];

export function Dashboard() {

  const actualUsuario = useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/pais/listar'); // Cambia la ruta según sea necesario
  };

  return (
    <>
      <Box>
        <Text fontWeight={'bold'}>Hola, {actualUsuario.displayName} !! </Text>
      </Box>
      <Button onClick={handleButtonClick} colorScheme="teal" mb={4}>
        Ir a Página de Países
      </Button>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
        <BarChartComponent data={data} />
        <PieChartComponent data={data2} />
        <ListaOrdenes orders={orders} />
        <ListaFacturas invoices={invoices} />
        <UltimosContactos contacts={contacts} />
      </SimpleGrid>
    </>
  );
}
