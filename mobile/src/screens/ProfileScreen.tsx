import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/config';

interface UserProfile {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  userType: string;
  avatarUrl: string;
  location: any;
  isVerified: boolean;
  createdAt: string;
}

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', onPress: () => logout(), style: 'destructive' }
      ]
    );
  };

  const menuItems = [
    {
      icon: 'wallet-outline',
      title: 'Mi Wallet',
      subtitle: 'Saldo y transacciones',
      onPress: () => navigation.navigate('Wallet')
    },
    {
      icon: 'list-outline',
      title: 'Mis Publicaciones',
      subtitle: 'Publicaciones creadas',
      onPress: () => navigation.navigate('MyPosts')
    },
    {
      icon: 'briefcase-outline',
      title: 'Mis Ofertas',
      subtitle: 'Ofertas enviadas',
      onPress: () => navigation.navigate('MyOffers'),
      visible: user?.userType === 'provider'
    },
    {
      icon: 'checkmark-circle-outline',
      title: 'Verificación',
      subtitle: 'Verificar identidad',
      onPress: () => navigation.navigate('Verification'),
      visible: user?.userType === 'provider' && !profile?.isVerified
    },
    {
      icon: 'chatbubbles-outline',
      title: 'Mis Chats',
      subtitle: 'Conversaciones activas',
      onPress: () => navigation.navigate('Chats')
    },
    {
      icon: 'star-outline',
      title: 'Mis Reseñas',
      subtitle: 'Calificaciones recibidas',
      onPress: () => navigation.navigate('MyReviews')
    },
    {
      icon: 'settings-outline',
      title: 'Configuración',
      subtitle: 'Ajustes de la cuenta',
      onPress: () => navigation.navigate('Settings')
    }
  ];

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#6B7280' }}>Cargando perfil...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <ScrollView>
        {/* Header */}
        <View style={{ backgroundColor: '#4F46E5', paddingTop: 20, paddingBottom: 30, paddingHorizontal: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#FFFFFF' }}>Mi Perfil</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
              <Ionicons name="create-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Avatar y Info */}
          <View style={{ alignItems: 'center' }}>
            <View style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#FFFFFF',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12
            }}>
              {profile?.avatarUrl ? (
                <Image source={{ uri: profile.avatarUrl }} style={{ width: 100, height: 100, borderRadius: 50 }} />
              ) : (
                <Ionicons name="person" size={50} color="#4F46E5" />
              )}
            </View>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' }}>
              {profile?.fullName}
            </Text>
            <Text style={{ fontSize: 14, color: '#E0E7FF', marginTop: 4 }}>
              {profile?.email}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <View style={{
                backgroundColor: profile?.userType === 'provider' ? '#10B981' : '#6366F1',
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 12
              }}>
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '500' }}>
                  {profile?.userType === 'provider' ? 'Prestador' : 'Cliente'}
                </Text>
              </View>
              {profile?.isVerified && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={{ color: '#10B981', fontSize: 12, marginLeft: 4 }}>Verificado</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: '#FFFFFF',
          marginHorizontal: 16,
          marginTop: -15,
          borderRadius: 12,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937' }}>0</Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>Publicaciones</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#E5E7EB' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937' }}>0</Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>Reseñas</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937' }}>0.0</Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>Rating</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
          {menuItems.map((item, index) => {
            if (item.visible === false) return null;
            return (
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 8
                }}
                onPress={item.onPress}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#F3F4F6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12
                }}>
                  <Ionicons name={item.icon as any} size={20} color="#4F46E5" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: '#1F2937' }}>{item.title}</Text>
                  <Text style={{ fontSize: 12, color: '#6B7280' }}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FEE2E2',
            marginHorizontal: 16,
            marginTop: 20,
            marginBottom: 40,
            padding: 16,
            borderRadius: 12
          }}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={{ color: '#EF4444', fontSize: 16, fontWeight: '500', marginLeft: 8 }}>
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
