import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin'

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

//Llamada a la API para que nos verifique que hemos iniciado sesión o no (return boolean)   	
export const googleIsSignedIn = async () => {
    let isSigned;
    await GoogleSignin.isSignedIn()
        .then(async (user) => {
            isSigned = user;
        })
        .catch(() => {
            isSigned = false;
        })
    return isSigned;
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
            messaje = res;
        })
        .catch(() => {
            messaje = null;
        })
    return messaje;
}
