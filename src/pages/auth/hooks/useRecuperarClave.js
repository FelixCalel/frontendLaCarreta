import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import {
  sendPasswordResetEmail,
  requestSmsRecovery,
  verifySmsRecovery,
  resetPasswordSms,
} from "../../../store/auth/thunks";

export const useRecuperarClave = () => {
  const [identifier, setIdentifier] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 2 && "OTPCredential" in window) {
      const ac = new AbortController();
      navigator.credentials
        .get({ otp: { transport: ["sms"] }, signal: ac.signal })
        .then((otp) => {
          if (otp) {
            setOtp(otp.code);
            verifyCode(otp.code);
          }
        })
        .catch((err) => console.log("WebOTP Error:", err));
      return () => ac.abort();
    }
  }, [step]);

  const isEmail = (input) => /\S+@\S+\.\S+/.test(input);

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const action = isEmail(identifier) ? sendPasswordResetEmail : requestSmsRecovery;
    
    try {
      const resultAction = await dispatch(action(identifier));
      if (action.fulfilled.match(resultAction)) {
        if (isEmail(identifier)) {
          toast({ title: "Correo enviado", description: resultAction.payload.message, status: "success" });
          navigate("/auth/login");
        } else {
          toast({ title: "Código enviado", status: "success" });
          setStep(2);
        }
      } else {
        throw new Error(resultAction.payload || "Error en la solicitud.");
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (code) => {
    setIsLoading(true);
    try {
      const resultAction = await dispatch(verifySmsRecovery({ telefono: identifier, code }));
      if (verifySmsRecovery.fulfilled.match(resultAction)) {
        setResetToken(resultAction.payload.token);
        setStep(3);
        toast({ title: "Código verificado", status: "success" });
      } else {
        throw new Error(resultAction.payload || "Código inválido.");
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, status: "error" });
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Las contraseñas no coinciden.", status: "error" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Mínimo 6 caracteres.", status: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const resultAction = await dispatch(resetPasswordSms({ token: resetToken, nuevaClave: newPassword }));
      if (resetPasswordSms.fulfilled.match(resultAction)) {
        toast({ title: "Contraseña Restablecida", status: "success" });
        navigate("/auth/login");
      } else {
        throw new Error(resultAction.payload || "Error al cambiar contraseña.");
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    identifier, setIdentifier,
    step, setStep,
    otp, setOtp,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    isLoading,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    handleInitialSubmit,
    handleOtpSubmit: (e) => { e.preventDefault(); if (otp.length === 6) verifyCode(otp); },
    handlePasswordResetSubmit,
    verifyCode
  };
};
