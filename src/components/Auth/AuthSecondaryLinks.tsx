import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Colors } from '../../theme';

type Props = {
  onOpenRegistration: () => void;
};

export default function AuthSecondaryLinks(props: Props) {
  const { onOpenRegistration } = props;
  const { t } = useTranslation();

  return (
    <>
      <View style={styles.registerRow}>
        <Text style={styles.secondaryText}>{t('auth.noAccount')}</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={onOpenRegistration}>
          <Text style={styles.linkText}>{t('auth.signUp')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBlock}>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
        </TouchableOpacity>
        <Text style={styles.questionText}>{t('auth.questions')}</Text>
        <Text style={styles.supportText}>{t('auth.supportPhone')}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bottomBlock: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 8,
  },
  forgotText: {
    color: Colors.accentCyan,
    fontSize: 16,
    lineHeight: 21,
    marginBottom: 16,
  },
  linkText: {
    color: Colors.accentCyan,
    fontSize: 16,
    lineHeight: 21,
  },
  questionText: {
    color: Colors.charcoal,
    fontSize: 16,
    lineHeight: 21,
  },
  registerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
  },
  secondaryText: {
    color: Colors.charcoal,
    fontSize: 16,
    lineHeight: 21,
  },
  supportText: {
    color: Colors.charcoal,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
    textAlign: 'center',
  },
});
