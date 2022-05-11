import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { RegistrosAccessControl } from '../../helper/AccessControl';


export const RegistroScreen = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [correo, setCorreo] = useState('');
    const [pwd, setPwd] = useState('');
    const [repeatPwd, setRepeatPwd] = useState('');
    const [iconName, setIconName] = useState('eye');
    const [iconName1, setIconName1] = useState('eye');
    const [secureText, setSecureText] = useState(true);
    const [secureText1, setSecureText1] = useState(true);


    return (
        <ScrollView style={{ top: 50, flexDirection: 'column' }}>
            <View style={{ alignItems: 'center' }}>
                <Icon name='navigate-circle' size={70} color={'black'} />
                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 30 }}>Registrarse</Text>
            </View>
            <View style={{ top: 10, alignItems: 'center' }}>
                <TextInput placeholder='Nombre' value={name} style={styles.textInputStyles} textAlign='center' onChangeText={(value) => setName(value)} />
                <TextInput placeholder='Apellidos' value={lastName} style={styles.textInputStyles} textAlign='center'
                    onChangeText={(value) => setLastName(value)} />
                <TextInput placeholder='Correo electrónico' value={correo} style={styles.textInputStyles} textAlign='center'
                    onChangeText={(value) => setCorreo(value)} />
                <View style={{ marginLeft: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput placeholder='Contraseña' value={pwd} style={styles.textInputStyles}
                            secureTextEntry={secureText} textAlign='center' onChangeText={(value) => setPwd(value)} />
                        <TouchableOpacity onPress={() => {
                            return (iconName === 'eye') ? (setIconName('eye-off'), setSecureText(false)) : (setIconName('eye'), setSecureText(true));
                        }}>
                            <Icon name={iconName} size={22} style={{ top: 15, right: 40 }} color='black' />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput placeholder='Repetir contraseña' value={repeatPwd} style={styles.textInputStyles}
                            secureTextEntry={secureText1} textAlign='center' onChangeText={(value) => setRepeatPwd(value)} />
                        <TouchableOpacity onPress={() => {
                            return (iconName1 === 'eye') ?
                                (setIconName1('eye-off'), setSecureText1(false)) : (setIconName1('eye'), setSecureText1(true));
                        }}>
                            <Icon name={iconName1} size={22} style={{ top: 15, right: 40 }} color='black' />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ margin: 30, flex: 1, alignItems: 'center', marginTop: 50 }}>
                    <TouchableOpacity style={styles.touchableStyle} onPress={() => {
                        RegistrosAccessControl({ name, lastName, correo, pwd, repeatPwd }, { navigation })
                    }}>
                        <Text style={{ color: 'white' }}>Registrate!</Text>
                    </TouchableOpacity>
                    <Text style={{ color: 'black', top: 20 }} onPress={() => { navigation.navigate('Login') }}>Estás registrado? Inicia sesión!</Text>
                </View>
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    textInputStyles: {
        borderRadius: 20, borderColor: 'black', borderWidth: 1, width: 280, marginTop: 30,
    },
    touchableStyle: {
        flexDirection: 'row',
        borderRadius: 30, borderWidth: 1,
        backgroundColor: 'black',
        width: 210, height: 40,
        alignItems: 'center', justifyContent: 'space-evenly',
    }
})
