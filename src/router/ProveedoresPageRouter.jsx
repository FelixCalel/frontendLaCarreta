/* eslint-disable react/prop-types */

import { Route, Routes } from "react-router-dom"
import { PageFormSol }  from "../pages/proveedores/PageFormSol"
import { PageLogin } from "../pages/proveedores/PageLogin"
import { PageProveedores } from "../pages/proveedores/PageProveedores";
import Proveedores from "../pages/layouts/Proveedores";

export const ProveedoresPageRouter = ( {children} ) => {
    return (
      <>
      <Routes  >
       <Route path="*" element={<Proveedores />}>
          
          <Route path="login" element={<PageLogin />} />
          <Route path="formSolicitud" element={<PageFormSol />} />
          <Route path="home" element={<PageProveedores />} />
      </ Route>
      <Content>{children}</Content>
      </Routes>    
      </>
    )
  }