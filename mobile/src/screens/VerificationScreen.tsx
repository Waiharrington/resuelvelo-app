import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import api from '../api/config';

export const VerificationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState({
    idFront: false,
    idBack: false,
    selfie: false
  });

  const handleUploadDocument = (type: string) => {
    Alert.alert(
      'Subir Documento',
      'Selecciona una opción',
      [
        {
          text: 'Tomar Foto',
          onPress: () => simulateUpload(type)
        },
        {
          text: 'Elegir de Galería',
          onPress: () => simulateUpload(type)
        },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const simulateUpload = (type: string) => {
    setDocuments(prev => ({ ...prev, [type]: true }));
    Alert.alert('Éxito', 'Documento subido correctamente');
  };

  const handleSubmitVerification = async () => {
    if (!documents.idFront || !documents.idBack || !documents.selfie) {
      Alert.alert('Error', 'Por favor sube todos los documentos requeridos');
      return;
    }

    setLoading(true);
    try {
      await api.post('/provider/verify');
      Alert.alert(
        'Solicitud Enviada',
        'Tu solicitud de verificación está siendo revisada. Te notificaremos cuando sea aprobada.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Error al enviar solicitud');
    } finally {
      setLoading(false);
    }
  };

  const requirements = [
    {
      id: 'idFront',
      title: 'Cédula de Identidad (Frente)',
      description: 'Foto clara del frente de tu cédula',
      icon: 'card-outline',
      uploaded: documents.idFront
    },
    {
      id: 'idBack',
      title: 'Cédula de Identidad (Reverso)',
      description: 'Foto clara del reverso de tu cédula',
      icon: 'card-outline',
      uploaded: documents.idBack
    },
    {
      id: 'selfie',
      title: 'Selfie con Cédula',
      description: 'Foto tuyo sosteniendo la cédula',
      icon: 'camera-outline',
      uploaded: documents.selfie
    }
  ];

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
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#1F2937' }}>
            Verificación de Identidad
          </Text>
        </View>

        {/* Info Banner */}
        <View style={{
          backgroundColor: '#EEF2FF',
          margin: 16,
          padding: 16,
          borderRadius: 12
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="information-circle" size={20} color="#4F46E5" />
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#4F46E5', marginLeft: 8 }}>
              ¿Por qué verificar mi identidad?
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: '#6B7280', lineHeight: 18 }}>
            La verificación aumenta la confianza de los clientes y te da acceso a más oportunidades. Tu información es tratada con total confidencialidad.
          </Text>
        </View>

        {/* Documents */}
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 12 }}>
            Documentos Requeridos
          </Text>

          {requirements.map((req) => (
            <TouchableOpacity
              key={req.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                padding: 16,
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: req.uploaded ? '#10B981' : '#E5E7EB'
              }}
              onPress={() => handleUploadDocument(req.id)}
            >
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: req.uploaded ? '#D1FAE5' : '#F3F4F6',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
              }}>
                <Ionicons
                  name={req.uploaded ? 'checkmark-circle' : req.icon as any}
                  size={24}
                  color={req.uploaded ? '#059669' : '#6B7280'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#1F2937' }}>
                  {req.title}
                </Text>
                <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                  {req.description}
                </Text>
              </View>
              <Ionicons
                name={req.uploaded ? 'checkmark-circle' : 'cloud-upload-outline'}
                size={20}
                color={req.uploaded ? '#10B981' : '#9CA3AF'}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Terms */}
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <Text style={{ fontSize: 12, color: '#6B7280', lineHeight: 18 }}>
            Al enviar estos documentos, aceptas nuestros{' '}
            <Text style={{ color: '#4F46E5', textDecorationLine: 'underline' }}>
              Términos de Servicio
            </Text>{' '}
            y{' '}
            <Text style={{ color: '#4F46E5', textDecorationLine: 'underline' }}>
              Política de Privacidad
            </Text>.
          </Text>
        </View>

        {/* Submit Button */}
        <View style={{ padding: 16, marginTop: 20 }}>
          <Button
            title="Enviar Solicitud de Verificación"
            onPress={handleSubmitVerification}
            loading={loading}
            disabled={!documents.idFront || !documents.idBack || !documents.selfie}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
