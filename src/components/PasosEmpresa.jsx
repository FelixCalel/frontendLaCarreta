import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';

const steps = [
  { title: 'Paso 1', description: 'Llenar Formulario' },
  { title: 'Paso 2', description: 'Completar Papelería' },
  { title: 'Paso 3', description: 'Solicitar alta' },
];

const bancosPorPais = {
  Guatemala: ["Banco Industrial", "Banco Agromercantil", "Banco Rural", "Banco G&T"],
  EEUU: ["Bank of America", "Chase Bank", "Wells Fargo", "Citibank"],
  México: ["Banamex", "BBVA Bancomer", "Banorte", "Santander"],
  // Agrega más países y bancos según sea necesario
};

const paisesOptions = ["Guatemala", "EEUU", "México", "El Salvador", "Honduras", "Costa Rica", "Nicaragua", "Panamá"];

const condicionesDePagoOptions = ["A 20 días", "A 40 días", "A 50 días"];

const tiposDeCuentaOptions = ["Monetaria", "Ahorros"];

const validationSchema = Yup.object({
  nombreEmpresa: Yup.string().required('Requerido'),
  razonSocial: Yup.string().required('Requerido'),
  nit: Yup.string().required('Requerido'),
  nombreRepresentanteLegal: Yup.string().required('Requerido'),
  correoElectronico: Yup.string().email('Correo inválido').required('Requerido'),
  telefono: Yup.string().required('Requerido'),
  condicionesDePago: Yup.string().required('Requerido'),
  paisBanco: Yup.string().required('Requerido'),
  nombreBanco: Yup.string().required('Requerido'),
  tipoCuenta: Yup.string().required('Requerido'),
  cuentaBancaria: Yup.string().required('Requerido'),
});

export const PasosEmpresa = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [paisSeleccionado, setPaisSeleccionado] = useState('');
  const toast = useToast();

  const handleNextStep = (values, actions) => {
    if (activeStep < steps.length - 1) {
      setActiveStep((currentStep) => currentStep + 1);
    } else {
      // Aquí manejarías el envío final del formulario
      console.log(values);
      toast({
        title: "Registro completado.",
        description: "Los datos han sido enviados.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
    actions.setTouched({});
    actions.setSubmitting(false);
  };

  const handlePrevStep = () => {
    setActiveStep((currentStep) => currentStep - 1);
  };

  // Función para manejar la subida de archivos
  const handleSubirArchivo = (evento) => {
    // const archivo = evento.target.files[0];
    // Aquí deberías subir el archivo a tu servidor o almacenamiento en la nube y luego actualizar el estado
    // Por ejemplo, suponiendo que la subida fue exitosa y tienes el nombre y tipo del archivo:
    // setArchivosSubidos([...archivosSubidos, { tipo: "RTU", nombre: archivo.name }]);
    // Mostrar notificación de éxito
    toast({
      title: "Archivo subido.",
      description: "El archivo se ha subido satisfactoriamente.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Formik
      initialValues={{
        nombreEmpresa: '',
        razonSocial: '',
        nit: '',
        nombreRepresentanteLegal: '',
        correoElectronico: '',
        telefono: '',
        condicionesDePago: '',
        paisBanco: '',
        nombreBanco: '',
        tipoCuenta: '',
        cuentaBancaria: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleNextStep}
    >
      {({ setFieldValue, values, errors, touched }) => (
        <Form>
          {activeStep === 0 && (
            <SimpleGrid columns={3} spacing={5}>
              {/* Columna 1 */}
              <FormControl isInvalid={errors.nombreEmpresa && touched.nombreEmpresa}>
                <FormLabel>Nombre de la Empresa</FormLabel>
                <Field as={Input} name="nombreEmpresa" />
                <ErrorMessage name="nombreEmpresa" component={Text} color="red.500" />
              </FormControl>
              <FormControl isInvalid={errors.razonSocial && touched.razonSocial}>
                <FormLabel>Razón Social</FormLabel>
                <Field as={Input} name="razonSocial" />
                <ErrorMessage name="razonSocial" component={Text} color="red.500" />
              </FormControl>
              <FormControl isInvalid={errors.nit && touched.nit}>
                <FormLabel>NIT</FormLabel>
                <Field as={Input} name="nit" />
                <ErrorMessage name="nit" component={Text} color="red.500" />
              </FormControl>
              
              {/* Columna 2 */}
              <FormControl isInvalid={errors.nombreRepresentanteLegal && touched.nombreRepresentanteLegal}>
                <FormLabel>Nombre del Representante Legal</FormLabel>
                <Field as={Input} name="nombreRepresentanteLegal" />
                <ErrorMessage name="nombreRepresentanteLegal" component={Text} color="red.500" />
              </FormControl>
              <FormControl isInvalid={errors.correoElectronico && touched.correoElectronico}>
                <FormLabel>Correo Electrónico</FormLabel>
                <Field as={Input} name="correoElectronico" />
                <ErrorMessage name="correoElectronico" component={Text} color="red.500" />
              </FormControl>
              <FormControl isInvalid={errors.telefono && touched.telefono}>
                <FormLabel>Teléfono</FormLabel>
                <Field as={Input} name="telefono" />
                <ErrorMessage name="telefono" component={Text} color="red.500" />
              </FormControl>
              
              {/* Columna 3 */}
              <FormControl isInvalid={errors.condicionesDePago && touched.condicionesDePago}>
                <FormLabel>Condiciones de Pago</FormLabel>
                <Field as={Select} name="condicionesDePago">
                  {condicionesDePagoOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Field>
                <ErrorMessage name="condicionesDePago" component={Text} color="red.500" />
              </FormControl>
              <FormControl isInvalid={errors.paisBanco && touched.paisBanco}>
                <FormLabel>País del Banco</FormLabel>
                <Field as={Select} name="paisBanco" onChange={(e) => {
                  const { value } = e.target;
                  setPaisSeleccionado(value);
                  setFieldValue("paisBanco", value);
                  setFieldValue("nombreBanco", ''); // Resetea el banco seleccionado al cambiar de país
                }}>
                  <option value="">Seleccione un país</option>
                  {paisesOptions.map(pais => (
                    <option key={pais} value={pais}>{pais}</option>
                  ))}
                </Field>
                <ErrorMessage name="paisBanco" component={Text} color="red.500" />
              </FormControl>
              {paisSeleccionado && (
                <FormControl isInvalid={errors.nombreBanco && touched.nombreBanco}>
                  <FormLabel>Nombre del Banco</FormLabel>
                  <Field as={Select} name="nombreBanco">
                    <option value="">Seleccione un banco</option>
                    {bancosPorPais[paisSeleccionado].map(banco => (
                      <option key={banco} value={banco}>{banco}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="nombreBanco" component={Text} color="red.500" />
                </FormControl>
              )}
              <FormControl isInvalid={errors.tipoCuenta && touched.tipoCuenta}>
                <FormLabel>Tipo de Cuenta</FormLabel>
                <Field as={Select} name="tipoCuenta">
                  {tiposDeCuentaOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Field>
                <ErrorMessage name="tipoCuenta" component={Text} color="red.500" />
              </FormControl>
              <FormControl isInvalid={errors.cuentaBancaria && touched.cuentaBancaria}>
                <FormLabel>Cuenta Bancaria</FormLabel>
                <Field as={Input} name="cuentaBancaria" />
                <ErrorMessage name="cuentaBancaria" component={Text} color="red.500" />
              </FormControl>
            </SimpleGrid>
          )}

          {activeStep === 1 && (
            <div>archivos</div>
          )}
          {/* Aquí puedes agregar contenido específico para otros pasos si es necesario */}
          <Flex mt="8" justifyContent="space-between">
            <Button onClick={handlePrevStep} isDisabled={activeStep === 0}>Anterior</Button>
            <Button type="submit">{activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}</Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
