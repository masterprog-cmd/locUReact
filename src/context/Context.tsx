import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import React, { createContext, useState } from "react";

//Definir que información tendré aqui
export interface AuthState {
    user: FirebaseAuthTypes.User | FirebaseAuthTypes.AuthCredential | null;
}

//Estado inicial 
export const authInitialState: AuthState = {
    user: null,
}

//Crear el contexto
export const AuthContext = createContext({} as any);

//Componente proveedor del estado
export const AuthProvider = ({ children }: any) => {
    const [context, setContext] = useState(authInitialState);
    return (
        <AuthContext.Provider value={
            { context, setContext }
        }>
            {children}
        </AuthContext.Provider>
    )

}