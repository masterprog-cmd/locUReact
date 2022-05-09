
import GetLocation from "react-native-get-location";
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { updatePhoto } from "../api/api";

//Obtenemos la localización para mostrar la ubicación del usuario en el mapa
export const location = async () =>
    GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
    })
        .then(loc => {
            return {
                'latitude': loc.latitude,
                'longitude': loc.longitude,
            };
        }).catch((error) => {
            console.log(error);
            return null;
        })

//Abrimos tanto la galería como la cámara para cambiar la foto de perfil
const options: ImagePicker.ImageLibraryOptions & ImagePicker.CameraOptions = {
    mediaType: "photo",
    quality: 0.3,
    includeBase64: true,
};

//Abrimos la galeria
export const openGallery = async ({ context, setContext }) => {
    await launchImageLibrary(options, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorMessage);
        } else {
            response.assets?.map(async ({ uri }) => {
                await updatePhoto(uri)
                    .then((resp) => {
                        if (resp !== null) {
                            setContext({
                                ...context,
                                user: {
                                    ...context.user,
                                    photoURL: uri
                                }

                            })
                        } else {
                            console.log('Error al actualizar la foto');
                        }
                    })
            })
        }
    });
}

//Abrimos la cámara
export const openCamera = async () => {
    launchCamera(options, (res) => {
        if (res.didCancel) {
            console.log('User cancelled image picker');
        } else if (res.errorCode) {
            console.log('ImagePicker Error: ', res.errorMessage);
        } else {
            res.assets?.map((base64: any) => {
                updatePhoto(base64.base64);
            })
        }
    });
}