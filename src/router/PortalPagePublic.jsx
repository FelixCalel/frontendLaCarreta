import { Route, Routes, Navigate } from "react-router-dom";
import { LoginForm } from "../pages/auth/LoginForm";
import { RecuperarClave } from "../pages/auth/RecuperarClave";
import { ResetPassword } from "../pages/auth/ResetPassword";
import { VerifyEmail } from "../pages/auth/VerifyEmail";
import RegisterForm from "../pages/auth/Registro/RegisterForm";
import { ConfirmacionRegistro } from "../pages/auth/ConfirmacionRegistro";
import { CambiarClave } from "../pages/auth/CambiarClave";
import { ActivarUsuarioDep } from "../pages/auth";

export const PortalPagePublic = () => (
  <Routes>
    {/* /auth  →  Login */}
    <Route index element={<LoginForm />} />

    {/* alias explícito */}
    <Route path="login" element={<LoginForm />} />
    <Route path="registro" element={<RegisterForm />} />
    <Route path="confirmacion_registro" element={<ConfirmacionRegistro />} />
    <Route path="recuperar_clave" element={<RecuperarClave />} />
    <Route path="reset-password" element={<ResetPassword />} />
    <Route path="verify-email" element={<VerifyEmail />} />
    <Route
      path="cambiar_clave/:token/:correo_electronico"
      element={<CambiarClave />}
    />
    <Route
      path="activar_usuario_hijo/:token/:correo_electronico/:nombres/:apellidos"
      element={<ActivarUsuarioDep />}
    />

    {/* catch-all interno opcional */}
    <Route path="*" element={<Navigate to="login" replace />} />
  </Routes>
);
