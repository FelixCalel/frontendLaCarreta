import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status:'checking',
        uid: null,
        email: null,
        // nombre_empresa: null,
        // nit: null,
        displayName: null,
        photoURL: null,
        errorMessage: null,
    },
    reducers: {
        registered: ( state, { payload } ) => {
            state.status = 'registered', // 'checking', 'not-authenticated', 'authenticated'
            state.uid = payload.id;
            state.email = payload.email;
            state.displayName = payload.displayName;
            state.photoURL = payload.photoURL;
            state.errorMessage = null;
           
        },
        login: ( state, { payload } ) => {
            state.status = 'authenticated', // 'checking', 'not-authenticated', 'authenticated'
            state.uid = payload.id;
            state.email = payload.email;
            state.displayName = payload.displayName;
            state.photoURL = payload.photoURL;
            state.errorMessage = null;
           
        },
   
        logout: ( state, { payload } ) => {

            
            state.status = 'not-authenticated', // 'checking', 'not-authenticated', 'authenticated'
            state.uid = null;
            state.email = null;
            state.displayName = null;
            state.photoURL = null;
            state.errorMessage = payload?.errorMessage;
          
        },
       
        checkingCredentials: (state) => {
                state.status = 'checking'
        }


    }
});

// Action creators are generated for each case reducer function
export const { login, logout, checkingCredentials, registered } = authSlice.actions;