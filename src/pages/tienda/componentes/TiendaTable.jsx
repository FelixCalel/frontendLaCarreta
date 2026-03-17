import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Badge,
  IconButton,
  Tooltip,
  Input,
  Select,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  InputGroup,
  InputLeftElement,
  Switch,
  useColorModeValue,
  Text,
  Flex,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons";

import Pagination from "../../../components/pagination";

import { useTiendaTable } from "../hooks/useTiendaTable";

const TiendaTable = ({
  data,
  onEdit,
  onDelete,
  onToggleStatus,
  isToggling,
}) => {
  const {
    filtroCiudad,
    setFiltroCiudad,
    filtroRuta,
    setFiltroRuta,
    filtroZona,
    setFiltroZona,
    filtroNombre,
    setFiltroNombre,
    currentPage,
    itemsPerPage,
    filteredData,
    currentItems,
    handlePageChange,
    ciudades,
    rutas,
  } = useTiendaTable({ data });

  const cardBg = useColorModeValue("white", "gray.800");
  const theadBg = useColorModeValue("gray.50", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Card bg={cardBg} boxShadow="lg" borderRadius="xl" overflow="hidden" mt={0}>
      <CardHeader pb={2}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={2}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar por nombre"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              variant="filled"
              borderRadius="full"
              _focus={{ borderColor: "green.400" }}
            />
          </InputGroup>
          <Select
            placeholder="Todas las Ciudades"
            value={filtroCiudad}
            onChange={(e) => setFiltroCiudad(e.target.value)}
            variant="filled"
            borderRadius="full"
            _focus={{ borderColor: "green.400" }}
          >
            {ciudades.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select
            placeholder="Todas las Rutas"
            value={filtroRuta}
            onChange={(e) => setFiltroRuta(e.target.value)}
            variant="filled"
            borderRadius="full"
            _focus={{ borderColor: "green.400" }}
          >
            {rutas.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
          <Input
            placeholder="Filtrar por Zona"
            value={filtroZona}
            onChange={(e) => setFiltroZona(e.target.value)}
            variant="filled"
            borderRadius="full"
            _focus={{ borderColor: "green.400" }}
          />
        </SimpleGrid>
      </CardHeader>
      <CardBody pt={0}>
        <Box overflowX="auto">
          <Table variant="simple" size="md">
            <Thead bg={theadBg}>
              <Tr>
                <Th color={subTextColor} fontSize="sm">
                  Nombre
                </Th>
                <Th color={subTextColor} fontSize="sm">
                  Ciudad
                </Th>
                <Th color={subTextColor} fontSize="sm">
                  Zona
                </Th>
                <Th color={subTextColor} fontSize="sm">
                  Ruta
                </Th>
                <Th color={subTextColor} fontSize="sm">
                  Deudor
                </Th>
                <Th color={subTextColor} fontSize="sm">
                  Desc.
                </Th>
                <Th color={subTextColor} fontSize="sm">
                  Estado
                </Th>
                <Th color={subTextColor} fontSize="sm">
                  Acciones
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentItems.length > 0 ? (
                currentItems.map((tienda) => (
                  <Tr
                    key={tienda.id}
                    _hover={{ bg: hoverBg }}
                    transition="background 0.2s"
                  >
                    <Td fontWeight="medium" color={textColor} fontSize="sm">
                      {tienda.nombre}
                    </Td>
                    <Td color={textColor} fontSize="sm">
                      {tienda.nombreCiudad}
                    </Td>
                    <Td color={textColor} fontSize="sm">
                      {tienda.zona}
                    </Td>
                    <Td>
                      <Badge
                        colorScheme="blue"
                        variant="subtle"
                        borderRadius="full"
                        px={2}
                        fontSize="xs"
                      >
                        {tienda.nombreRuta}
                      </Badge>
                    </Td>
                    <Td fontSize="sm" color={textColor}>
                      {tienda.nombreDeu}
                      {tienda.nombreCorrelativo && (
                        <Text
                          as="span"
                          color={subTextColor}
                          ml={1}
                          fontSize="xs"
                        >
                          ({tienda.nombreCorrelativo})
                        </Text>
                      )}
                    </Td>
                    <Td color={textColor} fontSize="sm">
                      {tienda.descuento}%
                    </Td>
                    <Td>
                      <Flex align="center" gap={2}>
                        <Switch
                          size="sm"
                          isChecked={Boolean(tienda.estaActivo)}
                          onChange={() => onToggleStatus(tienda)}
                          isDisabled={isToggling}
                          colorScheme="green"
                        />
                      </Flex>
                    </Td>
                    <Td>
                      <Flex gap={1}>
                        <Tooltip label="Editar Tienda">
                          <IconButton
                            icon={<EditIcon />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => onEdit(tienda)}
                            aria-label="Editar"
                          />
                        </Tooltip>
                        <Tooltip label="Eliminar Tienda">
                          <IconButton
                            icon={<DeleteIcon />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => onDelete(tienda.id)}
                            aria-label="Eliminar"
                          />
                        </Tooltip>
                      </Flex>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={8} textAlign="center" py={8} color="gray.500">
                    No se encontraron tiendas.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
        <Box mt={4}>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </Box>
      </CardBody>
    </Card>
  );
};

export default TiendaTable;
