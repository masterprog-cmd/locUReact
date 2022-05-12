import React from "react";
import { View, Text } from "react-native";
import { Callout, Marker } from "react-native-maps";

export const MyMarker = ({ item, color }: any) => {
    return (<Marker
        coordinate={{ latitude: item.geometry.location.lat, longitude: item.geometry.location.lng }}
        pinColor={color}
    // icon={require('../../assets/images/marker.png')}
    >
        {/* <PlaceModal
                            modalVisible={modalVisible}
                            setmodalVisible={setModalVisible}
                        /> */}
        <Callout onPress={() => {
            // setModalVisible(true);
        }}>

            <View style={{}}>
                <Text style={{}}>{item.name}</Text>
                <Text style={{}}>{item.opening_hours ? 'YES' : 'NO'}</Text>
            </View>
        </Callout>

    </Marker>
    )
};
