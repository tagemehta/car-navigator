// Identify Subject here
// TEAM 1 - Get access to the user's clipboard https://docs.expo.dev/versions/latest/sdk/clipboard/
// Then use parseCarInfo to get the make, model, and color

import { Text, View, TextInput, StyleSheet, Button } from "react-native";
import { useRouter } from 'expo-router';
import { useState } from "react";
import parseCarInfo from "@/utilities/parseCarInfo";
import { GestureHandlerRootView, TapGestureHandler } from "react-native-gesture-handler";
import * as Clipboard from 'expo-clipboard';


export default function Index() {
  const router = useRouter();
  const [carInfo, setCarInfo] = useState('');
  const handleDoubleTap = async () => {
    const clipboardContent = await Clipboard.getStringAsync();
    processCarInfo(clipboardContent, router);
  };
  return (
    <GestureHandlerRootView>
      <TapGestureHandler
        numberOfTaps={2}
        onActivated={handleDoubleTap}
      >
    <View
      style={{
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Please provide a description of the car: </Text>
      <TextInput style={styles.input} value={carInfo} onChangeText={setCarInfo} />
      <Button title="Submit" onPress={() => processCarInfo(carInfo, router)} />
    </View>
    </TapGestureHandler>
    </GestureHandlerRootView>
  );
}

const processCarInfo = (carInfo: string, router: any) => {
  // Process the car info here
  // For example, you can make an API call to get the car details
  // and then navigate to the next screen with the car details
  // using the router.push method
  // const parsed_text=carInfo.split(' ');
  // let color = parsed_text[0];
  // let model = parsed_text[1];
  // let make = parsed_text[2]
  // let licensePlate = ""
  router.push({pathname: '/scanner', params: { description: carInfo} });
};
const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
