import React, { useState, useEffect } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Select, Tabs, TabList, TabPanels, Tab, TabPanel, Flex,
  Heading, Checkbox, Textarea, Text, Grid, GridItem, Table, Thead, Tbody, Tr, Th, Td, IconButton
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import Header from './Header';  // Asegúrate de que la ruta sea correcta
import Footer from './Footer';  // Asegúrate de que la ruta sea correcta

const CustomFormControl = ({ id, label, children }) => (
  <FormControl id={id} mb={4}>
    <FormLabel fontWeight="bold">{label}</FormLabel>
    {children}
  </FormControl>
);

export const PageFormSol = () => {
  const [formData, setFormData] = useState({
    nombreSolicitante: '',
    empresaSolicitante: '',
    fechaSolicitud: '',
    nombreProveedor: '',
    paisProveedor: '',
    razonSocial: '',
    tipoProveedor: '',
    nit: '',
    dpi: '',
    localidadProveedor: '',
    nombreContacto: '',
    telefonoContacto: '',
    correoContacto: '',
    productosPrincipales: '',
    tipoPago: '',
    banco: '',
    tipoCuenta: '',
    numeroCuenta: '',
    nombreCheque: '',
    moneda: '',
    plazo: '',
    monto: '',
    cartaAceptacion: null,
    rtu: null,
    patenteComercio: null,
    dpiDoc: null,
    pasaporteRTN: null,
    cotizacionFactura: null
  });

  const [tabIndex, setTabIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [documentos, setDocumentos] = useState([]);
  const [selectedTipoDocumento, setSelectedTipoDocumento] = useState('');

  useEffect(() => {
    const currentDate = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Guatemala'
    }).split('/').join('/');
    setFormData(prevData => ({
      ...prevData,
      fechaSolicitud: currentDate
    }));
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: !value.trim()
    }));
  };

  const handleFileChange = (e) => {
    const { id } = e.target;
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      [id]: file
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: !file
    }));
    setDocumentos((prevDocumentos) => [
      ...prevDocumentos,
      { numero: prevDocumentos.length + 1, tipo: selectedTipoDocumento, nombre: file.name }
    ]);
  };

  const handleDeleteDocumento = (numero) => {
    setDocumentos((prevDocumentos) => prevDocumentos.filter((doc) => doc.numero !== numero));
  };

  const handleNextTab = () => {
    setTabIndex(tabIndex + 1);
  };

  const handlePreviousTab = () => {
    if (tabIndex > 0) {
      setTabIndex(tabIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await fetch('https://tu-endpoint.com/api/form', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Formulario enviado exitosamente');
      } else {
        alert('Hubo un error al enviar el formulario');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Hubo un error al enviar el formulario');
    }
  };

  const handleTipoPagoChange = (tipo) => {
    setFormData((prevData) => ({
      ...prevData,
      tipoPago: prevData.tipoPago === tipo ? '' : tipo
    }));
  };

  const bancosPorPais = {
    Guatemala: ['Banco G1', 'Banco G2'],
    México: ['Banco M1', 'Banco M2']
  };

  const monedasPorPais = {
    Guatemala: ['Quetzales'],
    México: ['Pesos']
  };

  return (
    <Flex direction="column" minH="100vh" bg="gray.100">
      <Header />
      <Flex direction="column" flex="1" p={4} width="100%">
        <Box width="100%" mx="auto" borderWidth={1} borderRadius="md" boxShadow="md" bg="white" p={6}>
          <Box bg="orange.400" color="white" py={2} px={4} borderRadius="md" mb={6} textAlign="center">
            <Heading size="md">CREACION DE PROVEEDOR</Heading>
          </Box>
          <Tabs index={tabIndex} isFitted variant="enclosed" onChange={index => setTabIndex(index)}>
            <TabList mb="1em">
              <Tab>Info Solicitante</Tab>
              <Tab>Info Proveedor</Tab>
              <Tab>Info Pago</Tab>
              <Tab>Info Crédito</Tab>
              <Tab>Documentación</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex align="center" justify="space-between" mb={4}>
                  <Box borderWidth={1} borderRadius="sm" p={4} flexGrow={1}>
                    <Heading size="sm">INFORMACIÓN DEL SOLICITANTE</Heading>
                  </Box>
                  <Box borderWidth={0} borderRadius="sm" p={4} flexShrink={0}>
                    <Flex alignItems="center">
                      <FormLabel htmlFor="fechaSolicitud" fontWeight="bold" mb="0" mr={2}>Fecha:</FormLabel>
                      <Input
                        id="fechaSolicitud"
                        type="text"
                        value={formData.fechaSolicitud}
                        readOnly
                        fontWeight="bold"
                        fontSize="sm"
                        borderColor="orange.400"
                        width="auto"
                        minW="max-content"
                      />
                    </Flex>
                  </Box>
                </Flex>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <CustomFormControl id="empresaSolicitante" label="Empresa donde solicita PRO">
                    <Select
                      placeholder="Seleccione una empresa"
                      value={formData.empresaSolicitante}
                      onChange={handleInputChange}
                    >
                      <option value="Agropecuaria Popoyán, S.A.">Agropecuaria Popoyán, S.A.</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="nombreSolicitante" label="Nombre del Solicitante">
                    <Input
                      placeholder="Nombre del Solicitante"
                      value={formData.nombreSolicitante}
                      onChange={handleInputChange}
                    />
                  </CustomFormControl>
                </Grid>
                <Flex justify="space-between" w="100%" mt={4}>
                  <Button onClick={handlePreviousTab} colorScheme="teal" visibility={tabIndex === 0 ? 'hidden' : 'visible'}>Anterior</Button>
                  <Button colorScheme="teal" onClick={handleNextTab}>Siguiente</Button>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
                  <Heading size="sm">INFORMACIÓN DEL PROVEEDOR</Heading>
                </Box>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <GridItem colSpan={2}>
                    <CustomFormControl id="razonSocial" label="Razón social (nombre de la empresa)">
                      <Input
                        placeholder="Razón social"
                        value={formData.razonSocial}
                        onChange={handleInputChange}
                      />
                    </CustomFormControl>
                  </GridItem>
                  <CustomFormControl id="paisProveedor" label="País del proveedor">
                    <Select
                      placeholder="Seleccione un país"
                      value={formData.paisProveedor}
                      onChange={handleInputChange}
                    >
                      <option value="Guatemala">Guatemala</option>
                      <option value="México">México</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="tipoProveedor" label="Tipo de proveedor">
                    <Select
                      placeholder="Seleccione el tipo de proveedor"
                      value={formData.tipoProveedor}
                      onChange={handleInputChange}
                    >
                      <option value="Nacional">Nacional</option>
                      <option value="Exterior">Exterior</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="nombreContacto" label="Nombre del contacto">
                    <Input
                      placeholder="Nombre del contacto"
                      value={formData.nombreContacto}
                      onChange={handleInputChange}
                    />
                  </CustomFormControl>
                  <CustomFormControl id="localidadProveedor" label="Localidad del proveedor">
                    <Input
                      placeholder="Localidad del proveedor"
                      value={formData.localidadProveedor}
                      onChange={handleInputChange}
                    />
                  </CustomFormControl>
                  <CustomFormControl id="correoContacto" label="Correo electrónico">
                    <Input
                      placeholder="Correo electrónico"
                      value={formData.correoContacto}
                      onChange={handleInputChange}
                    />
                  </CustomFormControl>
                  <CustomFormControl id="dpi" label={formData.tipoProveedor === 'Exterior' ? 'Pasaporte' : 'DPI'}>
                    <Input
                      placeholder={formData.tipoProveedor === 'Exterior' ? 'Pasaporte' : 'DPI'}
                      value={formData.dpi}
                      onChange={handleInputChange}
                    />
                  </CustomFormControl>
                  <CustomFormControl id="telefonoContacto" label="Teléfono de contacto">
                    <Input
                      placeholder="Teléfono de contacto"
                      value={formData.telefonoContacto}
                      onChange={handleInputChange}
                    />
                  </CustomFormControl>
                  <CustomFormControl id="nit" label={formData.tipoProveedor === 'Exterior' ? 'RTN' : 'NIT'}>
                    <Input
                      placeholder={formData.tipoProveedor === 'Exterior' ? 'RTN' : 'NIT'}
                      value={formData.nit}
                      onChange={handleInputChange}
                    />
                  </CustomFormControl>
                  <GridItem colSpan={2}>
                    <CustomFormControl id="productosPrincipales" label="Productos principales que nos vende">
                      <Textarea
                        placeholder="Productos principales"
                        value={formData.productosPrincipales}
                        onChange={handleInputChange}
                      />
                    </CustomFormControl>
                  </GridItem>
                </Grid>
                <Flex justify="space-between" w="100%" mt={4}>
                  <Button onClick={handlePreviousTab} colorScheme="teal">Anterior</Button>
                  <Button colorScheme="teal" onClick={handleNextTab}>Siguiente</Button>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
                  <Heading size="sm" mb={6}>INFORMACIÓN DE PAGO</Heading>
                  <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                    <GridItem colSpan={3}>
                      <Flex alignItems="center">
                        <Text fontWeight="bold" mr={4}>Tipo de pago:</Text>
                        <Checkbox
                          isChecked={formData.tipoPago === 'Transferencia'}
                          onChange={() => handleTipoPagoChange('Transferencia')}
                          mr={6}  // Espacio después del checkbox de Transferencia
                        >
                          Transferencia
                        </Checkbox>
                        <Checkbox
                          isChecked={formData.tipoPago === 'Cheque'}
                          onChange={() => handleTipoPagoChange('Cheque')}
                        >
                          Cheque
                        </Checkbox>
                      </Flex>
                    </GridItem>
                    <GridItem colSpan={1}>
                      <CustomFormControl id="paisBanco" label="País del banco">
                        <Select
                          placeholder="Seleccione un país"
                          value={formData.paisBanco}
                          onChange={handleInputChange}
                        >
                          {Object.keys(bancosPorPais).map(pais => (
                            <option key={pais} value={pais}>{pais}</option>
                          ))}
                        </Select>
                      </CustomFormControl>
                    </GridItem>
                    <GridItem colSpan={1}>
                      <CustomFormControl id="banco" label="Banco">
                        <Select
                          placeholder="Seleccione un banco"
                          value={formData.banco}
                          onChange={handleInputChange}
                          disabled={!formData.paisBanco}
                        >
                          {(bancosPorPais[formData.paisBanco] || []).map(banco => (
                            <option key={banco} value={banco}>{banco}</option>
                          ))}
                        </Select>
                      </CustomFormControl>
                    </GridItem>
                    <GridItem colSpan={1}>
                      <CustomFormControl id="moneda" label="Moneda">
                        <Select
                          placeholder="Seleccione una moneda"
                          value={formData.moneda}
                          onChange={handleInputChange}
                          disabled={!formData.paisBanco}
                        >
                          {(monedasPorPais[formData.paisBanco] || []).map(moneda => (
                            <option key={moneda} value={moneda}>{moneda}</option>
                          ))}
                        </Select>
                      </CustomFormControl>
                    </GridItem>
                    <GridItem colSpan={1}>
                      <CustomFormControl id="tipoCuenta" label="Tipo de cuenta">
                        <Select
                          placeholder="Seleccione un tipo de cuenta"
                          value={formData.tipoCuenta}
                          onChange={handleInputChange}
                        >
                          <option value="Ahorros">Ahorros</option>
                          <option value="Corriente">Corriente</option>
                        </Select>
                      </CustomFormControl>
                    </GridItem>
                    <GridItem colSpan={2}>
                      <CustomFormControl id="numeroCuenta" label="Número de cuenta">
                        <Input
                          placeholder="Número de cuenta"
                          value={formData.numeroCuenta}
                          onChange={handleInputChange}
                        />
                      </CustomFormControl>
                    </GridItem>
                    <GridItem colSpan={3}>
                      <CustomFormControl id="nombreCheque" label={formData.tipoPago === 'Cheque' ? 'Nombre al que se emite el cheque' : 'Nombre al que se emite la transferencia'}>
                        <Input
                          placeholder={formData.tipoPago === 'Cheque' ? 'Nombre en Cheque' : 'Nombre en Transferencia'}
                          value={formData.nombreCheque}
                          onChange={handleInputChange}
                        />
                      </CustomFormControl>
                    </GridItem>
                  </Grid>
                </Box>
                <Flex justify="space-between" w="100%" mt={4}>
                  <Button onClick={handlePreviousTab} colorScheme="teal">Anterior</Button>
                  <Button colorScheme="teal" onClick={handleNextTab}>Siguiente</Button>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
                  <Heading size="sm">INFORMACIÓN DE CRÉDITO</Heading>
                </Box>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <CustomFormControl id="plazo" label="Plazo">
                    <Select
                      placeholder="Seleccione el plazo"
                      value={formData.plazo}
                      onChange={handleInputChange}
                    >
                      <option value="30 días">30 días</option>
                      <option value="60 días">60 días</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="monto" label="Monto">
                    <Input
                      placeholder="Monto"
                      value={formData.monto}
                      onChange={handleInputChange}
                    />
                  </CustomFormControl>
                </Grid>
                <Flex justify="space-between" w="100%" mt={4}>
                  <Button onClick={handlePreviousTab} colorScheme="teal">Anterior</Button>
                  <Button colorScheme="teal" onClick={handleNextTab}>Siguiente</Button>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
                  <Heading size="sm">DOCUMENTACIÓN REQUERIDA</Heading>
                </Box>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <CustomFormControl id="tipoDocumento" label="Seleccionar el tipo de documento a subir">
                    <Select
                      placeholder="Seleccione un tipo de documento"
                      value={selectedTipoDocumento}
                      onChange={(e) => setSelectedTipoDocumento(e.target.value)}
                    >
                      <option value="CartaAceptacion">Carta de Aceptación de Pago</option>
                      <option value="RTU">RTU</option>
                      <option value="PatenteComercio">Patente de Comercio</option>
                      <option value="DPI">DPI</option>
                      <option value="PasaporteRTN">Pasaporte o RTN</option>
                      <option value="CotizacionFactura">Cotización o Factura</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="archivo" label="Seleccionar archivo">
                    <Input
                      type="file"
                      onChange={handleFileChange}
                    />
                  </CustomFormControl>
                </Grid>
                <Box borderWidth={1} borderRadius="md" p={4} mb={4} mt={4}>
                  <Heading size="sm" textAlign="center">Documentos almacenados</Heading>
                  <Table mt={4}>
                    <Thead>
                      <Tr>
                        <Th>Número de Documento</Th>
                        <Th>Tipo de Documento</Th>
                        <Th>Nombre del Documento</Th>
                        <Th>Acciones</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {documentos.map((doc, index) => (
                        <Tr key={index}>
                          <Td>{doc.numero}</Td>
                          <Td>{doc.tipo}</Td>
                          <Td>{doc.nombre}</Td>
                          <Td>
                            <IconButton
                              icon={<DeleteIcon />}
                              colorScheme="red"
                              onClick={() => handleDeleteDocumento(doc.numero)}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
                <Flex justify="space-between" w="100%" mt={4}>
                  <Button onClick={handlePreviousTab} colorScheme="teal">Anterior</Button>
                  <Button mt={4} colorScheme="teal" onClick={handleSubmit}>ENVIAR</Button>
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
      <Footer />
    </Flex>
  );
};

export default PageFormSol;
