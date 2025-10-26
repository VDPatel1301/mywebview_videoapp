import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { CommonActions } from '@react-navigation/native';

/**
 * We will export:
 * - initNotificationHandling(): request permissions
 * - scheduleNotification(title, body, seconds, data)
 * - registerNotificationHandler(): sets up response listener (tap) to call a callback
 *
 * Because the notifications response needs to navigate, the app-level listener uses a
 * custom global function setter to pass navigation into this module.
 */

let navigationRef: any = null;

/** Set the navigation object from App-level Root to allow navigation on tap. */
export function setNavigationForNotifications(navigation: any) {
  navigationRef = navigation;
}

export async function initNotificationHandling() {
  // Request permissions on start
  if (Platform.OS !== 'web') {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.warn('Notification permissions not granted - scheduling may not work');
    }
    // For Android: set default channel
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }
  }
}

/** Schedule a local notification */
export async function scheduleNotification(title: string, body: string, seconds: number, data?: any) {
  // seconds must be >= 0
  const trigger = seconds <= 0 ? null : { seconds };
  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data ?? {},
      sound: null,
    },
    trigger,
  });
}

/** Register response listener to handle taps. Call this once in App. */
export function registerNotificationHandler() {
  // When a user interacts with a notification (tap), this listener fires.
  Notifications.addNotificationResponseReceivedListener(response => {
    try {
      const data = response.notification.request.content.data || {};
      if (!navigationRef) {
        console.warn('No navigationRef set for notifications');
        return;
      }

      // Example: if notification has {open: 'video', url: 'https://...'}
      if (data.open === 'video') {
        // navigate to VideoPlayer with URL
        navigationRef.dispatch(
          CommonActions.navigate({
            name: 'VideoPlayer',
            params: { url: data.url },
          })
        );
      } else {
        // default navigate to VideoPlayer anyway
        navigationRef.dispatch(
          CommonActions.navigate({
            name: 'VideoPlayer',
          })
        );
      }
    } catch (err) {
      console.warn('Error handling notification response', err);
    }
  });
}
