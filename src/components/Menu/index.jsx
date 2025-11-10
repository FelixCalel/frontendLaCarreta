import { useBreakpointValue } from "@chakra-ui/react";
import MenuDesktop from "./MenuDesktop";
import MenuMobile from "./MenuMobile";

const MenuPrincipalD = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Renderizar componente móvil o desktop según el breakpoint
  return isMobile ? <MenuMobile /> : <MenuDesktop />;
};

export default MenuPrincipalD;
