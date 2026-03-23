import {
  useState,
  Fragment,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorModeValue,
  Checkbox,
  Button,
  Flex,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  useDisclosure,
  Text,
  Input,
  Center,
} from "@chakra-ui/react";
import {
  useAvanzarMultiEtapaDetalleMutation,
  useExportarOrdenFabricacionSAPMutation,
} from "../../services/pedidoProductionApi";
import { ConsolidatedOrderRow } from "./ConsolidatedOrderRow";

import { useConsolidatedOrders } from "./hooks/useConsolidatedOrders";
import { ConsolidatedActionModal } from "./modals/ConsolidatedActionModal";

export const ConsolidatedOrdersView = ({
  data,
  actionLabel = "Cargar a SAP",
}) => {
  const {
    visibleData,
    hasMore,
    loadMore,
    expandedState,
    toggleExpansion,
    selectedItems,
    handleSelectAll,
    handleSelectItem,
    isOpen,
    onClose,
    comment,
    setComment,
    dateSAP,
    setDateSAP,
    handleSendToSap,
    confirmSendToSap,
    isProcessing,
  } = useConsolidatedOrders(data, actionLabel);

  const headerBg = useColorModeValue("gray.100", "gray.700");
  const summaryRowBg = useColorModeValue("gray.50", "gray.900");
  const summaryRowHoverBg = useColorModeValue("gray.200", "gray.700");
  const modalBg = useColorModeValue("white", "gray.800");
  const summaryRowBorderColor = useColorModeValue("gray.200", "gray.700");

  const allSelected = useMemo(
    () => data.length > 0 && selectedItems.size === data.length,
    [selectedItems, data],
  );

  const deuHeaderBg = useColorModeValue("blue.50", "blue.900");
  const deuHeaderBorderTop = "2px solid";
  const deuHeaderBorderBottom = "2px solid";
  const deuHeaderBorderColor = useColorModeValue("blue.300", "blue.600");

  let currentDeu = null;

  return (
    <>
      <ConsolidatedActionModal
        isOpen={isOpen}
        onClose={onClose}
        actionButtonText={actionLabel}
        dateSAP={dateSAP}
        setDateSAP={setDateSAP}
        comment={comment}
        setComment={setComment}
        confirmSendToSap={confirmSendToSap}
        isProcessing={isProcessing}
        modalBg={modalBg}
      />

      <TableContainer
        w="100%"
        border="1px solid"
        borderColor={useColorModeValue("gray.200", "gray.600")}
        borderRadius="md"
        shadow="sm"
        overflowX="auto"
        fontSize="md"
        p={2}
      >
        <Table variant="simple" size="sm" tablelayout="fixed" w="100%">
          <Thead bg={headerBg} position="sticky" top={0} zIndex={1}>
            <Tr>
              <Th w="36px" px={2} py={2}>
                <Checkbox
                  isChecked={allSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </Th>
              <Th w="36px" px={2} py={2} />
              <Th px={2} py={2} fontSize="xs">
                Producto
              </Th>
              <Th px={2} py={2} fontSize="xs">
                Trazabilidad
              </Th>
              <Th px={2} py={2} fontSize="xs" textAlign="center">
                Solic. ventas
              </Th>
              <Th px={2} py={2} fontSize="xs" textAlign="center">
                Completado
              </Th>
              <Th px={2} py={2} fontSize="xs" textAlign="center">
                Cantidad Procesada
              </Th>
              <Th px={2} py={2} fontSize="xs" textAlign="center">
                Faltante
              </Th>
              <Th px={2} py={2} fontSize="xs" textAlign="center">
                Almacén Destino
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {visibleData.map((item) => {
              const deuCode = item.deudorCodigo || "";
              const showDeuHeader = currentDeu !== deuCode;
              if (showDeuHeader) {
                currentDeu = deuCode;
              }

              return (
                <Fragment key={`${deuCode}-${item.productoNombre}`}>
                  {showDeuHeader && (
                    <Tr
                      bg={deuHeaderBg}
                      borderTop={deuHeaderBorderTop}
                      borderBottom={deuHeaderBorderBottom}
                      borderColor={deuHeaderBorderColor}
                    >
                      <Td
                        colSpan={9}
                        px={4}
                        py={3}
                        fontWeight="bold"
                        fontSize="md"
                      >
                        {deuCode} - {item.deudorNombre || item.tienda}
                      </Td>
                    </Tr>
                  )}
                  <ConsolidatedOrderRow
                    item={item}
                    isExpanded={!!expandedState[item.id]}
                    onToggleExpand={toggleExpansion}
                    isSelected={selectedItems.has(`${deuCode}|${item.productoNombre}`)}
                    onToggleSelection={handleSelectItem}
                    summaryRowBg={summaryRowBg}
                    summaryRowHoverBg={summaryRowHoverBg}
                    summaryRowBorderColor={summaryRowBorderColor}
                  />
                </Fragment>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      {hasMore && (
        <Center mt={4}>
          <Button onClick={loadMore} size="sm" variant="outline">
            Cargar más ({data.length - visibleData.length} restantes)
          </Button>
        </Center>
      )}

      <Flex justify="flex-end" mt={4}>
        <Button
          colorScheme="blue"
          onClick={handleSendToSap}
          isDisabled={selectedItems.size === 0}
        >
          {actionLabel} ({selectedItems.size})
        </Button>
      </Flex>
    </>
  );
};

ConsolidatedOrdersView.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
