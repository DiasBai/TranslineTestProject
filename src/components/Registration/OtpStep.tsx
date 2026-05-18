import React, { MutableRefObject } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { Colors } from '../../theme';

type Props = {
  otp: string[];
  activeIdx: number;
  error: boolean;
  timer: number;
  phone: string;
  inputRefs: MutableRefObject<(TextInput | null)[]>;
  onChangeDigit: (value: string, idx: number) => void;
  onKeyPress: (key: string, idx: number) => void;
  onFocusIdx: (idx: number) => void;
  onResend: () => void;
};

function OtpStep({
  otp,
  activeIdx,
  error,
  timer,
  phone,
  inputRefs,
  onChangeDigit,
  onKeyPress,
  onFocusIdx,
  onResend,
}: Props) {
  const { t } = useTranslation();

  const timerStr = `0${Math.floor(timer / 60)}:${String(timer % 60).padStart(
    2,
    '0',
  )}`;

  return (
    <>
      <Text style={styles.title}>{t('registration.title')}</Text>
      <Text style={styles.desc}>
        {t('registration.otpDescription', { phone })}
      </Text>

      <View style={styles.otpRow}>
        {otp.map((digit, idx) => (
          <TextInput
            key={idx}
            ref={el => {
              inputRefs.current[idx] = el;
            }}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={val => onChangeDigit(val, idx)}
            onFocus={() => onFocusIdx(idx)}
            onKeyPress={({ nativeEvent }) => onKeyPress(nativeEvent.key, idx)}
            selectionColor={Colors.charcoal}
            style={[
              styles.otpBox,
              !error && activeIdx === idx && styles.otpBoxActive,
              error && styles.otpBoxError,
            ]}
            value={digit}
          />
        ))}
      </View>

      {error ? (
        <Text style={styles.errorText}>{t('registration.otpError')}</Text>
      ) : null}

      <TouchableOpacity
        activeOpacity={timer > 0 ? 1 : 0.85}
        disabled={timer > 0}
        onPress={onResend}
        style={[styles.resendBtn, timer > 0 && styles.resendBtnDisabled]}
      >
        <Text
          style={[styles.resendText, timer > 0 && styles.resendTextDisabled]}
        >
          {timer > 0
            ? t('registration.resendIn', { time: timerStr })
            : t('registration.resend')}
        </Text>
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
  otpRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 28,
  },
  otpBox: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
    color: Colors.midnight,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  otpBoxActive: {
    borderColor: Colors.accentCyan,
  },
  otpBoxError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 12,
  },
  resendBtn: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.accentCyan,
    marginTop: 'auto',
    paddingVertical: 14,
  },
  resendBtnDisabled: {
    borderColor: '#D7D8DB',
  },
  resendText: {
    color: Colors.accentCyan,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
  },
  resendTextDisabled: {
    color: Colors.slate,
  },
});

export default OtpStep;
