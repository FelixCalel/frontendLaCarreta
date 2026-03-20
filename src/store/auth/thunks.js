import {
  registerUser,
  registerUserChildren,
  singIn,
} from "../../providers/endpoints";
import {
  checkingCredentials,
  logout,
  login,
  registered,
  updateUser,
} from "./authSlice";
import { clearPedidos } from "../Pedidos/pedidoSlice";
import { clearModulosState } from "../Modulos/modulosSlice";
import { fetchModulos } from "../RolPermisoUsuario/thunks";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const TRUST_TOKENS_BY_IDENTIFIER_KEY = "trust_tokens_by_identifier";

const loadTrustTokensByIdentifier = () => {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(TRUST_TOKENS_BY_IDENTIFIER_KEY) || "{}",
    );
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_error) {
    return {};
  }
};

const saveTrustTokenForIdentifier = (identifierKey, token) => {
  if (!identifierKey || !token) return;
  const current = loadTrustTokensByIdentifier();
  current[identifierKey] = token;
  localStorage.setItem(TRUST_TOKENS_BY_IDENTIFIER_KEY, JSON.stringify(current));
};

const checkingAuthentication = () => {
  return async (dispatch) => {
    dispatch(checkingCredentials());
  };
};

const startCreatingUser = (
  nombres,
  apellidos,
  empresa,
  nit,
  correo_electronico,
  password,
) => {
  return async (dispatch) => {
    dispatch(checkingCredentials());

    const err = "";
    await registerUser(
      nombres,
      apellidos,
      empresa,
      nit,
      correo_electronico,
      password,
    )
      .then((resp) => {
        console.log(resp);
        if (!resp.ok) {
          const error1 = { ok: resp.ok, errorMessage: resp.errorMessage.error };

          return dispatch(logout(error1));
        }

        console.log(resp);
        const displayName = resp.usuario.nombres + resp.usuario.apellidos;
        const email = resp.usuario.correo_electronico;
        const id = resp.usuario.id;
        const nit = resp.usuario.nit;
        const nombre_empresa = resp.usuario.nombre_empresa;
        const payload = { displayName, email, id, nit, nombre_empresa };

        return dispatch(registered(payload));
      })
      .catch((error) => {
        console.log(error);
        const error1 = { ok: error.ok, errorMessage: error.errorMessage.error };
        return dispatch(logout(error1));
      });
  };
};

export const startCreatingUserChildren = (
  nombres,
  apellidos,
  empresa,
  nit,
  correo_electronico,
  password,
  roleId,
  parentId,
) => {
  return async (dispatch) => {
    const err = "";
    await registerUserChildren(
      nombres,
      apellidos,
      empresa,
      nit,
      correo_electronico,
      password,
      roleId,
      parentId,
    )
      .then((resp) => {
        console.log(resp);
        if (!resp.ok) {
          const error1 = { ok: resp.ok, errorMessage: resp.errorMessage.error };
          return error1;
        }

        console.log(resp);

        return { success: true };
      })
      .catch((error) => {
        console.log(error);
        const error1 = { ok: error.ok, errorMessage: error.errorMessage.error };
        return error1;
      });
  };
};

const obtenerDatosLogeado = () => {
  const data = JSON.parse(localStorage.getItem("userData"));

  if (!data) {
    return null;
  }

  const payload = {
    uid: data.id || null,
    displayName: data.displayName || null,
    email: data.email || null,
    nombre_empresa: data.nombre_empresa || null,
  };

  if (!payload.uid || !payload.email) {
    return null;
  }

  return payload;
};

export const startLogin = createAsyncThunk(
  "auth/startLogin",
  async (
    {
      identifier,
      identifierKey,
      contrasena,
      captchaToken,
      trustToken: requestTrustToken,
    },
    { rejectWithValue, dispatch },
  ) => {
    try {
      dispatch(clearModulosState());

      const resp = await axios.post(`${BASE_URL}/usuarios/login`, {
        identifier,
        contrasena,
        captchaToken,
        trustToken: requestTrustToken,
      });

      if (resp.data.status === "2fa_required") {
        return resp.data;
      }

      // De lo contrario, iniciar sesión normalmente
      const { token, usuario } = resp.data;
      const normalizedCorreo =
        usuario?.correo_electronico ?? usuario?.correo ?? null;
      const normalizedTelefono =
        usuario?.telefono ?? usuario?.telefono_celular ?? null;
      const refreshToken =
        resp.data.refreshToken || resp.data.refresh_token || null;
      const storedTrustToken =
        resp.data.trustToken || resp.data.trust_token || refreshToken || null;
      localStorage.setItem("access_token", token);
      sessionStorage.setItem("access_token", token);
      localStorage.setItem("token", token);
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
        sessionStorage.setItem("refresh_token", refreshToken);
      }
      if (storedTrustToken) {
        localStorage.setItem("trust_token", storedTrustToken);
        sessionStorage.setItem("trust_token", storedTrustToken);
        saveTrustTokenForIdentifier(identifierKey, storedTrustToken);
      }
      localStorage.setItem("usuarioId", usuario.id);
      localStorage.setItem("roleId", usuario.roleId);
      localStorage.setItem(
        "nombreUsuario",
        `${usuario.nombres} ${usuario.apellidos}`,
      );
      if (normalizedCorreo) {
        localStorage.setItem("correoUsuario", normalizedCorreo);
      } else {
        localStorage.removeItem("correoUsuario");
      }
      if (normalizedTelefono) {
        localStorage.setItem("telefonoUsuario", normalizedTelefono);
      } else {
        localStorage.removeItem("telefonoUsuario");
      }
      localStorage.setItem("isAuthenticated", "true");

      const payload = {
        uid: usuario.id,
        correo: normalizedCorreo,
        telefono: normalizedTelefono,
        displayName: `${usuario.nombres} ${usuario.apellidos}`,
        photoURL: usuario.avatar || null,
        token: token,
        paisId: usuario.paisId,
        roleId: usuario.roleId,
        permissions: resp.data.permissions || null,
        rutas: usuario.rutas || [],
      };

      dispatch(login(payload));
      if (usuario?.id) {
        dispatch(fetchModulos(usuario.id));
      }
      return payload;
    } catch (error) {
      console.error("Login thunk error:", error);
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          (Array.isArray(error.response?.data?.errors)
            ? error.response.data.errors.join(", ")
            : "Credenciales incorrectas"),
      );
    }
  },
);

export const startVerifyLogin = createAsyncThunk(
  "auth/startVerifyLogin",
  async ({ userId, code, identifierKey }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(clearModulosState());

      const resp = await axios.post(`${BASE_URL}/usuarios/verify-login`, {
        userId,
        code,
      });

      const { token, usuario } = resp.data;
      const normalizedCorreo =
        usuario?.correo_electronico ?? usuario?.correo ?? null;
      const normalizedTelefono =
        usuario?.telefono ?? usuario?.telefono_celular ?? null;
      const refreshToken =
        resp.data.refreshToken || resp.data.refresh_token || null;
      const trustToken =
        resp.data.trustToken || resp.data.trust_token || refreshToken || null;
      localStorage.setItem("access_token", token);
      sessionStorage.setItem("access_token", token);
      localStorage.setItem("token", token);
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
        sessionStorage.setItem("refresh_token", refreshToken);
      }
      if (trustToken) {
        localStorage.setItem("trust_token", trustToken);
        sessionStorage.setItem("trust_token", trustToken);
        saveTrustTokenForIdentifier(identifierKey, trustToken);
      }
      localStorage.setItem("usuarioId", usuario.id);
      localStorage.setItem("roleId", usuario.roleId);
      localStorage.setItem(
        "nombreUsuario",
        `${usuario.nombres} ${usuario.apellidos}`,
      );
      if (normalizedCorreo) {
        localStorage.setItem("correoUsuario", normalizedCorreo);
      } else {
        localStorage.removeItem("correoUsuario");
      }
      if (normalizedTelefono) {
        localStorage.setItem("telefonoUsuario", normalizedTelefono);
      } else {
        localStorage.removeItem("telefonoUsuario");
      }
      localStorage.setItem("isAuthenticated", "true");

      const payload = {
        uid: usuario.id,
        correo: normalizedCorreo,
        telefono: normalizedTelefono,
        displayName: `${usuario.nombres} ${usuario.apellidos}`,
        photoURL: usuario.avatar || null,
        token: token,
        paisId: usuario.paisId,
        roleId: usuario.roleId,
        permissions: resp.data.permissions || null,
        rutas: usuario.rutas || [],
      };

      dispatch(login(payload));
      if (usuario?.id) {
        dispatch(fetchModulos(usuario.id));
      }
      return payload;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Código inválido",
      );
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/login/me`);
      const me = data.user || data;

      if (data.token) {
        localStorage.setItem("access_token", data.token);
        sessionStorage.setItem("access_token", data.token);
        localStorage.setItem("token", data.token);
      }

      if (data.refreshToken || data.refresh_token) {
        const rt = data.refreshToken || data.refresh_token;
        localStorage.setItem("refresh_token", rt);
        sessionStorage.setItem("refresh_token", rt);
      }

      if (me) {
        localStorage.setItem("usuarioId", me.id);
        localStorage.setItem("roleId", me.roleId);
        if (me.nombre) {
          localStorage.setItem(
            "nombreUsuario",
            `${me.nombre} ${me.apellido || ""}`.trim(),
          );
        }
        if (me.correo) {
          localStorage.setItem("correoUsuario", me.correo);
        } else {
          localStorage.removeItem("correoUsuario");
        }
        if (me.telefono) {
          localStorage.setItem("telefonoUsuario", me.telefono);
        } else {
          localStorage.removeItem("telefonoUsuario");
        }
        if (me.avatar) {
          localStorage.setItem("avatar", me.avatar);
        }
        if (me.paisId) {
          localStorage.setItem("paisId", me.paisId);
        }
        localStorage.setItem("isAuthenticated", "true");
      }

      if (!me) throw new Error("No se pudo obtener la información del usuario");

      return data;
    } catch (err) {
      if (err.response && err.response.status === 401) {
        return rejectWithValue({
          status: 401,
          message: err.response.data?.error || "Sesión expirada o no válida",
        });
      } else if (
        err.message === "Network Error" ||
        err.code === "ERR_NETWORK"
      ) {
        // Silencioso en thunk, manejado en slice
      } else {
        console.error("Error fetching current user:", err);
      }
      return rejectWithValue(err.response?.data?.error || err.message || err);
    }
  },
);

export const verifyEmailCode = createAsyncThunk(
  "auth/verifyEmailCode",
  async (oobCode, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/usuarios/validate-email/${encodeURIComponent(oobCode)}`,
      );

      const email = data?.email || null;
      const syncTrustToken = data?.trustToken || data?.trust_token || null;
      if (syncTrustToken) {
        localStorage.setItem("trust_token", syncTrustToken);
        sessionStorage.setItem("trust_token", syncTrustToken);
        if (email) {
          const identifierKey = String(email).trim().toLowerCase();
          saveTrustTokenForIdentifier(identifierKey, syncTrustToken);
        }
      }
      return {
        success: true,
        message: data?.message || "¡Tu correo ha sido verificado exitosamente!",
      };
    } catch (error) {
      console.error("Verification error:", error);
      let errorMessage = "Hubo un error al verificar el correo.";
      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  },
);

export const sendPasswordResetEmail = createAsyncThunk(
  "auth/sendPasswordResetEmail",
  async (email, { rejectWithValue }) => {
    try {
      await axios.post(`${BASE_URL}/usuarios/recuperar-clave-custom`, {
        email,
      });
      return {
        success: true,
        message: "Correo enviado. Revisa tu bandeja de entrada.",
      };
    } catch (error) {
      let errorMessage = "Hubo un error al enviar el correo.";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No existe una cuenta con este correo electrónico.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "El correo electrónico no es válido.";
      }
      return rejectWithValue(errorMessage);
    }
  },
);

export const resetPasswordWithToken = createAsyncThunk(
  "auth/resetPasswordWithToken",
  async ({ token, clave }, { rejectWithValue }) => {
    try {
      await axios.post(`${BASE_URL}/usuarios/recuperar-clave`, {
        token,
        clave,
      });
      return {
        success: true,
        message: "Tu contraseña ha sido cambiada exitosamente.",
      };
    } catch (error) {
      console.error("Error al enviar la contraseña:", error);
      return rejectWithValue(
        "Hubo un error al cambiar la contraseña. Por favor, inténtalo de nuevo más tarde.",
      );
    }
  },
);

export const startLogout = createAsyncThunk(
  "auth/startLogout",
  async (_, { dispatch }) => {
    const lsKeys = [
      "access_token",
      "refresh_token",
      "usuarioId",
      "roleId",
      "nombreUsuario",
      "correoUsuario",
      "telefonoUsuario",
      "authSlice",
      "userData",
    ];
    lsKeys.forEach((k) => localStorage.removeItem(k));
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    dispatch(clearPedidos());
    dispatch(clearModulosState());
    dispatch(logout());
  },
);
export const startUpdateProfile = createAsyncThunk(
  "auth/startUpdateProfile",
  async ({ usuarioId, userData }, { dispatch, rejectWithValue }) => {
    try {
      await axios.put(`${BASE_URL}/usuarios/${usuarioId}`, userData);

      dispatch(
        updateUser({
          nombre: userData.nombre,
          apellido: userData.apellido,
          telefono: userData.telefono,
          avatar: userData.avatar,
        }),
      );

      return { success: true, message: "Perfil actualizado correctamente." };
    } catch (error) {
      console.error("Error in startUpdateProfile:", error);
      return rejectWithValue(
        error.response?.data?.message || "Error al actualizar el perfil.",
      );
    }
  },
);

export const requestSmsRecovery = createAsyncThunk(
  "auth/requestSmsRecovery",
  async (telefono, { rejectWithValue }) => {
    try {
      const resp = await axios.post(
        `${BASE_URL}/usuarios/recuperar-clave-sms`,
        {
          telefono,
        },
      );
      return resp.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Error al solicitar el código.",
      );
    }
  },
);

export const verifySmsRecovery = createAsyncThunk(
  "auth/verifySmsRecovery",
  async ({ telefono, code }, { rejectWithValue }) => {
    try {
      const resp = await axios.post(
        `${BASE_URL}/usuarios/verificar-clave-sms`,
        {
          telefono,
          code,
        },
      );
      return resp.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Código inválido o expirado.",
      );
    }
  },
);

export const resetPasswordSms = createAsyncThunk(
  "auth/resetPasswordSms",
  async ({ token, nuevaClave }, { rejectWithValue }) => {
    try {
      const resp = await axios.post(`${BASE_URL}/usuarios/cambiar-clave-sms`, {
        token,
        nuevaClave,
      });
      return resp.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Error al restablecer la contraseña.",
      );
    }
  },
);
