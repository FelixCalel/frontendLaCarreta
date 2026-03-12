import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const activateUserChild = createAsyncThunk(
  "auth/activateUserChild",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/usuarios/activarUsuarioHijo`,
        userData
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
  }
);

export const useActivarUsuario = () => {
  const url = window.location.href;
  const tokenMatch = url.match(/\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)$/) || [];
  const [, tokenUrl, correoElectronicoUrl, nombresUrl, apellidosUrl] = tokenMatch;

  const [nombres, setNombres] = useState(() => decodeURIComponent(nombresUrl || ""));
  const [apellidos, setApellidos] = useState(() => decodeURIComponent(apellidosUrl || ""));
  const [correo_electronico, setCorreoElectronico] = useState(() => correoElectronicoUrl || "");
  const [celular, setCelular] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    'url("./src/assets/images/fnd_py01.jpg")',
    'url("./src/assets/images/fnd_py02.jpg")',
    'url("./src/assets/images/fnd_py03.jpg")',
    'url("./src/assets/images/fnd_py04.jpg")',
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((idx) => (idx + 1) % images.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombres || !apellidos || !correo_electronico || !telefono || !celular || !nuevaClave || !confirmarClave) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }
    if (nuevaClave !== confirmarClave) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await dispatch(activateUserChild({ nombres, apellidos, correo_electronico, nuevaClave, telefono, celular }));
      if (activateUserChild.fulfilled.match(res)) {
        setMensaje(res.payload.message);
        window.location.href = "/auth/login";
      } else {
        setMensaje(res.payload || "Error al activar usuario.");
      }
    } catch (err) {
      setMensaje("Error inesperado.");
    }
  };

  return {
    nombres, setNombres,
    apellidos, setApellidos,
    correo_electronico, setCorreoElectronico,
    celular, setCelular,
    telefono, setTelefono,
    mensaje, setMensaje,
    nuevaClave, setNuevaClave,
    confirmarClave, setConfirmarClave,
    currentImageIndex, images,
    handleSubmit
  };
};
