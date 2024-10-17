// This is where we will continously check for the car using the model and camera
// TEAM 2 - Get access to the user's camera
// Figure out how to take pictures. Call identifyCar with the image

import { Text, View } from "react-native";
import identifyCarFromImg from "@/utilities/identifyCar";

type Props = {
    model: string;
    make: string;
    color: string;
}

export default function Scanner({ model, make, color}:Props) {
  return (<View>
    <Text>Scanner</Text>
    <Text>Make: {make}</Text>
    <Text>Model: {model}</Text>
    <Text>Color: {color}</Text>
  </View>);
}