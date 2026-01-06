import { Perfil } from "../components/Usuarios/Perfil"
import SEO from "../components/SEO"

export const PagePerfil = () => {
  return (
    <>
      <SEO title="Mi Perfil" description="Configuración de perfil de usuario." />
      <Perfil />
    </>
  )
}
