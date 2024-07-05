import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, VStack, Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Heading, Checkbox, Textarea, Text, Grid, GridItem } from '@chakra-ui/react';
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
    empresa: '',
    correlativo: '',
    nombre: '',
    nombreExtranjero: '',
    grupo: '',
    tipoProveedor: '',
    pasaporte: '',
    rtn: '',
    retencion: '',
    nombreContacto: '',
    telefono1: '',
    telefono2: '',
    correo: '',
    productos: '',
    modoPago: '',
    numeroCuenta: '',
    tipoCuenta: '',
    nombreCuentaCheque: '',
    monto: '',
    nombreCuentaTransferencia: '',
    pais: '',
    banco: '',
    moneda: '',
    cartaAceptacion: null,
    rtu: null,
    patenteComercio: null,
    dpi: null,
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
      ['nombreSolicitante', 'empresa', 'correlativo'],
      ['nombre', 'nombreExtranjero', 'grupo', 'tipoProveedor', 'pasaporte', 'rtn', 'retencion', 'nombreContacto', 'telefono1', 'telefono2', 'correo', 'productos'],
      ['modoPago', 'numeroCuenta', 'tipoCuenta', 'nombreCuentaCheque', 'monto', 'nombreCuentaTransferencia', 'pais', 'banco', 'moneda', 'cartaAceptacion'],
      ['rtu', 'patenteComercio', 'dpi', 'pasaporteRTN', 'cotizacionFactura']
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
      'nombreSolicitante', 'empresa', 'correlativo', 'nombre', 'nombreExtranjero', 'grupo', 'tipoProveedor', 'pasaporte', 'rtn', 'retencion', 'nombreContacto', 'telefono1', 'telefono2', 'correo', 'productos', 'modoPago', 'numeroCuenta', 'tipoCuenta', 'nombreCuentaCheque', 'monto', 'nombreCuentaTransferencia', 'pais', 'banco', 'moneda', 'cartaAceptacion', 'rtu', 'patenteComercio', 'dpi', 'pasaporteRTN', 'cotizacionFactura'
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
                  <CustomFormControl id="empresa" label="Empresa" isRequired isInvalid={errors.empresa}>
                    <Select
                      placeholder="Seleccione una empresa"
                      value={formData.empresa}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    >
                      <option value="Agropecuaria Popoyán, S.A.">Agropecuaria Popoyán, S.A.</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="correlativo" label="Correlativo" isRequired isInvalid={errors.correlativo}>
                    <Select
                      placeholder="Buscar elementos"
                      value={formData.correlativo}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    >
                      <option value="123">123</option>
                      <option value="214">214</option>
                    </Select>
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
                  <CustomFormControl id="nombre" label="Nombre" isRequired isInvalid={errors.nombre}>
                    <Input
                      placeholder="Nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="nombreExtranjero" label="Nombre de Extranjero" isRequired isInvalid={errors.nombreExtranjero}>
                    <Input
                      placeholder="Nombre de Extranjero"
                      value={formData.nombreExtranjero}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="grupo" label="Grupo" isRequired isInvalid={errors.grupo}>
                    <Input
                      placeholder="Grupo"
                      value={formData.grupo}
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
                      <option value="Exterior">Exterior</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="pasaporte" label="PASAPORTE" isRequired isInvalid={errors.pasaporte}>
                    <Input
                      placeholder="PASAPORTE"
                      value={formData.pasaporte}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="rtn" label="RTN" isRequired isInvalid={errors.rtn}>
                    <Input
                      placeholder="RTN"
                      value={formData.rtn}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="retencion" label="Indicadores de retención permitidos" isRequired isInvalid={errors.retencion}>
                    <Select
                      placeholder="Seleccione el indicador"
                      value={formData.retencion}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    >
                      <option value="ISR">ISR sobre productos financieros</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="nombreContacto" label="Nombre de Contacto" isRequired isInvalid={errors.nombreContacto}>
                    <Input
                      placeholder="Nombre de Contacto"
                      value={formData.nombreContacto}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="telefono1" label="Teléfono 1 de Contacto" isRequired isInvalid={errors.telefono1}>
                    <Input
                      placeholder="Teléfono 1 de Contacto"
                      value={formData.telefono1}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="telefono2" label="Teléfono 2 de Contacto" isRequired isInvalid={errors.telefono2}>
                    <Input
                      placeholder="Teléfono 2 de Contacto"
                      value={formData.telefono2}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="correo" label="Correo Electrónico" isRequired isInvalid={errors.correo}>
                    <Input
                      placeholder="Correo Electrónico"
                      value={formData.correo}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="productos" label="Productos que vende" isRequired isInvalid={errors.productos}>
                    <Input
                      placeholder="Productos que vende"
                      value={formData.productos}
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
                  <GridItem colSpan={2}>
                    <CustomFormControl id="modoPago" label="Modo de pago" isRequired isInvalid={errors.modoPago}>
                      <Checkbox
                        isChecked={formData.modoPago.includes('Transferencia')}
                        onChange={(e) => handleInputChange({ target: { id: 'modoPago', value: e.target.checked ? 'Transferencia' : '' } })}
                      >
                        Transferencia
                      </Checkbox>
                      <Checkbox
                        isChecked={formData.modoPago.includes('Cheque')}
                        onChange={(e) => handleInputChange({ target: { id: 'modoPago', value: e.target.checked ? 'Cheque' : '' } })}
                      >
                        Cheque
                      </Checkbox>
                      {errors.modoPago && <Text color="red.500">Este campo es requerido</Text>}
                    </CustomFormControl>
                  </GridItem>
                  <CustomFormControl id="numeroCuenta" label="Número de cuenta" isRequired isInvalid={errors.numeroCuenta}>
                    <Input
                      placeholder="Número de cuenta"
                      value={formData.numeroCuenta}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="tipoCuenta" label="Tipo Cuenta" isRequired isInvalid={errors.tipoCuenta}>
                    <Select
                      placeholder="Buscar elementos"
                      value={formData.tipoCuenta}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    >
                      <option value="Ahorros">Ahorros</option>
                      <option value="Corriente">Corriente</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="nombreCuentaCheque" label="Nombre de la Cuenta Cheque" isRequired isInvalid={errors.nombreCuentaCheque}>
                    <Input
                      placeholder="Nombre de la Cuenta Cheque"
                      value={formData.nombreCuentaCheque}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="monto" label="Monto" isRequired isInvalid={errors.monto}>
                    <Input
                      placeholder="Monto"
                      value={formData.monto}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="nombreCuentaTransferencia" label="Nombre de la Cuenta Transferencia" isRequired isInvalid={errors.nombreCuentaTransferencia}>
                    <Input
                      placeholder="Nombre de la Cuenta Transferencia"
                      value={formData.nombreCuentaTransferencia}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="pais" label="País" isRequired isInvalid={errors.pais}>
                    <Select
                      placeholder="Seleccione un país"
                      value={formData.pais}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    >
                      <option value="Guatemala">Guatemala</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="banco" label="Banco" isRequired isInvalid={errors.banco}>
                    <Select
                      placeholder="Seleccione un banco"
                      value={formData.banco}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    >
                      <option value="Banco Industrial">Banco Industrial</option>
                    </Select>
                  </CustomFormControl>
                  <CustomFormControl id="moneda" label="Moneda" isRequired isInvalid={errors.moneda}>
                    <Select
                      placeholder="Seleccione una moneda"
                      value={formData.moneda}
                      onChange={handleInputChange}
                      errorBorderColor="red.300"
                    >
                      <option value="Quetzales">Quetzales</option>
                    </Select>
                  </CustomFormControl>
                  <GridItem colSpan={2}>
                    <CustomFormControl id="cartaAceptacion" label="Carta de Aceptación de Pago" isRequired isInvalid={errors.cartaAceptacion}>
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        errorBorderColor="red.300"
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
                  <CustomFormControl id="patenteComercio" label="PATENTE COMERCIO" isRequired isInvalid={errors.patenteComercio}>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="dpi" label="DPI" isRequired isInvalid={errors.dpi}>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <CustomFormControl id="pasaporteRTN" label="PASAPORTE O RTN" isRequired isInvalid={errors.pasaporteRTN}>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      errorBorderColor="red.300"
                    />
                  </CustomFormControl>
                  <GridItem colSpan={2}>
                    <CustomFormControl id="cotizacionFactura" label="COTIZACIÓN O FACTURA" isRequired isInvalid={errors.cotizacionFactura}>
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        errorBorderColor="red.300"
                      />
                    </CustomFormControl>
                  </GridItem>
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
