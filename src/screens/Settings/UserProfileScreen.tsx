import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, useWindowDimensions, Dimensions } from "react-native";
import { Avatar, Button, Divider } from "react-native-paper";
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';

import { AuthContext } from "../../context/Context";
import { openGallery } from "../../helper/MobileAccess";
import { _controlGallCam } from "../../helper/Permisos";
import { deletePhoto } from "../../api/api";

export const UserProfileScreen = ({ navigation }: any) => {
    const { context, setContext } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setContext({
            ...context,
            user: auth().currentUser
        })
    }, [context.user]);


    return (
        <View style={{ margin: 20 }}>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Avatar.Image source={(context.user?.photoURL === null) ?
                    require('../../assets/avatarDefault.png') :
                    { uri: context.user?.photoURL }} style={{ backgroundColor: 'white' }} size={150} />
                <OpenModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    context={context}
                    setContext={setContext}
                />
                <TouchableOpacity
                    onPress={() => {
                        _controlGallCam({ navigation });
                        setModalVisible(true);
                    }}
                >
                    <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 5 }}>Cambiar imagen de perfil</Text>
                </TouchableOpacity>
            </View>
            <Divider style={{ marginVertical: 10, backgroundColor: 'black' }} />
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Text style={style.text}>Nombre del usuario: </Text>
                {/* Nombre de usuario */}
                <Text style={{ ...style.text, fontSize: 16, fontWeight: 'bold' }}>{context.user?.displayName}</Text>
            </View>
            <Divider style={{ marginVertical: 10, backgroundColor: 'black' }} />
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Text style={style.text}>Correo del usuario:</Text>
                {/* Correo del usuario */}
                <Text style={{ ...style.text, fontSize: 16, fontWeight: 'bold' }} >{context.user?.email}</Text>
            </View>
        </View >
    );
};

const OpenModal = ({ modalVisible, setModalVisible, context, setContext }: any) => {
    return (
        <View style={style.modalContainer}>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={style.modal}>
                    <View style={style.modalBox}>
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

const style = StyleSheet.create({
    text: { fontSize: 18, color: 'black' },
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