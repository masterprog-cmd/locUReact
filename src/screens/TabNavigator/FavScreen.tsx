import { InitialState } from '@react-navigation/core';
import React, { useEffect, useState } from 'react'
import { SectionList, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { deleteData, getData } from '../../api/api'

interface Data {
    title: string,
    data: [{
        open: boolean | undefined,
        address: string | null,
        types: string | [] | null,
    }],
    latitude: number | null,
    longitude: number | null,
}

const initialData: Data = {
    title: '',
    data: [{
        open: false,
        address: '',
        types: '' || [],
    }],
    latitude: 0,
    longitude: 0,
}

export const FavScreen = () => {
    const [info, setInfo] = useState<Data[]>([initialData]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getInfo();
    }, [info]);

    //Obtener la info de los lugares
    const getInfo = () => {
        return getData()
            .then((res: any) => {
                let arr: Data[] = [];
                res.map((item: any) => {
                    arr.push({
                        title: item.name,
                        data: [{
                            open: item.opening_hours,
                            address: item.address,
                            types: (typeof item.types === 'string') ? item.types : item.types[0],
                        }],
                        latitude: item.latitude,
                        longitude: item.longitude,
                    });
                })
                setInfo(arr);
            })

    }

    const wait = (timeout: number) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getInfo();
        wait(2000).then(() =>
            setRefreshing(false));
    }, []);

    const Item = ({ address, opening_hours, types }: any) => (
        <View style={{ borderRadius: 1.5, borderWidth: 1, borderColor: 'black', paddingVertical: 5 }}>
            <Text style={{ color: 'black' }}>Dirección: {address}</Text>
            <Text style={{ color: 'black' }}>Estado: {(opening_hours === true) ? <Text style={{ color: 'green' }}>Abierto</Text> : <Text style={{ color: 'red' }}>Cerrado</Text>}</Text>
            <Text style={{ textTransform: 'capitalize', color: 'black' }}>
                Tipo: {(types === 'night_club') ? 'Club nocturno' : (types === 'restaurant') ? 'Restaurante' : (types === 'meal_delivery') ? 'Comida rápida' : types}
            </Text>
        </View>
    );

    return (
        <>
            {
                (info.length > 0) ?
                    <SafeAreaView style={{
                        flex: 1,
                        paddingHorizontal: 10,
                        paddingBottom: 15,
                        backgroundColor: '#fff',
                    }}>
                        <SectionList
                            showsVerticalScrollIndicator={false}
                            sections={info}
                            keyExtractor={(item, index) => index.toString()}
                            renderSectionHeader={({ section: { title } }) => (
                                <View style={{ marginTop: 15, paddingTop: 10, paddingBottom: 10, backgroundColor: 'black', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ paddingLeft: 10, fontWeight: 'bold', fontSize: 20, color: 'white' }}>{title}</Text>
                                    <TouchableOpacity style={{ paddingRight: 20 }}
                                        onPress={() => {
                                            deleteData(title);
                                        }}>
                                        <Icon name='trash' color='white' size={20} />
                                    </TouchableOpacity>
                                </View>
                            )}
                            renderItem={({ item }) =>
                                <Item address={item.address} opening_hours={item.open} types={item.types} />
                            }
                            onRefresh={onRefresh}
                            refreshing={refreshing}
                        />
                    </SafeAreaView> :
                    <View style={{ backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size={'large'} color="black" style={{ backgroundColor: 'white' }} />
                        <Text>Cargando...</Text>
                    </View>
            }
        </>
    )
}
