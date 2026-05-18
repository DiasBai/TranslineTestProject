import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '../theme';
import { formatDate, loadProfile } from '../storage/profile';
import { StackParamList, UserProfile } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../provider/AuthProvider.tsx';

type Props = NativeStackScreenProps<StackParamList, 'ProfileScreen'>;

type Row = { label: string; value: string };

function FieldRow({ label, value, isLast }: Row & { isLast?: boolean }) {
  return (
    <View style={[styles.field, isLast && styles.fieldLast]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value || '—'}</Text>
    </View>
  );
}

function ProfileScreen(props: Props) {
  const {} = props;

  const { t } = useTranslation();
  const { deleteToken } = useAuth();

  const onEdit = () => {};
  const onLogout = () => {
    deleteToken();
  };

  const [data, setData] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfile().then(saved => {
      if (saved) {
        setData(saved);
      }
    });
  }, []);

  if (!data) return null;

  const { phone, role, iin, profile } = data;

  const isTransport = role === 'transport';

  const roleLabel =
    role === 'transport'
      ? t('profileView.roleTransport')
      : t('profileView.roleCustomer');

  const rows: Row[] = [
    { label: t('profile.phone'), value: phone },
    { label: t('profileView.role'), value: roleLabel },
    { label: t('profileView.iin'), value: iin },
    { label: t('profile.fullName'), value: profile.fullName },
    { label: t('profile.birthDate'), value: formatDate(profile.birthDate) },
    { label: t('profile.citizenship'), value: profile.citizenship },
    { label: t('profile.idSeries'), value: profile.idSeries },
    { label: t('profile.idIssueDate'), value: formatDate(profile.idIssueDate) },
    { label: t('profile.idIssuedBy'), value: profile.idIssuedBy },
  ];

  if (isTransport) {
    rows.push(
      { label: t('profile.driverLicense'), value: profile.driverLicenseNumber },
      {
        label: t('profile.driverCategory'),
        value: profile.driverLicenseCategory,
      },
      {
        label: t('profile.driverIssueDate'),
        value: formatDate(profile.driverLicenseDate),
      },
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('profileView.title')}</Text>

        <View style={styles.card}>
          {rows.map((row, index) => (
            <FieldRow
              key={row.label}
              isLast={index === rows.length - 1}
              label={row.label}
              value={row.value}
            />
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onEdit}
          style={styles.editBtn}
        >
          <Text style={styles.editText}>{t('profileView.edit')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onLogout}
          style={styles.logoutBtn}
        >
          <Text style={styles.logoutText}>{t('profileView.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.ivory,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  title: {
    color: Colors.midnight,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 31,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  field: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8EA',
  },
  fieldLast: {
    borderBottomWidth: 0,
  },
  fieldLabel: {
    color: Colors.slate,
    fontSize: 13,
    lineHeight: 16,
    marginBottom: 4,
  },
  fieldValue: {
    color: Colors.midnight,
    fontSize: 16,
    lineHeight: 22,
  },
  editBtn: {
    alignItems: 'center',
    backgroundColor: Colors.accentCyan,
    borderRadius: 16,
    marginTop: 24,
    paddingVertical: 14,
  },
  editText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
  },
  logoutBtn: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.error,
    marginTop: 12,
    paddingVertical: 14,
  },
  logoutText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
  },
});

export default ProfileScreen;
