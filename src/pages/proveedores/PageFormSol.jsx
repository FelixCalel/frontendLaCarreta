import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Heading } from '@chakra-ui/react';
import InfoSolicitante from './InfoSolicitante';
import InfoProveedor from './InfoProveedor';
import InfoPago from './InfoPago';
import InfoCredito from './InfoCredito';
import Documentacion from './Documentacion';

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
              <Tab>Doc Requerida</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <InfoSolicitante
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleNextTab={handleNextTab}
                  handlePreviousTab={handlePreviousTab}
                  tabIndex={tabIndex}
                />
              </TabPanel>
              <TabPanel>
                <InfoProveedor
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleNextTab={handleNextTab}
                  handlePreviousTab={handlePreviousTab}
                />
              </TabPanel>
              <TabPanel>
                <InfoPago
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleNextTab={handleNextTab}
                  handlePreviousTab={handlePreviousTab}
                  handleTipoPagoChange={handleTipoPagoChange}
                  bancosPorPais={bancosPorPais}
                  monedasPorPais={monedasPorPais}
                />
              </TabPanel>
              <TabPanel>
                <InfoCredito
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleNextTab={handleNextTab}
                  handlePreviousTab={handlePreviousTab}
                />
              </TabPanel>
              <TabPanel>
                <Documentacion
                  formData={formData}
                  handleFileChange={handleFileChange}
                  documentos={documentos}
                  selectedTipoDocumento={selectedTipoDocumento}
                  setSelectedTipoDocumento={setSelectedTipoDocumento}
                  handleDeleteDocumento={handleDeleteDocumento}
                  handlePreviousTab={handlePreviousTab}
                  handleSubmit={handleSubmit}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Flex>
  );
};

export default PageFormSol;
