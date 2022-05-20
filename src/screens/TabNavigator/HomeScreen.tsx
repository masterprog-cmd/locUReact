import React, { useContext, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Button, Dimensions, StyleSheet, Text, View } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
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
    const [places, setPlaces] = useState({
        restaurants: [],
        nightClubs: [],
        secRestaurants: [],
        secNightClubs: [],
        markerGuide: null,

    });

    //Obtenemos la posición del usuario
    const origin = { latitude, longitude };

    //useState para habilitar el botón de cancelar ruta
    const [cancelRoute, setCancelRoute] = useState(true);

    //useRef para volver a la ubicación del usuario o a la que se ha añadido en el GooglePlacesAutocomplete
    const mapRef = useRef(null);

    _controlLocation({ navigation });
    //useEffect para obtener la posición del usuario y los markers alrededor de él
    useEffect(() => {
        //Preguntamos si tenemos permisos para obtener la localización
        //Obtenemos la localización del usuario y la añadimos a los useState (arriba declarados) para mostrarla en el mapa
        location()
            .then(res => {
                const lat = res.latitude;
                const lng = res.longitude;

                setLatitude(lat);
                setLongitude(lng);

                Promise.all([
                    getPlacesDetails('restaurant', lat, lng),
                    getPlacesDetails('night_club', lat, lng),
                ]).then(([restaurants, nightClubs]) => {
                    setPlaces({
                        ...places,
                        restaurants: restaurants.results,
                        nightClubs: nightClubs.results,
                    })
                })
            })
            .catch(err => {
                console.error(err);
            });
    }, [places.markerGuide]);

    const getPlacesDetails = async (type: string, lat?: number, lng?: number) => {
        let messaje;
        await getPlaces(lat, lng, 3500, type, GOOGLE_MAPS_APIKEY)
            .then(resp => {
                messaje = resp;
            })
            .catch(() => {
                messaje = null;
            }
            );
        return messaje;
    }

    //Obtenemos todos los markers referentes a los restaurantes
    const getRestaurantMarkers = () => {
        if (places.restaurants?.length > 0 && places.markerGuide === null) {
            return (
                places.restaurants?.map((rest: any, key) => (
                    <MyMarker
                        key={key}
                        item={rest}
                        color={rest.icon_background_color}
                        setCancelRoute={setCancelRoute}
                        places={places}
                        setPlaces={setPlaces}
                    />
                ))
            )
        }
    }

    const getSecRestaurantMarkers = () => {
        if (places.secRestaurants?.length > 0 && places.markerGuide === null) {
            return (
                places.secRestaurants?.map((secRest: any, key) => (
                    <MyMarker
                        key={key}
                        item={secRest}
                        color={secRest.icon_background_color}
                        setCancelRoute={setCancelRoute}
                        places={places}
                        setPlaces={setPlaces}
                    />)
                )
            )
        }
    }

    //Obtenemos todos los markers referentes a los clubs nocturnos
    const getNightClubMarkers = () => {
        if (places.nightClubs?.length > 0 && places.markerGuide === null) {
            return (
                places.nightClubs?.map((club: any, key) => (
                    <MyMarker
                        key={key}
                        item={club}
                        color={'green'}
                        setCancelRoute={setCancelRoute}
                        places={places}
                        setPlaces={setPlaces}
                    />)
                )
            )

        }
    }

    //Obtenemos todos los markers referentes a los clubs nocturnos secundarios
    const getSecNightClubMarkers = () => {
        if (places.secNightClubs?.length > 0 && places.markerGuide === null) {
            return (
                places.secNightClubs?.map((secClub: any, key) => (
                    <MyMarker
                        key={key}
                        item={secClub}
                        color={'green'}
                        setCancelRoute={setCancelRoute}
                        places={places}
                        setPlaces={setPlaces}
                    />)
                )
            )
        }
    }

    //Obtenemos la ruta de la posición del lugar al que el usuario quiere ir
    const showRute = () => {
        if (places.markerGuide !== null) {
            return (
                <>
                    <MyMarker
                        key={'guide'}
                        item={places.markerGuide}
                        color={'#ff0000'}
                        setCancelRoute={setCancelRoute}
                        places={places}
                        setPlaces={setPlaces}
                    />
                    <MapViewDirections
                        strokeColor='black'
                        strokeWidth={3}
                        origin={origin}
                        destination={
                            {
                                latitude: places.markerGuide.geometry.location.lat,
                                longitude: places.markerGuide.geometry.location.lng
                            }
                        }
                        apikey={GOOGLE_MAPS_APIKEY}
                    />
                </>
            )
        }
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
                                mapRef.current.animateToRegion({
                                    latitude: details.geometry.location.lat,
                                    longitude: details.geometry.location.lng,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                })
                                Promise.all([
                                    getPlacesDetails('restaurant', details.geometry.location.lat, details.geometry.location.lng),
                                    getPlacesDetails('night_club', details.geometry.location.lat, details.geometry.location.lng),
                                ]).then(([restaurants, nightClubs]) => {
                                    setPlaces({
                                        ...places,
                                        secRestaurants: restaurants.results,
                                        secNightClubs: nightClubs.results,
                                    })
                                })
                            }}
                            query={{
                                key: GOOGLE_MAPS_APIKEY,
                                language: 'es',
                                types: ['restaurant']
                            }}
                        />
                    </View>
                    {!cancelRoute && (
                        <Button
                            title='Cancelar ruta'
                            onPress={() => {
                                setPlaces({
                                    ...places,
                                    markerGuide: null,
                                })
                                setCancelRoute(!cancelRoute);
                            }}
                            color={'black'}
                        />
                    )}

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
                            mapType="satellite"
                            showsPointsOfInterest={false}
                            // showsTraffic={trafficEnabled}
                            hasTVPreferredFocus={true}
                            userLocationPriority='high'
                            userLocationUpdateInterval={2000}
                            showsMyLocationButton={false}
                            showsCompass={true}
                            ref={mapRef}
                        >

                            {showRute()}
                            {getRestaurantMarkers()}
                            {getNightClubMarkers()}
                            {getSecRestaurantMarkers()}
                            {getSecNightClubMarkers()}
                            {/* {getGuideMarker()} */}
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
                                    setPlaces({
                                        ...places,
                                        secRestaurants: [],
                                        secNightClubs: [],
                                    })
                                }
                                }

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