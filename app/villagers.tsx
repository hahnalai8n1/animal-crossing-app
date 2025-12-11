import { useEffect, useState } from 'react';
import { View, FlatList, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getPastelColor } from './_colors';
import { Villager } from './_types';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;


export default function VillagersScreen() {
  const [villagers, setVillagers] = useState<Villager[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVillagers();
  }, []);

  const fetchVillagers = async () => {
    try {
      const response = await fetch('https://api.nookipedia.com/villagers?limit=50', {
        headers: { 
          'X-API-KEY': API_KEY || '', 
          'Accept-Version': '1.0.0' 
        }
      });
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setVillagers(data);
      }
    } catch (e) {
      console.error("Error fetching villagers:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5D4037"/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={villagers}
        keyExtractor={(item) => item.id}
        numColumns={2} 
        contentContainerStyle={{ padding: 15, paddingTop: 40 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }} 
        renderItem={({ item, index }) => {
    
          const bgColor = getPastelColor(index);

          return (
            <View style={[styles.card, { backgroundColor: bgColor }]}>
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
    borderRadius: 20, 
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
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