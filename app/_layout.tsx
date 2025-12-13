import { Stack } from 'expo-router';
import { FavoritesProvider } from './FavoritesContext'; 

export default function Layout() {
  return (
    <FavoritesProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Point to the tabs folder */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* These detail pages remain in the Stack, overlaying the Tabs */}
        <Stack.Screen 
          name="villagers" 
          options={{ title: 'All Villagers', headerShown: true, headerBackTitle: 'Back' }} 
        />
        <Stack.Screen 
          name="museum" 
          options={{ title: 'Museum', headerShown: true, headerBackTitle: 'Back' }} 
        />
      </Stack>
    </FavoritesProvider>
  );
}