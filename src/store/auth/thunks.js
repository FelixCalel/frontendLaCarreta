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
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  signInWithEmailAndPassword,
  checkActionCode,
  applyActionCode,
} from "firebase/auth";
import { auth } from "../../middleware/firebase-config";

const BASE_URL = import.meta.env.VITE_API_URL;

const checkingAuthentication = () => {
  return async (dispatch) => {
    dispatch(checkingCredentials());
  };
};
const startSignIn = ({ correo_electronico, password, paisId }) => {
  return async (dispatch) => {
    dispatch(checkingCredentials());

    await singIn({ correo_electronico, password, paisId })
      .then((result) => {
        if (result.ok) {
          const userData = {
            id: result.usuario.id,
            displayName:
              result.usuario.nombres + " " + result.usuario.apellidos,
            email: result.usuario.correo_electronico,
            nombre_empresa: result.usuario.nombre_empresa,
            paisId: result.usuario.paisId,
          };

          localStorage.setItem("userData", JSON.stringify(userData));
          localStorage.setItem("access_token", result.token);
          localStorage.setItem("token", result.token);

          dispatch(login(userData));
        } else {
          localStorage.setItem("isAuthenticated", "false");
          localStorage.setItem("userData", "");
          dispatch(logout(result));
        }
      })
      .catch((error) => {
        const err = error.response;
        dispatch(logout(err));
      });
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

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/login/me`);
      const me = data.user || data;

      if (data.token) {
        localStorage.setItem("access_token", data.token);
        localStorage.setItem("token", data.token);
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

export const startLogin = createAsyncThunk(
  "auth/startLogin",
  async ({ identifier, contrasena }, { dispatch, rejectWithValue }) => {
    try {
      const keyId = identifier.trim().toLowerCase();
      const trustToken =
        localStorage.getItem(`trust_token_${keyId}`) ||
        localStorage.getItem("trust_token");
      const resp = await axios.post(`${BASE_URL}/usuarios/login`, {
        identifier,
        contrasena,
        trustToken,
      });

      if (resp.data.status === "2fa_required") {
        return {
          status: "2fa_required",
          userId: resp.data.userId,
          maskedPhone: resp.data.maskedPhone,
        };
      } else if (resp.data.token && resp.data.usuario) {
        const { token, usuario, firebaseToken, permissions, trustToken } =
          resp.data;

        localStorage.setItem("access_token", token);
        if (resp.data.refreshToken) {
          localStorage.setItem("refresh_token", resp.data.refreshToken);
        }

        if (trustToken) {
          if (usuario.correo)
            localStorage.setItem(
              `trust_token_${usuario.correo.toLowerCase()}`,
              trustToken,
            );
          if (usuario.telefono)
            localStorage.setItem(`trust_token_${usuario.telefono}`, trustToken);
          localStorage.setItem("trust_token", trustToken);
        }

        const userData = {
          id: usuario.id,
          displayName: usuario.nombre + " " + usuario.apellido,
          email: usuario.correo,
          roleId: usuario.roleId,
          paisId: usuario.paisId,
        };
        localStorage.setItem("userData", JSON.stringify(userData));

        localStorage.setItem("usuarioId", usuario.id);
        localStorage.setItem("roleId", usuario.roleId);
        localStorage.setItem("nombreUsuario", userData.displayName);
        if (usuario.correo)
          localStorage.setItem("correoUsuario", usuario.correo);
        localStorage.setItem("isAuthenticated", "true");

        dispatch(
          login({
            uid: usuario.id,
            email: usuario.correo,
            displayName: usuario.nombre,
            token: token,
            roleId: usuario.roleId,
            permissions: permissions,
            roleId: usuario.roleId,
            permissions: permissions,
            user: usuario,
            photoURL: usuario.avatar,
          }),
        );

        return { status: "authenticated" };
      }

      return rejectWithValue("Flujo inesperado.");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      return rejectWithValue(
        err.response?.data?.error || "Error al iniciar sesión.",
      );
    }
  },
);

export const startVerifyLogin = createAsyncThunk(
  "auth/startVerifyLogin",
  async ({ userId, code }, { dispatch, rejectWithValue }) => {
    try {
      const resp = await axios.post(`${BASE_URL}/usuarios/verify-login`, {
        userId,
        code,
      });

      const { token, usuario, firebaseToken, permissions, trustToken } =
        resp.data;

      localStorage.setItem("access_token", token);
      if (resp.data.refreshToken) {
        localStorage.setItem("refresh_token", resp.data.refreshToken);
      }
      if (trustToken) {
        if (usuario.correo)
          localStorage.setItem(
            `trust_token_${usuario.correo.toLowerCase()}`,
            trustToken,
          );
        if (usuario.telefono)
          localStorage.setItem(`trust_token_${usuario.telefono}`, trustToken);
        localStorage.setItem("trust_token", trustToken);
      }

      const userData = {
        id: usuario.id,
        displayName: usuario.nombre + " " + usuario.apellido,
        email: usuario.correo,
        roleId: usuario.roleId,
        paisId: usuario.paisId,
      };
      localStorage.setItem("userData", JSON.stringify(userData));

      localStorage.setItem("usuarioId", usuario.id);
      localStorage.setItem("roleId", usuario.roleId);
      localStorage.setItem("nombreUsuario", userData.displayName);
      if (usuario.correo) localStorage.setItem("correoUsuario", usuario.correo);
      localStorage.setItem("isAuthenticated", "true");

      dispatch(
        login({
          uid: usuario.id,
          email: usuario.correo,
          displayName: usuario.nombre,
          token: token,
          roleId: usuario.roleId,
          permissions: permissions,
          roleId: usuario.roleId,
          permissions: permissions,
          user: usuario,
          photoURL: usuario.avatar,
        }),
      );

      return { success: true };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Código inválido.");
    }
  },
);

export const verifyEmailCode = createAsyncThunk(
  "auth/verifyEmailCode",
  async (oobCode, { rejectWithValue }) => {
    try {
      const info = await checkActionCode(auth, oobCode);
      const email = info.data.email;

      await applyActionCode(auth, oobCode);

      if (email) {
        try {
          await axios.post(`${BASE_URL}/usuarios/sync-verification`, {
            email,
          });
        } catch (syncError) {
          console.error("Error syncing verification with backend:", syncError);
        }
      }
      return {
        success: true,
        message: "¡Tu correo ha sido verificado exitosamente!",
      };
    } catch (error) {
      console.error("Verification error:", error);
      let errorMessage = "Hubo un error al verificar el correo.";
      if (error.code === "auth/expired-action-code") {
        errorMessage = "El enlace ha expirado. Por favor solicita uno nuevo.";
      } else if (error.code === "auth/invalid-action-code") {
        errorMessage = "El enlace no es válido o ya fue utilizado.";
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
  async ({ token, correo_electronico, clave }, { rejectWithValue }) => {
    try {
      await axios.post(`${BASE_URL}/usuarios/recuperar-clave`, {
        correo: correo_electronico,
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

export const activateUserChild = createAsyncThunk(
  "auth/activateUserChild",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/usuarios/activarUsuarioHijo`,
        userData,
      );
      if (response.status === 201) {
        return {
          success: true,
          message: "Tu cuenta fue activada correctamente.",
        };
      } else {
        return rejectWithValue("No se pudo activar la cuenta.");
      }
    } catch (error) {
      return rejectWithValue(`Hubo un error: ${error.message || error}`);
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
      "authSlice",
      "userData",
    ];
    lsKeys.forEach((k) => localStorage.removeItem(k));
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    dispatch(clearPedidos());
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
