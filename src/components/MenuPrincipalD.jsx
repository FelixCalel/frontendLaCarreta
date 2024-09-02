import { useState, useEffect } from 'react';
import { Box, Flex, IconButton, Text, VStack, Tooltip, useBreakpointValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import { AiFillDashboard } from 'react-icons/ai';
import { FaGlobe, FaBuilding } from 'react-icons/fa';  // Cambiamos a FaBuilding para "Empresas"
import { MdAddShoppingCart } from 'react-icons/md';
import PropTypes from 'prop-types';

// Componente MenuItem para cada ítem del menú
const MenuItem = ({ icon, label, to, isExpanded }) => {
  const menuItemContent = (
    <Flex align="center" p="2" justifyContent={isExpanded ? 'flex-start' : 'center'}>
      <Link to={to} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <Box 
          _hover={{ bg: 'green.500', color: 'white' }} 
          p={isExpanded ? "2" : "4"} 
          borderRadius="md"
          display="flex"
          alignItems="center"
        >
          {icon}
          {isExpanded && <Text ml="2">{label}</Text>}
        </Box>
      </Link>
    </Flex>
  );

  return isExpanded ? menuItemContent : (
    <Tooltip label={label} placement="right" hasArrow>
      {menuItemContent}
    </Tooltip>
  );
};

MenuItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired,
};

const MenuPrincipalD = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  useEffect(() => {
    setIsExpanded(!isMobile);
  }, [isMobile]);

  return (
    <Box w={isExpanded ? "200px" : "60px"} bg="gray.200" transition="width 0.5s">
      <Flex align="center" justifyContent="center" h="50px" bg="gray.200">
        <IconButton
          icon={<HamburgerIcon />}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle Menu"
          m="2"
        />
      </Flex>
      <VStack align="stretch" pl={isExpanded ? 2 : 0}>
        <MenuItem 
          icon={<AiFillDashboard style={{ fontSize: '20px' }} />} 
          label="Dashboard" 
          to="/admin/" 
          isExpanded={isExpanded}
        /> 
        <MenuItem 
          icon={<MdAddShoppingCart style={{ fontSize: '20px' }} />} 
          label="Compras" 
          to="/admin/ordenes" 
          isExpanded={isExpanded} 
        />
        <MenuItem 
          icon={<FaBuilding style={{ fontSize: '20px' }} />} 
          label="Empresas" 
          to="/empresa/listar"  // Cambia esta línea
          isExpanded={isExpanded} 
        />
        <MenuItem 
          icon={<FaGlobe style={{ fontSize: '20px' }} />} 
          label="País" 
          to="/pais/listar" 
          isExpanded={isExpanded}
        />
      </VStack>
    </Box>
  );
};

export default MenuPrincipalD;
