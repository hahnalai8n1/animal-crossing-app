import { useEffect, useState } from 'react';
import { 
  View, 
  FlatList, 
  Image, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import { Stack } from 'expo-router';
import { getPastelColor } from './_colors';
import { MuseumItem, MUSEUM_CATEGORIES } from './_types';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;


export default function MuseumScreen() {
  const [data, setData] = useState<MuseumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('fish');

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  async function fetchData(category: string) {
    setLoading(true);
    try {
      const url = `https://api.nookipedia.com/nh/${category}`;
      const response = await fetch(url, {
        headers: { 'X-API-KEY': API_KEY || '', 'Accept-Version': '1.0.0' }
      });
      const json = await response.json();
      
      if (Array.isArray(json)) {
        const validData = json.filter((item: any) => item.image_url);
        setData(validData);
      } else {
        setData([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Museum Collection', 
          headerBackTitle: 'Home',
          headerTintColor: '#5D4037',
          headerStyle: { backgroundColor: '#fff' },
          headerShadowVisible: false,
        }} 
      />

      {/* === Category Tabs === */}
      <View style={styles.tabContainer}>
        {MUSEUM_CATEGORIES.map((cat) => (
          <TouchableOpacity 
            key={cat.id} 
            onPress={() => setActiveTab(cat.id)}
            style={[
              styles.tabButton, 
              activeTab === cat.id && styles.tabButtonActive
            ]}
          >
            <Text style={[
              styles.tabText, 
              activeTab === cat.id && styles.tabTextActive
            ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* === Content List === */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4db6ac"/>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item: any) => item.name + item.id}
          numColumns={3} 
          contentContainerStyle={{ padding: 15, paddingTop: 20 }}
          columnWrapperStyle={{ gap: '3.5%' }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const bgColor = getPastelColor(index + 20);

            return (
              <View style={[styles.card, { backgroundColor: bgColor }]}>
                
                <Image 
                  source={{ uri: item.image_url }} 
                  style={styles.floatingImage} 
                  resizeMode="contain" 
                />
                
                <View style={styles.textWrapper}>
                  <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Tabs Styles
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#f9f9f9',
  },
  tabButtonActive: {
    backgroundColor: '#E0F7FA',
  },
  tabText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#006064',
    fontWeight: 'bold',
  },

  // Card Styles
  card: {
    width: '31%', 
    marginBottom: 35, 
    marginTop: 25,    
    borderRadius: 16, 
    padding: 10,
    alignItems: 'center',
    height: 110,      
    justifyContent: 'flex-end',
  },
  
  floatingImage: { 
    width: 80,       
    height: 80, 
    position: 'absolute',
    top: -25,        
    zIndex: 1, 
  },
  
  textWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8, 
  },
  
  name: { 
    fontSize: 14,    
    fontWeight: 'bold', 
    color: '#5D4037', 
    textAlign: 'center'
  },
});