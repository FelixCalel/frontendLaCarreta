import {
  Box,
  Flex,
  Text,
  Input,
  useColorModeValue,
  useToast,
  Button,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useUpdatePedidoProduccionMutation } from "../../services/pedidoProductionApi";

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

export const OrderProductionRegistry = ({
  order,
  rechazoQty,
  onUpdateStats,
  onOpenRechazo,
}) => {
  const [updatePedido] = useUpdatePedidoProduccionMutation();
  const toast = useToast();
  const boxBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");

  const [prodFields, setProdFields] = useState({
    mpUtilizada: order.mpUtilizada ?? 0,
    mpSobrante: order.mpSobrante ?? 0,
    basura: order.basura ?? 0,
    trazabilidad_Prod: order.trazabilidad_Prod ?? "",
    mp1ra: order.mp1ra ?? 0,
    mp2da: order.mp2da ?? 0,
    mp3ra: order.mp3ra ?? 0,
  });

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isTyping) return;
    setProdFields({
      mpUtilizada: order.mpUtilizada ?? 0,
      mpSobrante: order.mpSobrante ?? 0,
      basura: order.basura ?? 0,
      trazabilidad_Prod: order.trazabilidad_Prod ?? "",
      mp1ra: order.mp1ra ?? 0,
      mp2da: order.mp2da ?? 0,
      mp3ra: order.mp3ra ?? 0,
    });
  }, [
    isTyping,
    order.mpUtilizada,
    order.mpSobrante,
    order.basura,
    order.trazabilidad_Prod,
    order.mp1ra,
    order.mp2da,
    order.mp3ra,
  ]);

  const handleFieldChange = (field, raw) => {
    setIsTyping(true);
    const isText = field === "trazabilidad_Prod";
    let value = isText ? raw : raw;

    if (!isText) {
      if (value !== "") {
        const numVal = Number(value);
        if (!Number.isNaN(numVal) && numVal >= 0) {
          value = numVal;
        } else {
          value = 0;
        }
      }

      const fieldsToValidate = ["mpUtilizada"];

      if (value !== "" && fieldsToValidate.includes(field)) {
        const maxAllowed = Number(order.cantidadUnidad) || 0;
        let totalCheck = Number(value);

        if (field === "mpUtilizada") {
          totalCheck = Number(value) + rechazoQty;
        }

        if (totalCheck > maxAllowed) {
          const errorMsg =
            field === "mpUtilizada"
              ? `No se puede guardar: La cantidad total (MP Utilizada: ${value} + Rechazo: ${rechazoQty} = ${totalCheck}) excede la cantidad solicitada (${maxAllowed}).`
              : `El valor no puede ser mayor que "Solic. Ventas" (${maxAllowed}).`;

          toast({
            title: "Valor inválido",
            description: errorMsg,
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          return;
        }
      }
    }

    setProdFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setIsTyping(false);

    let rawValue = prodFields[field];
    if (rawValue === "" && field !== "trazabilidad_Prod") rawValue = 0;

    const validatedValue =
      field === "trazabilidad_Prod" ? String(rawValue ?? "").trim() : Number(rawValue);
    const updateData = { [field]: validatedValue };

    if (field === "mpUtilizada") {
      const nuevaCantidad = validatedValue;
      const nuevoFaltante =
        (Number(order.cantidadUnidad) || 0) - (nuevaCantidad + rechazoQty);

      onUpdateStats?.(nuevaCantidad, nuevoFaltante);

      updateData.cantidad = nuevaCantidad;
      updateData.faltante = nuevoFaltante;
    }

    updatePedido({
      id: order.id,
      data: updateData,
    })
      .unwrap()
      .catch(() => {
        setProdFields((prev) => ({
          ...prev,
          [field]: order[field] ?? (field === "trazabilidad_Prod" ? "" : 0),
        }));
        if (field === "mpUtilizada") {
          const revertCantidad = Number(order.cantidad) || 0;
          const revertFaltante =
            (Number(order.cantidadUnidad) || 0) - revertCantidad;
          onUpdateStats?.(revertCantidad, revertFaltante);
        }
      });
  };

  return (
    <Box
      bg={boxBg}
      p={1.5}
      borderRadius="md"
      shadow="sm"
      borderWidth="1px"
      borderColor="gray.200"
      mb={2}
    >
      <Flex align="center" justify="space-between" mb={1}>
        <Text fontSize="sm" fontWeight="bold" color="blue.600">
          Registro
        </Text>
        {onOpenRechazo && (
          <Button
            size="xs"
            h="20px"
            onClick={onOpenRechazo}
            colorScheme="red"
            variant="ghost"
            leftIcon={<ChevronRightIcon boxSize={3} />}
            fontSize="xs"
            title="Salidas de Inventario"
          >
            Salidas de Inventario
          </Button>
        )}
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
                value={
                  spec.type === "number" && (value === 0 || value === "0")
                    ? ""
                    : value === undefined
                      ? ""
                      : value
                }
                placeholder={spec.type === "number" ? "0" : ""}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                onBlur={() => handleBlur(field)}
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
  );
};
