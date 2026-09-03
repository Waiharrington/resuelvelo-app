import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import api from '../api/config';

interface Wallet {
  id: string;
  balance: number;
  createdAt: string;
}

interface Transaction {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  client: { fullName: string };
  provider: { fullName: string };
}

export const WalletScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      const [walletRes, transactionsRes] = await Promise.all([
        api.get('/transactions/wallet'),
        api.get('/transactions')
      ]);
      setWallet(walletRes.data.data);
      setTransactions(transactionsRes.data.data);
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = () => {
    Alert.alert(
      'Recargar Wallet',
      'Selecciona el monto a recargar',
      [
        { text: '$10', onPress: () => processTopUp(10) },
        { text: '$25', onPress: () => processTopUp(25) },
        { text: '$50', onPress: () => processTopUp(50) },
        { text: '$100', onPress: () => processTopUp(100) },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const processTopUp = async (amount: number) => {
    try {
      await api.post('/transactions/topup', { amount });
      Alert.alert('Éxito', `Se agregaron $${amount} a tu wallet`);
      loadWallet();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Error al recargar');
    }
  };

  const handleWithdraw = () => {
    Alert.alert(
      'Retirar Fondos',
      'Función próximamente disponible',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#6B7280' }}>Cargando wallet...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <ScrollView>
        {/* Header */}
        <View style={{
          backgroundColor: '#4F46E5',
          paddingTop: 20,
          paddingBottom: 30,
          paddingHorizontal: 24
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#FFFFFF' }}>Mi Wallet</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Balance Card */}
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 24,
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>Saldo Disponible</Text>
            <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#1F2937' }}>
              ${wallet?.balance || 0}
            </Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>USD</Text>

            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#4F46E5',
                  paddingVertical: 12,
                  borderRadius: 8,
                  marginRight: 8,
                  alignItems: 'center'
                }}
                onPress={handleTopUp}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '500' }}>Recargar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#F3F4F6',
                  paddingVertical: 12,
                  borderRadius: 8,
                  marginLeft: 8,
                  alignItems: 'center'
                }}
                onPress={handleWithdraw}
              >
                <Text style={{ color: '#1F2937', fontWeight: '500' }}>Retirar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Transactions */}
        <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 12 }}>
            Últimas Transacciones
          </Text>

          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <View key={tx.id} style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                padding: 16,
                marginBottom: 8
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: tx.status === 'completed' ? '#D1FAE5' : '#FEF3C7',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12
                    }}>
                      <Ionicons
                        name={tx.status === 'completed' ? 'checkmark-circle' : 'time'}
                        size={20}
                        color={tx.status === 'completed' ? '#059669' : '#F59E0B'}
                      />
                    </View>
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: '500', color: '#1F2937' }}>
                        Transacción
                      </Text>
                      <Text style={{ fontSize: 12, color: '#6B7280' }}>
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: tx.amount > 0 ? '#10B981' : '#EF4444'
                  }}>
                    {tx.amount > 0 ? '+' : ''}${tx.amount}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              padding: 32,
              alignItems: 'center'
            }}>
              <Ionicons name="wallet-outline" size={48} color="#D1D5DB" />
              <Text style={{ color: '#6B7280', marginTop: 12 }}>
                No hay transacciones aún
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
