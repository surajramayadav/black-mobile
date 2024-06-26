import { View, Text, StatusBar, StyleSheet, Dimensions, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker } from 'react-native-maps'
import axios from 'axios'

export default function Map() {

  const [userLocation, setuserLocation] = React.useState([])

  React.useEffect(() => {
    getUsersLocation()
  }, [])

  const getUsersLocation = async () => {
    const { data } = await axios.get("https://black-backend-o5mk.onrender.com/api/v1/user/view")
    console.log("api response", data)
    setuserLocation(data.data)
  }

  const renderUser = ({ item, index }: any) => {
    return (
      <View style={{ padding: 20, borderRadius: 10, }}>
        <Text>{item.device_name}</Text>
        <Text>{item.user_info.name}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 19.175547,
          longitude: 72.972099,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}

      >
        {userLocation.map((marker: any, index) => {
          console.log("markers", marker.location)
          return (
            <Marker
              key={index}
              coordinate={{ latitude: marker.location.latitude, longitude: marker.location.longitude }}
              title={marker.device_name}
              description={marker.user_info.name}
            />
          )
        })}
      </MapView>
       
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
  },
  map: {
    height: "100%"
  }

});