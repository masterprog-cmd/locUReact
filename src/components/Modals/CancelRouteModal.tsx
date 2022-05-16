import React from "react";
import { View, Modal, Dimensions, StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";


export const CancelRouteModal = ({ cancelRouteModal, setCancelRouteModal, setCoordenates }: any) => {
    return (
        <View style={styles.modalContainer}>
            <Modal
                visible={cancelRouteModal}
                animationType="fade"
                transparent={true}
            >
                <View style={styles.modal}>
                    <View style={styles.modalBox}>
                        <Text style={{ color: 'black', fontSize: 18 }}>Cancelar ruta:</Text>
                        <Button onPress={() => { setCoordenates({ latitude: null, longitude: null }); setCancelRouteModal(!cancelRouteModal); }} >Aceptar</Button>
                    </View>
                </View>
            </Modal >
        </View >
    )
};


const styles = StyleSheet.create({
    modalContainer: {
        bottom: 10, justifyContent: 'center'
    },
    modal: {
        flex: 1, justifyContent: 'flex-end', bottom: 50
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
        shadowRadius: 4
    },
    // iconTouchabe: { borderRadius: 20, borderColor: 'blue', backgroundColor: 'red', width: 40, height: 40, justifyContent: 'center' }
})