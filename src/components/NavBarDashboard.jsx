import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"






export const NavBarDashboard = () => {
  return (
    <Box  mb={5}>
    <Breadcrumb>
        <BreadcrumbItem>
            <BreadcrumbLink href='#'>Empresas</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
            <BreadcrumbLink href='#'>Docs</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href='#'>Historial</BreadcrumbLink>
        </BreadcrumbItem>
     </Breadcrumb>
     </Box>
     
  )
}
