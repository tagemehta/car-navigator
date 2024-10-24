// This is where we will continously check for the car using the model and camera
// TEAM 2 - Get access to the user's camera
// Figure out how to take pictures. Call identifyCar with the image

import { Text, View, Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
import identifyCarFromImg from "@/utilities/identifyCar";

type Props = {
    model: string;
    make: string;
    color: string;
}

export default function Scanner() {
  const { model, make, color } = useLocalSearchParams<Props>();
  return (<View>
    <Text>Scanner</Text>
    <Text>Model: {model}</Text>
    <Text>Make: {make}</Text>
    <Text>Color: {color}</Text>
    <Button onPress={identifyCarFromImg} title="Identify Car"></Button>
  </View>);
}