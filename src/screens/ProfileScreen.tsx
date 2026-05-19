import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ProfileStep, {
  type ProfileForm,
} from '../components/Registration/ProfileStep';
import { Colors } from '../theme';
import { formatDate, loadProfile, saveProfile } from '../storage/profile';
import { UserProfile } from '../types';
import { useAuth } from '../provider/AuthProvider.tsx';

type Row = { label: string; value: string };

function FieldRow({
  label,
  value,
  isFirst,
  isLast,
}: Row & { isFirst?: boolean; isLast?: boolean }) {
  return (
    <View
      style={[
        styles.field,
        isFirst && styles.fieldFirst,
        isLast && styles.fieldLast,
      ]}
    >
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value || '—'}</Text>
    </View>
  );
}

function ProfileScreen() {
  const { t } = useTranslation();
  const { deleteToken } = useAuth();

  const [data, setData] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const onEdit = () => {
    setIsEditing(true);
  };

  const onLogout = () => {
    deleteToken();
  };

  useEffect(() => {
    loadProfile().then(saved => {
      if (saved) {
        setData(saved);
      }
    });
  }, []);

  const handleProfileSubmit = async (profileForm: ProfileForm) => {
    if (!data) return;

    const updatedProfile: UserProfile = {
      ...data,
      iin: profileForm.iin,
      profile: profileForm,
    };

    setIsSaving(true);
    try {
      await saveProfile(updatedProfile);
      setData(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!data) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.loader]}>
        <ActivityIndicator color={Colors.accentCyan} />
      </SafeAreaView>
    );
  }

  const { phone, role, iin, profile } = data;

  const isTransport = role === 'transport';

  const baseRows: Row[] = [
    { label: t('profile.fullName'), value: profile.fullName },
    { label: t('profile.birthDate'), value: formatDate(profile.birthDate) },
    { label: t('profile.citizenship'), value: profile.citizenship },
    { label: t('profile.phone'), value: phone },
    { label: t('profile.iin'), value: iin },
    { label: t('profile.idSeries'), value: profile.idSeries },
    { label: t('profile.idIssueDate'), value: formatDate(profile.idIssueDate) },
    { label: t('profile.idIssuedBy'), value: profile.idIssuedBy },
  ];

  const driverRows: Row[] = isTransport
    ? [
        {
          label: t('profile.driverLicense'),
          value: profile.driverLicenseNumber,
        },
        {
          label: t('profile.driverCategory'),
          value: profile.driverLicenseCategory,
        },
        {
          label: t('profile.driverIssueDate'),
          value: formatDate(profile.driverLicenseDate),
        },
      ]
    : [];

  const rows = [...baseRows, ...driverRows];

  if (isEditing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAwareScrollView
          bounces={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={isSaving}
            onPress={() => setIsEditing(false)}
            style={styles.cancelBtn}
          >
            <Text style={styles.cancelText}>{t('profileView.cancel')}</Text>
          </TouchableOpacity>

          <ProfileStep
            initialProfile={profile}
            isSubmitting={isSaving}
            phone={phone}
            role={role}
            showDraft={false}
            submitLabel={t('profileView.save')}
            onSubmit={handleProfileSubmit}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        bounces={false}
        data={rows}
        keyExtractor={item => item.label}
        ListFooterComponent={
          <>
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
          </>
        }
        ListHeaderComponent={
          <Text style={styles.title}>{t('profileView.title')}</Text>
        }
        renderItem={({ item, index }) => (
          <FieldRow
            isFirst={index === 0}
            isLast={index === rows.length - 1}
            label={item.label}
            value={item.value}
          />
        )}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.ivory,
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
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
  field: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E8EA',
  },
  fieldFirst: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
  },
  fieldLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingBottom: 16,
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
  cancelBtn: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 8,
  },
  cancelText: {
    color: Colors.accentCyan,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
  },
});

export default ProfileScreen;
