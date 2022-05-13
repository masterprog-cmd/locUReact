import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { HomeScreen } from '../screens/TabNavigator/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FavScreen } from '../screens/TabNavigator/FavScreen';
import { ReservasScreen } from '../screens/TabNavigator/ReservasScreen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Tab = createBottomTabNavigator();

export const TabNavigator = ({ navigation }: any) => {
    return (
        <Tab.Navigator
            initialRouteName='Inicio'
            tabBar={(props) => <MyTabBar {...props} />}
            screenOptions={
                ({ route }) => ({
                    tabBarLabel: ({ focused }) => {
                        //Devolvemos el nombre de los componentes en orden
                        return <Text style={{ color: 'black' }}> {(focused) ? route.name : ''}</Text>
                    },
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName: any;

                        if (route.name === 'Favoritos') {
                            iconName = focused ? 'heart' : 'heart-outline';
                        } else if (route.name === 'Inicio') {
                            iconName = focused ? 'home' : 'home-outline';
                        }
                        else if (route.name === 'Reservas') {
                            iconName = focused ? 'bookmark' : 'bookmark-outline';
                        }
                        //Devolvemos el icono pertinente para cada ventana
                        return <Icon name={iconName} size={size} color={color} />;
                    },
                    //Estilo del appBar solamente
                    tabBarStyle: {
                        backgroundColor: 'black', borderTopLeftRadius: 24,
                        borderTopRightRadius: 24, height: 68
                    },
                    //Escodondemos el header
                    //Centramos el titulo
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: 'white',
                    },
                    //Estilo del header en la derecha, es decir, añadimos el boton de ajustes
                    headerRight: () => (
                        <TouchableOpacity onPress={() => { navigation.navigate('Settings') }}>
                            <Icon name='cog' size={30} color={'black'} style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                    )
                })
            }
        >
            <Tab.Screen name="Favoritos" component={FavScreen} />
            <Tab.Screen name="Inicio" component={HomeScreen} options={
                { headerShown: true, }
            } />
            <Tab.Screen name="Reservas" component={ReservasScreen} />
        </Tab.Navigator >
    )
}

const MyTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View style={{ flexDirection: 'row', backgroundColor: "white", height: 50, justifyContent: "center", alignItems: "center" }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;
                const label = route.name;
                let icon: any;
                if (route.name === 'Favoritos') {
                    icon = isFocused ? 'heart' : 'heart-outline';
                } else if (route.name === 'Inicio') {
                    icon = isFocused ? 'home' : 'home-outline';
                }
                else if (route.name === 'Reservas') {
                    icon = isFocused ? 'bookmark' : 'bookmark-outline';
                }

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };
                //Devolvemos el icono pertinente para cada ventana junto el texto y el on press para navegar entre ellas

                return (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={(!isFocused) ? style.container : { backgroundColor: 'black', height: 50, alignItems: 'center', justifyContent: 'center', flex: 1 }}
                        key={index}
                    >
                        <Icon name={icon} size={20} color={(isFocused) ? 'white' : '#222'} />
                        <Text style={{ color: (isFocused) ? 'white' : '#222' }}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const style = StyleSheet.create({
    container: { flex: 1, alignItems: "center", },
})