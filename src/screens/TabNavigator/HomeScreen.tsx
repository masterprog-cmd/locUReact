import React, { useContext, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Button, Dimensions, StyleSheet, Text, View } from 'react-native'
import MapView, { Coordinate, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { AuthContext } from '../../context/Context';
import { location } from '../../helper/MobileAccess';
import { mapStyle } from '../../helper/mapStyle';
import { _controlLocation } from '../../helper/Permisos';
import { getPlaces, GOOGLE_MAPS_APIKEY } from '../../api/api';
import { MyMarker } from '../../components/MyMarker';
import MapViewDirections from 'react-native-maps-directions';
import { FABButton } from '../../components/FABButton';

export const HomeScreen = ({ navigation }: any) => {
    //Obtenemos el context para utilizar la información del usuario
    const { context } = useContext(AuthContext);

    //Inicializamos latitude y longitude a 0 por si hay un fallo que nos muestre donde sea.
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    //Guardamos los datos de la petición de getPlaces donde obtenemos la info necesaria para printar los markers.
    const [places, setPlaces] = useState([]);
    const [places1, setPlaces1] = useState([]);

    const [secPlaces, setSecPlaces] = useState([]);


    //Obtenemos la posición del usuario
    const origin = { latitude, longitude };
    //Obtenemos la posición del destino
    const [coordenates, setCoordenates] = useState({
        latitude: null,
        longitude: null
    });
    const destination = { latitude: coordenates.latitude, longitude: coordenates.longitude };

    //useState para abrir el modal de cancelar ruta
    const [cancelRoute, setCancelRoute] = useState(true);

    //useState para mostrar el tráfico en el mapa
    // const [trafficEnabled, setTrafficEnabled] = useState(false);
    const mapRef = useRef(null);

    //useEffect para obtener la posición del usuario y los markers alrededor de él
    useEffect(() => {
        //Preguntamos si tenemos permisos para obtener la localización
        _controlLocation({ navigation });
        mapRef.current;
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
    const getRestaurantMarkers = (places.length > 0) ? (places.map((place: any, key) => {
        return (<MyMarker
            key={key}
            item={place}
            color={place.icon_background_color}
            setCoordenates={setCoordenates}
            setCancelRoute={setCancelRoute}
        />)
    })) : null;
    const getSecRestaurantMarkers = (secPlaces.length > 0) ? (secPlaces.map((place: any, key) => {
        return (<MyMarker
            key={key}
            item={place}
            color={place.icon_background_color}
            setCoordenates={setCoordenates}
            setCancelRoute={setCancelRoute}
        />)
    })) : null;


    //Obtenemos todos los markers referentes a los clubs nocturnos
    const getNightClubMarkers = (places1.length > 0) ? places1.map((place1: any, key) => {
        return (<MyMarker
            key={key}
            item={place1}
            color={'green'}
            setCoordenates={setCoordenates}
            setCancelRoute={setCancelRoute}
        />)
    }) : null;

    const showRute = () => {
        return ((coordenates.latitude !== null && coordenates.longitude !== null) ?
            (
                < MapViewDirections
                    strokeColor='black'
                    strokeWidth={3}
                    origin={origin}
                    destination={destination}
                    apikey={GOOGLE_MAPS_APIKEY}
                />
            )
            : null)
    }

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
                            currentLocationLabel='Mi ubicación'
                            keepResultsAfterBlur={false}
                            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                            GooglePlacesSearchQuery={{
                                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                rankby: 'distance',
                                types: 'restaurant',
                            }}
                            fetchDetails={true}
                            debounce={200}
                            enableHighAccuracyLocation={true}
                            onPress={(_data, details) => {
                                // 'details' is provided when fetchDetails = true
                                console.log(details.geometry.location.lat)
                                mapRef.current.animateToRegion({
                                    latitude: details.geometry.location.lat,
                                    longitude: details.geometry.location.lng,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                })
                                getPlaces(details.geometry.location.lat, details.geometry.location.lng, 3500, 'restaurant', GOOGLE_MAPS_APIKEY)
                                    .then(resp => {
                                        setSecPlaces(resp.results);
                                    })
                            }}
                            query={{
                                key: GOOGLE_MAPS_APIKEY,
                                language: 'es',
                                types: ['restaurant']
                            }}
                        />
                    </View>
                    <Button
                        title='Cancelar ruta'
                        disabled={cancelRoute}
                        onPress={() => {
                            coordenates.latitude = null;
                            coordenates.longitude = null;
                            setCancelRoute(!cancelRoute)
                        }}
                        color={'black'}
                    />
                    <View style={{ position: 'relative' }}>
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
                            }
                            }
                            mapType="standard"
                            showsPointsOfInterest={false}
                            // showsTraffic={trafficEnabled}
                            hasTVPreferredFocus={true}
                            userLocationPriority='high'
                            userLocationUpdateInterval={2000}
                            showsMyLocationButton={false}
                            pointerEvents="none"
                            showsCompass={true}
                            ref={mapRef}
                        >

                            {showRute()}
                            {getRestaurantMarkers}
                            {getNightClubMarkers}
                            {getSecRestaurantMarkers}
                        </MapView>
                        <View
                            style={{
                                position: 'absolute',//use absolute position to show button on top of the map
                                alignSelf: 'flex-end', //for align to right
                                top: 20, //for give some space from top
                            }}
                        >
                            <FABButton
                                iconName='locate'
                                onPress={() => {
                                    mapRef.current.animateToRegion({
                                        latitude,
                                        longitude,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01,
                                    })
                                    setSecPlaces([]);
                                }}
                                color={'black'}
                            />
                        </View>
                    </View>

                </View>
                :
                // Mapa cargando
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

    },

    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});