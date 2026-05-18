import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import CheckCircleIcon from '../../assets/icons/CheckCircleIcon';
import { PASSWORD_SPECIAL_REGEX } from './passwordStepValidation';
import { Colors } from '../../theme';

type Props = {
  password: string;
};

export default function PasswordStepRules({ password }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.rules}>
      <Text style={styles.rulesTitle}>{t('password.rulesTitle')}</Text>
      <View style={styles.ruleRow}>
        <CheckCircleIcon checked={password.length >= 8} />
        <Text style={[styles.ruleText, password.length >= 8 && styles.ruleTextMet]}>
          {t('password.ruleLength')}
        </Text>
      </View>
      <View style={styles.ruleRow}>
        <CheckCircleIcon checked={/[A-Z]/.test(password)} />
        <Text style={[styles.ruleText, /[A-Z]/.test(password) && styles.ruleTextMet]}>
          {t('password.ruleUpper')}
        </Text>
      </View>
      <View style={styles.ruleRow}>
        <CheckCircleIcon checked={/[a-z]/.test(password)} />
        <Text style={[styles.ruleText, /[a-z]/.test(password) && styles.ruleTextMet]}>
          {t('password.ruleLower')}
        </Text>
      </View>
      <View style={styles.ruleRow}>
        <CheckCircleIcon checked={/\d/.test(password)} />
        <Text style={[styles.ruleText, /\d/.test(password) && styles.ruleTextMet]}>
          {t('password.ruleDigit')}
        </Text>
      </View>
      <View style={styles.ruleRow}>
        <CheckCircleIcon checked={PASSWORD_SPECIAL_REGEX.test(password)} />
        <Text
          style={[
            styles.ruleText,
            PASSWORD_SPECIAL_REGEX.test(password) && styles.ruleTextMet,
          ]}
        >
          {t('password.ruleSpecial')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rules: {
    marginTop: 20,
  },
  rulesTitle: {
    color: Colors.midnight,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 10,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  ruleText: {
    flex: 1,
    color: Colors.slate,
    fontSize: 14,
    lineHeight: 20,
  },
  ruleTextMet: {
    color: Colors.midnight,
  },
});
