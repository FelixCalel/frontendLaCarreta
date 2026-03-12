import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast, useDisclosure, useSteps } from "@chakra-ui/react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  registerUser,
  sendSMSCode,
  verifyRegistrationPhone,
} from "../../../../middleware/api";
import { tablaPais } from "../../../../store/pais/thunks";

const steps = [
  { title: "Cuenta", description: "Información personal" },
  { title: "Contacto", description: "Correo y teléfono" },
  { title: "Seguridad", description: "Crea tu contraseña" },
];

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { data: paises } = useSelector((state) => state.paises);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    contact: "",
    telefono: "",
    paisId: "",
    contrasena: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPhone, setPendingPhone] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [recaptchaStatus, setRecaptchaStatus] = useState("idle");

  useEffect(() => {
    dispatch(tablaPais());
    if (auth === "authenticated") navigate("/home", { replace: true });
  }, [auth, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validateStep = () => {
    const e = {};
    if (activeStep === 0) {
      if (!formData.nombre.trim()) e.nombre = "El nombre es obligatorio";
      if (!formData.apellido.trim()) e.apellido = "El apellido es obligatorio";
      if (!formData.paisId) e.paisId = "Selecciona un país";
    } else if (activeStep === 1) {
      const emailRx = /^\S+@\S+\.\S+$/;
      const phoneRx = /^[\d\s()+-]+$/;
      if (!emailRx.test(formData.contact) && !phoneRx.test(formData.contact)) e.contact = "Inválido";
      if (emailRx.test(formData.contact) && !formData.telefono) e.telefono = "Obligatorio";
    } else if (activeStep === 2) {
      if (!formData.contrasena || formData.contrasena.length < 6) e.contrasena = "Mínimo 6 chars";
      if (formData.contrasena !== formData.confirmPassword) e.confirmPassword = "No coinciden";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async () => {
    setIsLoading(true);
    setRecaptchaStatus("loading");
    if (!executeRecaptcha) {
      setErrors({ general: "Seguridad no disponible" });
      setIsLoading(false);
      return;
    }

    const token = await executeRecaptcha("register");
    if (!token) {
      setErrors({ general: "Error de seguridad" });
      setIsLoading(false);
      return;
    }
    setRecaptchaStatus("success");

    const emailRx = /^\S+@\S+\.\S+$/;
    const { contact, telefono, ...rest } = formData;
    const pais = paises.find((p) => p.id == formData.paisId);
    let dial = (pais?.dialCode || "").replace(/\s/g, "");
    if (dial && !dial.startsWith("+")) dial = "+" + dial;

    if (emailRx.test(contact)) {
      const payload = { ...rest, correo: contact.trim().toLowerCase(), telefono: dial ? dial + telefono.replace(/\D+/g, "") : null, captchaToken: token };
      const res = await registerUser(payload);
      setIsLoading(false);
      if (res.ok) {
        toast({ title: "¡Éxito!", status: "success" });
        navigate("/auth/login");
      } else setErrors({ general: res.errorMessage });
    } else if (dial) {
      const phone = dial + contact.replace(/\D+/g, "");
      const res = await registerUser({ ...rest, correo: null, telefono: phone, captchaToken: token });
      if (!res.ok) {
        setErrors({ general: res.errorMessage });
        setIsLoading(false);
        return;
      }
      const smsToken = await executeRecaptcha("register");
      const sms = await sendSMSCode(phone, smsToken);
      setIsLoading(false);
      if (sms.ok) {
        setPendingPhone(phone);
        onOpen();
      } else setErrors({ general: sms.errorMessage });
    }
  };

  const handleVerifySMS = async (code) => {
    setIsLoading(true);
    const res = await verifyRegistrationPhone(pendingPhone, (code || verifyCode).trim());
    setIsLoading(false);
    if (res.ok) {
      toast({ title: "Verificado", status: "success" });
      onClose();
      navigate("/auth/login");
    } else toast({ title: "Error", description: res.errorMessage, status: "error" });
  };

  return {
    navigate, activeStep, goToPrevious, handleNext: () => validateStep() && (activeStep === steps.length - 1 ? handleSubmit() : goToNext()),
    formData, setFormData, handleChange,
    errors, isLoading, recaptchaStatus,
    isOpen, onClose, pendingPhone, verifyCode, setVerifyCode, handleVerifySMS
  };
};
