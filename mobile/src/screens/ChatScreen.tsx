import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/config';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

export const ChatScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { userId, userName } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
    // Poll for new messages every 5 seconds
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const response = await api.get(`/chat/${userId}`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      await api.post('/chat/send', {
        receiverId: userId,
        content: newMessage.trim()
      });
      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === user?.id;
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: isMe ? 'flex-end' : 'flex-start',
        marginBottom: 12
      }}>
        <View style={{
          maxWidth: '80%',
          backgroundColor: isMe ? '#4F46E5' : '#F3F4F6',
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 10
        }}>
          <Text style={{
            color: isMe ? '#FFFFFF' : '#1F2937',
            fontSize: 14
          }}>
            {item.content}
          </Text>
          <Text style={{
            color: isMe ? '#E0E7FF' : '#9CA3AF',
            fontSize: 10,
            marginTop: 4,
            textAlign: 'right'
          }}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB'
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#F3F4F6',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12
        }}>
          <Ionicons name="person" size={20} color="#6B7280" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937' }}>
            {userName}
          </Text>
          <Text style={{ fontSize: 12, color: '#10B981' }}>En línea</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#6B7280' }}>Cargando mensajes...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" />
                <Text style={{ color: '#6B7280', marginTop: 12 }}>
                  Inicia la conversación
                </Text>
              </View>
            }
          />
        )}

        {/* Input */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          backgroundColor: '#FFFFFF'
        }}>
          <TouchableOpacity style={{ marginRight: 12 }}>
            <Ionicons name="add-circle-outline" size={28} color="#4F46E5" />
          </TouchableOpacity>
          <TextInput
            style={{
              flex: 1,
              backgroundColor: '#F3F4F6',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 10,
              fontSize: 14,
              maxHeight: 100
            }}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#9CA3AF"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity
            style={{
              marginLeft: 12,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: newMessage.trim() ? '#4F46E5' : '#E5E7EB',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={handleSend}
            disabled={!newMessage.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={newMessage.trim() ? '#FFFFFF' : '#9CA3AF'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
