
import { TablaBusuarios } from '../components/Usuarios/TablaBusuarios'
import { BotonAgregar } from '../components/BotonAgregar';
import { CompModal } from '../components/CompModal';
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';




export const PageUsuarios = () => {
  const [isOpen, setIsOpen] = useState(false);
  const usuarioActivo = useSelector(state => state.auth)

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  return (
    <>
    <TablaBusuarios />
    <BotonAgregar onOpen={onOpen}  />
    <CompModal isOpen={isOpen} onClose={onClose} />
    </>
   
  )
}
