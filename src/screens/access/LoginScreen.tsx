import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React, { useContext, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { Divider } from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/Ionicons';

import { AuthContext } from '../../context/Context';
import { GoogleAccessControl, loginAccessControl } from '../../helper/AccessControl';


export const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [iconName, setIconName] = useState('eye');
    const [secureText, setSecureText] = useState(true);
    const { context, setContext } = useContext(AuthContext);


    // Pantalla de inicio de sesión
    return (
        <View style={{ top: 100 }}>
            <View style={{ alignItems: 'center' }}>
                <Icon name='navigate-circle' size={70} color={'black'} style={{ bottom: 10 }} />
                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 30 }}>Inicio de sesión</Text>
            </View>
            {/* Botón de inicio de sesión con Google */}
            <View style={{ alignItems: 'center', marginTop: 50, marginBottom: 20 }}>
                <GoogleSigninButton color={GoogleSigninButton.Color.Light}
                    onPress={() => {
                        GoogleAccessControl()
                            .then((user) => {
                                if (user === null) {
                                    Snackbar.show({
                                        text: 'No tienes acceso a Google',
                                    })
                                } else {
                                    setContext({
                                        ...context,
                                        user: user,
                                    });
                                    console.log(user);
                                    navigation.navigate('Tab navigator');

                                }
                            })
                    }} />
            </View>
            <Divider style={{ backgroundColor: 'black', borderWidth: 0.5, marginTop: 10, width: '90%', alignSelf: 'center' }} />
            {/* Cajón que contiene: textInputs del correo y password, y los botones de inicio sesión o redirigir a la pantalla registros */}
            <View style={{ alignItems: 'center' }}>
                {/* TextInput del correo y de la contraseña en una caja */}
                <View style={{ top: 30, left: 10, }}>
                    <TextInput placeholder='Correo electrónico' value={email} onChangeText={(value) => { setEmail(value) }}
                        style={{ borderRadius: 20, borderColor: 'black', borderWidth: 1, width: 280 }} textAlign='center' />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput placeholder='Contraseña' value={password} secureTextEntry={secureText} onChangeText={(value) => { setPassword(value) }}
                            style={{ borderRadius: 20, borderColor: 'black', borderWidth: 1, width: 280, marginTop: 30 }} textAlign='center' />
                        <TouchableOpacity onPress={() => {
                            return (iconName === 'eye') ? (setIconName('eye-off'), setSecureText(false)) : (setIconName('eye'), setSecureText(true))
                        }} >
                            <Icon name={iconName} size={22} style={{ top: 15, right: 40 }} color='black' />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Botones de inicio de sesión y redirigir a la pantalla registros */}
                <View style={{ marginTop: 90, alignItems: 'center' }}>
                    <TouchableOpacity style={{
                        borderRadius: 30, borderColor: 'black',
                        borderWidth: 1, width: 230,
                        height: 40, alignItems: 'center',
                        justifyContent: 'center', backgroundColor: 'black'
                    }}
                        // Llamada a la API para iniciar sesión
                        onPress={() => {
                            loginAccessControl({ correo: email, pwd: password }, { setContext }, { navigation });
                            setEmail('');
                            setPassword('');
                        }}
                    >
                        <Text style={{ color: 'white' }}>Iniciar sesión!</Text>
                    </TouchableOpacity>
                    <View style={{ top: 30 }}>
                        <Text style={{ color: 'black' }} onPress={() => { navigation.navigate('Registro') }}>
                            No estas registrado? Registrate ya!
                        </Text>
                    </View>
                </View>
            </View>
        </View >
    )
}