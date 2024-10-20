// This is where we will continously check for the car using the model and camera
// TEAM 2 - Get access to the user's camera
// Figure out how to take pictures. Call identifyCar with the image

import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import identifyCarFromImg from "@/utilities/identifyCar";

type Props = {
    model: string;
    make: string;
    color: string;
}

<<<<<<< HEAD:app/scanner.tsx
export default function Scanner({ model, make, color}:Props) {
  return (<View>
    <Text>Scanner</Text>
    <Text>Make: {make}</Text>
    <Text>Model: {model}</Text>
=======
export default function Scanner() {
  const { model, make, color } = useLocalSearchParams<Props>();
  return (<View>
    <Text>Scanner</Text>
    <Text>Model: {model}</Text>
    <Text>Make: {make}</Text>
>>>>>>> c2a76cf81346c61eb5643e2c97f72b7648dc4d0e:app/(tabs)/scanner.tsx
    <Text>Color: {color}</Text>
  </View>);
}