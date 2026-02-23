import { memo, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  TableContainer,
  useColorModeValue,
  useToast,
  Text,
  useDisclosure,
  Flex,
  Button,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { AddIcon } from "@chakra-ui/icons";
import {
  pedidoProduccionApi,
  useUpdateRecetaLineaMutation,
} from "../../services/pedidoProductionApi";
import AddMaterialModal from "./modals/AddMaterialModal";
import { RecetaRow } from "./RecetaRow";

export const RecetaTable = memo(
  ({ pedidoId, receta, isLoading = false, almacenes = [] }) => {
    const [updateLinea] = useUpdateRecetaLineaMutation();
    const toast = useToast();
    const dispatch = useDispatch();

    const headBg = useColorModeValue("gray.100", "gray.700");
    const inputBorderColor = useColorModeValue("gray.300", "gray.600");
    const headColor = useColorModeValue("gray.700", "gray.200");
    const stripeBg = useColorModeValue("gray.50", "gray.800");
    const hoverBg = useColorModeValue("blue.50", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const tableContainerBg = useColorModeValue("white", "gray.800");

    const handleLocalChange = useCallback(
      (id, field, value) => {
        dispatch(
          pedidoProduccionApi.util.updateQueryData(
            "getRecetaByPedido",
            { pedidoId: Number(pedidoId) },
            (draft) => {
              const line = draft.find((line) => line.id === id);
              if (line) {
                if (typeof value === "boolean") {
                  line[field] = value;
                } else {
                  line[field] = value === "" ? null : Number(value);
                }
              }
            },
          ),
        );
      },
      [dispatch, pedidoId],
    );

    const updateField = useCallback(
      async (id, field, raw) => {
        const isNumeric = [
          "cantidad_base",
          "cantidad_real",
          "mpUtilizada",
        ].includes(field);
        const value = isNumeric ? (raw === "" ? null : Number(raw)) : raw;

        try {
          await updateLinea({
            id,
            pedidoId,
            data: { [field]: value },
          }).unwrap();
          toast({
            status: "success",
            duration: 1500,
            description: "Campo actualizado",
            isClosable: true,
          });
        } catch {
          toast({
            status: "error",
            description: "Error al guardar",
            duration: 3000,
            isClosable: true,
          });
          dispatch(
            pedidoProduccionApi.util.invalidateTags([
              { type: "Receta", id: pedidoId },
            ]),
          );
        }
      },
      [dispatch, pedidoId, toast, updateLinea],
    );

    const { isOpen, onOpen, onClose } = useDisclosure();

    if (isLoading) {
      return (
        <Box py={4} textAlign="center">
          <Spinner size="sm" />
        </Box>
      );
    }

    return (
      <Box mt={2}>
        <Flex justify="space-between" align="center" mb={2}>
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="gray.500"
            textTransform="uppercase"
            letterSpacing="wide"
          >
            Lista de Materiales (Receta)
          </Text>
          <Button
            size="xs"
            colorScheme="blue"
            variant="outline"
            leftIcon={<AddIcon />}
            onClick={onOpen}
          >
            Agregar
          </Button>
        </Flex>

        <AddMaterialModal
          isOpen={isOpen}
          onClose={onClose}
          pedidoId={pedidoId}
        />

        <Box
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="md"
          overflow="hidden"
          bg={tableContainerBg}
        >
          <TableContainer maxH="400px" overflowY="auto">
            <Table size="sm" variant="simple">
              <Thead bg={headBg} position="sticky" top={0} zIndex={10}>
                <Tr>
                  <Th w="40px" px={2} py={2} color={headColor} fontSize="xs">
                    Activo
                  </Th>
                  <Th
                    minW="180px"
                    px={2}
                    py={2}
                    color={headColor}
                    fontSize="xs"
                  >
                    Material
                  </Th>
                  <Th
                    w="65px"
                    px={1}
                    py={2}
                    color={headColor}
                    fontSize="xs"
                    textAlign="center"
                    isNumeric
                  >
                    MP Utilizada
                  </Th>
                  <Th
                    w="65px"
                    px={1}
                    py={2}
                    color={headColor}
                    fontSize="xs"
                    textAlign="center"
                    isNumeric
                  >
                    Cant. Real
                  </Th>
                  <Th
                    w="80px"
                    px={1}
                    py={2}
                    color={headColor}
                    fontSize="xs"
                    textAlign="center"
                  >
                    C. Base
                  </Th>
                  <Th
                    w="80px"
                    px={1}
                    py={2}
                    color={headColor}
                    fontSize="xs"
                    textAlign="center"
                  >
                    C. Req.
                  </Th>
                  <Th w="80px" px={2} py={2} color={headColor} fontSize="xs">
                    Unidad
                  </Th>
                  <Th
                    w="auto"
                    minW="100px"
                    maxW="90px"
                    px={1}
                    py={2}
                    color={headColor}
                    fontSize="xs"
                    textAlign="center"
                  >
                    Almacén MP
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {receta.length === 0 ? (
                  <Tr>
                    <Td colSpan={8} textAlign="center" py={4} color="gray.500">
                      <Text fontSize="sm">
                        No hay materiales registrados en la receta.
                      </Text>
                    </Td>
                  </Tr>
                ) : (
                  receta.map((r, idx) => (
                    <RecetaRow
                      key={r.id}
                      r={r}
                      idx={idx}
                      stripeBg={stripeBg}
                      hoverBg={hoverBg}
                      inputBorderColor={inputBorderColor}
                      handleLocalChange={handleLocalChange}
                      updateField={updateField}
                      almacenes={almacenes}
                      pedidoId={pedidoId}
                    />
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    );
  },
);

RecetaTable.displayName = "RecetaTable";

RecetaTable.propTypes = {
  pedidoId: PropTypes.number.isRequired,
  receta: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      item: PropTypes.string.isRequired,
      descripcion: PropTypes.string,
      mpUtilizada: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      cantidad_base: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      cantidad_requerida: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
      nombre_unidad: PropTypes.string,
      state: PropTypes.bool,
      id_almacen: PropTypes.number,
    }),
  ).isRequired,
  isLoading: PropTypes.bool,
  almacenes: PropTypes.arrayOf(PropTypes.object).isRequired,
};
