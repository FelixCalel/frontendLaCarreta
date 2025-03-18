import { extendTheme } from "@chakra-ui/react";
import { colors } from "./coloresPY";

export const theme = extendTheme({
  // 1) Tus colores personalizados
  colors,

  // 2) Configuración de color mode
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },

  // 3) Estilos globales
  styles: {
    global: (props) => ({
      "html, body": {
        height: "100%",
        margin: 0,
        padding: 0,
        backgroundColor:
          props.colorMode === "dark" ? "gray.900" : "gray.50",
        color: props.colorMode === "dark" ? "white" : "gray.800",
      },
      "#root": {
        minHeight: "100%",
      },
    }),
  },

  // 4) Personalizaciones de componentes
  components: {
    Button: {
      variants: {
        solid: (props) => ({
          bg: props.colorMode === "dark" ? "brand.500" : "brand.600",
          color: "white",
          _hover: {
            bg: props.colorMode === "dark" ? "brand.500" : "brand.700",
            color: "black",
          },
        }),
      },
    },
    // ...otros componentes
  },
});
