import { View, Text } from "react-native"
import { useLocalSearchParams } from "expo-router";
type Props = {
  model: string;
  make: string;
  color: string;
  boundingBox: any // use the found car from the previous image page
}

export default function Navigator() {
  const { model, make, color, boundingBox } = useLocalSearchParams<Props>();
  return <View>
    <Text>Model: {model}</Text>
    <Text>Make: {make}</Text>
    <Text>Color: {color}</Text>
  </View>;
}