import { useColorModeValue, Box, Flex, Heading, ButtonGroup, Tooltip, Button, Text, SimpleGrid, Icon } from "@chakra-ui/react";
import { ViewIcon, HamburgerIcon, RepeatClockIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { FilterPanel } from "./FilterPanel";
import { ConsolidatedOrdersView } from "./ConsolidatedOrdersView";
import BotonSincronizarReceta from "../empresa/BotonSincronizarReceta";

const OrderGridCard = ({ group, onSelectOrder }) => {
    const cardBg = useColorModeValue("white", "gray.700");
    const cardBorder = useColorModeValue("gray.200", "gray.600");
    const doneCount = group.items.filter((i) => i.completo).length;
    const allDone = doneCount === group.items.length;

    return (
        <Box
            key={group.pedidoId}
            position="relative"
            p={4}
            bg={cardBg}
            border="1px solid"
            borderColor={cardBorder}
            borderRadius="md"
            cursor="pointer"
            _hover={{ shadow: "md" }}
            onClick={() => onSelectOrder(group.pedidoId)}
        >
            <Icon
                as={CheckCircleIcon}
                position="absolute"
                top="4px"
                right="4px"
                boxSize={6}
                color={allDone ? "green.400" : "yellow.400"}
            />
            <Text fontWeight="bold">Pedido #{group.pedidoId}</Text>
            <Text fontSize="sm">{group.tienda}</Text>
            <Text fontSize="sm" color="gray.500">
                {group.pais}
            </Text>
            <Box
                mt={2}
                px={2}
                py={1}
                bg="blue.500"
                color="white"
                fontSize="xs"
                borderRadius="sm"
                display="inline-block"
            >
                {group.items.length} ÍTEM{group.items.length > 1 ? "S" : ""}
            </Box>
        </Box>
    );
};

const SupervisorOrderList = ({
  viewMode,
  setViewMode,
  countryFilter,
  onCountryChange,
  clientFilter,
  onClientChange,
  stateFilter,
  onStateChange,
  countries,
  clients,
  empresaActiva,
  lastSync,
  filteredGroups,
  consolidatedItems,
  onSelectOrder,
}) => {
  return (
    <Box p={2}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="lg" flex="1" textAlign="center">
          {viewMode === "byOrder"
            ? "Pedidos de Supervisor"
            : "Consolidado de Supervisor"}
        </Heading>
      </Flex>
      <Flex
        direction={{ base: "column", lg: "row" }}
        justifyContent={{ lg: "space-between" }}
        alignItems="center"
        mb={0}
        gap={0}
      >
        {/* Left: View Mode & Sync */}
        <Flex
          alignItems="center"
          gap={4}
          w={{ base: "100%", lg: "auto" }}
          justifyContent={{ base: "space-between", lg: "flex-start" }}
        >
          <ButtonGroup isAttached variant="outline">
            <Tooltip label="Ver pedidos individuales" placement="top">
              <Button
                onClick={() => setViewMode("byOrder")}
                isActive={viewMode === "byOrder"}
                leftIcon={<ViewIcon />}
                aria-label="Ver por pedido"
              >
                Pedido
              </Button>
            </Tooltip>
            <Tooltip
              label="Ver resumen de productos consolidados"
              placement="top"
            >
              <Button
                onClick={() => setViewMode("consolidated")}
                isActive={viewMode === "consolidated"}
                leftIcon={<HamburgerIcon />}
                aria-label="Ver consolidado"
              >
                Consolidado
              </Button>
            </Tooltip>
          </ButtonGroup>

          <Flex alignItems="center" gap={2}>
            <Tooltip
              label="Sincronizar información de producción"
              placement="top"
            >
              <Box>
                <BotonSincronizarReceta
                  empresa={empresaActiva}
                  ultimaSincronizacionRecetas={
                    empresaActiva?.ultimaSincronizacionRecetas
                  }
                  leftIcon={<RepeatClockIcon />}
                />
              </Box>
            </Tooltip>
            {lastSync && (
              <Text
                fontSize="xs"
                color="gray.500"
                whiteSpace="nowrap"
                display={{ base: "none", xl: "block" }}
              >
                Últ. sinc.: {new Date(lastSync).toLocaleString()}
              </Text>
            )}
          </Flex>
        </Flex>

        {/* Right: Filters */}
        <Box w={{ base: "100%", lg: "auto" }}>
          <FilterPanel
            countryFilter={countryFilter}
            onCountryChange={onCountryChange}
            clientFilter={clientFilter}
            onClientChange={onClientChange}
            stateFilter={stateFilter}
            onStateChange={onStateChange}
            countries={countries}
            clients={clients}
          />
        </Box>
      </Flex>
      {viewMode === "byOrder" ? (
        <SimpleGrid columns={[1, 2, 3, 4]} spacing={6} mt={6}>
          {filteredGroups.map((g) => (
            <OrderGridCard key={g.pedidoId} group={g} onSelectOrder={onSelectOrder} />
          ))}
        </SimpleGrid>
      ) : (
        <ConsolidatedOrdersView data={consolidatedItems} />
      )}
    </Box>
  );
};

export default SupervisorOrderList;
