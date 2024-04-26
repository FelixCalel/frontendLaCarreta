import { Route, Routes } from "react-router-dom"
import { LoginForm } from "../pages/auth/LoginForm"
import RecuperarClave from "../pages/auth/RecuperarClave"
import { RegisterForm } from "../pages/auth/RegisterForm"
import { ConfirmacionRegistro } from "../pages/auth/ConfirmacionRegistro"
import { CambiarClave } from "../pages/auth/CambiarClave"
import { ActivarUsuarioDep } from "../pages/auth"


export const PortalPagePublic = () => {
  return (
    <>
    <Routes>
    <Route path="/*" element={<LoginForm />} /> 
        <Route path="login" element={<LoginForm />} />
        <Route path="registro" element={<RegisterForm />} />
        <Route path="confirmacion_registro" element={<ConfirmacionRegistro />} />
        <Route path="recuperar_clave" element={<RecuperarClave />} /> 
        <Route path="cambiar_clave/:token/:correo_electronico" element={<CambiarClave />} />
        <Route path="activar_usuario_hijo/:token/:correo_electronico/:nombres/:apellidos" element = {<ActivarUsuarioDep />} />
    </Routes>    
    </>
  )
}
