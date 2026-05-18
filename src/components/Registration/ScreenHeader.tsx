import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CloseIcon from '../../assets/icons/CloseIcon';
import LeftArrowIcon from '../../assets/icons/LeftArrowIcon';
import { Colors } from '../../theme';

type Props = {
  title: string;
  totalSteps: number;
  activeSteps: number;
  onBack: () => void;
  onClose: () => void;
};

function ScreenHeader({
  title,
  totalSteps,
  activeSteps,
  onBack,
  onClose,
}: Props) {
  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={10}
            onPress={onBack}
            style={styles.iconBtn}
          >
            <LeftArrowIcon />
          </TouchableOpacity>

          <Text style={styles.title}>{title}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={10}
          onPress={onClose}
          style={styles.iconBtn}
        >
          <CloseIcon />
        </TouchableOpacity>
      </View>

      <View style={styles.progress}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <View
            key={i}
            style={[styles.segment, i < activeSteps && styles.segmentActive]}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconBtn: {
    paddingRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.midnight,
    fontSize: 16,
    fontWeight: '500',
  },
  progress: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 40,
    paddingBottom: 24,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 100,
    backgroundColor: Colors.pewter,
  },
  segmentActive: {
    backgroundColor: Colors.accentCyan,
  },
});

export default ScreenHeader;
