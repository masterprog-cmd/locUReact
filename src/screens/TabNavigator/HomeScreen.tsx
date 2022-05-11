import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { AuthContext } from '../../context/Context';

import { location } from '../../helper/MobileAccess';
import { mapStyle } from '../../helper/mapStyle';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import { _controlLocation } from '../../helper/Permisos';

export const HomeScreen = ({ navigation }: any) => {
    //Inicializamos latitude y longitude a 0 por si hay un fallo que nos muestre donde sea.
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    //Obtenemos el context para utilizar la información del usuario
    const { context } = useContext(AuthContext);
    const origin = { latitude, longitude };
    const destination = { latitude: 37.771707, longitude: -122.4053769 };
    const GOOGLE_MAPS_APIKEY = 'AIzaSyAAfgLL5rdc8kvEzSAzUXV1AH7pX-rt_zw';

    useEffect(() => {
        //Preguntamos si tenemos permisos para obtener la localización
        _controlLocation({ navigation });
        //Obtenemos la localización del usuario y la añadimos a los useState (arriba declarados) para mostrarla en el mapa
        location()
            .then(res => {
                setLatitude(res.latitude);
                setLongitude(res.longitude);
            })
            .catch(err => {
                console.error(err);
            })
    }, [])


    return (
        <>
            {/* Hacemos un condicional que comprueve si latitude y longitude es diferente de 0. Esto sirve para esperar a que la llamada anterior(location()) 
        nos devuelva los valores que necesitamos. Mientras este proceso se ejecuta, mostramos la pantalla cargando, en el momento que tenemos los 
        datos, cargamos el mapa con nuestra localización */}
            {latitude !== 0 && longitude !== 0 ?
                <View style={styles.container}>
                    <View style={{ height: 50 }}>
                        <GooglePlacesAutocomplete
                            placeholder='Search'
                            minLength={2} // minimum length of text to search
                            fetchDetails={true}
                            enableHighAccuracyLocation={true}
                            onPress={(data, details = null) => {
                                // 'details' is provided when fetchDetails = true
                                console.log(data, details);
                            }}
                            styles={{
                                textInput: { height: 50, backgroundColor: '#eee', marginVertical: 5 }
                            }}
                            keyboardShouldPersistTaps="always"
                            query={{
                                key: GOOGLE_MAPS_APIKEY,
                                language: 'es',
                            }}
                        />
                    </View>
                    <MapView
                        customMapStyle={mapStyle}
                        showsUserLocation={true}
                        followsUserLocation={true}
                        provider={PROVIDER_GOOGLE}
                        style={styles.mapStyle}
                        focusable={true}

                        initialRegion={{
                            latitude,
                            longitude,
                            latitudeDelta: 0.00422,
                            longitudeDelta: 0.000121,
                        }}
                        mapType="standard"
                        userLocationPriority='high'
                        userLocationUpdateInterval={5000}
                        showsMyLocationButton={true}
                        showsCompass={true}

                    >
                        <MapViewDirections
                            origin={origin}
                            destination={destination}
                            apikey={GOOGLE_MAPS_APIKEY}
                        />
                    </MapView>
                </View>
                :
                <View style={{ backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'black', fontSize: 20, marginBottom: 20 }}>Bienvenido {context.user?.displayName}</Text>
                    <ActivityIndicator size={'large'} color="black" style={{ backgroundColor: 'white' }} />
                    <Text>Cargando...</Text>
                </View>
            }
        </>
    )
}
//Estilo del mapa
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        // backgroundColor: 'black',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

