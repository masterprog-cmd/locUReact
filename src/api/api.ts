import React from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { firebase } from '@react-native-firebase/firestore';

export const GOOGLE_MAPS_APIKEY = 'AIzaSyAAfgLL5rdc8kvEzSAzUXV1AH7pX-rt_zw';

//Llamada a la API para el inicio de sesión
export const loginUser = async (correo: string, pwd: string) => {
    let messaje: string | any;
    await auth().signInWithEmailAndPassword(correo, pwd)
        .then(async (res) => {
            messaje = res;
        })
        .catch(() => {
            messaje = null;

        })
    return messaje;
}

//Llamada a la API para el registro de usuario
export const registerUser = async (correo: string, pwd: string) => {
    let messaje: string | any;
    await auth().createUserWithEmailAndPassword(correo, pwd)
        .then(async (res) => {
            console.log(res);
            messaje = res;
        })
        .catch(error => {
            console.log(error);
            messaje = null;
        })
    return messaje;
}

//Llamada a la API para el inicio de sesión de Google
export const googleSignIn = async () => {
    GoogleSignin.configure({
        scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
        webClientId: '226037441310-0bikn441ms1d269pem9r1pkg8i7bgrn5.apps.googleusercontent.com',
        // if you want to access Google API on behalf of 
        // the user FROM YOUR app (that is, without	your app asking the user to grant consent), default is false.
        offlineAccess: true,
    });
    let messaje;
    await GoogleSignin.signIn()
        .then(async (user) => {
            messaje = user.idToken;
        });
    const token = auth.GoogleAuthProvider.credential(messaje);
    return auth().signInWithCredential(token);
}

//Llamada a la API para cambiar la foto de perfil
export const updatePhoto = async (photo: string) => {
    const update = {
        photoURL: photo
    }
    await auth().currentUser?.updateProfile(update);
}

//Llamada a la API para eliminar la foto de perfil
export const deletePhoto = async () => {
    const update = {
        photoURL: null
    }
    await auth().currentUser.updateProfile(update);
}

//Lamada a la API para eliminar el usuario
export const deleteUser = async () => {
    await auth().currentUser?.delete();
}

//Llamada a la API para cerrar sesión de Google
export const logoutGoogle = async () => {
    let messaje;
    GoogleSignin.configure({});
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut()
        .then((res) => {
            messaje = res;
        })
        .catch(() => {
            messaje = null;
        })
    return messaje;
}

//Llamada a la API para cerrar sesión
export const logoutUser = async () => {
    let messaje;
    await auth().signOut()
        .then((res) => {
            logoutGoogle();
            messaje = res;
        })
        .catch(() => {
            messaje = null;
        })
    return messaje;
}

//Pasamos como parámetros localización, tipo, radio y key para obtener los locales cercanos a la ubicación del usuario
export const getPlaces = async (latitude: number, longitude: number, radio: number, tipo: string, key: string) => {
    let messaje;
    await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radio}&types=${[tipo]}&key=${key}`)
        .then(res => res.json())
        .then(res => {
            messaje = res;
        }
        )
        .catch(() => {
            messaje = null;
        }
        )
    return messaje;
}

export const getPhoneNumber = async (place_id: string, key: string) => {
    let messaje;
    await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=formatted_phone_number&key=${key}`)
        .then(res => res.json())
        .then(res => {
            messaje = res;
        })
        .catch(() => {
            messaje = null;
        }
        )
    return messaje;
}

//Obtener imagenes del local
export const getImagesPlaces = async (photo_reference: string, key: string) => {
    let messaje;
    await fetch(`https://maps.googleapis.com/maps/api/place/photo
    ?maxwidth=400
    &photo_reference=${photo_reference}
    &key=${key}`)
        .then(res => {
            messaje = res;
        }
        )
        .catch(() => {
            messaje = null;
        }
        )
    return messaje;
}

//Añadir datos del usuario a la base de datos
export const addData = async (name: string, vicinity: string, lat: number, lng: number) => {

    await firebase.firestore().collection('Users').add({
        name: name,
        address: vicinity,
        latitude: lat,
        longitude: lng,
    })
        .then((res) => {
            return res;
        })
}