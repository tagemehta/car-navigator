import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', headerShown:false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="search" color={color} />,
          href: {
            pathname: '/scanner',
            params: { make: 'Toyota', model: 'Highlander', color: 'red' }
          }
        }}
        
      />
            <Tabs.Screen
        name="navigator"
        options={{
          title: 'Navigator',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="location-arrow" color={color} />,
          href: {
            pathname: '/navigator',
            params: { make: 'Toyota', model: 'Highlander', color: 'red' }
          }
        }}
        
      />
    </Tabs>
  );
}
