// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Route } from 'react-router-dom'
import  LoginForm  from '../LoginForm'
import  RegisterForm  from '../RegisterForm'
import  RecuperarClave  from '../RecuperarClave'
import ActivarUsuarioDep from '../ActivarUsuarioDep'
import { PageProveedores } from '../../proveedores/PageProveedores'

export const PrincipalesPublicasRoute = () => {
  return (
         <>
            <Route path='/proveedores' element={<PageProveedores />} />
            <Route path="/registro" element={<LoginForm />} />
            <Route path="/registro" element={<RegisterForm />} />
            <Route path="/recuperar_clave" element={<RecuperarClave />} />
            <Route path="/activar_usuario_hijo" element={<ActivarUsuarioDep />} />
            
        </> 
  )
}
