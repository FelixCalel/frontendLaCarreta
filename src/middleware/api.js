import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

export async function registerUser(payload) {
  try {
    const { data } = await axios.post(`${BASE_URL}/usuarios/registro`, payload);
    return { ok: true, usuario: data.usuario };
  } catch (err) {
    return {
      ok: false,
      errorMessage:
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al registrar el usuario",
    };
  }
}

export async function sendSMSCode(to) {
  try {
    await axios.post(`${BASE_URL}/sms/send`, { to });
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      errorMessage:
        err.response?.data?.message ||
        "No se pudo enviar el SMS (verifica el número o tu cuenta Twilio)",
    };
  }
}

export async function verifySMSCode(to, code) {
  try {
    await axios.post(`${BASE_URL}/sms/verify`, { to, code });
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      errorMessage:
        err.response?.data?.message ||
        "Código incorrecto o expirado. Intenta de nuevo.",
    };
  }
}
