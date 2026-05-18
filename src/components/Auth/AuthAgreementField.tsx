import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import CheckBoxIcon from '../../assets/icons/AuthIcons/CheckBoxIcon';
import { PRIVACY_POLICY_URL } from '../../constants/links';
import type { AuthFormValues } from '../../screens/auth/authForm';
import { Colors } from '../../theme';

const openPrivacyPolicy = () => {
  Linking.openURL(PRIVACY_POLICY_URL).catch(() => {});
};

type Props = {
  control: Control<AuthFormValues>;
  errors: FieldErrors<AuthFormValues>;
};

export default function AuthAgreementField(props: Props) {
  const { control, errors } = props;
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name="agreement"
      render={({ field: { onChange, value } }) => (
        <View>
          <View style={styles.agreementRow}>
            <TouchableOpacity
              accessibilityLabel={t('auth.agreementLabel')}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: value }}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, right: 4 }}
              onPress={() => onChange(!value)}
            >
              <View
                style={[styles.checkbox, value && styles.checkboxActive]}
              >
                {value ? <CheckBoxIcon /> : null}
              </View>
            </TouchableOpacity>
            <Text style={styles.agreementText}>
              <Text onPress={() => onChange(!value)}>
                {t('auth.agreementPrefix')}
              </Text>
              <Text
                accessibilityRole="link"
                onPress={openPrivacyPolicy}
                style={styles.policyText}
              >
                {t('auth.privacyPolicy')}
              </Text>
            </Text>
          </View>
          <View style={styles.agreementErrorSlot}>
            {errors.agreement?.message ? (
              <Text style={styles.errorText}>
                {t(errors.agreement.message as any)}
              </Text>
            ) : null}
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  agreementErrorSlot: {
    minHeight: 20,
  },
  agreementRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 24,
  },
  agreementText: {
    color: Colors.charcoal,
    flexShrink: 1,
    fontWeight: '500',
    lineHeight: 18,
  },
  checkbox: {
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderColor: '#D0D0D4',
    borderRadius: 4,
    borderWidth: 2,
    height: 22,
    justifyContent: 'center',
    marginRight: 7,
    width: 22,
  },
  checkboxActive: {
    backgroundColor: Colors.accentCyan,
    borderColor: Colors.accentCyan,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  policyText: {
    fontWeight: '300',
    textDecorationLine: 'underline',
  },
});
