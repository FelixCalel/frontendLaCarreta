import { Permisos } from "../components/Usuarios/Permisos"
import SEO from "../components/SEO"


export const PagePermisos = () => {
  return (
    <>
      <SEO title="Gestión de Permisos" description="Administración de permisos por módulo." />
      <Permisos />
    </>
  )
}
