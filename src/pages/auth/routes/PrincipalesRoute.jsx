import React from 'react'
import { Route } from 'react-router-dom'
import Dashboard from '../../Dashboard'
import Create from '../../Create'
import { Notificaciones } from '../../../components/Notificaciones'
import { PageEmpresa } from '../../PageEmpresa'
import { PageUsuarios } from '../../PageUsuarios'
import { PageRoles } from '../../PageRoles'
import { PagePerfil } from '../../PagePerfil'
import { PageOrdenes } from '../../PageOrdenes'
import { PageFacturas } from '../../PageFacturas'
import { PageConciliaciones } from '../../PageConciliaciones'
import { RootLayout } from '../../layouts/RootLayout'

export const PrincipalesRoute = () => {
  return (
    <>
         <Route path='/' element={<RootLayout />} />
        <Route index element={<Dashboard />} />
        <Route path="create" element={<Create />} />
        <Route path="notificaciones" element={<Notificaciones />} />
        <Route path="empresas" element={<PageEmpresa />} />
        <Route path="usuarios" element={<PageUsuarios />} />
        <Route path="roles" element={<PageRoles />} />
        <Route path="perfil" element={<PagePerfil />} />
        <Route path="ordenes" element={<PageOrdenes />} />
        <Route path="facturas" element={<PageFacturas />} />
        <Route path="conciliaciones" element={<PageConciliaciones />} />
    </>
  )
}
