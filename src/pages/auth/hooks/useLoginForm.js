import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { startLogin, startVerifyLogin } from "../../../store/auth/thunks";

export const useLoginForm = () => {
  const actualUsuario = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [recaptchaStatus, setRecaptchaStatus] = useState("idle");
  const [isLoading, setIsLoading] = useState(false);

  const {
    isOpen: is2FAOpen,
    onOpen: on2FAOpen,
    onClose: on2FAClose,
  } = useDisclosure();
  const [verifyUserId, setVerifyUserId] = useState(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (actualUsuario?.status === "authenticated") {
      navigate("/auth/home", { replace: true });
    }
  }, [actualUsuario, navigate]);

  useEffect(() => {
    if (is2FAOpen && "OTPCredential" in window) {
      const ac = new AbortController();
      navigator.credentials
        .get({ otp: { transport: ["sms"] }, signal: ac.signal })
        .then((otp) => {
          if (otp) {
            setVerifyCode(otp.code);
            setTimeout(() => handleVerifyCode(otp.code), 0);
          }
        })
        .catch((err) => console.log("WebOTP not used", err));
      return () => ac.abort();
    }
  }, [is2FAOpen]);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async ({ correo, contrasena }) => {
    setError("");
    setIsLoading(true);
    setRecaptchaStatus("loading");
    if (!executeRecaptcha) {
      setError("Seguridad no disponible.");
      setIsLoading(false);
      return;
    }

    try {
      const captchaToken = await executeRecaptcha("login");
      setRecaptchaStatus("success");
      const action = await dispatch(startLogin({ identifier: correo, contrasena, captchaToken }));
      if (startLogin.fulfilled.match(action)) {
        if (action.payload.status === "2fa_required") {
          setVerifyUserId(action.payload.userId);
          setMaskedPhone(action.payload.maskedPhone || "");
          on2FAOpen();
        } else navigate("/auth/home", { replace: true });
      } else {
        setError(action.payload || "Error al iniciar sesión");
        setRecaptchaStatus("idle");
      }
    } catch (err) {
      setError("Error inesperado.");
      setRecaptchaStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (codeToVerify) => {
    const code = typeof codeToVerify === "string" ? codeToVerify : verifyCode;
    setIsVerifying(true);
    try {
      const action = await dispatch(startVerifyLogin({ userId: verifyUserId, code }));
      if (startVerifyLogin.fulfilled.match(action)) {
        on2FAClose();
        navigate("/auth/home", { replace: true });
      } else setError(action.payload || "Código incorrecto");
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    error, recaptchaStatus, isLoading,
    is2FAOpen, on2FAClose,
    verifyCode, setVerifyCode, maskedPhone, isVerifying,
    handleSubmit, handleVerifyCode
  };
};
