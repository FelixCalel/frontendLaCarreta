import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, VStack, Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Heading, Checkbox, Textarea, Text } from '@chakra-ui/react';
import Header from './Header';  // Asegúrate de que la ruta sea correcta
import Footer from './Footer';  // Asegúrate de que la ruta sea correcta

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
      if (!formData[field]) {
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
    <Flex direction="column" minH="100vh">
      <Header />
      <Flex direction="column" flex="1" overflow="hidden">
        <Flex flex="1" align="top" justify="center" p={4} width="100%">
          <Box width="100%" mx="auto" borderWidth={1} borderRadius="md" boxShadow="md" overflow="hidden">
            <Box bg="orange" color="white" py={2} px={4} borderRadius="md" mb={4}>
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
                  <VStack spacing={4} align="stretch">
                    <FormControl id="nombreSolicitante" isRequired isInvalid={errors.nombreSolicitante}>
                      <FormLabel>Nombre del Solicitante</FormLabel>
                      <Input
                        placeholder="Nombre del Solicitante"
                        value={formData.nombreSolicitante}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      />
                      {errors.nombreSolicitante && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="empresa" isRequired isInvalid={errors.empresa}>
                      <FormLabel>Empresa</FormLabel>
                      <Select
                        placeholder="Seleccione una empresa"
                        value={formData.empresa}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      >
                        <option value="Agropecuaria Popoyán, S.A.">Agropecuaria Popoyán, S.A.</option>
                      </Select>
                      {errors.empresa && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="correlativo" isRequired isInvalid={errors.correlativo}>
                      <FormLabel>Correlativo</FormLabel>
                      <Select
                        placeholder="Buscar elementos"
                        value={formData.correlativo}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      >
                        <option value="123">123</option>
                        <option value="214">214</option>
                      </Select>
                      {errors.correlativo && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <Flex justify="space-between" w="100%">
                      <Button onClick={handlePreviousTab}>Anterior</Button>
                      <Button colorScheme="green" onClick={handleNextTab}>Siguiente</Button>
                    </Flex>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
                    <Heading size="sm">INFORMACIÓN DEL PROVEEDOR</Heading>
                  </Box>
                  <VStack spacing={4} align="stretch">
                    <FormControl id="nombre" isRequired isInvalid={errors.nombre}>
                      <FormLabel>Nombre</FormLabel>
                      <Input
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      />
                      {errors.nombre && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="nombreExtranjero" isRequired isInvalid={errors.nombreExtranjero}>
                      <FormLabel>Nombre de Extranjero</FormLabel>
                      <Input
                        placeholder="Nombre de Extranjero"
                        value={formData.nombreExtranjero}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      />
                      {errors.nombreExtranjero && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="grupo" isRequired isInvalid={errors.grupo}>
                      <FormLabel>Grupo</FormLabel>
                      <Input
                        placeholder="Grupo"
                        value={formData.grupo}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      />
                      {errors.grupo && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="tipoProveedor" isRequired isInvalid={errors.tipoProveedor}>
                      <FormLabel>Tipo de Proveedor</FormLabel>
                      <Select
                        placeholder="Seleccione el tipo de proveedor"
                        value={formData.tipoProveedor}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      >
                        <option value="Exterior">Exterior</option>
                      </Select>
                      {errors.tipoProveedor && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="pasaporte" isRequired isInvalid={errors.pasaporte}>
                      <FormLabel>PASAPORTE</FormLabel>
                      <Input
                        placeholder="PASAPORTE"
                        value={formData.pasaporte}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      />
                      {errors.pasaporte && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="rtn" isRequired isInvalid={errors.rtn}>
                      <FormLabel>RTN</FormLabel>
                      <Input
                        placeholder="RTN"
                        value={formData.rtn}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      />
                      {errors.rtn && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="retencion" isRequired isInvalid={errors.retencion}>
                      <FormLabel>Indicadores de retención permitidos</FormLabel>
                      <Select
                        placeholder="Seleccione el indicador"
                        value={formData.retencion}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      >
                        <option value="ISR">ISR sobre productos financieros</option>
                      </Select>
                      {errors.retencion && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="nombreContacto" isRequired isInvalid={errors.nombreContacto}>
                      <FormLabel>Nombre de Contacto</FormLabel>
                      <Input
                        placeholder="Nombre de Contacto"
                        value={formData.nombreContacto}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      />
                      {errors.nombreContacto && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="telefono1" isRequired isInvalid={errors.telefono1}>
                      <FormLabel>Teléfono 1 de Contacto</FormLabel>
                      <Input
                        placeholder="Teléfono 1 de Contacto"
                        value={formData.telefono1}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      />
                      {errors.telefono1 && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="telefono2" isRequired isInvalid={errors.telefono2}>
                      <FormLabel>Teléfono 2 de Contacto</FormLabel>
                      <Input
                        placeholder="Teléfono 2 de Contacto"
                        value={formData.telefono2}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      />
                      {errors.telefono2 && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="correo" isRequired isInvalid={errors.correo}>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <Input
                        placeholder="Correo Electrónico"
                        value={formData.correo}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      />
                      {errors.correo && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="productos" isRequired isInvalid={errors.productos}>
                      <FormLabel>Productos que vende</FormLabel>
                      <Input
                        placeholder="Productos que vende"
                        value={formData.productos}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      />
                      {errors.productos && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <Flex justify="space-between" w="100%">
                      <Button onClick={handlePreviousTab}>Anterior</Button>
                      <Button colorScheme="green" onClick={handleNextTab}>Siguiente</Button>
                    </Flex>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
                    <Heading size="sm">INFORMACIÓN DE PAGO</Heading>
                  </Box>
                  <VStack spacing={4} align="stretch">
                    <FormControl id="modoPago" isRequired isInvalid={errors.modoPago}>
                      <FormLabel>Modo de pago</FormLabel>
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
                    </FormControl>
                    <FormControl id="numeroCuenta" isRequired isInvalid={errors.numeroCuenta}>
                      <FormLabel>Número de cuenta</FormLabel>
                      <Input
                        placeholder="Número de cuenta"
                        value={formData.numeroCuenta}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      />
                      {errors.numeroCuenta && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="tipoCuenta" isRequired isInvalid={errors.tipoCuenta}>
                      <FormLabel>Tipo Cuenta</FormLabel>
                      <Select
                        placeholder="Buscar elementos"
                        value={formData.tipoCuenta}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      >
                        <option value="Ahorros">Ahorros</option>
                        <option value="Corriente">Corriente</option>
                      </Select>
                      {errors.tipoCuenta && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="nombreCuentaCheque" isRequired isInvalid={errors.nombreCuentaCheque}>
                      <FormLabel>Nombre de la Cuenta Cheque</FormLabel>
                      <Input
                        placeholder="Nombre de la Cuenta Cheque"
                        value={formData.nombreCuentaCheque}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      />
                      {errors.nombreCuentaCheque && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="monto" isRequired isInvalid={errors.monto}>
                      <FormLabel>Monto</FormLabel>
                      <Input
                        placeholder="Monto"
                        value={formData.monto}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      />
                      {errors.monto && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="nombreCuentaTransferencia" isRequired isInvalid={errors.nombreCuentaTransferencia}>
                      <FormLabel>Nombre de la Cuenta Transferencia</FormLabel>
                      <Input
                        placeholder="Nombre de la Cuenta Transferencia"
                        value={formData.nombreCuentaTransferencia}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      />
                      {errors.nombreCuentaTransferencia && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="pais" isRequired isInvalid={errors.pais}>
                      <FormLabel>País</FormLabel>
                      <Select
                        placeholder="Seleccione un país"
                        value={formData.pais}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      >
                        <option value="Guatemala">Guatemala</option>
                      </Select>
                      {errors.pais && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="banco" isRequired isInvalid={errors.banco}>
                      <FormLabel>Banco</FormLabel>
                      <Select
                        placeholder="Seleccione un banco"
                        value={formData.banco}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      >
                        <option value="Banco Industrial">Banco Industrial</option>
                      </Select>
                      {errors.banco && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="moneda" isRequired isInvalid={errors.moneda}>
                      <FormLabel>Moneda</FormLabel>
                      <Select
                        placeholder="Seleccione una moneda"
                        value={formData.moneda}
                        onChange={handleInputChange}
                        errorBorderColor="red.300"
                      >
                        <option value="Quetzales">Quetzales</option>
                      </Select>
                      {errors.moneda && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="cartaAceptacion" isRequired isInvalid={errors.cartaAceptacion}>
                      <FormLabel>Carta de Aceptación de Pago</FormLabel>
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        errorBorderColor="red.300"
                      />
                      {errors.cartaAceptacion && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <Flex justify="space-between" w="100%">
                      <Button onClick={handlePreviousTab}>Anterior</Button>
                      <Button colorScheme="green" onClick={handleNextTab}>Siguiente</Button>
                    </Flex>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
                    <Heading size="sm">DOCUMENTACIÓN REQUERIDA</Heading>
                  </Box>
                  <VStack spacing={4} align="stretch">
                    <FormControl id="rtu" isRequired isInvalid={errors.rtu}>
                      <FormLabel>RTU</FormLabel>
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        errorBorderColor="red.300"
                      />
                      {errors.rtu && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="patenteComercio" isRequired isInvalid={errors.patenteComercio}>
                      <FormLabel>PATENTE COMERCIO</FormLabel>
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        errorBorderColor="red.300"
                      />
                      {errors.patenteComercio && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="dpi" isRequired isInvalid={errors.dpi}>
                      <FormLabel>DPI</FormLabel>
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        errorBorderColor="red.300"
                      />
                      {errors.dpi && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="pasaporteRTN" isRequired isInvalid={errors.pasaporteRTN}>
                      <FormLabel>PASAPORTE O RTN</FormLabel>
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        errorBorderColor="red.300"
                      />
                      {errors.pasaporteRTN && <Text color="red.500">Este campo es requerido</Text>}
                    </FormControl>
                    <FormControl id="cotizacionFactura" isRequired isInvalid={errors.cotizacionFactura}>
                      <FormLabel>COTIZACIÓN O FACTURA</FormLabel>
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        errorBorderColor="red.300"
                      />
                      {errors.cotizacionFactura && <Text color="red.500">Este campo es requerido</Text>}
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
                  <Flex justify="space-between" w="100%">
                    <Button onClick={handlePreviousTab}>Anterior</Button>
                    <Button mt={4} colorScheme="green" onClick={handleSubmit}>ENVIAR</Button>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
        <Footer />
      </Flex>
    </Flex>
  );
};
