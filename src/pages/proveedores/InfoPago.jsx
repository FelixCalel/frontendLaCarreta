import React from 'react';
import {
  Box, Button, Input, Select, Flex, Heading, Checkbox, Text, Grid, GridItem } from '@chakra-ui/react';
import CustomFormControl from './CustomFormControl';

export const InfoPago = ({ formData, handleInputChange, handleNextTab, handlePreviousTab, handleTipoPagoChange, bancosPorPais, monedasPorPais }) => (
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
  </div>
);

export default InfoPago;
