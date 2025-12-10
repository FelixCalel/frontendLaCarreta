import { useBreakpointValue } from "@chakra-ui/react";
import MenuDesktop from "./MenuDesktop";
import MenuMobile from "./MenuMobile";

const MenuPrincipalD = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return isMobile ? <MenuMobile /> : <MenuDesktop />;
};

export default MenuPrincipalD;
