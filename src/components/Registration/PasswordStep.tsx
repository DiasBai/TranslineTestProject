import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Colors } from '../../theme';
import PasswordStepRules from './PasswordStepRules';
import PasswordStepSecureField from './PasswordStepSecureField';
import {
  PasswordForm,
  passwordStepResolver,
} from './passwordStepValidation';

type Props = {
  onSubmit: (password: string) => Promise<void> | void;
};

function PasswordStep({ onSubmit }: Props) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = useForm<PasswordForm>({
    defaultValues: { password: '', confirm: '' },
    mode: 'onChange',
    resolver: passwordStepResolver,
  });

  const password = watch('password');

  const handlePasswordSubmit = async ({ password: pw }: PasswordForm) => {
    setIsSubmitting(true);
    try {
      await onSubmit(pw);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <View style={styles.body}>
        <Text style={styles.title}>{t('password.title')}</Text>
        <Text style={styles.desc}>{t('password.description')}</Text>

        <Controller
          control={control}
          name="password"
          render={({ field: { onBlur, onChange, value } }) => (
            <PasswordStepSecureField
              hasError={Boolean(errors.password)}
              label={t('password.passwordLabel')}
              onBlur={onBlur}
              onChangeText={onChange}
              onToggleVisible={() => setShowPassword(v => !v)}
              value={value}
              visible={showPassword}
            />
          )}
        />

        <Controller
          control={control}
          name="confirm"
          render={({ field: { onBlur, onChange, value } }) => (
            <PasswordStepSecureField
              errorText={errors.confirm ? t('password.confirmError') : undefined}
              hasError={Boolean(errors.confirm)}
              label={t('password.confirmLabel')}
              onBlur={onBlur}
              onChangeText={onChange}
              onToggleVisible={() => setShowConfirm(v => !v)}
              value={value}
              visible={showConfirm}
            />
          )}
        />

        <PasswordStepRules password={password} />
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        disabled={!isValid || isSubmitting}
        onPress={handleSubmit(handlePasswordSubmit)}
        style={[
          styles.submit,
          (!isValid || isSubmitting) && styles.submitDisabled,
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitText}>{t('password.submit')}</Text>
        )}
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: 28,
  },
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
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 21,
  },
});

export default PasswordStep;
