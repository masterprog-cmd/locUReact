import React from 'react'
import Snackbar from 'react-native-snackbar';
import auth from '@react-native-firebase/auth';

import { googleSignIn, loginUser, registerUser } from '../api/api';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { firebase } from '@react-native-firebase/firestore';

interface Props {
    name?: string,
    lastName?: string,
    correo: string,
    pwd: string,
    repeatPwd?: string,
}

//Controlamos el acceso a la aplicación mediante el registro. Si las credenciales llegan vacias o la contraseña no coincide, se muestra un mensaje de error.
//Si no creamos la cuenta y accedemos a la cuenta.
export const RegistrosAccessControl = async (props: Props, { navigation }: any) => {
    if (props.name === '' || props.lastName === '' || props.correo === '' || props.pwd === '' || props.repeatPwd === '') {
        Snackbar.show({
            text: 'Todos los campos son obligatorios',
            backgroundColor: 'red',
            duration: Snackbar.LENGTH_SHORT,
        })
    } else if (props.pwd !== props.repeatPwd) {
        Snackbar.show({
            text: 'Las contraseñas no coinciden',
            backgroundColor: 'red',
            duration: Snackbar.LENGTH_SHORT,
        })
    } else {
        await registerUser(props.correo, props.pwd)
            .then((res) => {
                if (res === null) {
                    Snackbar.show({
                        text: 'Email o contraseña incorrectos',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: 'red'
                    });
                } else if (res !== null) {
                    auth().currentUser?.updateProfile({
                        displayName: `${props.name} ${props.lastName}`,
                    })
                        .then((resp) => {
                            console.log(resp);
                            Snackbar.show({
                                text: 'Bienvenid@!',
                                duration: Snackbar.LENGTH_SHORT,
                                backgroundColor: 'black',
                            });
                            navigation.navigate('Tab navigator');
                        })
                }
            }).
            catch((err) => {
                console.log(err);
            });
    }
}


//Controlamos que las credenciales de login no esten vacias y luego iniciamos sesión si estamos registrados.
export const loginAccessControl = async ({ correo, pwd }: Props, { setContext }: any, { navigation }: any) => {
    if (correo === '' || pwd === '') {
        Snackbar.show({
            text: 'Por favor, rellene todos los campos',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red'
        })
    } else {
        await loginUser(correo, pwd)
            .then((resp) => {
                if (resp !== null) {
                    console.log(resp);

                    Snackbar.show({
                        text: 'Bienvenido!',
                        backgroundColor: 'green',
                        duration: 3000,
                    })
                    setContext({
                        user: resp,
                    });
                    navigation.navigate('Tab navigator');
                } else {
                    console.log(resp);
                    Snackbar.show({
                        text: 'Email o contraseña incorrectos',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: 'red'
                    })
                }
            })
            .catch((err) => {
                console.error(err);
            })
    }
}

//Controlamos el acceso a la aplicación mediante el login con Google.
//Hacemos una llamada al login y devolvemos el resultado (User or null);
export const GoogleAccessControl = async () => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    return googleSignIn();
}
