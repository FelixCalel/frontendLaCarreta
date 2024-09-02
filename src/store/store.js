

import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './auth'
import { usuariosReducer  } from './usuarios/usuariosSlice'
import infoSolicitanteReducer from './proveedores/InfoSolicitante/InfoSolicitanteSlice';
import infoProveedorReducer from './proveedores/InfoProveedor/InfoProveedorSlice';
import infoPagoReducer from './proveedores/InfoPago/InfoPagoSlice';
import infoCreditoReducer from './proveedores/InfoCredito/InfoCreditoSlice';
import documentacionReducer from './proveedores/Documentacion/DocumentacionSlice';
import paisesReducer from './pais/paisSlice';
import empresaReducer from './Empresa/empresaSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    usuarios: usuariosReducer,
    infoSolicitante: infoSolicitanteReducer,
    infoProveedor: infoProveedorReducer,
    infoPago: infoPagoReducer,
    infoCredito: infoCreditoReducer,
    documentacion: documentacionReducer,
    paises: paisesReducer,
    empresas: empresaReducer  
  },
})