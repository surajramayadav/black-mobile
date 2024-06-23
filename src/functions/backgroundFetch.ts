import BackgroundFetch from "react-native-background-fetch";


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
      (error:any) => {
        console.log('[BackgroundFetch] failed to start: ', error);
      },
    );
    BackgroundFetch.status((status:any) => {
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
    await checkAndUpdateTimeZone();
    BackgroundFetch.finish(taskId);
  };

  const checkAndUpdateTimeZone = async () => {
    await sendApiRequest();
  }

  const sendApiRequest=()=>{

  }
  