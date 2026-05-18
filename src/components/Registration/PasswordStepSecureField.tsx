import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import CloseEyeIcon from '../../assets/icons/AuthIcons/CloseEyeIcon';
import OpenEyeIcon from '../../assets/icons/AuthIcons/OpenEyeIcon';
import { Colors } from '../../theme';

type Props = {
  label: string;
  value: string;
  onBlur: () => void;
  onChangeText: (text: string) => void;
  hasError: boolean;
  visible: boolean;
  onToggleVisible: () => void;
  errorText?: string;
};

export default function PasswordStepSecureField(props: Props) {
  const {
    label,
    value,
    onBlur,
    onChangeText,
    hasError,
    visible,
    onToggleVisible,
    errorText,
  } = props;

  const inputRef = useRef<TextInput>(null);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => inputRef.current?.focus()}
      style={[styles.inputWrap, hasError && styles.inputWrapError]}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          autoCapitalize="none"
          autoCorrect={false}
          onBlur={onBlur}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          style={styles.input}
          value={value}
        />
        <TouchableOpacity
          accessibilityRole="button"
          hitSlop={10}
          onPress={onToggleVisible}
          style={styles.eyeBtn}
        >
          {visible ? <OpenEyeIcon /> : <CloseEyeIcon />}
        </TouchableOpacity>
      </View>
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  inputWrapError: {
    borderColor: Colors.error,
  },
  label: {
    color: Colors.slate,
    fontSize: 13,
    lineHeight: 16,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: Colors.midnight,
    fontSize: 16,
    padding: 0,
  },
  eyeBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
});
