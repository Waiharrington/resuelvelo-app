import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'client' | 'provider'>('client');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName,
        email,
        phone,
        password,
        userType
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1 }}>
          {/* Header */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginBottom: 24 }}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>

          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 }}>
            Crear Cuenta
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 32 }}>
            Únete a Resuélvelo hoy
          </Text>

          {/* User Type Selection */}
          <View style={{ flexDirection: 'row', marginBottom: 24 }}>
            <TouchableOpacity
              onPress={() => setUserType('client')}
              style={{
                flex: 1,
                paddingVertical: 12,
                backgroundColor: userType === 'client' ? '#4F46E5' : '#F3F4F6',
                borderRadius: 12,
                marginRight: 8
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: userType === 'client' ? '#FFFFFF' : '#6B7280',
                  fontWeight: '600'
                }}
              >
                Cliente
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setUserType('provider')}
              style={{
                flex: 1,
                paddingVertical: 12,
                backgroundColor: userType === 'provider' ? '#4F46E5' : '#F3F4F6',
                borderRadius: 12,
                marginLeft: 8
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: userType === 'provider' ? '#FFFFFF' : '#6B7280',
                  fontWeight: '600'
                }}
              >
                Prestador
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <Input
            label="Nombre Completo"
            placeholder="Juan Pérez"
            value={fullName}
            onChangeText={setFullName}
            leftIcon="person-outline"
          />

          <Input
            label="Email"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
          />

          <Input
            label="Teléfono (opcional)"
            placeholder="+58 412 1234567"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon="call-outline"
          />

          <Input
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon="lock-closed-outline"
          />

          <Input
            label="Confirmar Contraseña"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            leftIcon="lock-closed-outline"
          />

          <Button
            title="Crear Cuenta"
            onPress={handleRegister}
            loading={loading}
            style={{ marginTop: 8 }}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
            <Text style={{ color: '#6B7280' }}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ color: '#4F46E5', fontWeight: '600' }}>Inicia Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
