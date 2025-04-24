import {
  registerUser,
  registerUserChildren,
  singIn,
} from "../../providers/endpoints";
import { checkingCredentials, logout, login, registered } from "./authSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const checkingAuthentication = () => {
  return async (dispatch) => {
    dispatch(checkingCredentials());
  };
};
export const startSignIn = ({ correo_electronico, password }) => {
  return async (dispatch) => {
    dispatch(checkingCredentials());

    await singIn({ correo_electronico, password })
      .then((result) => {
        if (result.ok) {
          const userData = {
            id: result.usuario.id,
            displayName:
              result.usuario.nombres + " " + result.usuario.apellidos,
            email: result.usuario.correo_electronico,
            nombre_empresa: result.usuario.nombre_empresa,
          };

          // Guardamos los datos en localStorage
          localStorage.setItem("userData", JSON.stringify(userData));
          localStorage.setItem("token", result.token); // Guarda el token si es necesario

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

        return ok;
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
      const { data } = await axios.get(`${BASE_URL}/usuarios/todos`);
      const usuarios = data.usuarios || data;

      const stored = JSON.parse(localStorage.getItem("userData")) || {
        id: +localStorage.getItem("usuarioId"),
      };
      const myId = stored.id;
      if (!myId) throw new Error("No hay id de usuario guardado");

      const me = usuarios.find((u) => u.id === myId);
      if (!me) throw new Error("Usuario no encontrado en /usuarios/todos");

      return me;
    } catch (err) {
      return rejectWithValue(err.message || err);
    }
  }
);
