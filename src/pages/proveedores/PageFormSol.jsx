import React from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, VStack, Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Heading, Text, Checkbox, Textarea } from '@chakra-ui/react';
import Header from './Header';  // Asegúrate de que la ruta sea correcta
import Footer from './Footer';  // Asegúrate de que la ruta sea correcta

export const PageFormSol = () => {
    return (
        <>
            <Header />
            <Flex direction="column" minH="100vh" overflow="hidden">
                <Flex flex="1" align="center" justify="center" p={4}>
                    <Box width="100%" maxW="800px" mx="auto" borderWidth={1} borderRadius="md" boxShadow="md" overflow="hidden">
                        <Box bg="green.500" color="white" py={2} px={4} borderRadius="md" mb={4}>
                            <Heading size="md">CREACION DE PROVEEDOR</Heading>
                        </Box>
                        <Tabs isFitted variant="enclosed">
                            <TabList mb="1em">
                                <Tab>Info Solicitante</Tab>
                                <Tab>Info Proveedor</Tab>
                                <Tab>Info Pago</Tab>
                                <Tab>Documentación</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
                                        <Heading size="sm">INFO SOLICITANTE</Heading>
                                    </Box>
                                    <VStack spacing={4} align="stretch">
                                        <FormControl id="nombreSolicitante" isRequired>
                                            <FormLabel>Nombre del Solicitante</FormLabel>
                                            <Input placeholder="Nombre del Solicitante" />
                                        </FormControl>
                                        <FormControl id="empresa" isRequired>
                                            <FormLabel>Empresa</FormLabel>
                                            <Select placeholder="Seleccione una empresa">
                                                <option value="Agropecuaria Popoyán, S.A.">Agropecuaria Popoyán, S.A.</option>
                                            </Select>
                                        </FormControl>
                                        <FormControl id="correlativo" isRequired>
                                            <FormLabel>Correlativo</FormLabel>
                                            <Select placeholder="Buscar elementos">
                                                {/* Aquí debes añadir las opciones necesarias */}
                                            </Select>
                                        </FormControl>
                                        <Button colorScheme="green" type="submit">Enviar</Button>
                                    </VStack>
                                </TabPanel>
 ///////////////////////////////////////////////////////////////////////////Info Solicitante                              
                                <TabPanel>
                                    <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
                                        <Heading size="sm">INFORMACIÓN DEL PROVEEDOR</Heading>
                                    </Box>
                                    <VStack spacing={4} align="stretch">
                                        <FormControl id="nombre" isRequired>
                                            <FormLabel>Nombre</FormLabel>
                                            <Input placeholder="Nombre" />
                                        </FormControl>
                                        <FormControl id="nombreExtranjero" isRequired>
                                            <FormLabel>Nombre de Extranjero</FormLabel>
                                            <Input placeholder="Nombre de Extranjero" />
                                        </FormControl>
                                        <FormControl id="grupo" isRequired>
                                            <FormLabel>Grupo</FormLabel>
                                            <Input placeholder="Grupo" />
                                        </FormControl>
                                        <FormControl id="tipoProveedor" isRequired>
                                            <FormLabel>Tipo de Proveedor</FormLabel>
                                            <Select placeholder="Seleccione el tipo de proveedor">
                                                <option value="Exterior">Exterior</option>
                                                {/* Aquí debes añadir las opciones necesarias */}
                                            </Select>
                                        </FormControl>
                                        <FormControl id="pasaporte" isRequired>
                                            <FormLabel>PASAPORTE</FormLabel>
                                            <Input placeholder="PASAPORTE" />
                                        </FormControl>
                                        <FormControl id="rtn" isRequired>
                                            <FormLabel>RTN</FormLabel>
                                            <Input placeholder="RTN" />
                                        </FormControl>
                                        <FormControl id="retencion" isRequired>
                                            <FormLabel>Indicadores de retención permitidos</FormLabel>
                                            <Select placeholder="Seleccione el indicador">
                                                <option value="ISR">ISR sobre productos financieros</option>
                                                {/* Aquí debes añadir las opciones necesarias */}
                                            </Select>
                                        </FormControl>
                                        <FormControl id="nombreContacto" isRequired>
                                            <FormLabel>Nombre de Contacto</FormLabel>
                                            <Input placeholder="Nombre de Contacto" />
                                        </FormControl>
                                        <FormControl id="telefono1" isRequired>
                                            <FormLabel>Teléfono 1 de Contacto</FormLabel>
                                            <Input placeholder="Teléfono 1 de Contacto" />
                                        </FormControl>
                                        <FormControl id="telefono2" isRequired>
                                            <FormLabel>Teléfono 2 de Contacto</FormLabel>
                                            <Input placeholder="Teléfono 2 de Contacto" />
                                        </FormControl>
                                        <FormControl id="correo" isRequired>
                                            <FormLabel>Correo Electrónico</FormLabel>
                                            <Input placeholder="Correo Electrónico" />
                                        </FormControl>
                                        <FormControl id="productos" isRequired>
                                            <FormLabel>Productos que vende</FormLabel>
                                            <Input placeholder="Productos que vende" />
                                        </FormControl>
                                    </VStack>
                                </TabPanel>

                                ///////////////////////////////////////////////////////////////////////////Info proveedor
                                <TabPanel>
                                    <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
                                        <Heading size="sm">INFORMACIÓN DE PAGO</Heading>
                                    </Box>
                                    <VStack spacing={4} align="stretch">
                                        <FormControl id="modoPago" isRequired>
                                            <FormLabel>Modo de pago</FormLabel>
                                            <Checkbox>Transferencia</Checkbox>
                                            <Checkbox>Cheque</Checkbox>
                                        </FormControl>
                                        <FormControl id="numeroCuenta" isRequired>
                                            <FormLabel>Número de cuenta</FormLabel>
                                            <Input placeholder="Número de cuenta" />
                                        </FormControl>
                                        <FormControl id="tipoCuenta" isRequired>
                                            <FormLabel>Tipo Cuenta</FormLabel>
                                            <Select placeholder="Buscar elementos">
                                                {/* Aquí debes añadir las opciones necesarias */}
                                            </Select>
                                        </FormControl>
                                        <FormControl id="nombreCuentaCheque" isRequired>
                                            <FormLabel>Nombre de la Cuenta Cheque</FormLabel>
                                            <Input placeholder="Nombre de la Cuenta Cheque" />
                                        </FormControl>
                                        <FormControl id="monto" isRequired>
                                            <FormLabel>Monto</FormLabel>
                                            <Input placeholder="Monto" />
                                        </FormControl>
                                        <FormControl id="nombreCuentaTransferencia" isRequired>
                                            <FormLabel>Nombre de la Cuenta Transferencia</FormLabel>
                                            <Input placeholder="Nombre de la Cuenta Transferencia" />
                                        </FormControl>
                                        <FormControl id="pais" isRequired>
                                            <FormLabel>País</FormLabel>
                                            <Select placeholder="Seleccione un país">
                                                <option value="Guatemala">Guatemala</option>
                                                {/* Aquí debes añadir las opciones necesarias */}
                                            </Select>
                                        </FormControl>
                                        <FormControl id="banco" isRequired>
                                            <FormLabel>Banco</FormLabel>
                                            <Select placeholder="Seleccione un banco">
                                                <option value="Banco Industrial">Banco Industrial</option>
                                                {/* Aquí debes añadir las opciones necesarias */}
                                            </Select>
                                        </FormControl>
                                        <FormControl id="moneda" isRequired>
                                            <FormLabel>Moneda</FormLabel>
                                            <Select placeholder="Seleccione una moneda">
                                                <option value="Quetzales">Quetzales</option>
                                                {/* Aquí debes añadir las opciones necesarias */}
                                            </Select>
                                        </FormControl>
                                        <FormControl id="cartaAceptacion" isRequired>
                                            <FormLabel>Carta de Aceptación de Pago</FormLabel>
                                            <Textarea placeholder="Adjuntar un archivo" />
                                            <Button>Adjuntar un archivo</Button>
                                        </FormControl>
                                    </VStack>
                                </TabPanel>

                                ///////////////////////////////////////////////////////////////////////////Info pago
                                <TabPanel>
                                    <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
                                        <Heading size="sm">DOCUMENTACIÓN REQUERIDA</Heading>
                                    </Box>
                                    <VStack spacing={4} align="stretch">
                                        <FormControl id="rtu" isRequired>
                                            <FormLabel>RTU</FormLabel>
                                            <Textarea placeholder="No hay nada adjunto." />
                                            <Button>Adjuntar un archivo</Button>
                                        </FormControl>
                                        <FormControl id="patenteComercio" isRequired>
                                            <FormLabel>PATENTE COMERCIO</FormLabel>
                                            <Textarea placeholder="No hay nada adjunto." />
                                            <Button>Adjuntar un archivo</Button>
                                        </FormControl>
                                        <FormControl id="dpi" isRequired>
                                            <FormLabel>DPI</FormLabel>
                                            <Textarea placeholder="No hay nada adjunto." />
                                            <Button>Adjuntar un archivo</Button>
                                        </FormControl>
                                        <FormControl id="pasaporteRTN" isRequired>
                                            <FormLabel>PASAPORTE O RTN</FormLabel>
                                            <Textarea placeholder="No hay nada adjunto." />
                                            <Button>Adjuntar un archivo</Button>
                                        </FormControl>
                                        <FormControl id="cotizacionFactura" isRequired>
                                            <FormLabel>COTIZACIÓN O FACTURA</FormLabel>
                                            <Textarea placeholder="No hay nada adjunto." />
                                            <Button>Adjuntar un archivo</Button>
                                        </FormControl>
                                    </VStack>
                                    <Text mt={4}>
                                        *Pasaporte o RTN y Cotización o Factura son Obligatorios.
                                    </Text>
                                    <Text>
                                        NOTA: Guarda el Archivo exactamente como se muestra en el ejemplo:
                                    </Text>
                                    <Text>
                                        - "Pasaporte - Nombre de la Cuenta" o "RTN - Nombre de la Cuenta"
                                    </Text>
                                    <Text>
                                        - "Cotización - Nombre de la Cuenta" o "Factura - Nombre de la Cuenta"
                                    </Text>
                                    <Text>
                                        - "RTU - Nombre de la Cuenta"
                                    </Text>
                                    <Text>
                                        - "DPI - Nombre de la Cuenta"
                                    </Text>
                                    <Text>
                                        - "Patente Comercio - Nombre de la Cuenta"
                                    </Text>
                                    <Button mt={4} colorScheme="green">ENVIAR</Button>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                </Flex>
                <Footer />
            </Flex>
        </>
    );
};

