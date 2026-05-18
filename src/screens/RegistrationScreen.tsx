import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
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
import type { UserProfile } from '../types';
import { Colors } from '../theme';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;
const CORRECT_CODE = '123456';

type Step = 'phone' | 'otp' | 'role' | 'profile' | 'password';
type Role = 'customer' | 'transport';

function getActiveSegments(s: Step) {
  if (s === 'role') return 2;
  if (s === 'profile') return 3;
  if (s === 'password') return 4;
  return 1;
}


type Props = {
  onBack: () => void;
  onClose: () => void;
  onComplete: (profile: UserProfile) => void;
  initialData?: UserProfile;
  editMode?: boolean;
};

function RegistrationScreen({
  onBack,
  onClose,
  onComplete,
  initialData,
  editMode = false,
}: Props) {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>(editMode ? 'profile' : 'phone');

  const [phone, setPhone] = useState(initialData?.phone ?? '');
  const [debouncedPhone, setDebouncedPhone] = useState(initialData?.phone ?? '');
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

  const headerTitle = t('registration.headerTitle');

  const persistAndComplete = useCallback(
    async (profileForm: ProfileForm) => {
      const saved: UserProfile = {
        phone,
        role: selectedRole ?? initialData?.role ?? 'customer',
        iin: profileForm.iin,
        profile: profileForm,
      };
      await saveProfile(saved);
      onComplete(saved);
    },
    [phone, selectedRole, initialData?.role, onComplete],
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

    if (step === 'password') {
      setStep('profile');
    } else if (step === 'profile') {
      setStep('role');
    } else if (step === 'role') {
      setStep('otp');
      resetOtp(false);
      setOtpError(false);
      setSelectedRole(null);
    } else if (step === 'otp') {
      setStep('phone');
      resetOtp(false);
      setOtpError(false);
    } else {
      onBack();
    }
  }, [step, editMode, onBack, resetOtp]);

  const handleSendCode = useCallback(() => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setStep('otp');
      setOtpError(false);
      setTimer(RESEND_SECONDS);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }, 1000);
  }, []);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  useEffect(() => {
    if (step !== 'otp' || timer <= 0) return;
    const id = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(id);
  }, [step, timer]);

  const verifyCode = useCallback(
    (digits: string[]) => {
      if (digits.join('') === CORRECT_CODE) {
        setStep('role');
      } else {
        setOtpError(true);
        resetOtp();
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
        verifyCode(next);
      }
    },
    [otp, verifyCode],
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

  const handleResend = () => {
    setOtpError(false);
    setTimer(RESEND_SECONDS);
    resetOtp();
  };

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
  };

  const handleProfileSubmit = (data: ProfileForm) => {
    setProfileData(data);
    if (editMode) {
      persistAndComplete(data);
    } else {
      setStep('password');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
          {step === 'phone' && (
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
              onSubmit={handleSendCode}
              phone={phone}
            />
          )}

          {step === 'otp' && (
            <OtpStep
              activeIdx={activeIdx}
              error={otpError}
              inputRefs={inputRefs}
              onChangeDigit={handleOtpChange}
              onFocusIdx={setActiveIdx}
              onKeyPress={handleOtpKeyPress}
              onResend={handleResend}
              otp={otp}
              phone={phone}
              timer={timer}
            />
          )}

          {step === 'role' && (
            <RoleStep
              isDisabled={!selectedRole}
              onSelectRole={handleSelectRole}
              onSubmit={() => setStep('profile')}
              selectedRole={selectedRole}
            />
          )}

          {step === 'profile' && (
            <ProfileStep
              initialProfile={profileData ?? initialData?.profile}
              phone={phone}
              role={selectedRole ?? initialData?.role ?? 'customer'}
              onSubmit={handleProfileSubmit}
            />
          )}

          {step === 'password' && !editMode && (
            <PasswordStep
              onSubmit={() => {
                if (profileData) {
                  persistAndComplete(profileData);
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

export default RegistrationScreen;
