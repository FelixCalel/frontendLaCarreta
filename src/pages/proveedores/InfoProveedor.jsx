import React, { useEffect } from 'react';
import {
  Box, Button, Input, Select, Flex, Heading, Textarea, Grid, GridItem
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDropdownOptions, submitFormData } from '../../store/proveedores/InfoProveedor/thunks'; // Verifica esta ruta
import { setFormData } from '../../store/proveedores/InfoProveedor/InfoProveedorSlice'; // Verifica esta ruta
import CustomFormControl from './CustomFormControl';

const InfoProveedor = ({ handleNextTab }) => {
  const dispatch = useDispatch();
  const dropdownOptions = useSelector((state) => state.infoProveedor.dropdownOptions);
  const formData = useSelector((state) => state.infoProveedor.formData);
  const status = useSelector((state) => state.infoProveedor.status);
  const error = useSelector((state) => state.infoProveedor.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDropdownOptions());
    }
  }, [status, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitFormData(formData));
  };

  return (
    <div>
      <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
        <Heading size="sm">INFORMACIÓN DEL PROVEEDOR</Heading>
      </Box>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <GridItem colSpan={2}>
          <CustomFormControl id="razonSocial" label="Razón social (nombre de la empresa)">
            <Input
              name="razonSocial"
              placeholder="Razón social"
              value={formData.razonSocial}
              onChange={handleInputChange}
            />
          </CustomFormControl>
        </GridItem>
        <CustomFormControl id="paisProveedor" label="País del proveedor">
          <Select
            name="paisProveedor"
            placeholder="Seleccione un país"
            value={formData.paisProveedor}
            onChange={handleInputChange}
          >
            {dropdownOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </CustomFormControl>
        <CustomFormControl id="tipoProveedor" label="Tipo de proveedor">
          <Select
            name="tipoProveedor"
            placeholder="Seleccione el tipo de proveedor"
            value={formData.tipoProveedor}
            onChange={handleInputChange}
          >
            <option value="Caja chica">Caja chica</option>
            <option value="Proveedor">Proveedor</option>
            <option value="Viat">Viat</option>
          </Select>
        </CustomFormControl>
        <CustomFormControl id="nombreContacto" label="Nombre del contacto">
          <Input
            name="nombreContacto"
            placeholder="Nombre del contacto"
            value={formData.nombreContacto}
            onChange={handleInputChange}
          />
        </CustomFormControl>
        <CustomFormControl id="localidadProveedor" label="Localidad del proveedor">
          <Select
            name="localidadProveedor"
            placeholder="Seleccione la localidad del proveedor"
            value={formData.localidadProveedor}
            onChange={handleInputChange}
          >
            <option value="Nacional">Nacional</option>
            <option value="Exterior">Exterior</option>
          </Select>
        </CustomFormControl>
        <CustomFormControl id="correoContacto" label="Correo electrónico">
          <Input
            name="correoContacto"
            placeholder="Correo electrónico"
            value={formData.correoContacto}
            onChange={handleInputChange}
          />
        </CustomFormControl>
        <CustomFormControl id="dpi" label={formData.tipoProveedor === 'Exterior' ? 'Pasaporte' : 'DPI'}>
          <Input
            name="dpi"
            placeholder={formData.tipoProveedor === 'Exterior' ? 'Pasaporte' : 'DPI'}
            value={formData.dpi}
            onChange={handleInputChange}
          />
        </CustomFormControl>
        <CustomFormControl id="telefonoContacto" label="Teléfono de contacto">
          <Input
            name="telefonoContacto"
            placeholder="Teléfono de contacto"
            value={formData.telefonoContacto}
            onChange={handleInputChange}
          />
        </CustomFormControl>
        <CustomFormControl id="nit" label={formData.tipoProveedor === 'Exterior' ? 'RTN' : 'NIT'}>
          <Input
            name="nit"
            placeholder={formData.tipoProveedor === 'Exterior' ? 'RTN' : 'NIT'}
            value={formData.nit}
            onChange={handleInputChange}
          />
        </CustomFormControl>
        <GridItem colSpan={2}>
          <CustomFormControl id="productosPrincipales" label="Productos principales que nos vende">
            <Textarea
              name="productosPrincipales"
              placeholder="Productos principales"
              value={formData.productosPrincipales}
              onChange={handleInputChange}
            />
          </CustomFormControl>
        </GridItem>
      </Grid>
      <Flex justifyContent="flex-end" w="100%" mt={4}>
        <Button colorScheme="teal" onClick={handleNextTab}>Siguiente</Button>
      </Flex>
    </div>
  );
};

export default InfoProveedor;