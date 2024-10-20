import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
export default function RootLayout() {
  return (
    <SafeAreaView style={{flex:1}}>
      <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}
