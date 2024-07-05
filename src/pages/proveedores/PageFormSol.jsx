import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Heading, Checkbox, Textarea, Text, Grid, GridItem } from '@chakra-ui/react';
import Header from './Header';  // Asegúrate de que la ruta sea correcta
import Footer from './Footer';  // Asegúrate de que la ruta sea correcta

const CustomFormControl = ({ id, label, isRequired, isInvalid, children }) => (
  <FormControl id={id} isRequired={isRequired} isInvalid={isInvalid} mb={4}>
    <FormLabel fontWeight="bold">{label}</FormLabel>
    {children}
    {isInvalid && <Text color="red.500" fontSize="sm">Este campo es requerido</Text>}
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
  };

  const validateFields = (fields) => {
    const newErrors = {};
    fields.forEach((field) => {
      if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
        newErrors[field] = true;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextTab = () => {
    const tabFields = [
      ['nombreSolicitante', 'empresaSolicitante', 'fechaSolicitud'],
      ['nombreProveedor', 'paisProveedor', 'razonSocial', 'tipoProveedor', 'nit', 'dpi', 'localidadProveedor', 'nombreContacto', 'telefonoContacto', 'correoContacto', 'productosPrincipales'],
      ['tipoPago', 'banco', 'tipoCuenta', 'numeroCuenta', 'nombreCheque', 'moneda', 'plazo', 'monto', 'cartaAceptacion'],
      ['rtu', 'patenteComercio', 'dpiDoc', 'pasaporteRTN', 'cotizacionFactura']
    ];

    if (validateFields(tabFields[tabIndex])) {
      setTabIndex(tabIndex + 1);
    } else {
      //alert('Por favor, completa todos los campos obligatorios antes de continuar.');
    }
  };

  const handlePreviousTab = () => {
    if (tabIndex > 0) {
      setTabIndex(tabIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const allFields = [
      'nombreSolicitante', 'empresaSolicitante', 'fechaSolicitud', 'nombreProveedor', 'paisProveedor', 'razonSocial', 'tipoProveedor', 'nit', 'dpi', 'localidadProveedor', 'nombreContacto', 'telefonoContacto', 'correoContacto', 'productosPrincipales', 'tipoPago', 'banco', 'tipoCuenta', 'numeroCuenta', 'nombreCheque', 'moneda', 'plazo', 'monto', 'cartaAceptacion', 'rtu', 'patenteComercio', 'dpiDoc', 'pasaporteRTN', 'cotizacionFactura'
    ];

    if (validateFields(allFields)) {
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
    } else {
      //alert('Por favor, completa todos los campos obligatorios antes de enviar.');
    }
  };

  return (
    <Flex direction="column" minH="100vh" bg="gray.100">
      <Header />
      <Flex direction="column" flex="1" p={4} width="100%">
        <Box width="100%" mx="auto" borderWidth={1} borderRadius="md" boxShadow="md" bg="white" p={6}>
          <Box bg="orange.400" color="white" py={2} px={4} borderRadius="md" mb={6} textAlign="center">
            <Heading size="md">CREACION DE PROVEEDOR</Heading>
          </Box>
          <Tabs index={tabIndex} isFitted variant="enclosed">
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
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <CustomFormControl id="nombreSolicitante" label="Nombre del Solicitante" isRequired isInvalid={errors.nombreSolicitante}>
                    <Input
                      placeholder="Nombre del Solicitante"
                      value={formData.nombreSolicitante}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="empresaSolicitante" label="Empresa" isRequired isInvalid={errors.empresaSolicitante}>
                    <Select
                      placeholder="Seleccione una empresa"
                      value={formData.empresaSolicitante}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    >
                      <option value="Agropecuaria Popoyán, S.A.">Agropecuaria Popoyán, S.A.</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="fechaSolicitud" label="Fecha de Solicitud" isRequired isInvalid={errors.fechaSolicitud}>
                    <Input
                      type="date"
                      value={formData.fechaSolicitud}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
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
                  <Heading size="sm">INFORMACIÓN DEL PROVEEDOR</Heading>
                </Box>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <CustomFormControl id="nombreProveedor" label="Nombre del Proveedor" isRequired isInvalid={errors.nombreProveedor}>
                    <Input
                      placeholder="Nombre del Proveedor"
                      value={formData.nombreProveedor}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="paisProveedor" label="País del Proveedor" isRequired isInvalid={errors.paisProveedor}>
                    <Select
                      placeholder="Seleccione un país"
                      value={formData.paisProveedor}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    >
                      <option value="Guatemala">Guatemala</option>
                      <option value="México">México</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="razonSocial" label="Razón Social" isRequired isInvalid={errors.razonSocial}>
                    <Input
                      placeholder="Razón Social"
                      value={formData.razonSocial}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="tipoProveedor" label="Tipo de Proveedor" isRequired isInvalid={errors.tipoProveedor}>
                    <Select
                      placeholder="Seleccione el tipo de proveedor"
                      value={formData.tipoProveedor}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    >
                      <option value="Nacional">Nacional</option>
                      <option value="Internacional">Internacional</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="nit" label="NIT" isRequired isInvalid={errors.nit}>
                    <Input
                      placeholder="NIT"
                      value={formData.nit}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="dpi" label="DPI" isRequired isInvalid={errors.dpi}>
                    <Input
                      placeholder="DPI"
                      value={formData.dpi}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="localidadProveedor" label="Localidad del Proveedor" isRequired isInvalid={errors.localidadProveedor}>
                    <Input
                      placeholder="Localidad del Proveedor"
                      value={formData.localidadProveedor}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="nombreContacto" label="Nombre del Contacto" isRequired isInvalid={errors.nombreContacto}>
                    <Input
                      placeholder="Nombre del Contacto"
                      value={formData.nombreContacto}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="telefonoContacto" label="Teléfono de Contacto" isRequired isInvalid={errors.telefonoContacto}>
                    <Input
                      placeholder="Teléfono de Contacto"
                      value={formData.telefonoContacto}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="correoContacto" label="Correo Electrónico" isRequired isInvalid={errors.correoContacto}>
                    <Input
                      placeholder="Correo Electrónico"
                      value={formData.correoContacto}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="productosPrincipales" label="Productos Principales" isRequired isInvalid={errors.productosPrincipales}>
                    <Textarea
                      placeholder="Productos Principales"
                      value={formData.productosPrincipales}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
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
                  <Heading size="sm">INFORMACIÓN DE PAGO</Heading>
                </Box>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <CustomFormControl id="tipoPago" label="Tipo de Pago" isRequired isInvalid={errors.tipoPago}>
                    <Select
                      placeholder="Seleccione un tipo de pago"
                      value={formData.tipoPago}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    >
                      <option value="Transferencia">Transferencia</option>
                      <option value="Cheque">Cheque</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="banco" label="Banco" isRequired isInvalid={errors.banco}>
                    <Select
                      placeholder="Seleccione un banco"
                      value={formData.banco}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    >
                      <option value="Banco 1">Banco 1</option>
                      <option value="Banco 2">Banco 2</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="tipoCuenta" label="Tipo de Cuenta" isRequired isInvalid={errors.tipoCuenta}>
                    <Select
                      placeholder="Seleccione un tipo de cuenta"
                      value={formData.tipoCuenta}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    >
                      <option value="Ahorros">Ahorros</option>
                      <option value="Corriente">Corriente</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="numeroCuenta" label="Número de Cuenta" isRequired isInvalid={errors.numeroCuenta}>
                    <Input
                      placeholder="Número de Cuenta"
                      value={formData.numeroCuenta}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="nombreCheque" label="Nombre en Cheque" isRequired isInvalid={errors.nombreCheque}>
                    <Input
                      placeholder="Nombre en Cheque"
                      value={formData.nombreCheque}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="moneda" label="Moneda" isRequired isInvalid={errors.moneda}>
                    <Select
                      placeholder="Seleccione una moneda"
                      value={formData.moneda}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    >
                      <option value="Quetzales">Quetzales</option>
                      <option value="Dólares">Dólares</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="plazo" label="Plazo" isRequired isInvalid={errors.plazo}>
                    <Select
                      placeholder="Seleccione el plazo"
                      value={formData.plazo}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    >
                      <option value="30 días">30 días</option>
                      <option value="60 días">60 días</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="monto" label="Monto" isRequired isInvalid={errors.monto}>
                    <Input
                      placeholder="Monto"
                      value={formData.monto}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="cartaAceptacion" label="Carta de Aceptación de Pago" isRequired isInvalid={errors.cartaAceptacion}>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      errorBorderColor="red.300"
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
                  <CustomFormControl id="rtu" label="RTU" isRequired isInvalid={errors.rtu}>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="patenteComercio" label="Patente de Comercio" isRequired isInvalid={errors.patenteComercio}>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="dpiDoc" label="DPI" isRequired isInvalid={errors.dpiDoc}>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="pasaporteRTN" label="Pasaporte o RTN" isRequired isInvalid={errors.pasaporteRTN}>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="cotizacionFactura" label="Cotización o Factura" isRequired isInvalid={errors.cotizacionFactura}>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                </Grid>
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