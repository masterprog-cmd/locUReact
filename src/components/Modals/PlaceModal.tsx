import React, { useState } from "react";
import { View, Modal, Text, Dimensions, StyleSheet, Linking, Alert, ScrollView, Image } from "react-native";
import { Button } from "react-native-paper";
import { Rating } from "react-native-ratings";

import { addData, getPhoneNumber, getPhoto, GOOGLE_MAPS_APIKEY } from "../../api/api";
import { FABButton } from "../FABButton";

export const PlaceModal = ({ modalVisible, setModalVisible, item, setCancelRoute, places, setPlaces }: any) => {
    const [photo, setPhoto] = useState();
    item.photos?.map((photo: any) => {
        getPhoto(photo.photo_reference, GOOGLE_MAPS_APIKEY)
            .then((res: any) => {
                setPhoto(res.url);
            })
    })

    return (
        <ScrollView style={styles.modalContainer}>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
                key={item.place_id}
            >
                <View style={styles.modal}>
                    <View style={styles.modalBox}>
                        <View style={{ flexDirection: 'column', padding: 20, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <FABButton
                                    iconName={'flag'}
                                    text={'Ir'}
                                    onPress={() => {
                                        setModalVisible(false);
                                        setCancelRoute(false);
                                        setTimeout(() => {
                                            setPlaces({
                                                ...places,
                                                markerGuide: item,
                                            });
                                        }, 200);
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
                            </View>
                        </View>
                        <Button onPress={() => { setModalVisible(!modalVisible); }} >Cancelar</Button>
                    </View>
                </View>
            </Modal>
        </ScrollView >
    )
};


const styles = StyleSheet.create({
    modalContainer: {
        bottom: 10, position: 'absolute'
    },
    modal: {
        flex: 1, justifyContent: 'flex-end',
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