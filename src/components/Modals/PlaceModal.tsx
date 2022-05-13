import React from "react";
import { View, Modal, TouchableOpacity, Text, Dimensions, StyleSheet, Platform, Linking, Alert } from "react-native";
import { Button } from "react-native-paper";
import { getPhoneNumber, GOOGLE_MAPS_APIKEY } from "../../api/api";
import { FABButton } from "../FABButton";

interface Props {
    item: any,
    modalVisible: boolean,
    setModalVisible: (modalVisible: boolean) => void,
    setCoordenates: (coordenates: any) => void
}

export const PlaceModal = ({ modalVisible, setModalVisible, item, setCoordenates }: any) => {

    return (
        <View style={styles.modalContainer}>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modal}>
                    <View style={styles.modalBox}>
                        <View style={{ flexDirection: 'column', margin: 20 }}>
                            <View style={{ margin: 20, borderColor: 'red', borderRadius: 1 }}>
                                <TouchableOpacity onPress={() => { setModalVisible(!modalVisible) }} style={{ flexDirection: 'row' }}>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <FABButton
                                    iconName={'flag'}
                                    text={'Ir'}
                                    onPress={() => {
                                        setCoordenates({
                                            latitude: item.geometry.location.lat,
                                            longitude: item.geometry.location.lng
                                        })
                                    }}
                                />
                                <FABButton
                                    iconName={'call'}
                                    text={'Llamar'}
                                    onPress={() => {
                                        getPhoneNumber(item.place_id, GOOGLE_MAPS_APIKEY)
                                            .then(res1 => {
                                                console.log(res1.result);
                                                (Object.keys(res1.result).length !== 0) ?
                                                    Linking.openURL(`tel:${res1.result.formatted_phone_number}`)
                                                    :
                                                    Alert.alert('No se encontró número telefónico');
                                            })
                                    }}
                                />
                                <FABButton
                                    iconName={'heart'}
                                    text={'Guardar'}
                                    onPress={() => { }}
                                />

                            </View>
                            <View style={{ margin: 20 }}>
                                <Text>{item.name}</Text>
                                <Text>{item.geometry.location.lat}</Text>
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
        bottom: 10, justifyContent: 'center', alignItems: 'center', position: 'absolute',
    },
    modal: {
        flex: 1, justifyContent: 'flex-end', alignItems: 'center',
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
    iconTouchabe: { borderRadius: 20, borderColor: 'blue', backgroundColor: 'red', width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }
})