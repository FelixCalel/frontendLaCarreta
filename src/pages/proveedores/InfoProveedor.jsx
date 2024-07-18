// src/components/InfoProveedor.js

import React, { useEffect, useState } from 'react';
import {
  Box, Button, Input, Select, Flex, Heading, Grid, GridItem
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDropdownOptions, fetchTipoProveedorOptions, fetchLocalidadProveedorOptions, fetchTagsOptions, submitFormData } from '../../store/proveedores/InfoProveedor/thunks';
import { setFormData } from '../../store/proveedores/InfoProveedor/InfoProveedorSlice';
import CustomFormControl from './CustomFormControl';
import TagInput from './TagInput';

const InfoProveedor = ({ handleNextTab }) => {
  const dispatch = useDispatch();
  const dropdownOptions = useSelector((state) => state.infoProveedor.dropdownOptions);
  const tipoProveedorOptions = useSelector((state) => state.infoProveedor.tipoProveedorOptions);
  const localidadProveedorOptions = useSelector((state) => state.infoProveedor.localidadProveedorOptions);
  const tagsOptions = useSelector((state) => state.infoProveedor.tagsOptions);
  const formData = useSelector((state) => state.infoProveedor.formData);
  const status = useSelector((state) => state.infoProveedor.status);
  const error = useSelector((state) => state.infoProveedor.error);

  const [tags, setTags] = useState(
    formData.productosPrincipales.map(tagId => {
      const tag = tagsOptions.find(t => t.value === tagId);
      return tag ? { label: tag.label, value: tag.value } : null;
    }).filter(Boolean)
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDropdownOptions());
      dispatch(fetchTipoProveedorOptions());
      dispatch(fetchLocalidadProveedorOptions());
      dispatch(fetchTagsOptions());
    }
  }, [status, dispatch]);

  useEffect(() => {
    dispatch(setFormData({ productosPrincipales: tags.map(tag => tag.value) }));
  }, [tags, dispatch]);

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
          <CustomFormControl id="razonSocial" label="Razón o Denominacion Social">
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
            {tipoProveedorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
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
            {localidadProveedorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
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
            <TagInput tags={tags} setTags={setTags} availableTags={tagsOptions} />
          </CustomFormControl>
        </GridItem>
      </Grid>
      <Flex justifyContent="flex-end" w="100%" mt={4}>
        <Button colorScheme="teal" onClick={handleSubmit}>Siguiente</Button>
      </Flex>
    </div>
  );
};

export default InfoProveedor;
