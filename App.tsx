import React from 'react'
import { checkPermissionStatus, getUserPermission } from './src/functions/permission'
import GetLocation from 'react-native-get-location'
import BackgroundFetch from "react-native-background-fetch";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDeviceName, getDeviceToken } from './src/functions/deviceInfo';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Location from './src/screen/location';
import Map from './src/screen/map';


export default function App() {


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

  

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Location' screenOptions={{
        headerShown:false
      }}>
        <Stack.Screen name="Location" component={Location} />
        <Stack.Screen name="Map" component={Map} />
      </Stack.Navigator>
    </NavigationContainer>
    

  )
}