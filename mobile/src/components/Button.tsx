import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle
}) => {
  const baseStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    opacity: disabled ? 0.5 : 1
  };

  const sizeStyles: Record<string, ViewStyle> = {
    small: { paddingVertical: 8, paddingHorizontal: 16 },
    medium: { paddingVertical: 12, paddingHorizontal: 24 },
    large: { paddingVertical: 16, paddingHorizontal: 32 }
  };

  const variantStyles: Record<string, ViewStyle> = {
    primary: { backgroundColor: '#4F46E5' },
    secondary: { backgroundColor: '#6B7280' },
    outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#4F46E5' },
    danger: { backgroundColor: '#EF4444' }
  };

  const textStyles: Record<string, TextStyle> = {
    primary: { color: '#FFFFFF' },
    secondary: { color: '#FFFFFF' },
    outline: { color: '#4F46E5' },
    danger: { color: '#FFFFFF' }
  };

  const textSizeStyles: Record<string, TextStyle> = {
    small: { fontSize: 14 },
    medium: { fontSize: 16 },
    large: { fontSize: 18 }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        baseStyle,
        sizeStyles[size],
        variantStyles[variant],
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textStyles[variant].color} />
      ) : (
        <Text
          style={[
            { fontWeight: '600' },
            textStyles[variant],
            textSizeStyles[size],
            textStyle
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
