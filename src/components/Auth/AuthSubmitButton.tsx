import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { Colors } from '../../theme';

type Props = {
  disabled: boolean;
  loading: boolean;
  onPress: () => void;
};

export default function AuthSubmitButton(props: Props) {
  const { disabled, loading, onPress } = props;
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      onPress={onPress}
      style={[styles.submitButton, disabled && styles.submitButtonDisabled]}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.submitText}>{t('auth.submit')}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    alignItems: 'center',
    backgroundColor: Colors.accentCyan,
    borderRadius: 16,
    paddingVertical: 15,
  },
  submitButtonDisabled: {
    backgroundColor: '#8DE0EF',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
