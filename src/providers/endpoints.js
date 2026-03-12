import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const singIn = async ({ correo_electronico, password }) => {
  return await axios
    .post(`${BASE_URL}/usuarios/login`, { correo_electronico, password })
    .then((response) => {
      // cambio
      const { token, usuario } = response.data;
      const displayName = usuario.nombres + " " + usuario.apellidos;
      const email = usuario.correo_electronico;
      const { id, nit, nombre_empresa, paisId, errorMessage } =
        response.data.usuario;

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem(
        "userData",
        JSON.stringify({
          id,
          nit,
          token,
          email,
          paisId,
          nombre_empresa,
          displayName,
          errorMessage,
        })
      );
      return {
        ok: true,
        id: usuario.id,
        nit: usuario.nit,
        correo: usuario.correo,
        paisId: usuario.paisId,
        roleId: usuario.roleId,
        nombre_empresa: usuario.nombre_empresa,
        displayName: displayName,
        errorMessage: null,
      };
    })
    .catch((error) => {
      return {
        ok: false,
        errorMessage: error.response.data.error,
      };
    });
};

export const registerUser = async (data) => {
  const username = data.nombres + "." + data.apellidos;
  const telefono = "123456789";
  const celular = "123131313";
  const estado = true;

  const userData = {
    username: username,
    password: data.contrasenia,
    nombres: data.nombres,
    apellidos: data.apellidos,
    nit: data.nit,
    nombre_empresa: data.nombreProveedorEmpresa,
    correo_electronico: data.correoElectronico,
    paisId: data.paisId,
    telefono,
    celular,
    estado,
  };

  return await axios
    .post(`${BASE_URL}/usuarios/registro`, userData)
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        const { id, nombres, apellidos, correo, paisId, nombre_empresa } =
          response.data.usuario;
        return {
          ok: true,
          usuario: response.data.usuario,
        };
      }
    })
    .catch((error) => {
      console.log(error);
      return {
        ok: false,
        errorMessage: error.response.data,
      };
    });
};

export const registerUserChildren = async (data) => {
  console.log("datos", data);
  const username = data.nombres + "." + data.apellidos;
  const telefono = "123456789";
  const celular = "123131313";
  const nit = "8999999";
  const estado = true;
  const nombre_empresa = "no obligatorio";

  const userData = {
    username: username,
    nombres: data.nombres,
    apellidos: data.apellidos,
    nit,
    nombre_empresa: nombre_empresa,
    correo_electronico: data.correo_electronico,
    telefono,
    celular,
    estado,
    parentId: data.parentId,
    roleId: parseInt(data.roleId),
    paisId: data.paisId,
  };

  console.log("userData", userData);
  return await axios
    .post(`${BASE_URL}/usuarios/registro_usuario_hijo`, userData)
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        const { id, nombres, apellidos, nombre_empresa } =
          response.data.usuario;
        return {
          ok: true,
          usuario: response.data.usuario,
        };
      }
    })
    .catch((error) => {
      console.log(error);
      return {
        ok: false,
        errorMessage: error.response.data,
      };
    });
};

function isAuthenticated() {
  if (localStorage.getItem("isAuthenticated") === "true") {
    return true;
  } else {
    return false;
  }
}

export const listUsuarios = async (data) => {
  const usuarioData = { id: data.id };
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  
  if (!usuarioData.id) {
    if (userData && userData.id) {
        usuarioData.id = parseInt(userData.id);
    } else {
        console.error("No user ID found in arguments or localStorage");
        return { ok: false, error: "No user ID found" };
    }
  }
  return await axios
    .get(`${BASE_URL}/usuarios/lista/${usuarioData.id}`)
    .then((response) => {
      // console.log(response.data.result)
      if (response.status === 200 || response.status === 201) {
        const data = response.data;
        const usuariosList = Array.isArray(data) ? data : (data.usuarios || []);

        if (typeof data === 'string' && data.trim().startsWith('<')) {
            console.error("Received HTML instead of JSON from listUsuarios");
            return { ok: false, error: "Invalid server response" };
        }

        return {
          ok: true,
          usuarios: usuariosList,
        };
      }
    })
    .catch((error) => {
      return {
        ok: false,
        error: error.response.data,
      };
    });
};
