import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Callout, Marker } from "react-native-maps";
import { PlaceModal } from "./Modals/PlaceModal";
import Icon from 'react-native-vector-icons/Ionicons';
interface Props {
    item: any,
    color: string,
    setCoordenates: (coordenates: any) => void,
    setCancelRouteModal: (cancelRouteModal: boolean) => void,
}

export const MyMarker = ({ item, color, setCoordenates, setCancelRouteModal }: Props) => {
    const [modalVisible, setModalVisible] = useState(false);
    console.log(item.name + ' ' + JSON.stringify(item.opening_hours));


    return (<Marker
        coordinate={{ latitude: item.geometry.location.lat, longitude: item.geometry.location.lng }}
        pinColor={color}
        tracksInfoWindowChanges={true}
        style={{ borderRadius: 20 }}
    >
        <Callout onPress={() => {
            setModalVisible(true);
        }}>
            <PlaceModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                item={item}
                setCoordenates={setCoordenates}
                setCancelRouteModal={setCancelRouteModal}
            />

            <View style={{}}>
                <Text style={{}}>{item.name}</Text>
                <Text style={{}}>Abierto: {item.opening_hours === true ? 'Si' : 'No'}</Text>
            </View>
        </Callout>

    </Marker>
    )
};
