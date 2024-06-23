import DeviceInfo from 'react-native-device-info';

const getDeviceName = async () => {
    return await DeviceInfo.getDeviceName()
}

const getDeviceToken = async () => {
    return await DeviceInfo.getUniqueId()
}

export { getDeviceName,getDeviceToken}