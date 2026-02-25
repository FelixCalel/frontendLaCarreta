import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { OrderDetailsTable } from "./OrderDetailsTable";

const FIELD_LABELS = {
  mpUtilizada: "MP Utilizada",
  mpSobrante: "MP Sobrante",
  basura: "Basura",
  trazabilidad_Prod: "Trazabilidad",
  mp1ra: "MP 1ra",
  mp2da: "MP 2da",
  mp3ra: "MP 3ra",
};

const FIELD_SPECS = {
  mpUtilizada: { w: "51px", type: "number" },
  mpSobrante: { w: "51px", type: "number" },
  basura: { w: "51px", type: "number" },
  trazabilidad_Prod: { w: "65px", type: "text" },
  mp1ra: { w: "51px", type: "number" },
  mp2da: { w: "51px", type: "number" },
  mp3ra: { w: "51px", type: "number" },
};

const ROW_1 = ["mpUtilizada", "mpSobrante", "basura", "trazabilidad_Prod"];

export const OrderRegisterBox = ({
  onOpenRechazo,
  prodFields,
  handleFieldChange,
  details,
  loadingDetalles,
  hasReceta,
  isPTMQ,
  onTogglePTMQ,
  memoizedRecetaTable,
}) => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = "gray.200";
  const inputBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Flex gap={4} direction={{ base: "column", xl: "row" }}>
      <Box width="fit-content">
        <Box
          bg={bg}
          p={1.5}
          borderRadius="md"
          shadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
          mb={2}
        >
          <Flex align="center" justify="space-between" mb={1}>
            <Text fontSize="sm" fontWeight="bold" color="blue.600">
              Registro
            </Text>
            <Button
              size="xs"
              h="20px"
              onClick={onOpenRechazo}
              colorScheme="red"
              variant="ghost"
              leftIcon={<ChevronRightIcon boxSize={3} />}
              fontSize="xs"
            >
              Registrar Rechazo
            </Button>
          </Flex>

          <Flex gap={2} wrap="wrap" align="center">
            {ROW_1.map((field) => {
              const value = prodFields[field];
              const spec = FIELD_SPECS[field] ?? {
                w: "80px",
                type: "number",
              };
              return (
                <Flex key={field} direction="column" align="center">
                  <Text
                    fontSize="10px"
                    fontWeight="bold"
                    color="gray.500"
                    mb={0.5}
                    textTransform="uppercase"
                    textAlign="center"
                  >
                    {FIELD_LABELS[field]}
                  </Text>
                  <Input
                    size="xs"
                    h="24px"
                    w={spec.w}
                    type={spec.type}
                    value={spec.type === "number" && value === 0 ? "" : value}
                    placeholder={spec.type === "number" ? "0" : ""}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    focusBorderColor="blue.400"
                    borderRadius="sm"
                    bg={inputBg}
                    textAlign="center"
                    fontSize="xs"
                  />
                </Flex>
              );
            })}
          </Flex>
        </Box>

        <Box>
          <OrderDetailsTable
            details={details}
            isLoading={loadingDetalles}
            showPTMQ={!hasReceta}
            isPTMQ={isPTMQ}
            onTogglePTMQ={onTogglePTMQ}
          />
        </Box>
      </Box>

      <Box flex="1">{memoizedRecetaTable}</Box>
    </Flex>
  );
};

OrderRegisterBox.propTypes = {
  onOpenRechazo: PropTypes.func,
  prodFields: PropTypes.object,
  handleFieldChange: PropTypes.func,
  details: PropTypes.array,
  loadingDetalles: PropTypes.bool,
  hasReceta: PropTypes.bool,
  isPTMQ: PropTypes.bool,
  onTogglePTMQ: PropTypes.func,
  memoizedRecetaTable: PropTypes.node,
};
