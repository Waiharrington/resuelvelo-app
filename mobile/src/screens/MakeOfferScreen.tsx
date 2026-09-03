import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import api from '../api/config';

export const MakeOfferScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { postId, postTitle } = route.params;
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMakeOffer = async () => {
    if (!price) {
      Alert.alert('Error', 'Por favor ingresa un precio');
      return;
    }

    setLoading(true);
    try {
      await api.post('/offers', {
        postId,
        price: parseFloat(price),
        message
      });

      Alert.alert('Éxito', 'Oferta enviada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Error al enviar oferta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937' }}>
            Hacer Oferta
          </Text>
        </View>

        {/* Post Info */}
        <View style={{
          backgroundColor: '#F9FAFB',
          borderRadius: 12,
          padding: 16,
          marginBottom: 24
        }}>
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 4 }}>Publicación:</Text>
          <Text style={{ fontSize: 16, fontWeight: '500', color: '#1F2937' }}>
            {postTitle}
          </Text>
        </View>

        {/* Form */}
        <Input
          label="Tu Precio (USD) *"
          placeholder="Ej: 25"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          leftIcon="cash-outline"
        />

        <Input
          label="Mensaje (opcional)"
          placeholder="Cuéntale al cliente por qué eres la mejor opción..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: 'top' }}
        />

        {/* Tips */}
        <View style={{
          backgroundColor: '#EEF2FF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 24
        }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#4F46E5', marginBottom: 8 }}>
            Consejos para una buena oferta:
          </Text>
          <Text style={{ fontSize: 12, color: '#6B7280', lineHeight: 18 }}>
            • Sé claro con tu precio{'\n'}
            • Explica por qué eres la mejor opción{'\n'}
            • Menciona tu experiencia{'\n'}
            • Ofrece un tiempo de entrega
          </Text>
        </View>

        <Button
          title="Enviar Oferta"
          onPress={handleMakeOffer}
          loading={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
