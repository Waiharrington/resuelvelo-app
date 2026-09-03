import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import api from '../api/config';

const CATEGORIES = [
  { id: '1', name: 'Transporte', icon: 'car-outline' },
  { id: '2', name: 'Instalaciones', icon: 'construct-outline' },
  { id: '3', name: 'Reparaciones', icon: 'build-outline' },
  { id: '4', name: 'Belleza', icon: 'cut-outline' },
  { id: '5', name: 'Limpieza', icon: 'sparkles-outline' },
  { id: '6', name: 'Otros', icon: 'ellipsis-horizontal-outline' }
];

export const CreatePostScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {
    if (!title || !description || !category || !budget) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/posts', {
        title,
        description,
        categoryId: category,
        budget: parseFloat(budget),
        deadline: deadline || undefined
      });

      Alert.alert('Success', 'Post created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        contentContainerStyle={{ padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937' }}>
            Nueva Publicación
          </Text>
        </View>

        {/* Category Selection */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 12 }}>
          Categoría *
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setCategory(cat.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: category === cat.id ? '#4F46E5' : '#F3F4F6',
                marginRight: 8,
                marginBottom: 8
              }}
            >
              <Ionicons
                name={cat.icon as any}
                size={16}
                color={category === cat.id ? '#FFFFFF' : '#6B7280'}
                style={{ marginRight: 4 }}
              />
              <Text
                style={{
                  color: category === cat.id ? '#FFFFFF' : '#6B7280',
                  fontSize: 14
                }}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form */}
        <Input
          label="Título *"
          placeholder="¿Qué necesitas?"
          value={title}
          onChangeText={setTitle}
        />

        <Input
          label="Descripción *"
          placeholder="Describe tu necesidad en detalle..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: 'top' }}
        />

        <Input
          label="Presupuesto (USD) *"
          placeholder="50"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
          leftIcon="cash-outline"
        />

        <Input
          label="Fecha Límite (opcional)"
          placeholder="dd/mm/aaaa"
          value={deadline}
          onChangeText={setDeadline}
          leftIcon="calendar-outline"
        />

        <Button
          title="Publicar"
          onPress={handleCreatePost}
          loading={loading}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
