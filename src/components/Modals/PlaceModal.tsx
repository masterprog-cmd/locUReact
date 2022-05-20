import React, { useState } from "react";
import { View, Text, Dimensions, StyleSheet, Linking, Alert, Image, Modal, Button } from "react-native";
// import Modal, { Direction } from "react-native-modal";
import { Rating } from "react-native-ratings";
import Icon from 'react-native-vector-icons/Ionicons';


import { addData, getPhoneNumber, getPhoto, GOOGLE_MAPS_APIKEY } from "../../api/api";
import { FABButton } from "../FABButton";

export const PlaceModal = ({ modalVisible, setModalVisible, item, setCancelRoute, places, setPlaces }: any) => {
    const [photo, setPhoto] = useState();



    item.photos?.map((photos: any) => {
        getPhoto(photos.photo_reference, GOOGLE_MAPS_APIKEY)
            .then((res: any) => {
                setPhoto(res.url);
            })
    })

    return (
        <View style={styles.modalContainer}>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={false}
                key={item.place_id}
                style={{ ...styles.modal, top: 250 }}
            >
                {/* <View > */}
                <View style={styles.modalBox}>
                    <View style={{ flexDirection: 'column', padding: 20, alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <FABButton
                                iconName={'flag'}
                                text={'Ir'}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    setTimeout(() => {
                                        setCancelRoute(false);
                                        setPlaces({
                                            ...places,
                                            markerGuide: item,
                                        });
                                    }, 500);
                                }}
                            />
                            <FABButton
                                iconName={'call'}
                                text={'Llamar'}
                                onPress={() => {
                                    getPhoneNumber(item.place_id, GOOGLE_MAPS_APIKEY)
                                        .then(res1 => {
                                            (Object.keys(res1.result).length !== 0) ?
                                                Linking.openURL(`tel:${res1.result.international_phone_number}`)
                                                :
                                                Alert.alert('No se encontró número telefónico');
                                        })
                                    setModalVisible(!modalVisible);
                                }}
                            />
                            <FABButton
                                iconName={'heart'}
                                text={'Guardar'}
                                onPress={() => {
                                    addData(item.name, item.vicinity, item.geometry.location.lat, item.geometry.location.lng, item.business_status, item.types[0], item.opening_hours);
                                    setModalVisible(!modalVisible);
                                }}
                            />
                        </View>
                        <View style={{ margin: 20, alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, color: 'black' }}>{item.name}</Text>
                            <Text>Valoración</Text>
                            <Rating
                                type="star"
                                ratingBackgroundColor="yellow"
                                ratingCount={5}
                                imageSize={20}
                                readonly
                                startingValue={item.rating}
                            />
                            <Text>{item.rating}</Text>
                            <Text style={{ marginTop: 10 }}>Total valoraciones: {item.user_ratings_total}</Text>
                            <Image source={{ uri: photo }} style={{ height: 200, width: 300, marginTop: 10 }} />
                            <Button title='Cancelar' onPress={() => { setModalVisible(!modalVisible) }} />
                        </View>
                    </View>
                </View>
                {/* </View> */}
            </Modal>
        </View>
    )
};


const styles = StyleSheet.create({
    modalContainer: {
        position: 'relative',

    },
    modal: {
        flex: 1, justifyContent: 'flex-end', top: 400, alignItems: 'center'
    },
    modalBox: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    // iconTouchabe: { borderRadius: 20, borderColor: 'blue', backgroundColor: 'red', width: 40, height: 40, justifyContent: 'center' }
})