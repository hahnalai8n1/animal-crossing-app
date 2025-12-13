import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false, 
      tabBarActiveTintColor: '#5D4037',
      tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, elevation: 5 }
    }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="my_island" 
        options={{ 
          title: 'My Island',
          tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} />
        }} 
      />
    </Tabs>
  );
}