import { Route, Routes } from "react-router-dom";
import  {PortalRouter}  from "./PortalRouter";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { PortalPagePublic } from "./PortalPagePublic";
import { useDispatch, useSelector } from "react-redux";
import CheckingAuth from "../ui/components/CheckingAuth";
import { useEffect, useMemo } from "react";
import { logout,login, obtenerDatosLogeado } from "../store/auth";
import { isAuthenticated } from "../providers/endpoints";
import { Dashboard } from "../pages";



export const AppRouter = () => {

    const distpach = useDispatch();

    const  status  =  useSelector( (state) => state.auth);
    const isAuthenticating = isAuthenticated();
 
    
    
     useEffect(()=>{
        ( !isAuthenticating === true )
        ?  distpach( logout()  )
        : distpach(login(obtenerDatosLogeado()) )
     
     },[])

    if ( status.status === 'checking'){
        return <CheckingAuth />
    }
return (
    <>
      <Routes >
      <Route path="*" element={<Routes>
                <Route path="/admin/dashboard" element={<Dashboard />} />
              
            </Routes>} />
        {/* <Route path="/*" element={<Routes path="/admin/dashboard" element={ <Dashboard />} />} />  */}
        <Route path="/auth/*" element={<PublicRoute>
        
            <PortalPagePublic />
            </PublicRoute> } 
        />
        
        <Route path="/admin/*" element={<PrivateRoute>
            
            <PortalRouter />

        </PrivateRoute>} />

        

    </Routes></>
)
}