import { useState, useEffect } from "react";
import {
  Flex,
  Box,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  registerUser,
  sendSMSCode,
  verifySMSCode,
} from "../../../middleware/api";
import { PhoneIcon } from "@chakra-ui/icons";
import FirstNameField from "./component/FirstNameField";
import LastNameField from "./component/LastNameField";
import PaisSelector from "./component/paisSelector";
import PasswordField from "./component/PasswordField";
import ConfirmPasswordField from "./component/ConfirmPasswordField";
import ContactField from "./component/ContactField";
import ErrorAlerts from "./component/ErrorAlerts";
import SubmitButton from "./component/SubmitButton";

const RegisterForm = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const { data: paises } = useSelector((state) => state.paises);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    contact: "",
    telefono: "",
    paisId: "",
    contrasena: "",
    confirmPassword: "",
  });
  const [verifyCode, setVerifyCode] = useState("");
  const [pendingPhone, setPendingPhone] = useState("");
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (auth === "authenticated") navigate("/home", { replace: true });
  }, [auth, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const v = {};
    if (!formData.nombre.trim()) v.nombre = "El nombre es obligatorio";
    if (!formData.apellido.trim()) v.apellido = "El apellido es obligatorio";
    if (!formData.paisId) v.paisId = "Selecciona un país";
    if (!formData.contrasena) v.contrasena = "La contraseña es obligatoria";
    if (formData.contrasena !== formData.confirmPassword)
      v.confirmPassword = "Las contraseñas no coinciden";

    const emailR = /^\S+@\S+\.\S+$/;
    const phoneR = /^[\d\s()+-]+$/;

    const { contact, telefono, ...rest } = formData;
    let payload;
    let phoneE164 = "";

    if (emailR.test(contact)) {
      if (!phoneR.test(telefono || "")) {
        v.telefono = "Ingresa un teléfono válido";
      }
      payload = {
        ...rest,
        correo: contact.trim(),
        telefono: telefono ? telefono.replace(/\D+/g, "") : null,
      };
    } else if (phoneR.test(contact)) {
      const pais = paises.find((p) => p.id == formData.paisId);
      if (pais?.dialCode) {
        phoneE164 =
          pais.dialCode.replace(/\s/g, "") + contact.replace(/\D+/g, "");
        payload = { ...rest, correo: null, telefono: phoneE164 };
      } else v.paisId = "Selecciona un país con código válido";
    } else {
      v.contact = "Ingresa un correo o teléfono válido";
    }

    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    const res = await registerUser(payload);
    if (!res.ok) {
      setErrors({ general: res.errorMessage });
      return;
    }

    if (phoneE164 && !emailR.test(contact)) {
      const sms = await sendSMSCode(phoneE164);
      if (!sms.ok) {
        setErrors({ general: sms.errorMessage });
        return;
      }
      setPendingPhone(phoneE164);
      onOpen();
      toast({
        title: "Código enviado",
        description: "Revisa tu SMS e ingresa el código",
        status: "info",
        duration: 5000,
      });
    } else {
      toast({
        title: "Usuario creado",
        description: "Revisa tu correo electrónico para activarlo.",
        status: "success",
        duration: 5000,
      });
      setMessage("Usuario creado correctamente.");

      navigate("/auth/login", { replace: true });
    }
  };

  const handleVerifySMS = async () => {
    setLoadingVerify(true);
    const res = await verifySMSCode(pendingPhone, verifyCode.trim());
    setLoadingVerify(false);

    if (res.ok) {
      toast({
        title: "Teléfono verificado",
        description: "¡Cuenta activada con éxito!",
        status: "success",
        duration: 5000,
      });
      onClose();
      setMessage("Usuario creado y verificado correctamente.");

      navigate("/auth/login", { replace: true });
    } else setErrors({ general: res.errorMessage });
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" p={4}>
      <Box
        p={8}
        w={{ base: "100%", md: "450px" }}
        bg="white"
        borderRadius="lg"
        boxShadow="2xl"
      >
        <VStack spacing={4}>
          <Heading color="green.600">Crea tu Cuenta</Heading>
          <Text color="gray.500">Completa el formulario para registrarte</Text>
          <ErrorAlerts errors={errors} />
          <form style={{ width: "100%" }} onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FirstNameField
                value={formData.nombre}
                onChange={handleChange}
                error={errors.nombre}
              />
              <LastNameField
                value={formData.apellido}
                onChange={handleChange}
                error={errors.apellido}
              />
              <PaisSelector
                value={formData.paisId}
                onPaisChange={(paisId) =>
                  setFormData((p) => ({ ...p, paisId }))
                }
                error={errors.paisId}
              />
              <ContactField
                value={formData.contact}
                onChange={handleChange}
                error={errors.contact}
              />

              {isEmail(formData.contact) && (
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <PhoneIcon color="gray.400" />
                  </InputLeftElement>

                  <Input
                    name="telefono"
                    type="text"
                    placeholder="Ingresa tu teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    focusBorderColor="green.500"
                    borderRadius="md"
                    size="lg"
                  />
                </InputGroup>
              )}

              <PasswordField
                label="Contraseña"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                error={errors.contrasena}
              />
              <ConfirmPasswordField
                label="Confirmar contraseña"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
              <SubmitButton>Registrar</SubmitButton>
            </VStack>
          </form>

          {message && (
            <Text color="green.600" fontWeight="bold">
              {message}
            </Text>
          )}

          <Link color="green.600" href="/auth/login">
            Volver al inicio de sesión
          </Link>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verificar teléfono</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={3}>
              Hemos enviado un SMS al <b>{pendingPhone}</b>. Ingresa el código
              de 6 dígitos para activar tu cuenta.
            </Text>
            <Input
              placeholder="Código SMS"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              maxLength={6}
              focusBorderColor="green.500"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={handleVerifySMS}
              isLoading={loadingVerify}
            >
              Verificar
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default RegisterForm;
