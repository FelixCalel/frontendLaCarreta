import axios from "axios"


export const singIn = async ( { correo_electronico, password})=>{
 

   return   await axios.post('http://localhost:3000/usuarios/login', { correo_electronico, password})
                      .then((response) => {
                               
                             // cambio 
                                const { token,usuario} = response.data
                                const displayName = usuario.nombres + ' ' + usuario.apellidos
                                const email = usuario.correo_electronico
                                const {id,nit,nombre_empresa,errorMessage} = response.data.usuario
                          
                                
                                localStorage.setItem('isAuthenticated','true')
                                localStorage.setItem('userData', JSON.stringify({id,nit,email,nombre_empresa,displayName,errorMessage}));
                          
                            //errores
                            return { 
                        
                                ok: true,
                                id: usuario.id,
                                nit: usuario.nit,
                                email,
                                nombre_empresa: usuario.nombre_empresa,
                                displayName: displayName,
                                errorMessage: null
                            }

                      }).catch((error)=>{
                           
                        return { 
                        
                                ok: false,
                                errorMessage: error.response.data.error
                              }

                      })
           

           
    
   
  


}

export const registerUser = async (data) => {
       const username = data.nombres + "." +data.apellidos;
       const telefono = '123456789';
       const celular = '123131313';
       const estado = true;

       const userData = {
        username: username, // Esto es equivalente a username: username
        password: data.contrasenia,
        nombres: data.nombres,
        apellidos: data.apellidos,
        nit: data.nit,
        nombre_empresa: data.nombreProveedorEmpresa,
        correo_electronico: data.correoElectronico,
        telefono,
        celular,
        estado
    };
       


       return  await  axios.post('http://localhost:3000/usuarios/registro',userData)
         .then((response)=>{
             // cambio 
             console.log(response)
             if( response.status === 200 ){
                    const {id,nombres,apellidos,nombre_empresa} = response.data.usuario;
                    //errores
                    return {
                        ok: true,
                        usuario:response.data.usuario
                    }
             }    
         }).catch((error)=>{
            
                    console.log(error);
            return { 
            
                    ok: false,
                    errorMessage: error.response.data
                  }

          })

     
    
}
export const registerUserChildren  = async (data) => {
  console.log("datos",data)
  const username = data.nombres + "." +data.apellidos;
       const telefono = '123456789';
       const celular = '123131313';
       const nit = '8999999'
       const estado = true;
       const nombre_empresa = "no obligatorio"

       const userData = {
        username: username, // Esto es equivalente a username: username
        nombres: data.nombres,
        apellidos: data.apellidos,
        nit,
        nombre_empresa: nombre_empresa,
        correo_electronico: data.correo_electronico,
        telefono,
        celular,
        estado,
        parentId: data.parentId,
        roleId: parseInt(data.roleId)
    };
       

        console.log("userData",userData)
       return  await  axios.post('http://localhost:3000/usuarios/registro_usuario_hijo',userData)
         .then((response)=>{
             // cambio 
             console.log(response)
             if( response.status === 200 ){
                    const {id,nombres,apellidos,nombre_empresa} = response.data.usuario;
                    //errores
                    return {
                        ok: true,
                        usuario:response.data.usuario
                    }
             }    
         }).catch((error)=>{
            
                    console.log(error);
            return { 
            
                    ok: false,
                    errorMessage: error.response.data
                  }

          })

}

export function isAuthenticated() {
    if(localStorage.getItem('isAuthenticated') === 'true'){
        return true
     }
     else{
      return false
     };
}

export const listUsuarios = async(data) => {

    const usuarioData = { id:data.id}
    const userData = JSON.parse(localStorage.getItem('userData'))
    //console.log(userData);
  if(!usuarioData.id){ // si en caso al refrescar la pagina se pierde el id del redux, lo almacenamos
                    // en localstorage para recuperarlo.
     usuarioData.id = parseInt(userData.id)
   }
    return await axios.get(`http://localhost:3000/usuarios/lista/${usuarioData.id}`)
                            .then((response) => {
                                    // console.log(response.data.result)
                              if( response.status === 200 || response.status === 201 ){
                                 const usuarios = response.data
                              
                                 return {
                                        ok: true,
                                        usuarios: usuarios
                                 }
                              }
                            })
                            .catch((error) => {

                              return { 
            
                                ok: false,
                                error: error.response.data
                              }

                            })

}