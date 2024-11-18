import React, { useEffect, useRef } from "react";
import {
  Box,
  Flex,
  IconButton,
  Image,
  Spacer,
  HStack,
  Tooltip,
  Badge,
  Collapse,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import { MenuPerfil } from "./MenuPerfil";
import SearchBar from "./component/searchBar";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";
import { tablaPedidos } from "../store/Pedidos/thunks";

export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const roleId = localStorage.getItem("roleId");

  const pedidos = useSelector((state) => state.pedidos.data || []);

  useEffect(() => {
    dispatch(tablaPedidos());
  }, [dispatch]);

  // Filtrar y contar los pedidos según su estado
  const pedidosNuevos = pedidos.filter((pedido) => pedido.estadoId === 2); // Pedidos pendientes
  const countAprobados = pedidos.filter((pedido) => pedido.estadoId === 3).length; // Pedidos aprobados
  const countEnProceso = pedidos.filter((pedido) => pedido.estadoId === 1).length; // Pedidos en proceso
  const countCancelados = pedidos.filter((pedido) => pedido.estadoId === 4).length; // Pedidos cancelados

  const { isOpen, onToggle, onClose } = useDisclosure();
  const ref = useRef();

  useOutsideClick({
    ref: ref,
    handler: () => {
      if (isOpen) {
        onClose();
      }
    },
  });

  const handleNotificationClick = () => {
    navigate("/pedidos/entrantes");
  };

  const handleSearch = (query) => {
    console.log("Buscar:", query);
    // Aquí podrías redirigir a una página de resultados de búsqueda o realizar otras acciones.
  };

  return (
    <Flex
      as="nav"
      p={{ base: "4px 8px", md: "8px 16px" }}
      alignItems="center"
      borderBottom="1px solid"
      borderColor="gray.100"
      bg="white"
      position="sticky"
      top="0"
      zIndex="1000"
      width="100%"
      boxShadow="sm"
    >
      <Box display="flex" alignItems="center">
        <Link to="/auth/home">
          <Image
            src="/images/LogoLaCarreta.png"
            alt="La Carreta"
            objectFit="contain"
            width={{ base: "40px", md: "60px", lg: "80px" }}
            cursor="pointer"
          />
        </Link>
      </Box>

      <Box flex={1} mx={{ base: "5px", md: "10px" }} display="flex" justifyContent="center">
        <SearchBar placeholder="Buscar..." onSearch={handleSearch} />
      </Box>

      <Spacer />

      <HStack spacing={{ base: "10px", md: "20px" }} pr={{ base: "5px", md: "10px" }}>
        <Tooltip label="Notificaciones" aria-label="Notificaciones Tooltip">
          <Box position="relative" onClick={onToggle}>
            <IconButton
              variant="ghost"
              fontSize={{ base: "20px", md: "24px" }}
              icon={<FiBell />}
              size="lg"
              _hover={{
                color: "blue.600",
                transform: "scale(1.05)",
              }}
              transition="all 0.2s ease-in-out"
            />
            {roleId === "3" && pedidosNuevos.length > 0 && (
              <Badge
                colorScheme="red"
                borderRadius="full"
                position="absolute"
                top="-1px"
                right="-1px"
                fontSize="xs"
                p="4px"
              >
                {pedidosNuevos.length}
              </Badge>
            )}
          </Box>
        </Tooltip>

        <MenuPerfil />
      </HStack>

      <Collapse in={isOpen} animateOpacity>
        <Box
          ref={ref}
          pos="absolute"
          top="60px"
          right="20px"
          w="320px"
          bg="white"
          boxShadow="lg"
          p={4}
          borderRadius="lg"
          zIndex="1000"
          cursor="pointer"
          backdropFilter="blur(10px)"
          border="1px solid #E2E8F0"
          transition="all 0.3s ease"
        >
          {roleId === "3" ? (
            <Box onClick={handleNotificationClick} _hover={{ bg: "gray.50" }}>
              {pedidosNuevos.length > 0 ? (
                <Text fontWeight="medium" textAlign="center" color="gray.700" fontSize="sm">
                  Tienes <strong>{pedidosNuevos.length}</strong> solicitudes de pedidos pendientes.
                </Text>
              ) : (
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  No hay nuevas solicitudes de pedidos.
                </Text>
              )}
            </Box>
          ) : (
            <Box>
              <Text fontSize="md" color="gray.700" fontWeight="bold">
                Estado de tus pedidos:
              </Text>
              <Box mt={2}>
                <Text fontSize="sm" color="green.600">
                  Aprobados: {countAprobados}
                </Text>
                <Text fontSize="sm" color="yellow.600">
                  En Proceso: {countEnProceso}
                </Text>
                <Text fontSize="sm" color="red.600">
                  Cancelados: {countCancelados}
                </Text>
              </Box>
            </Box>
          )}
        </Box>
      </Collapse>
    </Flex>
  );
}
