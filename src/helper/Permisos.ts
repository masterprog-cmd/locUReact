import { Linking, PermissionsAndroid, Platform } from "react-native";

// Permisos para acceder a la ubicación
export const _controlLocation = async ({ navigation }: any) => {
    try {
        if (Platform.OS === 'android') {
            await PermissionsAndroid
                .requestMultiple([
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
                ])
                .then(res => {
                    if (res['android.permission.ACCESS_COARSE_LOCATION']
                        && res['android.permission.ACCESS_FINE_LOCATION']
                        && res['android.permission.ACCESS_BACKGROUND_LOCATION'] === 'denied') {
                        _controlLocation({ navigation });
                        Linking.openSettings();
                    } else if (res['android.permission.ACCESS_BACKGROUND_LOCATION']
                        && res['android.permission.ACCESS_COARSE_LOCATION']
                        && res['android.permission.ACCESS_FINE_LOCATION'] === 'never_ask_again') {
                        if (Platform.OS === 'ios') {
                            navigation.navigate(Linking.openURL('app-settings:'));
                        } else {
                            Linking.openSettings();
                        }
                    }
                    return res;
                });
        }

    } catch (error) {
        console.log(error)
    }
}

//Permisos para acceder a la galería y a la cámara
export const _controlGallCam = async ({ navigation }: any) => {
    try {
        if (Platform.OS === 'android') {
            await PermissionsAndroid
                .requestMultiple([
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                ])
                .then(res => {
                    if (res['android.permission.CAMERA']
                        && res['android.permission.READ_EXTERNAL_STORAGE']
                        && res['android.permission.WRITE_EXTERNAL_STORAGE'] === 'denied') {
                        _controlGallCam({ navigation });
                    } else if (res['android.permission.CAMERA']
                        && res['android.permission.READ_EXTERNAL_STORAGE']
                        && res['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again') {
                        if (Platform.OS === 'ios') {
                            navigation.navigate(Linking.openURL('app-settings:'));
                        } else {
                            Linking.openSettings();
                        }
                    }
                });
        }
    } catch (error) {
        console.log(error)
    }
}