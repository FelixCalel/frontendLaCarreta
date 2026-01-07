
import { TablaBusuarios } from '../components/Usuarios/TablaBusuarios'
import { BotonAgregar } from '../components/BotonAgregar';
import { CompModal } from '../components/CompModal';
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import SEO from '../components/SEO';




export const PageUsuarios = () => {
  const [isOpen, setIsOpen] = useState(false);
  const usuarioActivo = useSelector(state => state.auth)

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  return (
    <>
    <SEO title="Gestión de Usuarios" description="Administración de usuarios y accesos." />
    <TablaBusuarios />
    <BotonAgregar onOpen={onOpen}  />
    <CompModal isOpen={isOpen} onClose={onClose} />
    </>
   
  )
}
