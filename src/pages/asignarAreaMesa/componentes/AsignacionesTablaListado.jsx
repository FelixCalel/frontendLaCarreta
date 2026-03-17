import PropTypes from "prop-types";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { desasignarTipoGrupoThunk, fetchAsignacionesThunk } from "../../../store/asignacionAM/thunks";
import { useToast } from "@chakra-ui/react";

export const AsignacionesTablaListado = ({
  filteredAsignaciones,
  visibleCount,
  listBg,
  borderColor,
  theadBg,
  theadThColor,
  hoverBg,
  tagLabelColor,
  usuarioId,
  areaId,
  handleTableScroll,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const handleDesasignar = (id) => {
    dispatch(desasignarTipoGrupoThunk({ id, update_by: usuarioId })).then(
      (res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast({
            title: "Línea removida",
            description: "La línea de producción fue quitada exitosamente.",
            status: "info",
            duration: 2000,
            isClosable: true,
            position: "top-right",
          });
        }
        dispatch(fetchAsignacionesThunk(areaId));
      },
    );
  };

  return (
    <Box
      bg={listBg}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      mb={3}
      maxH="300px"
      overflowY="auto"
      position="relative"
      onScroll={handleTableScroll}
    >
      <Table variant="simple" size="sm">
        <Thead bg={theadBg} position="sticky" top={0} zIndex={1}>
          <Tr>
            <Th color={theadThColor}>Código</Th>
            <Th color={theadThColor}>Nombre de Producto</Th>
            <Th w="50px" textAlign="center" color={theadThColor}>
              Acciones
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredAsignaciones.length === 0 ? (
            <Tr>
              <Td
                colSpan={3}
                textAlign="center"
                py={8}
                color="gray.500"
                fontStyle="italic"
              >
                No hay líneas asignadas a esta área.
              </Td>
            </Tr>
          ) : (
            filteredAsignaciones.slice(0, visibleCount).map((a) => (
              <Tr
                key={a.id}
                _hover={{
                  bg: hoverBg,
                }}
                transition="background 0.2s"
              >
                <Td fontWeight="bold" color="blue.600">
                  {a.productoCodigo || "---"}
                </Td>
                <Td color={tagLabelColor}>
                  {a.productoNombre || "Cargando..."}
                </Td>
                <Td textAlign="center">
                  <IconButton
                    aria-label="Remover línea"
                    icon={<MdDelete />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleDesasignar(a.id)}
                  />
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

AsignacionesTablaListado.propTypes = {
  filteredAsignaciones: PropTypes.array.isRequired,
  visibleCount: PropTypes.number.isRequired,
  listBg: PropTypes.string.isRequired,
  borderColor: PropTypes.string.isRequired,
  theadBg: PropTypes.string.isRequired,
  theadThColor: PropTypes.string.isRequired,
  hoverBg: PropTypes.string.isRequired,
  tagLabelColor: PropTypes.string.isRequired,
  usuarioId: PropTypes.number.isRequired,
  areaId: PropTypes.number.isRequired,
  handleTableScroll: PropTypes.func.isRequired,
};
