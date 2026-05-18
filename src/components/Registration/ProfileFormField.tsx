import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors } from '../../theme';

type Props = {
  label: string;
  required?: boolean;
  error?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'number-pad' | 'numeric' | 'email-address' | 'phone-pad';
  maxLength?: number;
};

export function ProfileFormField({
  label,
  required,
  error,
  value,
  onChangeText,
  onBlur,
  autoCapitalize = 'sentences',
  keyboardType,
  maxLength,
}: Props) {
  return (
    <View style={[styles.inputWrap, error ? styles.inputWrapError : null]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.req}> *</Text>}
      </Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        keyboardType={keyboardType}
        maxLength={maxLength}
        onBlur={onBlur}
        onChangeText={onChangeText}
        style={styles.input}
        value={value}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 6,
  },
  inputWrapError: {
    borderColor: Colors.error,
  },
  label: {
    color: Colors.slate,
    fontSize: 13,
    lineHeight: 16,
    marginBottom: 4,
  },
  req: {
    color: Colors.accentCyan,
  },
  input: {
    color: Colors.midnight,
    fontSize: 16,
    padding: 0,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
});
