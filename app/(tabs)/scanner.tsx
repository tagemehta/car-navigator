// This is where we will continously check for the car using the model and camera
// TEAM 2 - Get access to the user's camera
// Figure out how to take pictures. Call identifyCar with the image
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef} from 'react';
import { Button, StyleSheet, Text, Touchable, View,  TouchableOpacity} from 'react-native';
import { useLocalSearchParams, useRouter } from "expo-router";
import identifyCarFromImg from "@/utilities/identifyCar";
import navigateToCar from '@/utilities/navigator';
import * as Speech from 'expo-speech';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
  import { Vibration } from 'react-native';

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
          setOutputText('Car found!')
          let car_in_frame = true;
          let past_car_loc = "unknown"
          while(car_in_frame) {
            let car_pic = await camRef.current.takePictureAsync({base64: true});
            if (car_pic?.base64) {
              let car_loc = await navigateToCar(car_pic.base64, obj)
              if (car_loc == "Left") {
                setOutputText('Car is on the left. Slowly turn left!')
                past_car_loc = "left"
              } else if (car_loc == "Right") {
                setOutputText('Car is on the right. Slowly turn right!')
                past_car_loc = "right"
              } else if (car_loc == "Center") {
                setOutputText('Car is centered. Move forward!')
                past_car_loc = "center"
              } else if (car_loc == "no_car") {
                setOutputText(`Car is no longer in the frame. It was last seen on the ${past_car_loc} of the camera frame. Rotate your camera to locate the car again.`)
                car_in_frame = false
              }
              if (outputText != "") {
                Speech.speak(outputText);
              }
            }
          }
          takePic();
        }
        else if (res == 'no_car') {
          setOutputText('No car found, retaking picture!')
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
    Vibration.vibrate(100); // Vibrate for 100 milliseconds upon swiping
    if (direction === "right") {
      console.log('Swiped left');
      swipeable.close();
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