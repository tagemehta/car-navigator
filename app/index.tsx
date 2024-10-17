// Identify Subject here
// TEAM 1 - Get access to the user's clipboard https://docs.expo.dev/versions/latest/sdk/clipboard/
// Then use parseCarInfo to get the make, model, and color

import { Text, View, TextInput, StyleSheet, Button } from "react-native";
import { useRouter } from 'expo-router';
import { useState } from "react";
import parseCarInfo from "@/utilities/parseCarInfo";

export default function Index() {
  const router = useRouter();
  const [carInfo, setCarInfo] = useState('');
  return (
    <View
      style={{
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Please provide the car's make, model and year, separated by a comma</Text>
      <TextInput style={styles.input} value={carInfo} onChangeText={setCarInfo} />
      <Button title="Submit" onPress={() => processCarInfo(carInfo, router)} />
        <Button title="Go to Camera" onPress={() => router.push('/camera')} />
    </View>
  );
}

const processCarInfo = (carInfo: string, router: any) => {
  // Process the car info here
  // For example, you can make an API call to get the car details
  // and then navigate to the next screen with the car details
  // using the router.push method
  carInfo.split(',');
  let make = carInfo[0];
  let model = carInfo[1];
  let year = carInfo[2];
  let color = "silver"
  let licensePlate = ""
  router.push({pathname: '/scanner', params: { make, model, color, year, licensePlate } });
  // Navigate to the scanner page
  
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