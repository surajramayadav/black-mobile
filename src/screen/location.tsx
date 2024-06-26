import { View, Text, StatusBar, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Location({navigation}:any) {
    const [Name, setName] = React.useState("")
    const saveName = async () => {
        AsyncStorage.setItem("name", Name)
        if (Name == "adminsj") {
            navigation.navigate("Map")
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <StatusBar backgroundColor={"black"} />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
                <TextInput
                    placeholder='Please Enter Your Name'
                    placeholderTextColor={"grey"}
                    style={{
                        borderWidth: 1, borderRadius: 10, padding: 15,
                        borderColor: "white", width: "80%", color: "white"
                    }}
                    onChangeText={(e) => setName(e)}
                    value={Name}
                />
                <TouchableOpacity
                    onPress={() => saveName()}
                    style={{
                        marginTop: 20,
                        backgroundColor: "blue",
                        width: "80%",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        padding: 15
                    }}>
                    <Text style={{ color: "white", }}>Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}