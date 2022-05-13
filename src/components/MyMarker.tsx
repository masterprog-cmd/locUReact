import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Callout, Marker } from "react-native-maps";
import { PlaceModal } from "./Modals/PlaceModal";

interface Props {
    item: any,
    color: string,
    setCoordenates: (coordenates: any) => void
}

export const MyMarker = ({ item, color, setCoordenates }: Props) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (<Marker
        coordinate={{ latitude: item.geometry.location.lat, longitude: item.geometry.location.lng }}
        pinColor={color}
        icon={item.icon}
    >
        <Callout onPress={() => {
            console.log('hola');
            setModalVisible(true);
        }}>
            <PlaceModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                item={item}
                setCoordenates={setCoordenates}
            />

            <View style={{}}>
                <Text style={{}}>{item.name}</Text>
                <Text style={{}}>{item.opening_hours ? 'YES' : 'NO'}</Text>
            </View>
        </Callout>

    </Marker>
    )
};
