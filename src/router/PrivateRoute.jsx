

import { Navigate } from 'react-router-dom'

import { useSelector } from 'react-redux';




// eslint-disable-next-line react/prop-types
export const PrivateRoute = ({ children }) => {

    const actualUsuario = useSelector( state => state.auth)

    return ( actualUsuario.status === 'authenticated')
        ? children
        : <Navigate to="/auth/login" replace />    
  
 }
 

