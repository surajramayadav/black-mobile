/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
if (Platform.OS == 'android') {
    import('./HeadLessTask');
  }

AppRegistry.registerComponent(appName, () => App);
