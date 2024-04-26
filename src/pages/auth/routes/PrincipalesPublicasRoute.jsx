import React from 'react'
import { Route } from 'react-router-dom'
import  LoginForm  from '../LoginForm'
import  RegisterForm  from '../RegisterForm'
import  RecuperarClave  from '../RecuperarClave'
import ActivarUsuarioDep from '../ActivarUsuarioDep'

export const PrincipalesPublicasRoute = () => {
  return (
         <>
            <Route path="/registro" element={<LoginForm />} />
            <Route path="/registro" element={<RegisterForm />} />
            <Route path="/recuperar_clave" element={<RecuperarClave />} />
            <Route path="/activar_usuario_hijo" element={<ActivarUsuarioDep />} />
            
        </> 
  )
}
