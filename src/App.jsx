
import { useEffect, useState } from "react";
import { AuthProvider } from "./pages/auth/context/AuthProvider";
import { AppRouter } from "./router/AppRouter";
import { store } from './store/store'
import { Provider, useSelector } from 'react-redux'


export function App() {


  
  return (
  
      <Provider store={store} >
      {/* <AuthProvider> */}
        
         <AppRouter  />
      {/* </AuthProvider> */}
      </Provider>
    
  );
}
