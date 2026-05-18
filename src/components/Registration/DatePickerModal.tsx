import React from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';

import { Colors } from '../../theme';

type Props = {
  visible: boolean;
  value: Date;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
  onConfirm: () => void;
};

export function DatePickerModal({ visible, value, onChange, onConfirm }: Props) {
  const { t } = useTranslation();

  if (!visible) return null;

  if (Platform.OS === 'ios') {
    return (
      <Modal animationType="slide" transparent visible>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <TouchableOpacity onPress={onConfirm} style={styles.modalDoneBtn}>
              <Text style={styles.modalDoneText}>{t('profile.done')}</Text>
            </TouchableOpacity>
            <DateTimePicker
              display="spinner"
              mode="date"
              onChange={onChange}
              value={value}
            />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <DateTimePicker
      display="default"
      mode="date"
      onChange={onChange}
      value={value}
    />
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  modalDoneBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
  },
  modalDoneText: {
    color: Colors.accentCyan,
    fontSize: 16,
    fontWeight: '600',
  },
});
