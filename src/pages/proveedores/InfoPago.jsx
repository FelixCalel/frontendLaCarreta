import React, { useEffect } from 'react';
import {
  Box, Button, Input, Select, Flex, Heading, Checkbox, Text, Grid, GridItem
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDropdownOptions, fetchBancoOptions, fetchMonedaOptions, fetchTipoCuentaOptions } from '../../store/proveedores/InfoPago/thunks';
import { setFormData, setTipoPago } from '../../store/proveedores/InfoPago/InfoPagoSlice';
import CustomFormControl from './CustomFormControl';

const InfoPago = ({ handleNextTab, handlePreviousTab }) => {
  const dispatch = useDispatch();
  const dropdownOptions = useSelector((state) => state.infoPago.dropdownOptions);
  const bancoOptions = useSelector((state) => state.infoPago.bancoOptions);
  const monedaOptions = useSelector((state) => state.infoPago.monedaOptions);
  const tipoCuentaOptions = useSelector((state) => state.infoPago.tipoCuentaOptions);
  const formData = useSelector((state) => state.infoPago.formData);
  const status = useSelector((state) => state.infoPago.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDropdownOptions());
      dispatch(fetchTipoCuentaOptions());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (formData.paisBanco) {
      dispatch(fetchBancoOptions(formData.paisBanco));
      dispatch(fetchMonedaOptions(formData.paisBanco));
    }
  }, [formData.paisBanco, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ [name]: value }));
  };

  const handleTipoPagoChange = (tipoPago) => {
    dispatch(setTipoPago(tipoPago));
  };

  const selectedBancos = formData.paisBanco === 'Guatemala' ? [
    { value: 1, label: 'Banco Industrial' },
    { value: 2, label: 'Banrural' },
  ] : bancoOptions;

  const selectedMonedas = formData.paisBanco === 'Guatemala' ? [
    { value: 1, label: 'Quetzales' }
  ] : monedaOptions;

  return (
    <div>
      <Box borderWidth={1} borderRadius="md" p={4} mb={4}>
        <Heading size="sm" mb={6}>INFORMACIÓN DE PAGO</Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <GridItem colSpan={3}>
            <Flex alignItems="center">
              <Text fontWeight="bold" mr={4}>Tipo de pago:</Text>
              <Checkbox
                isChecked={formData.tipoPago === 'Transferencia'}
                onChange={() => handleTipoPagoChange('Transferencia')}
                mr={6}
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
          {formData.tipoPago !== 'Cheque' && (
            <>
              <GridItem colSpan={1}>
                <CustomFormControl id="paisBanco" label="País del banco">
                  <Select
                    name="paisBanco"
                    placeholder="Seleccione un país"
                    value={formData.paisBanco || ''}
                    onChange={handleInputChange}
                  >
                    {dropdownOptions.map(pais => (
                      <option key={pais.value} value={pais.value}>{pais.label}</option>
                    ))}
                  </Select>
                </CustomFormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <CustomFormControl id="banco" label="Banco">
                  <Select
                    name="banco"
                    placeholder="Seleccione un banco"
                    value={formData.banco || ''}
                    onChange={handleInputChange}
                  >
                    {selectedBancos.map(banco => (
                      <option key={banco.value} value={banco.value}>{banco.label}</option>
                    ))}
                  </Select>
                </CustomFormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <CustomFormControl id="moneda" label="Moneda">
                  <Select
                    name="moneda"
                    placeholder="Seleccione una moneda"
                    value={formData.moneda || ''}
                    onChange={handleInputChange}
                  >
                    {selectedMonedas.map(moneda => (
                      <option key={moneda.value} value={moneda.value}>{moneda.label}</option>
                    ))}
                  </Select>
                </CustomFormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <CustomFormControl id="tipoCuenta" label="Tipo de cuenta">
                  <Select
                    name="tipoCuenta"
                    placeholder="Seleccione un tipo de cuenta"
                    value={formData.tipoCuenta || ''}
                    onChange={handleInputChange}
                  >
                    {tipoCuentaOptions.map(tipoCuenta => (
                      <option key={tipoCuenta.value} value={tipoCuenta.value}>{tipoCuenta.label}</option>
                    ))}
                  </Select>
                </CustomFormControl>
              </GridItem>
              <GridItem colSpan={2}>
                <CustomFormControl id="numeroCuenta" label="Número de cuenta">
                  <Input
                    name="numeroCuenta"
                    placeholder="Número de cuenta"
                    value={formData.numeroCuenta || ''}
                    onChange={handleInputChange}
                  />
                </CustomFormControl>
              </GridItem>
            </>
          )}
          <GridItem colSpan={3}>
            <CustomFormControl id="nombreCheque" label={formData.tipoPago === 'Cheque' ? 'Nombre al que se emite el cheque' : 'Nombre al que se emite la transferencia'}>
              <Input
                name="nombreCheque"
                placeholder={formData.tipoPago === 'Cheque' ? 'Nombre en Cheque' : 'Nombre en Transferencia'}
                value={formData.nombreCheque || ''}
                onChange={handleInputChange}
              />
            </CustomFormControl>
          </GridItem>
        </Grid>
      </Box>
      <Flex justifyContent="space-between" w="100%" mt={4}>
        <Button onClick={handlePreviousTab} colorScheme="teal" size="sm">Anterior</Button>
        <Button colorScheme="teal" onClick={handleNextTab} size="sm">Siguiente</Button>
      </Flex>
    </div>
  );
};

export default InfoPago;
