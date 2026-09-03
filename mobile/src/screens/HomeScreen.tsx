import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/config';

interface Post {
  id: string;
  title: string;
  description: string;
  category: { name: string };
  budget: number;
  location: any;
  createdAt: string;
  offersCount: number;
}

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data.data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
      }}
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <View
          style={{
            backgroundColor: '#EEF2FF',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8
          }}
        >
          <Text style={{ color: '#4F46E5', fontSize: 12, fontWeight: '500' }}>
            {item.category.name}
          </Text>
        </View>
        <Text style={{ color: '#9CA3AF', fontSize: 12 }}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 8 }}>
        {item.title}
      </Text>
      <Text
        style={{ fontSize: 14, color: '#6B7280', marginBottom: 12 }}
        numberOfLines={2}
      >
        {item.description}
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="cash-outline" size={16} color="#10B981" />
          <Text style={{ color: '#10B981', fontWeight: '600', marginLeft: 4 }}>
            ${item.budget}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="people-outline" size={16} color="#6B7280" />
          <Text style={{ color: '#6B7280', marginLeft: 4 }}>
            {item.offersCount} ofertas
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          paddingHorizontal: 24,
          paddingVertical: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <View>
          <Text style={{ fontSize: 14, color: '#6B7280' }}>Hola, 👋</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937' }}>
            {user?.fullName}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ marginRight: 16 }}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-circle-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 48 }}>
            <Ionicons name="search-outline" size={64} color="#D1D5DB" />
            <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 16 }}>
              No hay publicaciones disponibles
            </Text>
          </View>
        }
      />

      {/* FAB */}
      {user?.userType === 'client' && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#4F46E5',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#4F46E5',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6
          }}
          onPress={() => navigation.navigate('CreatePost')}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};
