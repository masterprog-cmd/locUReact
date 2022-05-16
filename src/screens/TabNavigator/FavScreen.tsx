import React, { useEffect, useState } from 'react'
import { SectionList, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { getData } from '../../api/api'

export const FavScreen = () => {
    const [info, setInfo] = useState<any[]>([]);
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();


    useEffect(() => {
        getData()
            .then((res: any) => {
                let arr: any = [];
                res.map((item: any) => {
                    arr.push({
                        title: item.name,
                        data: [{
                            open: item.opening_hours,
                            address: item.address,
                            types: (typeof item.types === 'string') ? item.types : item.types[0],
                        }]
                    });
                    setLatitude(item.latitude);
                    setLongitude(item.longitude);
                })
                setInfo(arr);
            })
    }, [info]);

    const Item = ({ address, opening_hours, types }: any) => (
        <View>
            <Text >Dirección: {address}</Text>
            <Text >Estado: {(opening_hours === true) ? 'abierto' : 'cerrado'}</Text>
            <Text style={{ textTransform: 'capitalize' }}>Tipo: {(types === 'night_club') ? 'Club nocturno' : (types === 'restaurant') ? 'Restaurante' : types}</Text>
        </View>
    );

    return (
        <SafeAreaView style={{
            flex: 1,
            paddingHorizontal: 10,
            paddingVertical: 10,
            backgroundColor: '#fff',
        }}>
            <SectionList
                sections={info}
                keyExtractor={(item, index) => item + index}
                renderSectionHeader={({ section: { title } }) => (
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{title}</Text>
                    </View>
                )}
                renderItem={({ item }) =>
                    <Item address={item.address} opening_hours={item.open} types={item.types} />
                }
            />
        </SafeAreaView>
    )
}
