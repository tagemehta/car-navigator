// This is where we will continously check for the car using the model and camera

import { Text, View } from "react-native";

type Props = {
    model: string;
    make: string;
    color: string;
}

export default function Scanner({ model, make, color}:Props) {
  return (<View></View>);
}