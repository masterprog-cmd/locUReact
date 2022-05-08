import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar, Divider } from "react-native-paper";
import { AuthContext } from "../../context/Context";
import { openGallery } from "../../helper/MobileAccess";
import { _controlGallCam } from "../../helper/Permisos";

export const UserProfileScreen = ({ navigation }: any) => {
    const [photo, setPhoto] = useState('');
    const { context } = useContext(AuthContext);

    useEffect(() => {
    }, [])


    return (
        <View style={{ margin: 20 }}>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Avatar.Image source={(context.user?.photoURL === '') ? require('../../assets/avatarDefault.png') : { uri: context.user?.photoURL }} style={{ backgroundColor: 'white' }} />
                <TouchableOpacity
                    onPress={() => {
                        _controlGallCam({ navigation });
                        openGallery({ setPhoto });
                    }}
                >
                    <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 5 }}>Cambiar imagen de perfil</Text>
                </TouchableOpacity>
            </View>
            <Divider style={{ marginVertical: 10, backgroundColor: 'black' }} />
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Text style={style.text}>Nombre del usuario: </Text>
                <Text style={{ ...style.text, fontSize: 16, fontWeight: 'bold' }}>{context.user?.displayName}</Text>
            </View>
            <Divider style={{ marginVertical: 10, backgroundColor: 'black' }} />
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Text style={style.text}>Correo del usuario:</Text>
                <Text style={{ ...style.text, fontSize: 16, fontWeight: 'bold' }} >{context.user?.email}</Text>
            </View>
        </View >
    );
};

const style = StyleSheet.create({
    text: { fontSize: 18, color: 'black' },
})
