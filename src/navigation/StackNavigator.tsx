import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { InitScreen } from '../screens/InitScreen';
import { LoginScreen } from '../screens/access/LoginScreen';
import { RegistroScreen } from '../screens/access/RegistroScreen';
import { TabNavigator } from './TabNavigator';
import { SettingsScreen } from '../screens/SettingsScreen';
import { UserProfileScreen } from '../screens/Settings/UserProfileScreen';


const Stack = createStackNavigator();


export const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Init"
      screenOptions={{
        cardStyle: { backgroundColor: 'white' }
      }}
    >
      <Stack.Screen name="Init" component={InitScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Registro" component={RegistroScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Tab navigator" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true }} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: true, title: 'Datos del usuario' }} />
    </Stack.Navigator>
  )
}
