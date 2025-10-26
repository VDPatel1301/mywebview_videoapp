import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import WebViewScreen from '../screens/WebViewScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';

export type RootStackParamList = {
  WebView: undefined;
  VideoPlayer: { url?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="WebView">
      <Stack.Screen name="WebView" component={WebViewScreen} options={{ title: 'WebView + Notifications' }} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} options={{ title: 'Video Player' }} />
    </Stack.Navigator>
  );
}
