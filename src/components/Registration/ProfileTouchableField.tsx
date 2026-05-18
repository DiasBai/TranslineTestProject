import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Colors } from '../../theme';

type Props = {
  label: string;
  required?: boolean;
  error?: string;
  hasValue: boolean;
  displayValue: string;
  placeholder: string;
  onPress: () => void;
};

export function ProfileTouchableField({
  label,
  required,
  error,
  hasValue,
  displayValue,
  placeholder,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.inputWrap, error ? styles.inputWrapError : null]}
    >
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.req}> *</Text>}
      </Text>
      <Text style={hasValue ? styles.dateValue : styles.datePlaceholder}>
        {hasValue ? displayValue : placeholder}
      </Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </TouchableOpacity>
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
  dateValue: {
    color: Colors.midnight,
    fontSize: 16,
    paddingVertical: 2,
  },
  datePlaceholder: {
    color: Colors.slate,
    fontSize: 16,
    paddingVertical: 2,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
});
