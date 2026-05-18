import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MaskedTextInput } from 'react-native-mask-text';

import BottomArrowIcon from '../../assets/icons/BottomArrowIcon';
import type { AuthFormValues } from '../../screens/auth/authForm';
import { Colors } from '../../theme';

type Props = {
  control: Control<AuthFormValues>;
  errors: FieldErrors<AuthFormValues>;
};

export default function AuthPhoneField(props: Props) {
  const { control, errors } = props;
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name="phone"
      render={({ field: { onBlur, onChange, value } }) => (
        <View>
          <View
            style={[
              styles.inputContainer,
              errors.phone && styles.inputContainerError,
            ]}
          >
            <View style={styles.countryBox}>
              <Text style={styles.flag}>🇰🇿</Text>
            </View>
            <Text style={styles.countryCode}>+7</Text>
            <View style={styles.countryChevron}>
              <BottomArrowIcon />
            </View>
            <MaskedTextInput
              keyboardType="phone-pad"
              mask="(999) 999-99-99"
              onBlur={onBlur}
              onChangeText={(formattedText: string) => onChange(formattedText)}
              placeholder={t('auth.phonePlaceholder')}
              placeholderTextColor="#808080"
              style={styles.phoneInput}
              value={value}
            />
          </View>
          {errors.phone?.message ? (
            <Text style={styles.errorText}>
              {t(errors.phone.message as any)}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  countryBox: {
    alignItems: 'center',
    borderRadius: 2,
    height: 14,
    justifyContent: 'center',
    marginRight: 7,
    overflow: 'hidden',
    width: 20,
  },
  countryChevron: {
    marginRight: 8,
  },
  countryCode: {
    color: '#1E1E22',
    fontSize: 16,
    marginRight: 4,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  flag: {
    lineHeight: 14,
  },
  inputContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  inputContainerError: {
    borderColor: Colors.error,
    borderWidth: 1,
  },
  phoneInput: {
    color: Colors.charcoal,
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
});
