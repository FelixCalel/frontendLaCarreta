
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux';


// eslint-disable-next-line react/prop-types
export const PublicRoute = ({children}) => {
   
const actualUsuario = useSelector( state => state.auth)

return  ( actualUsuario.status === 'registered')
  ? <Navigate to="/auth/confirmacion_registro" replace />
  : ( actualUsuario.status === 'authenticated')
  ? <Navigate to="/auth/home" replace />
  : children  


}
