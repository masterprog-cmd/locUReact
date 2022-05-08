
import GetLocation from "react-native-get-location";
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker';

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

export const openGallery = async ({ setPhoto }: any) => {
    launchImageLibrary(options, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorMessage);
        } else {
            console.log(response);
        }
    });
}
