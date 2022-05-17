import { useIsFocused } from "@react-navigation/core";
import React from "react";
import { View, Modal, Text, Dimensions, StyleSheet, Linking, Alert } from "react-native";
import { Button } from "react-native-paper";

import { addData, getPhoneNumber, GOOGLE_MAPS_APIKEY } from "../../api/api";
import { FABButton } from "../FABButton";

export const PlaceModal = ({ modalVisible, setModalVisible, item, setCoordenates, setCancelRoute }: any) => {
    const isFocused = useIsFocused();

    return (
        <View style={styles.modalContainer}>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modal}>
                    <View style={styles.modalBox}>
                        <View style={{ flexDirection: 'column', padding: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <FABButton
                                    iconName={'flag'}
                                    text={'Ir'}
                                    onPress={() => {
                                        setCoordenates({
                                            latitude: item.geometry.location.lat,
                                            longitude: item.geometry.location.lng,
                                        });
                                        console.log(isFocused ? 'focused' : 'unfocused');
                                        setModalVisible(!modalVisible);
                                        setCancelRoute(false);
                                    }}
                                />
                                <FABButton
                                    iconName={'call'}
                                    text={'Llamar'}
                                    onPress={() => {
                                        getPhoneNumber(item.place_id, GOOGLE_MAPS_APIKEY)
                                            .then(res1 => {
                                                (Object.keys(res1.result).length !== 0) ?
                                                    Linking.openURL(`tel:${res1.result.formatted_phone_number}`)
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
                                        addData(item.name, item.vicinity, item.geometry.location.lat, item.geometry.location.lng, item.business_status, item.types[0], item.opening_hours)
                                            .then(res => {
                                                console.log(res);
                                            })
                                        setModalVisible(!modalVisible);
                                    }}
                                />
                            </View>
                            <View style={{ margin: 20, alignItems: 'center' }}>
                                <Text style={{ fontSize: 18, color: 'black' }}>{item.name}</Text>
                            </View>
                        </View>
                        <Button onPress={() => { setModalVisible(!modalVisible); }} >Cancelar</Button>
                    </View>
                </View>
            </Modal>
        </View >
    )
};


const styles = StyleSheet.create({
    modalContainer: {
        bottom: 10, justifyContent: 'center',
    },
    modal: {
        flex: 1, justifyContent: 'flex-end'
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