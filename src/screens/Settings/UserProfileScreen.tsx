import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Avatar, Divider } from "react-native-paper";
import auth from '@react-native-firebase/auth';

import { AuthContext } from "../../context/Context";
import { _controlGallCam } from "../../helper/Permisos";
import { ChangeAvatarModal } from "../../components/Modals/changeAvatarModal";

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
                <ChangeAvatarModal
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



const style = StyleSheet.create({
    text: { fontSize: 18, color: 'black' },

})