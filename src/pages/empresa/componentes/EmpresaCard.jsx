import PropTypes from "prop-types";
import {
  Text,
  Badge,
  IconButton,
  Tooltip,
  HStack,
  VStack,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaSyncAlt } from "react-icons/fa";
import { m } from "framer-motion";
import BotonSincronizarReceta from "../../../components/empresa/BotonSincronizarReceta";

const MotionBox = m.div || m("div");

export const EmpresaCard = ({
  empresa,
  paisNombre,
  formatDate,
  syncDisabled,
  handleEdit,
  confirmDelete,
  handleSync,
  handleOpenWarehouseModal,
}) => {
  const cardBg = useColorModeValue("gray.100", "gray.700");

  return (
    <MotionBox
      p={4}
      bg={cardBg}
      style={{
        borderRadius: "0.375rem",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <VStack align="start" spacing={2} w="100%">
        <HStack justifyContent="space-between" w="100%">
          <Text fontSize="lg" fontWeight="bold">
            {empresa.nombre}
          </Text>
          <Badge colorScheme={empresa.estaActivo ? "green" : "red"}>
            {empresa.estaActivo ? "ACTIVO" : "INACTIVO"}
          </Badge>
        </HStack>
        <Text>
          <strong>Alias:</strong> {empresa.alias}
        </Text>
        <Text>
          <strong>Creada:</strong> {formatDate(empresa.creadoEl)}
        </Text>
        <Text>
          <strong>Actualizada:</strong> {formatDate(empresa.actualizadoEl)}
        </Text>
        <Text>
          <strong>Base de Datos:</strong> {empresa.baseDatos}
        </Text>
        <Text>
          <strong>Serie:</strong> {empresa.serie}
        </Text>
        <Text>
          <strong>IP SAP:</strong> {empresa.ipBaseDatos}
        </Text>
        <Text>
          <strong>País:</strong> {paisNombre || "Sin país"}
        </Text>
        <Stack direction="row" spacing={2} mt={2} w="100%">
          <Tooltip label="Editar" aria-label="Editar">
            <IconButton
              icon={<EditIcon />}
              onClick={() => handleEdit(empresa)}
              variant="outline"
              colorScheme="teal"
            />
          </Tooltip>
          <Tooltip label="Eliminar" aria-label="Eliminar">
            <IconButton
              icon={<DeleteIcon />}
              onClick={() => confirmDelete(empresa.id)}
              variant="outline"
              colorScheme="red"
            />
          </Tooltip>
          <Tooltip label="Sincronizar Deus" aria-label="Sincronizar Deus">
            <IconButton
              icon={<FaSyncAlt />}
              onClick={() =>
                handleSync(empresa.id, empresa.baseDatos, empresa.ipBaseDatos)
              }
              variant="outline"
              colorScheme={syncDisabled[empresa.id] ? "gray" : "blue"}
              isDisabled={syncDisabled[empresa.id]}
              isLoading={syncDisabled[empresa.id]}
            />
          </Tooltip>
          <Tooltip label="Sincronizar Items" aria-label="Sincronizar Items">
            <IconButton
              icon={<FaSyncAlt />}
              onClick={() => handleOpenWarehouseModal(empresa)}
              variant="outline"
              colorScheme={syncDisabled[empresa.id] ? "gray" : "green"}
              isDisabled={syncDisabled[empresa.id]}
            />
          </Tooltip>
          <BotonSincronizarReceta empresa={empresa} />
        </Stack>
      </VStack>
    </MotionBox>
  );
};

EmpresaCard.propTypes = {
  empresa: PropTypes.object.isRequired,
  paisNombre: PropTypes.string,
  formatDate: PropTypes.func.isRequired,
  syncDisabled: PropTypes.object.isRequired,
  handleEdit: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  handleSync: PropTypes.func.isRequired,
  handleOpenWarehouseModal: PropTypes.func.isRequired,
};

