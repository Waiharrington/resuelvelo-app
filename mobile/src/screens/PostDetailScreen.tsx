import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/config';

interface Post {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: string;
  createdAt: string;
  category: { name: string; icon: string };
  client: { id: string; fullName: string; avatarUrl: string };
  offers: Offer[];
}

interface Offer {
  id: string;
  price: number;
  message: string;
  status: string;
  createdAt: string;
  provider: { id: string; fullName: string; avatarUrl: string };
}

export const PostDetailScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { postId } = route.params;
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, []);

  const loadPost = async () => {
    try {
      const response = await api.get(`/posts/${postId}`);
      setPost(response.data.data);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    Alert.alert(
      'Aceptar Oferta',
      '¿Estás seguro de que quieres aceptar esta oferta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              await api.put(`/offers/${offerId}/accept`);
              Alert.alert('Éxito', 'Oferta aceptada');
              loadPost();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Error al aceptar oferta');
            }
          }
        }
      ]
    );
  };

  const handleMakeOffer = () => {
    navigation.navigate('MakeOffer', { postId: post?.id, postTitle: post?.title });
  };

  const handleChat = () => {
    if (post?.client?.id) {
      navigation.navigate('Chat', { userId: post.client.id, userName: post.client.fullName });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#6B7280' }}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#6B7280' }}>Publicación no encontrada</Text>
      </SafeAreaView>
    );
  }

  const isOwner = user?.id === post.client?.id;
  const isProvider = user?.userType === 'provider';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <ScrollView>
        {/* Header */}
        <View style={{
          backgroundColor: '#FFFFFF',
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB'
        }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={{ flex: 1, fontSize: 18, fontWeight: '600', color: '#1F2937' }}>
            Detalles
          </Text>
          <TouchableOpacity onPress={handleChat}>
            <Ionicons name="chatbubble-outline" size={24} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        {/* Post Info */}
        <View style={{ backgroundColor: '#FFFFFF', marginTop: 8, padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <View style={{
              backgroundColor: '#EEF2FF',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8
            }}>
              <Text style={{ color: '#4F46E5', fontSize: 12, fontWeight: '500' }}>
                {post.category?.name}
              </Text>
            </View>
            <View style={{
              backgroundColor: post.status === 'active' ? '#D1FAE5' : '#FEE2E2',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8
            }}>
              <Text style={{
                color: post.status === 'active' ? '#059669' : '#DC2626',
                fontSize: 12,
                fontWeight: '500'
              }}>
                {post.status === 'active' ? 'Activo' : 'Cerrado'}
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 }}>
            {post.title}
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 16 }}>
            {post.description}
          </Text>

          {/* Budget */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="cash-outline" size={20} color="#10B981" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#10B981', marginLeft: 8 }}>
              ${post.budget}
            </Text>
          </View>

          {/* Deadline */}
          {post.deadline && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="time-outline" size={20} color="#F59E0B" />
              <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 8 }}>
                Fecha límite: {new Date(post.deadline).toLocaleDateString()}
              </Text>
            </View>
          )}

          {/* Client */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
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
            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#1F2937' }}>
                {post.client?.fullName}
              </Text>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>Cliente</Text>
            </View>
          </View>
        </View>

        {/* Offers Section */}
        <View style={{ backgroundColor: '#FFFFFF', marginTop: 8, padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937' }}>
              Ofertas ({post.offers?.length || 0})
            </Text>
          </View>

          {post.offers && post.offers.length > 0 ? (
            post.offers.map((offer) => (
              <View key={offer.id} style={{
                backgroundColor: '#F9FAFB',
                borderRadius: 12,
                padding: 12,
                marginBottom: 8
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: '#E5E7EB',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 10
                    }}>
                      <Ionicons name="person" size={18} color="#6B7280" />
                    </View>
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: '500', color: '#1F2937' }}>
                        {offer.provider?.fullName}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#6B7280' }}>
                        {new Date(offer.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#10B981' }}>
                    ${offer.price}
                  </Text>
                </View>
                {offer.message && (
                  <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 8 }}>
                    {offer.message}
                  </Text>
                )}
                {isOwner && offer.status === 'pending' && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#4F46E5',
                      paddingVertical: 8,
                      borderRadius: 8,
                      marginTop: 8,
                      alignItems: 'center'
                    }}
                    onPress={() => handleAcceptOffer(offer.id)}
                  >
                    <Text style={{ color: '#FFFFFF', fontWeight: '500' }}>Aceptar Oferta</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <Ionicons name="people-outline" size={48} color="#D1D5DB" />
              <Text style={{ color: '#6B7280', marginTop: 8 }}>No hay ofertas aún</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Button */}
      {post.status === 'active' && isProvider && !isOwner && (
        <View style={{ padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#4F46E5',
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center'
            }}
            onPress={handleMakeOffer}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
              Hacer Oferta
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
