import { BellIcon } from "@chakra-ui/icons";
import { Box, Flex, Text, Heading, Button, Spacer,HStack, Image, IconButton, Avatar } from "@chakra-ui/react";
import { MenuPerfil } from "./MenuPerfil";
import SearchBar from "./Dashboard/SearchBar";
import { Link } from "react-router-dom";
import AvatarUsuario from './AvatarUsuario'

export default function NavBar() {


  return (

    <Flex as="nav" p="8px" alignItems={"center"} borderBottom="1px"  top={"0"} left={"0"}>
        <Box>
           {/* Logo */}
        <Image 
          src="/images/logo_popoyan.png" 
          alt="Popoyán "
           boxSize="195px"
           htmlWidth="auto" // Asegura que el ancho sea automático y mantenga la proporción
           height={{ base: "42px", md: "33px", lg: "65px" }} // Altura responsive
           />
       </Box>
       
        <Box flex={1} justifySelf="center">
        <SearchBar />
        </Box>
        <Spacer />
            <HStack spacing={"20px"}>
                
            <Link to="/notificaciones">
            <IconButton
              variant='solid'
              fontSize='20px'
              icon={<BellIcon/>}
              
            />
            </Link>
            
            {/* <Box>
              { user?.nombres }
            </Box> */}
            <MenuPerfil />
            <AvatarUsuario />
            </HStack>
    </Flex>
    // <Flex bg={"gra.200"} justify={"space-between"} wrap={"wrap"} gap={"2"}>
    //     <Box w="150px" h="50px" bg="red">1</Box>
    //     <Box w="150px" h="50px" bg="blue">2</Box>
    //     <Box w="150px" h="50px" bg="green">3</Box>
    //     <Box w="150px" h="50px" flexGrow={"1"} bg="yellow">4</Box>
    //     <Box w="150px" h="50px" flexGrow={"2"} bg="gray">5</Box>
        
    // </Flex>
  )
}

