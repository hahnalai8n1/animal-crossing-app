import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../FavoritesContext';
import { Villager } from '../_types';
import { getPastelColor } from '../_colors';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export default function MyIslandScreen() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [allVillagers, setAllVillagers] = useState<Villager[]>([]);

  // Get complete villager data for favorites
  const myVillagers = allVillagers.filter((v) => favorites.includes(v.id));

  // Fetch data (consider moving fetch logic to Context to avoid duplicate requests, simplified here)
  useEffect(() => {
    fetch('https://api.nookipedia.com/villagers?limit=100', {
      headers: { 'X-API-KEY': API_KEY || '', 'Accept-Version': '1.0.0' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAllVillagers(data);
      });
  }, []);

  // plus button
  const renderAddButton = () => (
    <TouchableOpacity
      style={styles.addButton}
      onPress={() => router.push('/villagers')} 
    >
      <Ionicons name="add" size={40} color="#5D4037" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Island 🏝️</Text>
        <Text style={styles.subtitle}>{myVillagers.length} Residents</Text>
      </View>

      <FlatList
        data={[...myVillagers, { id: 'ADD_BUTTON' } as any]}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item, index }) => {
          if (item.id === 'ADD_BUTTON') {
            return (
              <View style={styles.gridItem}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => router.push('/villagers')}
                >
                  <Ionicons name="add" size={40} color="#5D4037" />
                </TouchableOpacity>

                <Text style={styles.name}>Add</Text>
              </View>
            );
          }
          // ===============================================

          const bgColor = getPastelColor(index);

          return (
            <View style={styles.gridItem}>
              <View
                style={[styles.avatarContainer, { backgroundColor: bgColor }]}
              >
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.avatar}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#5D4037' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 5 },

  gridItem: {
    width: '33.3%', // 3 column
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 65,
    height: 65,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5D4037',
  },

  
  addButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 2,
    borderColor: '#D7CCC8',
    borderStyle: 'dashed',

    marginBottom: 8,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
