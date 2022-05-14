import React, { useEffect, useState } from 'react'
import { SectionList, Text, View } from 'react-native'
import { getData } from '../../api/api'

export const FavScreen = () => {
    const [info, setInfo] = useState<any[]>([]);
    let arr: any = [];


    useEffect(() => {
        getData()
            .then((res: any) => {
                res.map((item: any) => {
                    console.log(item);
                    arr.push({
                        title: item.name,
                        data: {
                            address: item.address,
                            latitude: item.latitude,
                            longitude: item.longitude,
                        }

                    });

                })
            })
        setInfo(arr);
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <SectionList
                sections={info}
                keyExtractor={(item, index) => item + index}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{title}</Text>
                )}
                renderItem={({ section: { data } }) =>
                    <View>
                        <Text>{data.address}</Text>
                    </View>
                }
            />
        </View>
    )
}
