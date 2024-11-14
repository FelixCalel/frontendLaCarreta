import { Box, Breadcrumb, BreadcrumbItem } from "@chakra-ui/react"


export const NavBarDashboard = () => {
  return (
    <Box  mb={5}>
        {/*Acaba habia un 5 antes*/}
    <Breadcrumb>
        {/* <BreadcrumbItem>
            <BreadcrumbLink href='#'>Empresas</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>    
            <BreadcrumbLink href='#'>Docs</BreadcrumbLink>
        </BreadcrumbItem> */}

        <BreadcrumbItem isCurrentPage>
            {/* <BreadcrumbLink href='#'>Pagina de Empresas</BreadcrumbLink> */}
        </BreadcrumbItem>
     </Breadcrumb>
     </Box>
     
  )
}
