// Identify Subject here

import { Text, View, TextInput, StyleSheet, Button } from "react-native";
import { useRouter } from 'expo-router';
import { useState } from "react";
export default function Index() {
  const router = useRouter();
  const [carInfo, setCarInfo] = useState('');
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>hello</Text>
      <TextInput style={styles.input} value={carInfo} onChangeText={setCarInfo} />
      <Button title="Submit" onPress={() => processCarInfo(carInfo, router)} />
    </View>
  );
}

const processCarInfo = (carInfo: string, router: any) => {
  // Process the car info here
  // For example, you can make an API call to get the car details
  // and then navigate to the next screen with the car details
  // using the router.push method
  carInfo.split('');

  let make = ""
  let model = ""
  let year = 0
  let color = "silver"
  let licensePlate = ""
  router.push({pathname: '/scanner', params: { make, model, color, year, licensePlate } });
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