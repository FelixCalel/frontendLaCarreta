import React, { useState, useEffect, useReducer } from 'react'; // Importa React y algunos hooks.
import { Box, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Heading, Button } from '@chakra-ui/react'; // Importa componentes de Chakra UI.
import InfoSolicitante from './InfoSolicitante'; // Importa el componente InfoSolicitante.
import InfoProveedor from './InfoProveedor'; // Importa el componente InfoProveedor.
import InfoPago from './InfoPago'; // Importa el componente InfoPago.
import InfoCredito from './InfoCredito'; // Importa el componente InfoCredito.
import Documentacion from './Documentacion'; // Importa el componente Documentacion.

// Estado inicial del formulario.
const initialState = {
  formData: { // Datos del formulario.
    nombreSolicitante: '',
    empresaSolicitante: '',
    fechaSolicitud: '',
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
    cotizacionFactura: null,
    // Campos adicionales para registro.
    usuarioCreador: '',
    fechaEnvio: '',
  },
  tabIndex: 0, // Índice de la pestaña activa.
  errors: {}, // Errores del formulario.
  documentos: [], // Documentos cargados.
  selectedTipoDocumento: '', // Tipo de documento seleccionado.
  isLoading: false, // Indicador de carga.
};

// Función reductora para manejar el estado.
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FORM_DATA': // Actualiza los datos del formulario.
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'SET_TAB_INDEX': // Actualiza el índice de la pestaña.
      return { ...state, tabIndex: action.payload };
    case 'SET_ERRORS': // Actualiza los errores del formulario.
      return { ...state, errors: { ...state.errors, ...action.payload } };
    case 'ADD_DOCUMENTO': // Agrega un documento a la lista.
      return { ...state, documentos: [...state.documentos, action.payload] };
    case 'SET_ARCHIVO': // Actualiza la propiedad archivo en formData.
      return { ...state, formData: { ...state.formData, archivo: action.payload } };
    case 'DELETE_DOCUMENTO': // Elimina un documento de la lista y actualiza los números.
      const documentosActualizados = state.documentos.filter(doc => doc.numero !== action.payload)
        .map((doc, index) => ({ ...doc, numero: index + 1 }));
      return { ...state, documentos: documentosActualizados };
    case 'SET_LOADING': // Actualiza el estado de carga.
      return { ...state, isLoading: action.payload };
    case 'SET_SELECTED_TIPO_DOCUMENTO': // Actualiza el tipo de documento seleccionado.
      return { ...state, selectedTipoDocumento: action.payload };
    default:
      return state;
  }
};

// Componente principal.
export const PageFormSol = ({ user }) => {
  const [state, dispatch] = useReducer(reducer, initialState); // Utiliza useReducer para manejar el estado del componente.

  // useEffect para inicializar la fecha de solicitud y el usuario creador.
  useEffect(() => {
    const currentDate = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Guatemala'
    }).split('/').join('/');
    dispatch({ type: 'SET_FORM_DATA', payload: { fechaSolicitud: currentDate, usuarioCreador: user?.name || 'Anónimo' } });
  }, [user]);

  // Maneja el cambio en los campos de entrada del formulario.
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    dispatch({ type: 'SET_FORM_DATA', payload: { [id]: value } });
    dispatch({ type: 'SET_ERRORS', payload: { [id]: !value.trim() } });
  };

  // Maneja el cambio en los campos de archivo.
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Actualiza el estado con la información del archivo.
        dispatch({
          type: 'SET_ARCHIVO',
          payload: {
            nombre: file.name,
            tipo: file.type,
            tamaño: file.size,
            contenido: reader.result
          }
        });
        // Añade el archivo a la lista de documentos.
        dispatch({ type: 'ADD_DOCUMENTO', payload: { numero: state.documentos.length + 1, tipo: state.selectedTipoDocumento, nombre: file.name } });
      };
      reader.readAsDataURL(file); // Lee el contenido del archivo como una URL de datos (base64).
    }
  };

  // Maneja la eliminación de un documento.
  const handleDeleteDocumento = (numero) => {
    dispatch({ type: 'DELETE_DOCUMENTO', payload: numero });
  };

  // Maneja el avance a la siguiente pestaña.
  const handleNextTab = () => {
    dispatch({ type: 'SET_TAB_INDEX', payload: state.tabIndex + 1 });
  };

  //Funcion par elegir proveedor y localidad
  const seleccionarProveedor = (id) => {
    console.log("Seleccione el id de este proveedor: ", id);
    dispatch({ type: 'SET_FORM_DATA', payload: { tipoProveedor: id } });
  }

  //Funcion par elegir proveedor y localidad
  const seleccionarLocalidad = (id) => {
    console.log("Seleccione el id de esta localidad: ", id);
    dispatch({ type: 'SET_FORM_DATA', payload: { localidadProveedor: id } });
  }

  // Maneja el retroceso a la pestaña anterior.
  const handlePreviousTab = () => {
    if (state.tabIndex > 0) {
      dispatch({ type: 'SET_TAB_INDEX', payload: state.tabIndex - 1 });
    }
  };

  // Maneja el envío del formulario.
  const handleSubmit = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    const fechaEnvio = new Date().toLocaleString('es-ES', {
      timeZone: 'America/Guatemala'
    });

    // Añade la fecha y hora de envío a formData.
    const formDataWithTimestamp = {
      ...state.formData,
      fechaEnvio
    };

    // Convierte archivos a base64.
    const documentosBase64 = await Promise.all(state.documentos.map(async (doc) => {
      const file = formDataWithTimestamp[doc.tipo];
      if (file) {
        const base64 = await toBase64(file);
        return { ...doc, base64 };
      }
      return doc;
    }));

    // Excluir el campo archivo del JSON final.
    const { archivo, ...dataToSave } = {
      ...formDataWithTimestamp,
      documentos: documentosBase64
    };

    // Guarda los datos como JSON.
    const dataStr = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);

    dispatch({ type: 'SET_LOADING', payload: false });
  };

  // Convierte un archivo a base64.
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  // Maneja el cambio del tipo de pago.
  const handleTipoPagoChange = (tipo) => {
    dispatch({ type: 'SET_FORM_DATA', payload: { tipoPago: state.formData.tipoPago === tipo ? '' : tipo } });
  };

  // Bancos por país.
  const bancosPorPais = {
    Guatemala: ['Banco G1', 'Banco G2'],
    México: ['Banco M1', 'Banco M2']
  };

  // Monedas por país.
  const monedasPorPais = {
    Guatemala: ['Quetzales'],
    México: ['Pesos']
  };

  return (
    <Flex direction="column" minH="100vh" bg="gray.100">
      <Flex direction="column" flex="1" p={4} width="100%">
        <Box width="100%" mx="auto" borderWidth={1} borderRadius="md" boxShadow="md" bg="white" p={6}>
          <Box bg="#4CAF50" color="white" py={2} px={4} borderRadius="md" mb={6} textAlign="center">
            <Heading size="md">CREACION DE PROVEEDOR</Heading>
          </Box>
          <Tabs index={state.tabIndex} isFitted variant="enclosed" onChange={index => dispatch({ type: 'SET_TAB_INDEX', payload: index })}>
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
                  formData={state.formData}
                  handleInputChange={handleInputChange}
                  handleNextTab={handleNextTab}
                  handlePreviousTab={handlePreviousTab}
                />
              </TabPanel>
              <TabPanel>
                <InfoProveedor
                  formData={state.formData}
                  handleInputChange={handleInputChange}
                  handleNextTab={handleNextTab}
                  handlePreviousTab={handlePreviousTab}
                  seleccionarProveedor={seleccionarProveedor}
                  seleccionarLocalidad={seleccionarLocalidad}
                />
              </TabPanel>
              <TabPanel>
                <InfoPago
                  formData={state.formData}
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
                  formData={state.formData}
                  handleInputChange={handleInputChange}
                  handleNextTab={handleNextTab}
                  handlePreviousTab={handlePreviousTab}
                />
              </TabPanel>
              <TabPanel>
                <Documentacion
                  formData={state.formData}
                  handleFileChange={handleFileChange}
                  documentos={state.documentos}
                  selectedTipoDocumento={state.selectedTipoDocumento}
                  setSelectedTipoDocumento={(tipo) => dispatch({ type: 'SET_SELECTED_TIPO_DOCUMENTO', payload: tipo })}
                  handleDeleteDocumento={handleDeleteDocumento}
                  handlePreviousTab={handlePreviousTab}
                  handleSubmit={handleSubmit}
                  isLoading={state.isLoading}
                  tipoProveedorId={state.formData.tipoProveedor}
                  localidadId={state.formData.localidadProveedor}
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
