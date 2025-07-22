import { useState } from "react";
import PropTypes from "prop-types";
import {
  Tr,
  Td,
  Checkbox,
  IconButton,
  Collapse,
  Box,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { FabricacionDetailsTable } from "./FabricacionDetailsTable";

export const FabricacionRow = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const stripe = useColorModeValue("gray.50", "gray.800");
  const hoverBg = useColorModeValue("gray.200", "gray.600");
  const panelBg = useColorModeValue("green.50", "green.900");

  // Mapea los campos al modelo de tu API
  const {
    itemCode,
    productoNombre,
    cantidadUnidad,
    completo,
    despacho,
    faltante,
    unidadMedida,
    cantidad,
    trazabilidad_Prod,
    details,
  } = order;

  return (
    <>
      <Tr bg={stripe} _hover={{ bg: hoverBg }}>
        <Td>
          <IconButton
            size="sm"
            variant="ghost"
            icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            aria-label="Expandir"
            onClick={() => setIsExpanded((v) => !v)}
          />
        </Td>
        <Td>{itemCode}</Td>
        <Td>{productoNombre}</Td>
        <Td>{cantidadUnidad ?? "-"}</Td>
        <Td textAlign="center">
          <Checkbox isChecked={!!completo} isReadOnly />
        </Td>
        <Td>{despacho ?? "-"}</Td>
        <Td>{faltante ?? "-"}</Td>
        <Td>{unidadMedida}</Td>
        <Td>
          <Input
            size="sm"
            type="number"
            value={cantidad ?? ""}
            isReadOnly
            w="60px"
          />
        </Td>
        <Td>{trazabilidad_Prod ?? "-"}</Td>
      </Tr>
      <Tr>
        <Td colSpan={10} p={0} border="none">
          <Collapse in={isExpanded} animateOpacity>
            <Box bg={panelBg} p={4}>
              <FabricacionDetailsTable details={details || []} />
            </Box>
          </Collapse>
        </Td>
      </Tr>
    </>
  );
};

FabricacionRow.propTypes = {
  order: PropTypes.shape({
    itemCode: PropTypes.string,
    productoNombre: PropTypes.string,
    cantidadUnidad: PropTypes.number,
    completo: PropTypes.bool,
    despacho: PropTypes.number,
    faltante: PropTypes.number,
    unidadMedida: PropTypes.string,
    cantidad: PropTypes.number,
    trazabilidad_Prod: PropTypes.string,
    details: PropTypes.array,
  }).isRequired,
};
