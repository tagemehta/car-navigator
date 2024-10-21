import { useCameraPermission, useCameraDevice, Camera } from "react-native-vision-camera"
import { useRouter } from "expo-router"
import {View, Text, Button, StyleSheet} from "react-native"
import * as Haptics from 'expo-haptics';
export default function App(){
    const { hasPermission, requestPermission } = useCameraPermission()
    const router = useRouter();
    if (!hasPermission) {
        // Camera permissions are not granted yet.
        return (
        <View style={styles.container}>
          <Text style={styles.message}>We need your permission to show the camera</Text>
          <Button onPress={() => {
            requestPermission();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }} title="grant permission" />
        </View>
        );
      }
    const device = useCameraDevice('back')
    if (device == null) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>No camera device found</Text>
            </View>
        );
    }
    return (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
        />
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    message: {
      textAlign: 'center',
      paddingBottom: 10,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 64,
    },
    button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
  });
  