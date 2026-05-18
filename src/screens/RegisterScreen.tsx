import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import OtpStep from '../components/Registration/OtpStep';
import PasswordStep from '../components/Registration/PasswordStep';
import PhoneStep from '../components/Registration/PhoneStep';
import ProfileStep, {
  type ProfileForm,
} from '../components/Registration/ProfileStep';
import RoleStep from '../components/Registration/RoleStep';
import ScreenHeader from '../components/Registration/ScreenHeader';
import { saveProfile } from '../storage/profile';
import { StackParamList, UserProfile } from '../types';
import { Colors } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { authService } from '../api/authService.ts';
import { useAuth } from '../provider/AuthProvider.tsx';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;
const CORRECT_CODE = '123456';

enum Step {
  phone,
  otp,
  role,
  profile,
  password,
}
type Role = 'customer' | 'transport';

function getActiveSegments(s: Step) {
  switch (s) {
    case Step.password:
      return 4;
    case Step.profile:
      return 3;
    case Step.role:
      return 2;
    default:
      return 1;
  }
}

type Props = NativeStackScreenProps<StackParamList, 'RegisterScreen'>;

export default function RegisterScreen(props: Props) {
  const { navigation } = props;

  const onClose = navigation.goBack;

  const initialData: any = {};
  const editMode = false;

  const { t } = useTranslation();
  const { setToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<Step>(editMode ? Step.profile : Step.phone);

  const [phone, setPhone] = useState(initialData?.phone ?? '');
  const [debouncedPhone, setDebouncedPhone] = useState(
    initialData?.phone ?? '',
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [activeIdx, setActiveIdx] = useState(0);
  const [otpError, setOtpError] = useState(false);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const [selectedRole, setSelectedRole] = useState<Role | null>(
    initialData?.role ?? null,
  );
  const [profileData, setProfileData] = useState<ProfileForm | undefined>(
    initialData?.profile,
  );

  const onBack = useCallback(() => {
    setStep(prevState => {
      if (prevState === 0) {
        navigation.goBack();
        return prevState;
      } else {
        return prevState - 1;
      }
    });
  }, [setStep, navigation]);

  const headerTitle = t('registration.headerTitle');

  const persistAndComplete = useCallback(
    async (profileForm: ProfileForm, password: string) => {
      const saved: UserProfile = {
        phone,
        role: selectedRole ?? initialData?.role ?? 'customer',
        iin: profileForm.iin,
        profile: profileForm,
      };
      await saveProfile(saved);
      const response = await authService.register(saved, password);
      setToken(response.token);
    },
    [phone, selectedRole, initialData?.role],
  );

  const resetOtp = useCallback((focusFirst = true) => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setActiveIdx(0);
    if (focusFirst) {
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }, []);

  const handleBack = useCallback(() => {
    if (editMode) {
      onBack();
      return;
    }

    if (step === Step.password) {
      setStep(Step.profile);
    } else if (step === Step.profile) {
      setStep(Step.role);
    } else if (step === Step.role) {
      setStep(Step.otp);
      resetOtp(false);
      setOtpError(false);
      setSelectedRole(null);
    } else if (step === Step.otp) {
      setStep(Step.phone);
      resetOtp(false);
      setOtpError(false);
    } else {
      onBack();
    }
  }, [step, editMode, onBack, resetOtp]);

  const handleSendCode = useCallback(async (phoneNumber: string) => {
    setIsSending(true);
    try {
      await authService.sendOtp({ phoneNumber });
      setStep(Step.otp);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  }, []);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  useEffect(() => {
    if (step !== Step.otp || timer <= 0) return;
    const id = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(id);
  }, [step, timer]);

  const verifyCode = useCallback(
    async (phoneNumber: string, digits: string[]) => {
      try {
        setIsLoading(true);
        await authService.confirmOtp({ phoneNumber, code: digits.join('') });
        setStep(Step.role);
      } catch (e) {
        console.log(e);
        setOtpError(true);
        resetOtp();
      } finally {
        setIsLoading(false);
      }
    },
    [resetOtp],
  );

  const handleOtpChange = useCallback(
    (value: string, idx: number) => {
      const digit = value.replace(/\D/g, '').slice(-1);
      const next = [...otp];
      next[idx] = digit;
      setOtp(next);
      setOtpError(false);

      if (digit && idx < OTP_LENGTH - 1) {
        inputRefs.current[idx + 1]?.focus();
      } else if (digit && idx === OTP_LENGTH - 1) {
        inputRefs.current[idx]?.blur();
        verifyCode(phone, next);
      }
    },
    [otp, phone, verifyCode],
  );

  const handleOtpKeyPress = useCallback(
    (key: string, idx: number) => {
      if (key === 'Backspace' && !otp[idx] && idx > 0) {
        const next = [...otp];
        next[idx - 1] = '';
        setOtp(next);
        inputRefs.current[idx - 1]?.focus();
      }
    },
    [otp],
  );

  const handleResend = useCallback(async (phoneNumber: string) => {
    try {
      setOtpError(false);
      await authService.sendOtp({ phoneNumber });
      setTimer(RESEND_SECONDS);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
  };

  const handleProfileSubmit = (data: ProfileForm) => {
    setProfileData(data);
    if (editMode) {
      persistAndComplete(data);
    } else {
      setStep(Step.password);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.headerContainer}>
          <ScreenHeader
            activeSteps={editMode ? 3 : getActiveSegments(step)}
            onBack={handleBack}
            onClose={editMode ? onBack : onClose}
            title={headerTitle}
            totalSteps={4}
          />
        </View>

        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === Step.phone && (
            <PhoneStep
              focused={phoneFocused}
              isDisabled={debouncedPhone.replace(/\D/g, '').length !== 11}
              isSending={isSending}
              onBlur={() => setPhoneFocused(false)}
              onChange={formatted => {
                setPhone(formatted);
                clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(
                  () => setDebouncedPhone(formatted),
                  300,
                );
              }}
              onFocus={() => setPhoneFocused(true)}
              onSubmit={() => handleSendCode(phone)}
              phone={phone}
            />
          )}

          {step === Step.otp && (
            <>
              <OtpStep
                activeIdx={activeIdx}
                error={otpError}
                inputRefs={inputRefs}
                onChangeDigit={handleOtpChange}
                onFocusIdx={setActiveIdx}
                onKeyPress={handleOtpKeyPress}
                onResend={() => handleResend(phone)}
                otp={otp}
                phone={phone}
                timer={timer}
              />
              {isLoading && (
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { alignItems: 'center', justifyContent: 'center' },
                  ]}
                >
                  <ActivityIndicator />
                </View>
              )}
            </>
          )}

          {step === Step.role && (
            <RoleStep
              isDisabled={!selectedRole}
              onSelectRole={handleSelectRole}
              onSubmit={() => setStep(Step.profile)}
              selectedRole={selectedRole}
            />
          )}

          {step === Step.profile && (
            <ProfileStep
              initialProfile={profileData ?? initialData?.profile}
              phone={phone}
              role={selectedRole ?? initialData?.role ?? 'customer'}
              onSubmit={handleProfileSubmit}
            />
          )}

          {step === Step.password && !editMode && (
            <PasswordStep
              onSubmit={password => {
                if (profileData) {
                  persistAndComplete(profileData, password);
                }
              }}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.ivory,
  },
  flex: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
