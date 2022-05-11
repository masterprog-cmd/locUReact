import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

import { logoutUser } from '../api/api';

export const SettingsScreen = ({ navigation }: any) => {

    return (
        <View>
            <TouchableOpacity style={styles.touchableContainer}
                onPress={() => {
                    navigation.navigate('UserProfile');
                }}
            >
                <Icon name='person-circle' size={30} color='black' />
                <Text style={styles.text}>Datos del usuario</Text>
            </TouchableOpacity>
            <Divider style={styles.divider} />
            <TouchableOpacity style={styles.touchableContainer}
                onPress={() => {
                    navigation.navigate('Change Password');
                }
                }>
                <Icon name='trash' size={30} color='black' />
                <Text style={styles.text}>Eliminar cuenta</Text>
            </TouchableOpacity>
            <Divider style={styles.divider} />
            <TouchableOpacity style={styles.touchableContainer}
                onPress={() => {
                    logoutUser();
                    navigation.navigate('Login');
                }
                }>
                <Icon name='exit' size={30} color='black' />
                <Text style={styles.text}>Cerrar sesión</Text>
            </TouchableOpacity>
            <Divider style={styles.divider} />
        </View >
    )
}

const styles = StyleSheet.create({
    touchableContainer: {
        flexDirection: 'row', left: 20, marginTop: 10
    },
    text: {
        color: 'black', alignSelf: 'center', fontSize: 20, marginLeft: 20
    },
    divider: {
        borderColor: 'black', borderWidth: 0.1, marginTop: 10
    }
})