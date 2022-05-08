import { Linking, PermissionsAndroid, Platform } from "react-native";

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
                    } else if (res['android.permission.ACCESS_BACKGROUND_LOCATION']
                        && res['android.permission.ACCESS_COARSE_LOCATION']
                        && res['android.permission.ACCESS_FINE_LOCATION'] === 'never_ask_again') {
                        if (Platform.OS === 'ios') {
                            navigation.navigate(Linking.openURL('app-settings:'));
                        } else {
                            Linking.sendIntent("android.settings.LOCATION_SOURCE_SETTINGS");
                        }
                    }
                });
        }

    } catch (error) {
        console.log(error)
    }
}