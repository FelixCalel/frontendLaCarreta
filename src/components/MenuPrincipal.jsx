import { CalendarIcon, ChatIcon, DragHandleIcon } from "@chakra-ui/icons"
import { Text, Box, List, ListIcon, ListItem } from "@chakra-ui/react"
import { NavLink } from "react-router-dom"
import MenuPrincipalD from "./MenuPrincipalD"



export const MenuPrincipal = () => {
  return (
    <>

    <MenuPrincipalD />
      {/* <List color={"black"} fontSize={"0.8em"} spacing={"5"} p={4}>

      <ListItem _hover={{ bg: 'brand.600', color:'white' }}>
        <NavLink to="/">
          <ListIcon as={DragHandleIcon} color="black" />
          Ordenes de compras

        </NavLink>
      </ListItem>
      <ListItem _hover={{ bg: 'brand.600', color:'white' }}>
        <NavLink to="/contenido01">
          <ListIcon as={CalendarIcon} color="black" />
          Facturas

        </NavLink>
      </ListItem>
      <ListItem _hover={{ bg: 'brand.600', color:'white' }}>
        <NavLink to="/">
          <ListIcon as={ChatIcon} color="black" />
          Conciliaciones

        </NavLink>
      </ListItem>
      <ListItem _hover={{ bg: 'brand.600', color:'white' }}>
        <NavLink to="/">
          <ListIcon as={ChatIcon} color="black" />
          Salir

        </NavLink>
      </ListItem>
    </List> */}
    </>
  )
}
