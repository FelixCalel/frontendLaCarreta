
import { Outlet, Routes } from "react-router-dom"
import NavBar from "../../components/NavBar"
import {Grid, GridItem, Box, Flex, Spacer, Text, Avatar } from "@chakra-ui/react"

import {Dashboard} from "../Dashboard"
import { MenuPrincipal } from "../../components/MenuPrincipal"
import Footer from "../../components/Dashboard/PiePagina"
import { NavBarDashboard } from "../../components/NavBarDashboard"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"


export const RootLayout = () =>{
  const [nombresUsuario, setNombresUsuario] = useState('')
  const {actualUsuario} = useSelector( state => state.auth)

  useEffect(()=>{
    const usuario= JSON.parse(localStorage.getItem('userData'))

    if(usuario){
       setNombresUsuario(usuario['displayName'])
    }
  },[])
    return (
        <Grid minH="100vh" templateRows="auto 1fr auto" templateColumns="repeat(5, 1fr)">
        {/* NavBar */}
        <Box gridRow="1" gridColumn="1 / -1" bg="white" p={4} color="black">
          <NavBar />
        </Box>

        {/* Contenido Principal y Menú Lateral */}
        <Flex gridRow="2" gridColumn="1 / -1">
          {/* Slider/Menu Lateral */}
          
         
           <MenuPrincipal />
         

          {/* Área de Contenido Dinámico */}
          <Box flex="1" bg="gray.50" p={13} >
          <NavBarDashboard />
            <Outlet />
          </Box>
        </Flex>

        {/* Footer */}
        <Box gridRow="4" gridColumn="1 / -1" bg="green" p={1} color="white" display="flex" alignItems="center" justifyContent="center">
           <Footer />
        </Box>
      </Grid>
       
    )

    
}

