import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import CloseEyeIcon from '../../assets/icons/AuthIcons/CloseEyeIcon';
import OpenEyeIcon from '../../assets/icons/AuthIcons/OpenEyeIcon';
import type { AuthFormValues } from '../../screens/auth/authForm';
import { Colors } from '../../theme';

type Props = {
  control: Control<AuthFormValues>;
  errors: FieldErrors<AuthFormValues>;
  isPasswordVisible: boolean;
  onTogglePasswordVisibility: () => void;
};

export default function AuthPasswordField(props: Props) {
  const {
    control,
    errors,
    isPasswordVisible,
    onTogglePasswordVisibility,
  } = props;
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name="password"
      render={({ field: { onBlur, onChange, value } }) => (
        <View>
          <View
            style={[
              styles.inputContainer,
              styles.passwordContainer,
              errors.password && styles.inputContainerError,
            ]}
          >
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={t('auth.passwordPlaceholder')}
              placeholderTextColor="#808080"
              secureTextEntry={!isPasswordVisible}
              style={styles.passwordInput}
              value={value}
            />
            <TouchableOpacity
              accessibilityLabel={
                isPasswordVisible ? t('auth.hidePassword') : t('auth.showPassword')
              }
              hitSlop={10}
              onPress={onTogglePasswordVisibility}
              style={styles.passwordToggle}
            >
              {isPasswordVisible ? <OpenEyeIcon /> : <CloseEyeIcon />}
            </TouchableOpacity>
          </View>
          {errors.password?.message ? (
            <Text style={styles.errorText}>
              {t(errors.password.message as any)}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 4,
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
  passwordContainer: {
    marginTop: 16,
  },
  passwordInput: {
    color: '#1E1E22',
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  passwordToggle: {
    alignItems: 'center',
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
});
