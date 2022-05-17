import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Callout, Marker } from "react-native-maps";
import { PlaceModal } from "./Modals/PlaceModal";
interface Props {
    item: any,
    color: string,
    setCoordenates: (coordenates: any) => void,
    setCancelRoute: (cancelRoute: boolean) => void,
}

export const MyMarker = ({ item, color, setCoordenates, setCancelRoute }: Props) => {
    const [modalVisible, setModalVisible] = useState(false);

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
                setCancelRoute={setCancelRoute}
            />

            <View style={{}}>
                <Text style={{}}>{item.name}</Text>

                <Text style={{}}>Abierto: {item.opening_hours?.open_now === true ? 'Si' : item.opening_hours === undefined ? 'Horario no definido' : 'No'}</Text>


            </View>
        </Callout>

    </Marker>
    )
};
