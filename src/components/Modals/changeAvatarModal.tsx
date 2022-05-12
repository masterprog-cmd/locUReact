import React from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { Button } from "react-native-paper";
import Icon from 'react-native-vector-icons/Ionicons';

import { deletePhoto } from "../../api/api";
import { openGallery } from "../../helper/MobileAccess";

export const ChangeAvatarModal = ({ modalVisible, setModalVisible, context, setContext }: any) => {
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
                            <View style={{ margin: 20 }}>
                                <TouchableOpacity onPress={() => { openGallery({ context, setContext }); setModalVisible(!modalVisible) }} style={{ flexDirection: 'row' }}>
                                    <Icon name='folder' size={25} />
                                    <Text style={{ marginLeft: 10, fontSize: 20, color: 'black' }}>Cambiar Imagen</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ margin: 20 }}>
                                <TouchableOpacity onPress={() => {
                                    deletePhoto()
                                        .then(() => {
                                            setContext({
                                                ...context,
                                                user: {
                                                    ...context.user,
                                                    photoURL: null
                                                }
                                            });
                                        })
                                        ;
                                    setModalVisible(!modalVisible)
                                }} style={{ flexDirection: 'row' }}>
                                    <Icon name='trash' size={25} />
                                    <Text style={{ marginLeft: 10, fontSize: 20, color: 'black' }}>Eliminar imagen</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Button onPress={() => { setModalVisible(!modalVisible); }} >Cancelar</Button>
                    </View>
                </View>
            </Modal>
        </View >
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        bottom: 10, justifyContent: 'center', alignItems: 'center'
    },
    modal: {
        flex: 1, justifyContent: 'flex-end', alignItems: 'center'
    },
    modalBox: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
})