import { Routes, Route } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import PageAsignacion from "../pages/asignarAreaMesa/pageAsignacion";
import PageAsignacionAreas from "../pages/asignarAreaMesa/PageAsignacionAreas";

import CrearArea from "../pages/asignarAreaMesa/CrearArea";
import { Box, Heading, Text, Icon } from "@chakra-ui/react";
import { MdWorkspaces } from "react-icons/md";

export const PaginaAsignacionAM = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route element={<PageAsignacionAreas />}>
          <Route
            index
            element={
              <Box
                display="flex"
                h="full"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                color="gray.400"
              >
                <Icon as={MdWorkspaces} boxSize={20} mb={4} opacity={0.5} />
                <Heading size="md">Selecciona un Área</Heading>
                <Text mt={2}>
                  Elige un área del panel lateral para administrarla o crea una
                  nueva.
                </Text>
              </Box>
            }
          />
          <Route path="nueva" element={<CrearArea />} />
          <Route path=":id" element={<PageAsignacion />} />
        </Route>
      </Route>
    </Routes>
  );
};
