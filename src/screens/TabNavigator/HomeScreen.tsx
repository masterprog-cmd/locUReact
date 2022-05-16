import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { AuthContext } from '../../context/Context';
import { location } from '../../helper/MobileAccess';
import { mapStyle } from '../../helper/mapStyle';
import { _controlLocation } from '../../helper/Permisos';
import { getPlaces, GOOGLE_MAPS_APIKEY } from '../../api/api';
import { MyMarker } from '../../components/MyMarker';
import MapViewDirections from 'react-native-maps-directions';

export const HomeScreen = ({ navigation }: any) => {
    //Inicializamos latitude y longitude a 0 por si hay un fallo que nos muestre donde sea.
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    //Guardamos los datos de la petición de 
    const [places, setPlaces] = useState([]);
    const [places1, setPlaces1] = useState([]);

    //Obtenemos el context para utilizar la información del usuario
    const { context } = useContext(AuthContext);
    const origin = { latitude, longitude };
    const [coordenates, setCoordenates] = useState({
        latitude: null,
        longitude: null
    });
    const destination = { latitude: coordenates.latitude, longitude: coordenates.longitude };



    useEffect(() => {
        //Preguntamos si tenemos permisos para obtener la localización
        _controlLocation({ navigation });
        //Obtenemos la localización del usuario y la añadimos a los useState (arriba declarados) para mostrarla en el mapa
        location()
            .then(res => {
                const lat = res.latitude;
                const lng = res.longitude;

                setLatitude(lat);
                setLongitude(lng);

                getPlaces(lat, lng, 3500, 'restaurant', GOOGLE_MAPS_APIKEY)
                    .then(resp => {
                        setPlaces(resp.results);

                    })
                    .catch(err => {
                        console.error(err);
                    }
                    );
                getPlaces(lat, lng, 3500, 'night_club', GOOGLE_MAPS_APIKEY)
                    .then(resp => {
                        setPlaces1(resp.results);
                    })
                    .catch(err => {
                        console.error(err);
                    }
                    );
            })
            .catch(err => {
                console.error(err);
            });
    }, [coordenates]);

    //Obtenemos todos los markers referentes a los restaurantes
    const getRestaurantMarkers = (places.length > 0) ?
        (places.map((place: any, key) => {
            return (<MyMarker
                key={key}
                item={place}
                color='red'
                setCoordenates={setCoordenates}
            />)
        })) : (null);

    //Obtenemos todos los markers referentes a los clubs nocturnos
    const getNightClubMarkers = (places1.length > 0) ? places1.map((place1: any, key) => {
        return (<MyMarker
            key={key}
            item={place1}
            color='green'
            setCoordenates={setCoordenates}
        />)
    }) : null

    return (
        <>
            {/* Hacemos un condicional que comprueve si latitude y longitude es diferente de 0. Esto sirve para esperar a que la llamada anterior(location()) 
        nos devuelva los valores que necesitamos. Mientras este proceso se ejecuta, mostramos la pantalla cargando, en el momento que tenemos los 
        datos, cargamos el mapa con nuestra localización */}
            {latitude !== 0 && longitude !== 0 ?
                <View style={styles.container}>
                    <View>
                        <GooglePlacesAutocomplete
                            placeholder='Buscar dirección'
                            minLength={2} // minimum length of text to search
                            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                            GooglePlacesSearchQuery={{
                                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                rankby: 'distance',
                                types: 'restaurant',
                            }}
                            fetchDetails={true}
                            debounce={200}
                            enableHighAccuracyLocation={true}
                            onPress={(data, details) => {
                                // 'details' is provided when fetchDetails = true
                                console.log(data);
                                console.log(details.formatted_address);
                                console.log(details.geometry.location);
                            }}
                            query={{
                                key: GOOGLE_MAPS_APIKEY,
                                language: 'es',
                                types: ['restaurant']
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
                            latitudeDelta: 0.0422,
                            longitudeDelta: 0.0121,
                        }}
                        mapType="satellite"
                        userLocationPriority='high'
                        userLocationUpdateInterval={2000}
                        showsMyLocationButton={true}
                        showsCompass={true}

                    >
                        {(coordenates.latitude !== null && coordenates.longitude !== null) ?

                            <MapViewDirections
                                strokeColor='blue'
                                strokeWidth={3}
                                origin={origin}
                                destination={destination}
                                apikey={GOOGLE_MAPS_APIKEY}
                            />
                            :
                            null
                        }
                        {getRestaurantMarkers}
                        {getNightClubMarkers}
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
        position: 'absolute',
        // backgroundColor: 'black',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});