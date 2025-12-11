import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerShadowVisible: false,
        headerTintColor: '#5D4037', 
        headerTitleStyle: { fontWeight: 'bold', color: '#5D4037' },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="villagers" 
        options={{ 
          title: 'All Villagers',
          headerBackTitle: 'Home',
        }} 
      />
      <Stack.Screen 
        name="museum" 
        options={{ 
          title: 'Museum Collection',
          headerBackTitle: 'Home',
        }} 
      />
    </Stack>
  );
}