import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/usuarios/registro`, userData);
    return { ok: true, data: response.data };
  } catch (error) {
    return {
      ok: false,
      errorMessage: error.response?.data?.message || error.message || "Error al registrar usuario",
    };
  }
};

export const verifyRegistrationPhone = async (phone, code) => {
  try {
    const response = await axios.post(`${BASE_URL}/sms/verify`, {
      to: phone,
      code,
    });
    if (response.data.valid) {
      return { ok: true };
    } else {
      return { ok: false, errorMessage: response.data.message || "Código inválido" };
    }
  } catch (error) {
    return {
      ok: false,
      errorMessage: error.response?.data?.message || error.message || "Error al verificar código",
    };
  }
};
