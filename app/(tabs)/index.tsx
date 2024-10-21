import { Camera, useCameraPermission, useCameraDevice } from 'react-native-vision-camera'
import { Text } from 'react-native';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
export default function App() {
  const device = useCameraDevice('back')
  const { hasPermission, requestPermission } = useCameraPermission()
  useEffect(() => {
    if (!hasPermission) {
      requestPermission()
    }
  }, [])
  if (!hasPermission) return <Text>No Permission</Text>;
  if (device == null) return <Text>No Device</Text>;
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
  )
}
