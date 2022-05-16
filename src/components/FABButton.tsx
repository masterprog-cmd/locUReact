import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    iconName: string,
    text: string,
    onPress: () => void
}

export const FABButton = (props: Props) => {
    return (
        <View style={{ flexDirection: 'column', alignItems: 'center', paddingHorizontal: 20 }}>
            <TouchableOpacity style={styles.iconTouchabe} onPress={props.onPress}>
                <Icon name={props.iconName} color={'white'} size={25} />
            </TouchableOpacity>
            <Text>{props.text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    iconTouchabe: { borderRadius: 20, borderColor: 'blue', backgroundColor: 'red', width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }

})