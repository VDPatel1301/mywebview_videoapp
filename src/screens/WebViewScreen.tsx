import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { scheduleNotification, setNavigationForNotifications } from '../utils/notifications';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'WebView'>;

const TEST_URL = 'https://example.com'; // change to the site you want to embed

export default function WebViewScreen(_: Props) {
  const navigation = useNavigation();
  const [lastLoadTime, setLastLoadTime] = useState<number | null>(null);

  useEffect(() => {
    // set navigation to notifications util so notification taps can navigate
    setNavigationForNotifications(navigation);
  }, [navigation]);

  async function triggerNotificationA() {
    // schedule notification in ~2s
    await scheduleNotification(
      'Notification A',
      'This is Notification A (delayed 2s). Tap to open video player.',
      2,
      { open: 'video', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    );
    Alert.alert('Scheduled', 'Notification A scheduled in 2 seconds.');
  }

  async function triggerNotificationB() {
    // schedule in ~5s
    await scheduleNotification(
      'Notification B',
      'This is Notification B (delayed 5s). Tap to open video player.',
      5,
      { open: 'video', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
    );
    Alert.alert('Scheduled', 'Notification B scheduled in 5 seconds.');
  }

  async function onWebViewLoaded() {
    setLastLoadTime(Date.now());
    // Bonus challenge: send notification when webview finishes loading
    await scheduleNotification('WebView loaded', 'The embedded site finished loading. Tap to open the video player.', 1, {
      open: 'video',
      url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.webviewContainer}>
        <WebView
          source={{ uri: TEST_URL }}
          style={{ flex: 1 }}
          onLoadEnd={() => {
            onWebViewLoaded();
          }}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <Text style={styles.infoText}>Use the buttons to schedule local notifications:</Text>
        <View style={{ marginVertical: 6 }}>
          <Button title="Trigger Notification (2s)" onPress={triggerNotificationA} />
        </View>
        <View style={{ marginVertical: 6 }}>
          <Button title="Trigger Notification (5s)" onPress={triggerNotificationB} />
        </View>
        <View style={{ marginTop: 12 }}>
          <Button title="Go to Video Player Now" onPress={() => navigation.navigate('VideoPlayer', { url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' })} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webviewContainer: { flex: 1, borderWidth: 1, borderColor: '#ddd' },
  buttonsContainer: { padding: 12, backgroundColor: '#fafafa' },
  infoText: { marginBottom: 8 }
});
