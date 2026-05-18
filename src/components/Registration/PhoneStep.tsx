import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaskedTextInput } from 'react-native-mask-text';

import { Colors } from '../../theme';

type Props = {
  phone: string;
  focused: boolean;
  isSending: boolean;
  isDisabled: boolean;
  onChange: (formatted: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSubmit: () => void;
};

function PhoneStep({
  phone,
  focused,
  isSending,
  isDisabled,
  onChange,
  onFocus,
  onBlur,
  onSubmit,
}: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Text style={styles.title}>{t('registration.title')}</Text>
      <Text style={styles.desc}>{t('registration.description')}</Text>

      <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
        <Text style={styles.label}>{t('registration.phonePlaceholder')}</Text>
        <MaskedTextInput
          keyboardType="phone-pad"
          mask="+7 999 999 99 99"
          onBlur={onBlur}
          onChangeText={formatted => onChange(formatted)}
          onFocus={onFocus}
          style={styles.input}
          value={phone}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isDisabled || isSending}
        onPress={onSubmit}
        style={[
          styles.submit,
          (isDisabled || isSending) && styles.submitDisabled,
        ]}
      >
        {isSending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitText}>{t('registration.submit')}</Text>
        )}
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Colors.midnight,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 31,
  },
  desc: {
    color: Colors.slate,
    fontSize: 16,
    lineHeight: 19,
    marginTop: 8,
  },
  inputWrap: {
    marginTop: 26,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  inputWrapFocused: {
    borderColor: Colors.accentCyan,
  },
  label: {
    color: Colors.slate,
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 16,
  },
  input: {
    color: Colors.midnight,
    fontSize: 16,
    padding: 0,
  },
  submit: {
    alignItems: 'center',
    backgroundColor: Colors.accentCyan,
    borderRadius: 16,
    marginTop: 'auto',
    paddingVertical: 14,
  },
  submitDisabled: {
    backgroundColor: '#8EDDF0',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 21,
  },
});

export default PhoneStep;
