import {
  registerUser,
  registerUserChildren,
  singIn,
} from "../../providers/endpoints";
import { checkingCredentials, logout, login, registered } from "./authSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  signInWithEmailAndPassword,
  checkActionCode,
  applyActionCode,
} from "firebase/auth";
import { auth } from "../../middleware/firebase-config";

const BASE_URL = import.meta.env.VITE_API_URL;

export const checkingAuthentication = () => {
  return async (dispatch) => {
    dispatch(checkingCredentials());
  };
};
export const startSignIn = ({ correo_electronico, password, paisId }) => {
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

          // Guardamos los datos en localStorage
          localStorage.setItem("userData", JSON.stringify(userData));
          // FIX: Save as access_token to match interceptor
          localStorage.setItem("access_token", result.token);
          localStorage.setItem("token", result.token); // Keep for backward compatibility if needed

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

export const startCreatingUser = (
  nombres,
  apellidos,
  empresa,
  nit,
  correo_electronico,
  password
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
      password
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
  parentId
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
      parentId
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

export const obtenerDatosLogeado = () => {
  const data = JSON.parse(localStorage.getItem("userData"));

  // Verificamos si los datos existen
  if (!data) {
    return null; // Retornamos null si no hay datos
  }

  // Validamos que todos los datos esperados estén presentes
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
      // Optimized: Fetch only the current user's profile
      const { data } = await axios.get(`${BASE_URL}/login/me`);

      // The endpoint returns the user object directly or nested, adapt as needed based on API response
      // Assuming /login/me returns the user object directly or in a 'user' property
      const me = data.user || data;

      if (!me) throw new Error("No se pudo obtener la información del usuario");

      return me;
    } catch (err) {
      // Suppress console error for 401 (Unauthorized) and Network Errors
      if (err.response && err.response.status === 401) {
        // console.warn("Session expired or invalid token");
      } else if (
        err.message === "Network Error" ||
        err.code === "ERR_NETWORK"
      ) {
        // console.warn("Backend unavailable");
      } else {
        console.error("Error fetching current user:", err);
      }
      return rejectWithValue(err.message || err);
    }
  }
);

// --- New Thunks for Refactoring ---

export const startLoginWithEmailPassword = createAsyncThunk(
  "auth/startLoginWithEmailPassword",
  async ({ correo, contrasena }, { dispatch, rejectWithValue }) => {
    try {
      // 1. Firebase Login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        correo,
        contrasena
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        return rejectWithValue(
          "El correo electrónico no está verificado. Por favor, verifica tu correo antes de iniciar sesión."
        );
      }

      let token = await user.getIdToken(true);

      // 2. Check User Status in Backend
      const resp = await axios.post(`${BASE_URL}/usuarios/datos`, {
        correo: user.email,
      });

      if (!resp.data || !resp.data.usuario) {
        return rejectWithValue("Error al obtener datos del usuario.");
      }

      const {
        nombre,
        correo: correoUsuario,
        id: usuarioId,
        paisId,
        roleId,
        estaActivo,
        avatar,
      } = resp.data.usuario;

      if (!estaActivo) {
        return rejectWithValue(
          "Tu usuario está inactivo. No tienes acceso al sistema."
        );
      }

      // 3. Exchange Token
      const doExchange = async (idToken) => {
        try {
          const tokenExchangeResp = await axios.post(
            `${BASE_URL}/usuarios/exchange-token`,
            { firebaseToken: idToken }
          );
          return {
            access_token: tokenExchangeResp?.data?.access_token ?? null,
            refresh_token: tokenExchangeResp?.data?.refresh_token ?? null,
            permissions: tokenExchangeResp?.data?.permissions ?? null,
          };
        } catch (e1) {
          const status = e1?.response?.status;
          if (status === 404 || status === 401 || status === 405) {
            const fbResp = await axios.post(`${BASE_URL}/login/firebase`, {
              idToken: idToken,
            });
            return {
              access_token:
                fbResp?.data?.accessToken ?? fbResp?.data?.access_token ?? null,
              refresh_token:
                fbResp?.data?.refreshToken ??
                fbResp?.data?.refresh_token ??
                null,
              permissions: fbResp?.data?.permissions ?? null,
            };
          } else {
            throw e1;
          }
        }
      };

      let { access_token, refresh_token, permissions } = await doExchange(
        token
      );

      if (!access_token) {
        token = await user.getIdToken(true);
        ({ access_token, refresh_token, permissions } = await doExchange(
          token
        ));
      }

      if (!access_token) {
        throw new Error("No se recibió access_token del backend");
      }

      // 4. Save to LocalStorage
      localStorage.setItem("access_token", access_token);
      if (refresh_token) {
        localStorage.setItem("refresh_token", refresh_token);
      }
      localStorage.setItem("nombreUsuario", nombre);
      localStorage.setItem("correoUsuario", correoUsuario);
      localStorage.setItem("usuarioId", usuarioId);
      localStorage.setItem("roleId", roleId);
      localStorage.setItem("paisId", paisId);
      if (avatar) localStorage.setItem("avatar", avatar);

      // 5. Dispatch Login Action
      dispatch(
        login({
          uid: user.uid,
          email: correoUsuario,
          displayName: nombre,
          token: access_token,
          roleId,
          paisId,
          rutas: resp.data.usuario.rutas?.map((r) => r.id) ?? [],
          rutasFull: resp.data.usuario.rutas,
          id: usuarioId,
          permissions,
          photoURL: avatar,
        })
      );

      // 6. Fetch Current User Data
      await dispatch(fetchCurrentUser());

      return { success: true };
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      let msg = "Error al iniciar sesión. Verifica tus credenciales.";

      if (err.code === "auth/user-not-found") {
        msg =
          "Este correo no está registrado en el sistema. Por favor regístrate o crea una cuenta.";
      } else if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password"
      ) {
        try {
          await axios.post(`${BASE_URL}/usuarios/datos`, { correo });
          msg = "Contraseña incorrecta. Por favor verifica e intenta de nuevo.";
        } catch (backendErr) {
          if (backendErr.response && backendErr.response.status === 404) {
            msg =
              "Este correo no está registrado en el sistema. Por favor regístrate o crea una cuenta.";
          } else {
            msg =
              "Correo o contraseña incorrectos. Por favor verifica e intenta de nuevo.";
          }
        }
      } else if (err.code === "auth/invalid-email") {
        msg = "El formato del correo electrónico no es válido.";
      } else if (err.code === "auth/too-many-requests") {
        msg =
          "Demasiados intentos fallidos. Por favor espera unos minutos e intenta de nuevo.";
      } else if (err.code === "auth/network-request-failed") {
        msg = "Error de conexión. Por favor revisa tu internet.";
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.response?.data?.error) {
        msg = err.response.data.error;
      } else if (typeof err === "string") {
        msg = err;
      }

      return rejectWithValue(msg);
    }
  }
);

export const verifyEmailCode = createAsyncThunk(
  "auth/verifyEmailCode",
  async (oobCode, { rejectWithValue }) => {
    try {
      // 1. Obtener el email del código
      const info = await checkActionCode(auth, oobCode);
      const email = info.data.email;

      // 2. Verificar en Firebase
      await applyActionCode(auth, oobCode);

      // 3. Sincronizar con el backend
      if (email) {
        try {
          await axios.post(`${BASE_URL}/usuarios/sync-verification`, {
            email,
          });
        } catch (syncError) {
          console.error(
            "Error syncing verification with backend:",
            syncError
          );
        }
      }
      return { success: true, message: "¡Tu correo ha sido verificado exitosamente!" };
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
  }
);

export const sendPasswordResetEmail = createAsyncThunk(
  "auth/sendPasswordResetEmail",
  async (email, { rejectWithValue }) => {
    try {
      await axios.post(`${BASE_URL}/usuarios/recuperar-clave-custom`, {
        email,
      });
      return { success: true, message: "Correo enviado. Revisa tu bandeja de entrada." };
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
  }
);

export const resetPasswordWithToken = createAsyncThunk(
  "auth/resetPasswordWithToken",
  async ({ token, correo_electronico, clave }, { rejectWithValue }) => {
    try {
      await axios.post(`${BASE_URL}/usuarios/recuperar-clave`, {
        correo_electronico,
        token,
        clave,
      });
      return { success: true, message: "Tu contraseña ha sido cambiada exitosamente." };
    } catch (error) {
      console.error("Error al enviar la contraseña:", error);
      return rejectWithValue("Hubo un error al cambiar la contraseña. Por favor, inténtalo de nuevo más tarde.");
    }
  }
);

export const activateUserChild = createAsyncThunk(
  "auth/activateUserChild",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/usuarios/activarUsuarioHijo`, userData);
      if (response.status === 201) {
        return { success: true, message: "Tu cuenta fue activada correctamente." };
      } else {
        return rejectWithValue("No se pudo activar la cuenta.");
      }
    } catch (error) {
      return rejectWithValue(`Hubo un error: ${error.message || error}`);
    }
  }
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
    dispatch(logout());
  }
);
export const startUpdateProfile = createAsyncThunk(
  "auth/startUpdateProfile",
  async ({ usuarioId, userData }, { dispatch, rejectWithValue }) => {
    try {
      await axios.put(`${BASE_URL}/usuarios/${usuarioId}`, userData);

      // Dispatch update to local state
      dispatch(
        updateUser({
          nombre: userData.nombre,
          apellido: userData.apellido,
          telefono: userData.telefono,
          avatar: userData.avatar,
        })
      );

      return { success: true, message: "Perfil actualizado correctamente." };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error al actualizar el perfil."
      );
    }
  }
);
