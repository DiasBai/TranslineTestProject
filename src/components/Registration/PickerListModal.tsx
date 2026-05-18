import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import type { ListRenderItem } from 'react-native';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '../../theme';

type Props = {
  visible: boolean;
  title: string;
  data: string[];
  onSelect: (item: string) => void;
  onClose: () => void;
  flatListExtraData?: unknown;
};

export function PickerListModal({
  visible,
  title,
  data,
  onSelect,
  onClose,
  flatListExtraData,
}: Props) {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['55%', '92%'], []);

  const prevVisibleRef = useRef(false);

  useLayoutEffect(() => {
    const wasVisible = prevVisibleRef.current;
    prevVisibleRef.current = visible;

    if (visible && !wasVisible) {
      Keyboard.dismiss();
      bottomSheetRef.current?.present();
      return;
    }
    if (!visible && wasVisible) {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
      />
    ),
    [],
  );

  const handleSelect = useCallback(
    (item: string) => {
      onSelect(item);
    },
    [onSelect],
  );

  const renderItem = useCallback<ListRenderItem<string>>(
    ({ item }) => (
      <TouchableOpacity
        onPress={() => handleSelect(item)}
        style={styles.modalItem}
      >
        <Text style={styles.modalItemText}>{item}</Text>
      </TouchableOpacity>
    ),
    [handleSelect],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      name="shared-picker-list"
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      bottomInset={insets.bottom}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handle}
    >
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>{title}</Text>
        <TouchableOpacity hitSlop={8} onPress={onClose}>
          <Text style={styles.modalClose}>✕</Text>
        </TouchableOpacity>
      </View>
      <BottomSheetFlatList
        data={data}
        extraData={flatListExtraData}
        keyExtractor={item => item}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
      />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    backgroundColor: '#D0D0D0',
    width: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    color: Colors.midnight,
    fontSize: 17,
    fontWeight: '600',
  },
  modalClose: {
    color: Colors.slate,
    fontSize: 18,
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalItemText: {
    color: Colors.midnight,
    fontSize: 16,
  },
});
