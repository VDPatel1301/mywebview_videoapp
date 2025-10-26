import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { RouteProp, useRoute } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/RootNavigator';
import Slider from '@react-native-community/slider';

type VideoRouteProp = RouteProp<RootStackParamList, 'VideoPlayer'>;

export default function VideoPlayerScreen() {
  const route = useRoute<VideoRouteProp>();
  const videoRef = useRef<Video | null>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const url = route.params?.url ?? 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

  async function onPlayPause() {
    if (!videoRef.current || !status) return;
    if (status.isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  }

  async function onEnterFullscreen() {
    try {
      if (videoRef.current) {
        // expo-av provides methods to present fullscreen player on supported platforms
        await videoRef.current.presentFullscreenPlayer();
      }
    } catch (err) {
      console.warn('Fullscreen not available', err);
    }
  }

  function onSeek(sliderVal: number) {
    if (!videoRef.current || !status || typeof status.durationMillis !== 'number') return;
    const positionMillis = sliderVal * status.durationMillis;
    videoRef.current.setPositionAsync(positionMillis);
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: url }}
          style={styles.video}
          useNativeControls={false} // we'll implement controls below
          resizeMode="contain"
          onPlaybackStatusUpdate={(s) => {
            setStatus(s);
            setIsBuffering(!!s.isBuffering);
          }}
          shouldPlay={false}
          isLooping={false}
        />
        {isBuffering && (
          <View style={styles.bufferOverlay}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.controlButton} onPress={onPlayPause}>
            <Text>{status?.isPlaying ? 'Pause' : 'Play'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={onEnterFullscreen}>
            <Text>Fullscreen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={async () => {
              if (videoRef.current) {
                await videoRef.current.setStatusAsync({ positionMillis: 0 });
              }
            }}
          >
            <Text>Restart</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text>
            {status?.positionMillis ? Math.floor((status.positionMillis / 1000)) : 0}s /
            {status?.durationMillis ? Math.floor((status.durationMillis / 1000)) : 0}s
          </Text>
          <Slider
            value={status && status.durationMillis ? (status.positionMillis! / status.durationMillis!) : 0}
            onValueChange={onSeek}
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={1}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  videoContainer: { height: 260, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  video: { width: '100%', height: '100%' },
  bufferOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  controls: { padding: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
  controlButton: { padding: 10, backgroundColor: '#eee', borderRadius: 6 }
});
