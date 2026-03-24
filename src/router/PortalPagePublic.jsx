import { lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

const LoginForm = lazy(() =>
  import("../pages/auth/LoginForm").then((module) => ({
    default: module.LoginForm,
  })),
);

const RecuperarClave = lazy(() =>
  import("../pages/auth/RecuperarClave").then((module) => ({
    default: module.RecuperarClave,
  })),
);

const ResetPassword = lazy(() =>
  import("../pages/auth/ResetPassword").then((module) => ({
    default: module.ResetPassword,
  })),
);

const VerifyEmail = lazy(() =>
  import("../pages/auth/VerifyEmail").then((module) => ({
    default: module.VerifyEmail,
  })),
);

const RegisterForm = lazy(() => import("../pages/auth/Registro/RegisterForm"));

const ConfirmacionRegistro = lazy(() =>
  import("../pages/auth/ConfirmacionRegistro").then((module) => ({
    default: module.ConfirmacionRegistro,
  })),
);

const CambiarClave = lazy(() =>
  import("../pages/auth/CambiarClave").then((module) => ({
    default: module.CambiarClave,
  })),
);

const ActivarUsuarioDep = lazy(() =>
  import("../pages/auth").then((module) => ({
    default: module.ActivarUsuarioDep,
  })),
);

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
