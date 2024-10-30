// This is where we will continously check for the car using the model and camera
// TEAM 2 - Get access to the user's camera
// Figure out how to take pictures. Call identifyCar with the image
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef} from 'react';
import { Button, StyleSheet, Text, Touchable, View,  TouchableOpacity} from 'react-native';
import { useLocalSearchParams, useRouter } from "expo-router";
import identifyCarFromImg from "@/utilities/identifyCar";
import * as Speech from 'expo-speech';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [camReady, setCamReady] = useState(false);
  const [outputText, setOutputText] = useState('');
  const obj = useLocalSearchParams<Props>();
  const {make, model, color} = obj;
  const camRef = useRef<CameraView>(null);
  const router = useRouter();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const takePic = async () => {
    if (camReady && camRef.current) {
      let result = await camRef.current.takePictureAsync({base64: true});
      if (result?.base64) {
        let res = await identifyCarFromImg(result.base64, obj);
        if (res == 'correct') {
          setOutputText('Car found!');
          router.push({pathname: '/navigator', params: { make, model, color} });
        } else if (res == 'no_car') {
          setOutputText('No car found, retaking picture!');
          takePic();
        } else if (res == 'incorrect') {
          setOutputText('Incorrect car found, retaking picture!');
          takePic();
        }
        if (outputText != "") {
          Speech.speak(outputText);
        }
      } else {
        setOutputText('Looking for car!');
      }
    }
  }

  const handleSwipeOpen = (direction: "left" | "right", swipeable: Swipeable) => {
    if (direction === "right") {
      console.log('Swiped left');
      // Add your logic for handling the swipe left gesture here
      router.push('/'); // Example: Navigate to home screen
    } else if (direction === "left") {
      console.log('Swiped right');
      // Add your logic for handling the swipe right gesture here
    }
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={() => <View style={{ flex: 1, backgroundColor: 'blue' }} />}
        onSwipeableOpen={handleSwipeOpen}
      >
        <CameraView ref={camRef} style={styles.camera} facing={facing} onCameraReady={() => setCamReady(true)}>
          <View style={styles.outputContainer}>
            <Text style={styles.outputText}>{outputText}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            {camReady && (
              <TouchableOpacity onPress={takePic} style={styles.button}>
                <Text style={styles.text}>Take Picture</Text>
              </TouchableOpacity>
            )}
          </View>
        </CameraView>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    
    height: "100%",
    width: "100%"
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    marginHorizontal: '5%',
  },
  button: {
    fontSize: 24,
    marginHorizontal: '5%',
    borderWidth: 4,
    borderColor: 'white',
    padding: 4,
    color: 'white',
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  outputText: {
    color: 'white',
    fontSize: 24,
  },
  outputContainer: {
    alignItems: 'center',
    marginTop: 200,
  
  }
});




type Props = {
    model: string;
    make: string;
    color: string;
}

// export default function Scanner() {
//   const { model, make, color } = useLocalSearchParams<Props>();
//   return (<View>
//     <Text>Scanner</Text>
//     <Text>Model: {model}</Text>
//     <Text>Make: {make}</Text>
//     <Text>Color: {color}</Text>
//   </View>);
// }