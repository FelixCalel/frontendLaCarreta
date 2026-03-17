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
  const [pendingIdentifierKey, setPendingIdentifierKey] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (actualUsuario?.status === "authenticated") {
      navigate("/auth/home", { replace: true });
    }
  }, [actualUsuario, navigate]);

  useEffect(() => {
    if (!is2FAOpen) return;

    const applyOtpCandidate = (value) => {
      const code = String(value || "")
        .replace(/\D/g, "")
        .slice(0, 6);

      if (code.length !== 6) return false;

      setVerifyCode(code);
      setTimeout(() => handleVerifyCode(code), 0);
      return true;
    };

    const ac = new AbortController();

    if ("OTPCredential" in window && navigator.credentials?.get) {
      navigator.credentials
        .get({ otp: { transport: ["sms"] }, signal: ac.signal })
        .then((otp) => {
          if (otp?.code) applyOtpCandidate(otp.code);
        })
        .catch(() => {});
    }

    return () => {
      ac.abort();
    };
  }, [is2FAOpen]);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const normalizeIdentifierKey = (rawIdentifier) => {
    const value = String(rawIdentifier || "").trim();
    if (!value) return "";

    if (value.includes("@")) {
      return `email:${value.toLowerCase()}`;
    }

    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    const localSuffix = digits.length > 8 ? digits.slice(-8) : digits;
    return `phone:${localSuffix}`;
  };

  const getStoredTrustTokenForIdentifier = (identifierKey) => {
    if (!identifierKey) return null;

    try {
      const map = JSON.parse(
        localStorage.getItem("trust_tokens_by_identifier") || "{}",
      );

      if (map && typeof map === "object") {
        if (map[identifierKey]) return map[identifierKey];

        if (identifierKey.startsWith("phone:")) {
          const phoneDigits = identifierKey.replace("phone:", "");
          const fallbackEntry = Object.entries(map).find(([key]) => {
            if (!key.startsWith("phone:")) return false;
            const storedDigits = key.replace("phone:", "");
            return (
              storedDigits === phoneDigits ||
              storedDigits.endsWith(phoneDigits) ||
              phoneDigits.endsWith(storedDigits)
            );
          });

          if (fallbackEntry?.[1]) return fallbackEntry[1];
        }
      }
    } catch (_error) {
      // Si el parse falla, seguimos con fallback.
    }

    return null;
  };

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
      const identifierKey = normalizeIdentifierKey(correo);
      const storedTrustToken =
        getStoredTrustTokenForIdentifier(identifierKey) ||
        localStorage.getItem("trust_token") ||
        sessionStorage.getItem("trust_token") ||
        null;

      setRecaptchaStatus("success");
      const action = await dispatch(
        startLogin({
          identifier: correo,
          identifierKey,
          contrasena,
          captchaToken,
          trustToken: storedTrustToken,
        }),
      );
      if (startLogin.fulfilled.match(action)) {
        if (action.payload.status === "2fa_required") {
          setVerifyUserId(action.payload.userId);
          setPendingIdentifierKey(identifierKey);
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
    if (isVerifying) return;

    const code = String(
      typeof codeToVerify === "string" ? codeToVerify : verifyCode,
    )
      .replace(/\D/g, "")
      .slice(0, 6);

    if (code.length !== 6) {
      return;
    }

    setIsVerifying(true);
    try {
      const action = await dispatch(
        startVerifyLogin({
          userId: verifyUserId,
          code,
          identifierKey: pendingIdentifierKey,
        }),
      );
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
