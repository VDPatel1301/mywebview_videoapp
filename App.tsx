import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import * as Notifications from 'expo-notifications';
import { registerNotificationHandler, initNotificationHandling } from './src/utils/notifications';
import { Platform } from 'react-native';

// Configure how notifications are shown when app is foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    // Any runtime notification setup lived in utils/notifications
    initNotificationHandling();
    registerNotificationHandler();
  }, []);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
