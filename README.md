# WebView + Notifications + Video Player (Expo / TypeScript)

This project demonstrates:
- Embedding a website inside a WebView.
- Triggering at least two distinct local notifications (2s and 5s delays).
- A Video Player page that plays HLS streams with play/pause/fullscreen and basic progress/seek controls.
- A notification that opens the Video Player page when tapped.

## Setup

1. Clone / create project with `create-expo-app` using the blank TypeScript template.
2. Install dependencies:
3. Run:
npx expo start
4. For notifications, test on a physical device or configure local notification tooling for iOS simulators and Android emulators. Expo Go supports notifications on a physical device.

## Files
- `App.tsx` — App entry and notification setup.
- `src/navigation/RootNavigator.tsx` — Navigation stack.
- `src/screens/WebViewScreen.tsx` — WebView + buttons that schedule notifications.
- `src/screens/VideoPlayerScreen.tsx` — HLS video player using `expo-av`.
- `src/utils/notifications.ts` — Helpers for scheduling and handling notification taps.

## Notes
- Replace `TEST_URL` inside `WebViewScreen.tsx` with the site you want to embed.
- The HLS test stream used is: `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`.
- Notification behavior differs between platforms (Android vs iOS). Always test on a real device for full verification.
