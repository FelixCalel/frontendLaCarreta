
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux';


export const PublicRoute = ({children}) => {
   
const actualUsuario = useSelector( state => state.auth)

return  ( actualUsuario.status === 'registered')
  ? <Navigate to="/auth/confirmacion_registro" replace />
  : ( actualUsuario.status === 'authenticated')
  ? <Navigate to="/admin/dashboard" replace />
  : children  


}
