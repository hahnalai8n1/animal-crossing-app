import { useEffect, useState } from 'react';
import { View, FlatList, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';

const PASTEL_COLORS = [
  '#FFEBEE', '#E3F2FD', '#F3E5F5', '#E8F5E9', '#FFF3E0', 
  '#F1F8E9', '#E0F7FA', '#FFF8E1', '#F9FBE7', '#ECEFF1',
];

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export default function VillagersScreen() {
  const [villagers, setVillagers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.nookipedia.com/villagers?limit=50', {
      headers: { 'X-API-KEY': API_KEY, 'Accept-Version': '1.0.0' }
    })
    .then(res => res.json())
    .then(data => {
      if(Array.isArray(data)) setVillagers(data);
      setLoading(false);
    })
    .catch(e => console.error(e));
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#4db6ac"/></View>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'All Villagers', headerBackTitle: 'Home', headerTintColor: '#4db6ac' }} />

      <FlatList
        data={villagers}
        keyExtractor={(item: any) => item.id}
        numColumns={2} 
        // Increase top padding to prevent the 'head' of the first row from being cut off
        contentContainerStyle={{ padding: 15, paddingTop: 40 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }} 
        renderItem={({ item, index }) => {
          const bgColor = PASTEL_COLORS[index % PASTEL_COLORS.length];

          return (
            <View style={[styles.card, { backgroundColor: bgColor }]}>
              {/* Floating image: half-head effect */}
              <Image 
                source={{ uri: item.image_url }} 
                style={styles.floatingImage} 
                resizeMode="contain" 
              />
              
              <View style={styles.textWrapper}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.quote} >
                  "{item.quote}"
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  card: {
    width: '48%', 
    marginBottom: 60, 
    marginTop: 20,    
    borderRadius: 20, // Rounded corners
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start', // Align content from the top
    minHeight: 160, 
    paddingBottom: 10,
  },
  
  floatingImage: { 
    width: 120,      
    height: 120, 
    position: 'absolute',
    top: -45,       
    zIndex: 1, 
  },
  
  textWrapper: {
    // Calculate distance. Image height 100 (approx), top -40, overlaps inside by 60.
    // Set to around 60 to let text hug the image tightly
    marginTop: 65, 
    alignItems: 'center',
  },
  
  name: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#5D4037', 
    marginBottom: 6,
    textAlign: 'center'
  },
  quote: { 
    fontSize: 11, 
    color: '#8D6E63', 
    textAlign: 'center', 
    fontStyle: 'italic',
    lineHeight: 14,
  }
});