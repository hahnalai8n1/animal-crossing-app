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

// Morandi Color Palette
const PASTEL_COLORS = [
  '#FFEBEE', // Light Pink
  '#E3F2FD', // Light Blue
  '#F3E5F5', // Light Purple
  '#E8F5E9', // Light Green
  '#FFF3E0', // Light Orange
  '#E0F7FA', // Light Cyan
  '#F1F8E9', // Light Yellow-Green
  '#FFF8E1', // Light Amber
  '#d5e8f5b7', // Light Blue-Grey
  '#F9FBE7', // Light Lemon
  '#e4eaeeff', // Light Blue-Grey
];

interface Villager {
  id: string;
  name: string;
  image_url: string;
  quote: string;
}

export default function Index() {
  const router = useRouter();
  const [villagers, setVillagers] = useState<Villager[]>([]);
  const [museumTab, setMuseumTab] = useState<'fish' | 'sea' | 'bugs' | 'art'>('fish');
  const [museumData, setMuseumData] = useState<any[]>([]);
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
        { headers: { 'X-API-KEY': API_KEY, 'Accept-Version': '1.0.0' } }
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
        { headers: { 'X-API-KEY': API_KEY, 'Accept-Version': '1.0.0' } }
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
            const bgColor = PASTEL_COLORS[index % PASTEL_COLORS.length];
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
          <Text style={styles.showAll}>Show all</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {['fish', 'sea', 'bugs', 'art'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setMuseumTab(tab as any)}
              style={[
                styles.tabButton, 
                museumTab === tab && styles.tabButtonActive
              ]}
            >
              <Text style={[
                styles.tabText, 
                museumTab === tab && styles.tabTextActive
              ]}>
                {tab === 'sea' ? 'Sea' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Grid Container */}
        <View style={styles.gridContainer}>
          {museumData.map((item: any, index) => {
             const bgColor = PASTEL_COLORS[(index + 3) % PASTEL_COLORS.length]; 

             return (
              <View key={index} style={[styles.museumCard, { backgroundColor: bgColor }]}>
                
                {/* Floating Image */}
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
  showAll: { fontSize: 14, color: '#4db6ac', fontWeight: '600' }, 
  
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
  
  // === Common Text Styles ===
  textWrapper: { marginTop: 85, alignItems: 'center', width: '100%' },
  
  // Specific styles for Museum text
  textWrapperMuseum: { 
    width: '100%', 
    alignItems: 'flex-start', 
    paddingLeft: 5,
    marginBottom: 5 
  }, 
  
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#5D4037', marginBottom: 4 },
  cardQuote: { fontSize: 10, color: '#8D6E63', textAlign: 'center', fontStyle: 'italic' },
  
  // Smaller font for Museum
  museumTitle: { fontSize: 14, fontWeight: 'bold', color: '#5D4037' },

  // === Tabs ===
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10, justifyContent: 'space-between' },
  tabButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20, backgroundColor: 'transparent' },
  tabButtonActive: { backgroundColor: '#E0F7FA' },
  tabText: { fontSize: 13, color: '#999', fontWeight: '600' }, 
  tabTextActive: { color: '#006064', fontWeight: 'bold' },
  
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
});