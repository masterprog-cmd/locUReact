import React, { useState } from "react";
import { View, Text } from "react-native";
import { Callout, Marker } from "react-native-maps";
import { PlaceModal } from "./Modals/PlaceModal";
interface Props {
    item: any,
    color: string,
    setCoordenates: (coordenates: any) => void,
    setCancelRoute: (cancelRoute: boolean) => void,
    setSecPlaces: (secPlace: any) => void,
}

export const MyMarker = ({ item, color, setCoordenates, setCancelRoute, setSecPlaces }: Props) => {
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
                setSecPlaces={setSecPlaces}
            />

            <View style={{}}>
                <Text style={{}}>{item.name}</Text>

                <Text style={{ color: 'black' }}>{item.opening_hours?.open_now === true ? <Text style={{ color: 'green' }}>Abierto</Text>
                    : item.opening_hours?.open_now === undefined ?
                        <Text style={{ color: 'orange' }}>Horario no definido</Text> : <Text style={{ color: 'red' }}>Cerrado</Text>}</Text>


            </View>
        </Callout>

    </Marker>
    )
};
