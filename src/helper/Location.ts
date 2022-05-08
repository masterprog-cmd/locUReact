
import GetLocation from "react-native-get-location";

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
