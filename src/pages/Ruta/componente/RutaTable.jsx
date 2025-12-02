import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  IconButton,
  Tooltip,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Switch,
  useColorModeValue,
  Flex,
  Text,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { format } from "date-fns";

const RutaTable = ({
  data,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const formatDate = (dateString) => {
    try {
      return dateString
        ? format(new Date(dateString), "dd-MM-yyyy HH:mm")
        : "-";
    } catch (error) {
      return "-";
    }
  };

  const cardBg = useColorModeValue("white", "gray.800");
  const theadBg = useColorModeValue("gray.50", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Card bg={cardBg} boxShadow="lg" borderRadius="xl" overflow="hidden" mt={0}>
      <CardHeader pb={2}>
        {/* <Heading size="md" mb={2} color={textColor}>Listado de Rutas</Heading> */}
      </CardHeader>
      <CardBody pt={0}>
        <Box overflowX="auto">
          <Table variant="simple" size="md">
            <Thead bg={theadBg}>
              <Tr>
                <Th color={subTextColor} fontSize="sm">ID</Th>
                <Th color={subTextColor} fontSize="sm">Ruta</Th>
                <Th color={subTextColor} fontSize="sm">País</Th>
                <Th color={subTextColor} fontSize="sm">Creado</Th>
                <Th color={subTextColor} fontSize="sm">Actualizado</Th>
                <Th color={subTextColor} fontSize="sm">Estado</Th>
                <Th color={subTextColor} fontSize="sm">Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.length > 0 ? (
                data.map((ruta) => (
                  <Tr key={ruta.id} _hover={{ bg: hoverBg }} transition="background 0.2s">
                    <Td color={textColor} fontSize="sm">{ruta.id}</Td>
                    <Td fontWeight="medium" color={textColor} fontSize="sm">{ruta.nombre}</Td>
                    <Td color={textColor} fontSize="sm">{ruta.nombrePais}</Td>
                    <Td color={textColor} fontSize="sm">{formatDate(ruta.creadoEl)}</Td>
                    <Td color={textColor} fontSize="sm">{formatDate(ruta.actualizadoEl)}</Td>
                    <Td>
                      <Flex align="center" gap={2}>
                        <Switch
                          size="sm"
                          isChecked={Boolean(ruta.estaActivo)}
                          onChange={() => onToggleStatus(ruta.id, !ruta.estaActivo)}
                          colorScheme="green"
                        />
                      </Flex>
                    </Td>
                    <Td>
                      <Flex gap={1}>
                        <Tooltip label="Editar Ruta">
                          <IconButton
                            icon={<EditIcon />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => onEdit(ruta)}
                            aria-label="Editar"
                          />
                        </Tooltip>
                        <Tooltip label="Eliminar Ruta">
                          <IconButton
                            icon={<DeleteIcon />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => onDelete(ruta.id)}
                            aria-label="Eliminar"
                          />
                        </Tooltip>
                      </Flex>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={8} color="gray.500">
                    No se encontraron rutas.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>
  );
};

export default RutaTable;
