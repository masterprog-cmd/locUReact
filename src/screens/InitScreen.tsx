import React, { useContext, useEffect } from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';

import { AuthContext } from '../context/Context';

//Pantalla de carga de la aplicación para comprobar si estamos logueados o no
export const InitScreen = ({ navigation }: any) => {
    //Es una forma de pasar datos a un componente hijo, en este caso, el contexto para guardar los datos del usuario en el momento de autenticarnos
    const { context, setContext } = useContext(AuthContext);

    useEffect(() => {
        //Comprobamos si el usuario está logueado
        auth().onAuthStateChanged((user) => {
            if (user) {
                //Si está logueado, guardamos los datos del usuario en el contexto y navegamos a la pagina principal
                setContext({
                    ...context,
                    user: user,
                });
                navigation.navigate('Tab navigator');
            } else {
                //Si no está logueado, navegamos a la pantalla de login
                navigation.navigate('Login');
            }
        });
    }, []);

    return (
        <View style={{ alignItems: 'center', top: 330 }}>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Text style={{ color: 'black', fontSize: 30, fontWeight: 'bold' }}>Bienvenido a LocU</Text>
                <Icon name='navigate-circle' size={70} color={'black'} style={{ top: 10 }} />
            </View>
        </View >
    )
}
