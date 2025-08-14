import { useState, useMemo } from "react";
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
  Button,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  HStack,
  useToast,
  useBreakpointValue,
  Tooltip,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";

export default function QaProductTable({ items, onMuestreoClick, onEditQa }) {
  const toast = useToast();
  const btnSize = useBreakpointValue({ base: "xs", md: "sm" });
  const inputSize = useBreakpointValue({ base: "xs", md: "sm" });

  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    caracteristicas: "",
    cantidad: 0,
    id_unidadMedida: "",
    observaciones: "",
  });

  const unidadOptions = useMemo(() => {
    return [
      { id: 0, label: "No aplica" },
      { id: 1, label: "Unidad" },
      { id: 2, label: "Kg" },
      { id: 3, label: "Lt" },
    ];
  }, []);

  const startEdit = (row) => {
    setEditingId(row.qaId);
    setDraft({
      caracteristicas: row.caracteristicas ?? "",
      cantidad: Number(row.cantidad ?? 0),
      id_unidadMedida: "",
      observaciones: row.observaciones ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({
      caracteristicas: "",
      cantidad: 0,
      id_unidadMedida: "",
      observaciones: "",
    });
  };

  const saveEdit = async (row) => {
    try {
      const payload = {
        caracteristicas: draft.caracteristicas,
        cantidad: Number(draft.cantidad),
        observaciones: draft.observaciones,
        updatedBy: Number(localStorage.getItem("usuarioId") || 1),
      };
      await onEditQa(row.qaId, payload);
      toast({ title: "Guardado", status: "success", duration: 1500 });
      cancelEdit();
    } catch (e) {
      toast({ title: "No se pudo guardar", status: "error" });
    }
  };

  return (
    <Box overflowX="auto" w="full" sx={{ "& table": { tableLayout: "auto" } }}>
      <Table
        size={useBreakpointValue({ base: "sm", md: "sm" })}
        variant="simple"
        minW={{ base: "900px", md: "980px", lg: "1100px" }}
      >
        <Thead>
          <Tr>
            <Th display={{ base: "none", md: "table-cell" }}>ID</Th>
            <Th>Código</Th>
            <Th>Producto</Th>
            <Th>Características</Th>
            <Th isNumeric>Cantidad</Th>
            <Th display={{ base: "none", md: "table-cell" }}>Unidad</Th>
            <Th>Observaciones</Th>
            <Th textAlign="center">Acción</Th>
          </Tr>
        </Thead>

        <Tbody>
          {items.map((row) => {
            const isEditing = editingId === row.qaId;

            return (
              <Tr key={row.qaId}>
                <Td display={{ base: "none", md: "table-cell" }}>{row.qaId}</Td>

                <Td>{row.productoCodigo}</Td>

                <Td
                  maxW={{ base: "260px", md: "320px", lg: "420px" }}
                  whiteSpace="normal"
                  wordBreak="break-word"
                >
                  {row.productoNombre}
                </Td>

                <Td>
                  {isEditing ? (
                    <Input
                      size={inputSize}
                      value={draft.caracteristicas}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          caracteristicas: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    row.caracteristicas || "—"
                  )}
                </Td>

                <Td isNumeric>
                  {isEditing ? (
                    <NumberInput
                      size={inputSize}
                      min={0}
                      value={draft.cantidad}
                      onChange={(_, v) =>
                        setDraft((d) => ({ ...d, cantidad: v ?? 0 }))
                      }
                      maxW="110px"
                    >
                      <NumberInputField />
                    </NumberInput>
                  ) : (
                    row.cantidad
                  )}
                </Td>

                <Td display={{ base: "none", md: "table-cell" }}>
                  {isEditing ? (
                    <Select
                      size={inputSize}
                      value={draft.id_unidadMedida}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          id_unidadMedida: e.target.value,
                        }))
                      }
                      maxW="160px"
                    >
                      {unidadOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    row.unidadMedida || "No aplica"
                  )}
                </Td>

                <Td>
                  {isEditing ? (
                    <Input
                      size={inputSize}
                      value={draft.observaciones}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          observaciones: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    row.observaciones || "—"
                  )}
                </Td>

                <Td>
                  <HStack justify="center" spacing={2}>
                    {isEditing ? (
                      <>
                        <Tooltip label="Guardar">
                          <IconButton
                            aria-label="Guardar"
                            icon={<CheckIcon />}
                            colorScheme="green"
                            size={btnSize}
                            onClick={() => saveEdit(row)}
                          />
                        </Tooltip>
                        <Tooltip label="Cancelar">
                          <IconButton
                            aria-label="Cancelar"
                            icon={<CloseIcon />}
                            size={btnSize}
                            onClick={cancelEdit}
                          />
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip label="Editar fila">
                          <IconButton
                            aria-label="Editar"
                            icon={<EditIcon />}
                            size={btnSize}
                            onClick={() => startEdit(row)}
                          />
                        </Tooltip>

                        <Button
                          size={btnSize}
                          colorScheme="green"
                          onClick={() =>
                            onMuestreoClick(row.qaId, row.muestreoId)
                          }
                        >
                          Muestreo
                        </Button>
                      </>
                    )}
                  </HStack>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
}

QaProductTable.propTypes = {
  items: PropTypes.array.isRequired,
  onMuestreoClick: PropTypes.func.isRequired,
  onEditQa: PropTypes.func.isRequired,
};
