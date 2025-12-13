import { useEffect, useState } from 'react';
import { View, FlatList, Image, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { getPastelColor } from './_colors';
import { Villager } from './_types';
import { useFavorites } from './FavoritesContext'; 
import { Stack } from 'expo-router';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export default function VillagersScreen() {
  const [villagers, setVillagers] = useState<Villager[]>([]);
  const [filteredVillagers, setFilteredVillagers] = useState<Villager[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // self-defined hook
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    fetchVillagers();
  }, []);

  // Search filter logic
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredVillagers(villagers);
    } else {
      setFilteredVillagers(
        villagers.filter(v => v.name.toLowerCase().includes(search.toLowerCase()))
      );
    }
  }, [search, villagers]);

  const fetchVillagers = async () => {
    try {
      const response = await fetch('https://api.nookipedia.com/villagers?limit=100', { 
        headers: { 'X-API-KEY': API_KEY || '', 'Accept-Version': '1.0.0' }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setVillagers(data);
        setFilteredVillagers(data);
      }
    } catch (e) {
      console.error(e);
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
      <Stack.Screen 
        options={{ 
          title: 'All Villagers',
          headerBackTitle: 'Home',      
          headerTintColor: '#5D4037',   
          headerStyle: { backgroundColor: '#fff' },
          headerShadowVisible: false,  
        }} 
      />
      {/* === Search Bar === */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search villagers..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredVillagers}
        keyExtractor={(item) => item.id}
        numColumns={2} 
        contentContainerStyle={{ padding: 15, paddingTop: 25 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }} 
        renderItem={({ item, index }) => {
          const bgColor = getPastelColor(index);
          const fav = isFavorite(item.id); 

          return (
            <View style={[styles.card, { backgroundColor: bgColor }]}>
              
              {/* === Heart Icon Button === */}
              <TouchableOpacity 
                style={styles.heartButton} 
                onPress={() => toggleFavorite(item.id)}
              >
                <Ionicons 
                  name={fav ? "heart" : "heart-outline"} 
                  size={24} 
                  color={fav ? "#e91e63" : "#5D4037"} 
                />
              </TouchableOpacity>

              <Image 
                source={{ uri: item.image_url }} 
                style={styles.floatingImage} 
                resizeMode="contain" 
              />
              <View style={styles.textWrapper}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.quote} numberOfLines={2}>"{item.quote}"</Text>
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
  
  // Search bar styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 45,
  },
  searchInput: { flex: 1, height: '100%' },

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

  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10, 
    backgroundColor: 'rgba(255,255,255,0.5)', // Semi-transparent background makes it easier to see
    borderRadius: 15,
    padding: 4,
  },
  floatingImage: { 
    width: 120, height: 120, position: 'absolute', top: -45, zIndex: 1, 
  },
  textWrapper: { marginTop: 65, alignItems: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#5D4037', marginBottom: 6 },
  quote: { fontSize: 11, color: '#8D6E63', textAlign: 'center', fontStyle: 'italic' }
});