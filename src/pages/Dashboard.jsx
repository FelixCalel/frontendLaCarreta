import { SimpleGrid, Text,Box } from '@chakra-ui/react';
import {ListaOrdenes} from '../components/Dashboard/ListaOrdenes'; // Asume que este es tu componente de órdenes de compra
import {ListaFacturas} from '../components/Dashboard/ListaFacturas'; // Asume que este es tu componente de facturas registradas
import {UltimosContactos} from '../components/Dashboard/UltimosContactos'; // Asume que este es tu componente de últimos contactos
import {NavBarDashboard} from '../components/NavBarDashboard'
// Importa los datos JSON
import orders from '../assets/datos/orders.json';
import invoices from '../assets/datos/invoices.json';
import contacts from '../assets/datos/contacts.json';
import BarChartComponent from '../components/Dashboard/graficas';
import PieChartComponent from '../components/Dashboard/graficaspie';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

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
  
export  function Dashboard(){

  const actualUsuario = useSelector( state => state.auth)


  return(
    <>
     <Box>
          <Text fontWeight={'bold'}>Hola, {actualUsuario.displayName} !! </Text>
        </Box>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
       
      <BarChartComponent data={data} />
      <PieChartComponent data={data2} />
      <ListaOrdenes orders={orders} />
      <ListaFacturas invoices={invoices} />
      <UltimosContactos contacts={contacts} />
    </SimpleGrid>
  
    </>
   
  )
}