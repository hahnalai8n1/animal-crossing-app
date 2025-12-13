import { useEffect, useState } from 'react';
import { 
  ActivityIndicator, 
  FlatList, 
  Image, 
  Text, 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPastelColor } from '../_colors';
import { Villager, MUSEUM_CATEGORIES, MuseumItem } from '../_types';

export default function Index() {
  const router = useRouter();
  const [villagers, setVillagers] = useState<Villager[]>([]);
  
  const [museumTab, setMuseumTab] = useState('fish');
  const [museumData, setMuseumData] = useState<MuseumItem[]>([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

  useEffect(() => {
    fetchVillagers();
    fetchMuseumData('fish');
  }, []);

  useEffect(() => {
    fetchMuseumData(museumTab);
  }, [museumTab]);

  async function fetchVillagers() {
    try {
      const response = await fetch(
        'https://api.nookipedia.com/villagers?limit=10', 
        { headers: { 'X-API-KEY': API_KEY || '', 'Accept-Version': '1.0.0' } }
      );
      const json = await response.json();
      if (Array.isArray(json)) {
        setVillagers(json);
      }
      setLoading(false);
    } catch (e) {
      console.error("Villager Error:", e);
    }
  }

  async function fetchMuseumData(category: string) {
    try {
      const url = `https://api.nookipedia.com/nh/${category}`;
      const response = await fetch(
        url, 
        { headers: { 'X-API-KEY': API_KEY || '', 'Accept-Version': '1.0.0' } }
      );
      const json = await response.json();
      
      if (!Array.isArray(json)) {
        setMuseumData([]);
        return;
      }

      const previewData = json
        .filter((item: any) => item.image_url) 
        .slice(0, 6); 

      setMuseumData(previewData);
    } catch (e) {
      console.error("Museum Error:", e);
      setMuseumData([]);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4db6ac" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🏝️ Animal Crossing 🍃</Text>
          <Text style={styles.headerSubtitle}>Welcome to your island dashboard!</Text>
        </View>

        {/* ================= VILLAGERS ================= */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Villagers</Text>
          <TouchableOpacity onPress={() => router.push('/villagers')}>
            <Text style={styles.showAll}>Show all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={villagers}
          horizontal={true} 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item, index }) => {
            // Generate colors using the new function
            const bgColor = getPastelColor(index);
            return (
              <View style={[styles.villagerCard, { backgroundColor: bgColor }]}>
                <Image 
                  source={{ uri: item.image_url }} 
                  style={styles.floatingImage} 
                  resizeMode="contain"
                />
                <View style={styles.textWrapper}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.cardQuote} numberOfLines={2}>
                    "{item.quote}"
                  </Text>
                </View>
              </View>
            );
          }}
        />

        {/* ================= MUSEUM ================= */}
        <View style={[styles.sectionHeader, { marginTop: 0 }]}> 
          <Text style={styles.sectionTitle}>Museum</Text>
          <TouchableOpacity onPress={() => router.push('/museum')}>
            <Text style={styles.showAll}>Show all</Text>
          </TouchableOpacity>
        </View>

        {/* === Tabs (Updated Style) === */}
        <View style={styles.tabContainer}>
          {MUSEUM_CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              onPress={() => setMuseumTab(cat.id)}
              style={[
                styles.tabButton, 
                museumTab === cat.id && styles.tabButtonActive
              ]}
            >
              <Text style={[
                styles.tabText, 
                museumTab === cat.id && styles.tabTextActive
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Grid Container */}
        <View style={styles.gridContainer}>
          {museumData.map((item: any, index) => {
             // The index plus the offset, ensures that it is different from the villager's color.
             const bgColor = getPastelColor(index + 50); 

             return (
              <View key={index} style={[styles.museumCard, { backgroundColor: bgColor }]}>
                <Image 
                  source={{ uri: item.image_url }} 
                  style={styles.floatingImageMuseum} 
                  resizeMode="contain"
                />
                <View style={styles.textWrapperMuseum}>
                  <Text style={styles.museumTitle} numberOfLines={1}>{item.name}</Text>
                </View>
              </View>
            );
          })}
        </View>
        
        <View style={{height: 50}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, paddingTop: 10, paddingBottom: 5 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#333' }, 
  headerSubtitle: { fontSize: 14, color: '#888', marginTop: 5 },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15, marginTop: 15
  },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  showAll: { fontSize: 14, color: '#5d4037c0', fontWeight: '600' }, 
  
  // === Villager Card ===
  villagerCard: {
    width: 130,  
    height: 160, 
    marginRight: 15, 
    borderRadius: 24, 
    padding: 12, 
    alignItems: 'center', 
    justifyContent: 'flex-end', 
    marginTop: 50, 
  },
  floatingImage: { 
    width: 120,    
    height: 135,   
    position: 'absolute', 
    top: -50,      
    zIndex: 1,
  },
  
  // === Museum Card ===
  museumCard: {
    width: '48%',         
    height: 70,           
    borderRadius: 18, 
    padding: 10, 
    marginBottom: 15,     
    marginTop: 20,        
    alignItems: 'center', 
    justifyContent: 'flex-end', 
  },
  floatingImageMuseum: {
    width: 70,           
    height: 70, 
    position: 'absolute',
    top: -25,            
    right: 5,            
    zIndex: 1,
  },
  
  textWrapper: { marginTop: 85, alignItems: 'center', width: '100%' },
  
  textWrapperMuseum: { 
    width: '100%', 
    alignItems: 'flex-start', 
    paddingLeft: 5,
    marginBottom: 5 
  }, 
  
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#5D4037', marginBottom: 4 },
  cardQuote: { fontSize: 10, color: '#8D6E63', textAlign: 'center', fontStyle: 'italic' },
  
  museumTitle: { fontSize: 14, fontWeight: 'bold', color: '#5D4037' },

  tabContainer: { 
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    marginBottom: 15, 
    justifyContent: 'space-between' 
  },
  tabButton: { 
    paddingVertical: 8,      
    paddingHorizontal: 16,   
    borderRadius: 15,        
    backgroundColor: '#f5f5f5' 
  },
  tabButtonActive: { 
    backgroundColor: '#E0F7FA' // Color when selected
  },
  tabText: { 
    fontSize: 13, 
    color: '#888', 
    fontWeight: '600' 
  }, 
  tabTextActive: { 
    color: '#006064', 
    fontWeight: 'bold' 
  },
  
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
});