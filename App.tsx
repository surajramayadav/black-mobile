import { View, Text, SafeAreaView, StatusBar, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { checkPermissionStatus, getUserPermission } from './src/functions/permission'
import GetLocation from 'react-native-get-location'
import BackgroundFetch from "react-native-background-fetch";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDeviceName, getDeviceToken } from './src/functions/deviceInfo';
import axios from 'axios';


export default function App() {

  const [Name, setName] = React.useState("")

  React.useEffect(() => {
    captureLocation()
  }, [])

  const captureLocation = async () => {

    if (await checkPermissionStatus()) {
      getLocation()
    } else {
      await getUserPermission()
      getLocation()
    }
    configureBackgroundFetch()
  }


  const configureBackgroundFetch = () => {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // minutes
        stopOnTerminate: false, // Continue background fetch when the app is terminated
        startOnBoot: true, // Start background fetch when the device is rebooted
        enableHeadless: true,
        forceAlarmManager: true,
      },
      backgroundFetchHandler,
      (error: any) => {
        console.log('[BackgroundFetch] failed to start: ', error);
      },
    );
    BackgroundFetch.status((status: any) => {
      switch (status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log('BackgroundFetch restricted');
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log('BackgroundFetch denied');
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log('BackgroundFetch is enabled');
          break;
      }
    });
  };

  const backgroundFetchHandler = async (taskId: any) => {
    console.log('[BackgroundFetch] taskId: ', taskId);
    getLocation()
    BackgroundFetch.finish(taskId);
  };

  const getLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(async (location) => {
        console.log(location);
        callApi(location)
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
  }


  const callApi = async (location: any) => {
    const body = {
      "location": {
        "latitude": location.latitude,
        "longitude": location.longitude
      },
      "device_name": await getDeviceName(),
      "device_id": await getDeviceToken(),
      "user_info": {
        "name": await AsyncStorage.getItem("name") || "name is not entered"
      }
    }
    console.log("body", body)
    const { data } = await axios.post("https://black-backend-o5mk.onrender.com/api/v1/user/add", body)
    console.log("api response", data)
  }

  const saveName = async () => {
    AsyncStorage.setItem("name", Name)
    if (!await checkPermissionStatus()) {
      await getUserPermission()
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