import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Flex, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login as loginAuth } from "../../store/auth/authSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../middleware/firebase-config";
import { fetchCurrentUser } from "../../store/auth/thunks";
import { BrandingPanel } from "../../components/auth/BrandingPanel";
import { LoginFormFields } from "../../components/auth/LoginFormFields";
import { AnimatedBackground } from "../../components/auth/AnimatedBackground";

const BASE_URL = import.meta.env.VITE_API_URL;

export const LoginForm = () => {
  const actualUsuario = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (actualUsuario?.status === "authenticated") {
      navigate("/auth/home", { replace: true });
    }
  }, [actualUsuario, navigate]);

  const handleSubmit = async ({ correo, contrasena }) => {
    setError("");
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        correo,
        contrasena
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError(
          "El correo electrónico no está verificado. Por favor, verifica tu correo antes de iniciar sesión."
        );
        setIsLoading(false);
        return;
      }

      let token = await user.getIdToken(true);
      const resp = await axios.post(`${BASE_URL}/usuarios/datos`, {
        correo: user.email,
      });

      if (resp.data && resp.data.usuario) {
        const {
          nombre,
          correo: correoUsuario,
          id: usuarioId,
          paisId,
          roleId,
          estaActivo,
        } = resp.data.usuario;

        if (!estaActivo) {
          setError("Tu usuario está inactivo. No tienes acceso al sistema.");
          setIsLoading(false);
          return;
        }

        console.log("Enviando token de Firebase para intercambio:", token);
        try {
          const doExchange = async (idToken) => {
            let access_token = null;
            let refresh_token = null;
            try {
              const tokenExchangeResp = await axios.post(
                `${BASE_URL}/usuarios/exchange-token`,
                { firebaseToken: idToken }
              );
              access_token = tokenExchangeResp?.data?.access_token ?? null;
              refresh_token = tokenExchangeResp?.data?.refresh_token ?? null;
            } catch (e1) {
              const status = e1?.response?.status;
              if (status === 404 || status === 401 || status === 405) {
                const fbResp = await axios.post(`${BASE_URL}/login/firebase`, {
                  idToken: idToken,
                });
                access_token =
                  fbResp?.data?.accessToken ??
                  fbResp?.data?.access_token ??
                  null;
                refresh_token =
                  fbResp?.data?.refreshToken ??
                  fbResp?.data?.refresh_token ??
                  null;
              } else {
                throw e1;
              }
            }
            return { access_token, refresh_token };
          };

          let { access_token, refresh_token } = await doExchange(token);

          if (!access_token) {
            token = await user.getIdToken(true);
            ({ access_token, refresh_token } = await doExchange(token));
          }

          console.log("JWT del backend recibido:", access_token);

          if (!access_token) {
            throw new Error("No se recibió access_token del backend");
          }

          localStorage.setItem("access_token", access_token);
          if (refresh_token) {
            localStorage.setItem("refresh_token", refresh_token);
          }
          console.log("Token guardado en localStorage:", access_token);
          console.log(
            "Verificación localStorage access_token:",
            localStorage.getItem("access_token")
          );
          localStorage.setItem("nombreUsuario", nombre);
          localStorage.setItem("correoUsuario", correoUsuario);
          localStorage.setItem("usuarioId", usuarioId);
          localStorage.setItem("roleId", roleId);
          localStorage.setItem("paisId", paisId);

          dispatch(
            loginAuth({
              uid: user.uid,
              email: correoUsuario,
              displayName: nombre,
              token: access_token,
              roleId,
              paisId,
              rutas: resp.data.usuario.rutas?.map((r) => r.id) ?? [],
              rutasFull: resp.data.usuario.rutas,
              id: usuarioId,
            })
          );
          await dispatch(fetchCurrentUser());
          navigate("/auth/home", { replace: true });
          window.location.reload();
        } catch (tokenError) {
          console.error("Error al intercambiar token:", tokenError);
          const msg =
            tokenError?.response?.data?.message ||
            tokenError?.response?.data?.error ||
            tokenError?.message ||
            "Error al obtener token de autenticación.";
          setError(msg);
          setIsLoading(false);
          return;
        }
      } else {
        setError("Error al obtener datos del usuario.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Error al iniciar sesión. Verifica tus credenciales.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box position="relative" minH="100vh" w="100vw" overflow="hidden">
      <AnimatedBackground />
      <Stack
        direction={{ base: "column", md: "row" }}
        minH="100vh"
        position="relative"
        zIndex={1}
      >
        <BrandingPanel display={{ base: "none", md: "flex" }} />
        <Flex p={1} flex={1} align="center" justify="center" bg="transparent">
          <LoginFormFields
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </Flex>
      </Stack>
    </Box>
  );
};
