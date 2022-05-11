import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import Icon from 'react-native-vector-icons/Ionicons';

import { deleteUser } from "../../api/api";

export const DeleteUser = ({ navigation }: any) => {

    //Eliminar la cuenta del usuario al darle al boton aceptar, de lo contrario darle a cancelar
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ alignItems: 'center' }}>
                <Icon name='warning' size={80} color={'red'} />
                <Text style={{ fontSize: 20, alignItems: 'center' }}>¿Estás seguro que quieres eliminar tu cuenta?</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                <TouchableOpacity style={{
                    borderRadius: 20, borderColor: 'black', borderWidth: 1,
                    height: 35, width: 90, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black'
                }} onPress={() => {
                    deleteUser();
                    console.log('ok');
                    navigation.navigate('Login');
                }}>
                    <Text style={{ color: 'white' }}>Aceptar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    borderRadius: 20, borderColor: 'black', borderWidth: 1,
                    height: 35, width: 90, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black'
                }} onPress={() => {
                    navigation.navigate('Settings');
                }}>
                    <Text style={{ color: 'white' }}>Cancelar</Text>
                </TouchableOpacity>
            </View >
        </View >
    )
};
