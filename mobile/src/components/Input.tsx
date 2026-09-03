import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle: ViewStyle = {
    marginBottom: 16
  };

  const inputContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: error ? '#EF4444' : isFocused ? '#4F46E5' : '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12
  };

  const inputStyle = {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937'
  };

  return (
    <View style={containerStyle}>
      <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6 }}>
        {label}
      </Text>
      <View style={inputContainerStyle}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={isFocused ? '#4F46E5' : '#9CA3AF'}
            style={{ marginRight: 8 }}
          />
        )}
        <TextInput
          style={inputStyle}
          placeholderTextColor="#9CA3AF"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && (
          <Ionicons
            name={rightIcon}
            size={20}
            color={isFocused ? '#4F46E5' : '#9CA3AF'}
            onPress={onRightIconPress}
            style={{ marginLeft: 8 }}
          />
        )}
      </View>
      {error && (
        <Text style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{error}</Text>
      )}
    </View>
  );
};
