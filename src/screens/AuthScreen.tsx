import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authService } from '../api/authService.ts';
import AuthAgreementField from '../components/Auth/AuthAgreementField';
import AuthLogo from '../components/Auth/AuthHero';
import AuthPasswordField from '../components/Auth/AuthPasswordField';
import AuthPhoneField from '../components/Auth/AuthPhoneField';
import AuthSecondaryLinks from '../components/Auth/AuthSecondaryLinks';
import AuthSubmitButton from '../components/Auth/AuthSubmitButton';
import { useAuth } from '../provider/AuthProvider.tsx';
import { Colors } from '../theme';
import { StackParamList } from '../types';

import { authFormResolver, type AuthFormValues } from './auth/authForm';

type Props = NativeStackScreenProps<StackParamList, 'AuthScreen'>;

export default function AuthScreen(props: Props) {
  const { navigation } = props;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { setToken } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AuthFormValues>({
    defaultValues: {
      phone: '',
      password: '',
      agreement: false,
    },
    mode: 'onChange',
    resolver: authFormResolver,
  });

  const onSubmit = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      const digits = values.phone.replace(/\D/g, '');
      const normalized = `+7 ${digits.slice(0, 3)} ${digits.slice(
        3,
        6,
      )} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
      const response = await authService.login({
        phoneNumber: normalized,
        password: values.password,
      });
      setToken(response.token);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'default';
      Alert.alert(
        t('auth.errorTitle'),
        t(`auth.errors.${message}` as any, {
          defaultValue: t('auth.errors.default'),
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onOpenRegistration = () => {
    navigation.navigate('RegisterScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthLogo />
          <AuthPhoneField control={control} errors={errors} />
          <AuthPasswordField
            control={control}
            errors={errors}
            isPasswordVisible={isPasswordVisible}
            onTogglePasswordVisibility={() =>
              setIsPasswordVisible(prev => !prev)
            }
          />
          <AuthAgreementField control={control} errors={errors} />
          <AuthSubmitButton
            disabled={!isValid || isLoading}
            loading={isLoading}
            onPress={handleSubmit(onSubmit)}
          />
          <AuthSecondaryLinks onOpenRegistration={onOpenRegistration} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: Colors.ivory,
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
