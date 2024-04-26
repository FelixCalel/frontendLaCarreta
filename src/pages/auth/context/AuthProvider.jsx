import React, { useReducer } from 'react'
import { AuthContext } from './AuthContext'
import { authReducer } from './AuthReducer'

import { types } from '../types'

const initialState = {
    logged: false,
}
const init = ()=>{
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    logged: !!user,
    user: user,
  }
}

export const AuthProvider = ({ children }) => {
    
  const [authstate, dispatch] = useReducer( authReducer, {}, init)
 
 
  const login = ( nombres = '') => {
    const user = {id: 'ABC', nombres}
    const action = {
      type: types.login,
      payload: {
        id: 'ABC',
        nombres: nombres
      }
    }
    localStorage.setItem('user',JSON.stringify(user));
    dispatch(action)
  }
  const logout = ()=>{
    localStorage.removeItem('user');
    const action = { types: types.logout}
    dispatch(action);
  }

  return (
    <AuthContext.Provider value={{
      ...authstate,
      login,
      logout
    }} >
        { children }
    </AuthContext.Provider>
  )
}


