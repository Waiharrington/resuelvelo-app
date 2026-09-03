import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/config';

interface Conversation {
  userId: string;
  fullName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export const ChatsListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await api.get('/chat');
      setConversations(response.data.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6'
      }}
      onPress={() => navigation.navigate('Chat', {
        userId: item.userId,
        userName: item.fullName
      })}
    >
      <View style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
      }}>
        <Ionicons name="person" size={24} color="#6B7280" />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: '#1F2937' }}>
            {item.fullName}
          </Text>
          <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
            {item.lastMessageTime}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 14, color: '#6B7280', flex: 1 }} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={{
              backgroundColor: '#4F46E5',
              borderRadius: 10,
              minWidth: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 8
            }}>
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '500' }}>
                {item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      {/* Header */}
      <View style={{
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB'
      }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1F2937' }}>
          Mis Conversaciones
        </Text>
      </View>

      {/* Conversations List */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#6B7280' }}>Cargando conversaciones...</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.userId}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" />
              <Text style={{ color: '#6B7280', marginTop: 12, fontSize: 16 }}>
                No hay conversaciones aún
              </Text>
              <Text style={{ color: '#9CA3AF', marginTop: 4, fontSize: 14 }}>
                Inicia una chat desde una publicación
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};
