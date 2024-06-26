import { PERMISSIONS, RESULTS, check, request } from "react-native-permissions";

const checkPermissionStatus = async () => {
    const permissionType = PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;

    const status = await check(permissionType);

    if (status == RESULTS.GRANTED) {
        return true
    } else {
        return false
    }
}

const getUserPermission = async () => {
    const permissionType = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    const result = await request(permissionType);
    
    switch (result) {
        case RESULTS.GRANTED:
            console.log('ACCESS_FINE_LOCATION permission granted');
            const Bgresult = await request( PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
            break;
        case RESULTS.DENIED:
            console.log('ACCESS_FINE_LOCATION permission denied');
            break;
        case RESULTS.BLOCKED:
            console.log('ACCESS_FINE_LOCATION permission blocked');
            break;
        default:
            console.log('ACCESS_FINE_LOCATION permission result: ', result);
            break;
    }

    
}
export { checkPermissionStatus, getUserPermission }