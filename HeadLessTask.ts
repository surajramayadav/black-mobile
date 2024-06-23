import BackgroundFetch from 'react-native-background-fetch';
import GetLocation from 'react-native-get-location';
import { getDeviceName, getDeviceToken } from './src/functions/deviceInfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


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

const getLocation = () => {
  GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 60000,
  })
    .then(location => {
      console.log(location);
      callApi(location)
    })
    .catch(error => {
      const { code, message } = error;
      console.warn(code, message);
    })
}

const headlessTask = async (event: any) => {
  console.log('[BackgroundFetch HeadlessTask] start', event);
  try {
     getLocation()
  }
  catch (error) {
    console.error(error);
  }

  BackgroundFetch.finish(event.taskId);
};



BackgroundFetch.registerHeadlessTask(headlessTask);