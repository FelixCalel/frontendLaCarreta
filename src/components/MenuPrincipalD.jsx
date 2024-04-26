import React, { useState } from 'react';
import { Box, Flex, IconButton, Text, VStack, Link as ChakraLink, Avatar } from '@chakra-ui/react';
import { Link } from 'react-router-dom'; // Importa Link de React Router
import { HamburgerIcon, AddIcon, SearchIcon, InfoIcon } from '@chakra-ui/icons';

import { AiFillDashboard } from 'react-icons/ai';
import { FaFileInvoice } from 'react-icons/fa';
import { MdAddShoppingCart } from "react-icons/md";

// Componente MenuItem actualizado para incluir enlaces
const MenuItem = ({ icon, label, to }) => (
  <Flex align="center" p="2">
    <Link to={to} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
      {icon}
      <Text ml="2">{label}</Text>
    </Link>
  </Flex>
);

const MenuPrincipalD = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <><Box w={isExpanded ? "200px" : "41px"} bg="gray.200" transition="width 0.5s">
        <IconButton
          icon={<HamburgerIcon />}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle Menu" />
        <VStack align="stretch" pl={2}>
          <MenuItem _hover={{ bg: 'brand.600', color: 'white' }} icon={<AiFillDashboard style={{ fontSize: '20px' }} />} label="Dashboard" to="/admin/" />

          <MenuItem icon={<MdAddShoppingCart style={{ fontSize: '20px' }} />} label="Compras" to="/admin/ordenes" />
          <MenuItem icon={<FaFileInvoice />} label="Facturas" to="/admin/facturas" />
        </VStack>
      </Box></>
  );
};

export default MenuPrincipalD;
