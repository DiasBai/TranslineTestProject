import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Controller, type Resolver, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { DRAFT_KEY } from '../../storage/profile';
import { Colors } from '../../theme';
import { DatePickerModal } from './DatePickerModal';
import { PickerListModal } from './PickerListModal';
import { ProfileFormField } from './ProfileFormField';
import { ProfileTouchableField } from './ProfileTouchableField';

const CITIZENSHIPS = [
  'Казахстан',
  'Россия',
  'Кыргызстан',
  'Узбекистан',
  'Таджикистан',
  'Азербайджан',
  'Армения',
  'Беларусь',
  'Грузия',
];

const DRIVER_CATEGORIES = [
  'A',
  'A1',
  'B',
  'B1',
  'C',
  'C1',
  'D',
  'D1',
  'BE',
  'CE',
  'DE',
];

function buildSchema(isTransport: boolean) {
  const req = 'profile.required';
  const msPerYear = 365.25 * 24 * 3600 * 1000;

  return yup.object({
    iin: yup
      .string()
      .required(req)
      .matches(/^\d{12}$/, 'profile.iinError'),
    fullName: yup.string().trim().required(req),
    birthDate: yup
      .string()
      .required(req)
      .test(
        'not-future',
        'profile.birthDateFuture',
        v => !v || new Date(v) <= new Date(),
      )
      .test('min-age', 'profile.birthDateTooYoung', v => {
        if (!v) return false;
        const age = Date.now() - new Date(v).getTime();
        return age >= 18 * msPerYear;
      })
      .test('max-age', 'profile.birthDateTooOld', v => {
        if (!v) return false;
        const age = Date.now() - new Date(v).getTime();
        return age < 65 * msPerYear;
      }),
    citizenship: yup.string().required(req),
    idSeries: yup.string().trim().required(req),
    idIssueDate: yup.string().required(req),
    idIssuedBy: yup.string().trim().required(req),
    driverLicenseNumber: isTransport
      ? yup.string().trim().required(req)
      : yup.string(),
    driverLicenseCategory: isTransport
      ? yup.string().required(req)
      : yup.string(),
    driverLicenseDate: isTransport
      ? yup.string().required(req)
      : yup.string(),
  });
}

export type ProfileForm = {
  iin: string;
  fullName: string;
  birthDate: string;
  citizenship: string;
  idSeries: string;
  idIssueDate: string;
  idIssuedBy: string;
  driverLicenseNumber: string;
  driverLicenseCategory: string;
  driverLicenseDate: string;
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
}

type Props = {
  phone: string;
  role: 'customer' | 'transport';
  initialProfile?: ProfileForm;
  onSubmit: (data: ProfileForm) => void;
};

function ProfileStep({ phone, role, initialProfile, onSubmit }: Props) {
  const { t } = useTranslation();
  const isTransport = role === 'transport';

  const [activeDateField, setActiveDateField] = useState<
    keyof ProfileForm | null
  >(null);
  const [tempDate, setTempDate] = useState(new Date());
  const [listPicker, setListPicker] = useState<'citizenship' | 'category' | null>(
    null,
  );
  const [draftSaved, setDraftSaved] = useState(false);

  const resolver: Resolver<ProfileForm> = async values => {
    const schema = buildSchema(isTransport);
    try {
      const data = await schema.validate(values, { abortEarly: false });
      return { values: data as any, errors: {} };
    } catch (e) {
      if (!(e instanceof yup.ValidationError)) throw e;
      const errs: any = {};
      e.inner.forEach(err => {
        if (err.path && !errs[err.path]) {
          errs[err.path] = {
            type: err.type ?? 'validation',
            message: err.message,
          };
        }
      });
      return { values: {} as any, errors: errs };
    }
  };

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm<ProfileForm>({
    defaultValues: {
      iin: '',
      fullName: '',
      birthDate: '',
      citizenship: '',
      idSeries: '',
      idIssueDate: '',
      idIssuedBy: '',
      driverLicenseNumber: '',
      driverLicenseCategory: '',
      driverLicenseDate: '',
    },
    mode: 'onChange',
    resolver,
  });

  useEffect(() => {
    if (initialProfile) {
      (Object.keys(initialProfile) as (keyof ProfileForm)[]).forEach(k => {
        if (initialProfile[k]) {
          setValue(k, initialProfile[k], { shouldValidate: true });
        }
      });
      return;
    }

    AsyncStorage.getItem(DRAFT_KEY).then(json => {
      if (!json) return;
      try {
        const draft: Partial<ProfileForm> = JSON.parse(json);
        (Object.keys(draft) as (keyof ProfileForm)[]).forEach(k => {
          if (draft[k]) setValue(k, draft[k]!, { shouldValidate: true });
        });
      } catch {}
    });
  }, [initialProfile, setValue]);

  const openDatePicker = (field: keyof ProfileForm, current: string) => {
    setTempDate(current ? new Date(current) : new Date());
    setActiveDateField(field);
  };

  const onDateChange = (_: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setActiveDateField(null);
      if (selected && activeDateField) {
        setValue(activeDateField, selected.toISOString(), {
          shouldValidate: true,
        });
      }
    } else {
      if (selected) setTempDate(selected);
    }
  };

  const confirmDate = () => {
    if (activeDateField) {
      setValue(activeDateField, tempDate.toISOString(), {
        shouldValidate: true,
      });
    }
    setActiveDateField(null);
  };

  const saveDraft = async () => {
    try {
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(getValues()));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    } catch {}
  };

  return (
    <>
      <Text style={styles.title}>{t('profile.title')}</Text>
      <Text style={styles.desc}>{t('profile.description')}</Text>

      <Controller
        control={control}
        name="fullName"
        render={({ field: { onBlur, onChange, value } }) => (
          <ProfileFormField
            autoCapitalize="words"
            error={
              errors.fullName ? t(errors.fullName.message as any) : undefined
            }
            label={t('profile.fullName')}
            onBlur={onBlur}
            onChangeText={onChange}
            required
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="birthDate"
        render={({ field: { value } }) => (
          <ProfileTouchableField
            displayValue={fmtDate(value)}
            error={
              errors.birthDate ? t(errors.birthDate.message as any) : undefined
            }
            hasValue={!!value}
            label={t('profile.birthDate')}
            onPress={() => openDatePicker('birthDate', value)}
            placeholder={t('profile.datePlaceholder')}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="citizenship"
        render={({ field: { value } }) => (
          <ProfileTouchableField
            displayValue={value}
            error={
              errors.citizenship
                ? t(errors.citizenship.message as any)
                : undefined
            }
            hasValue={!!value}
            label={t('profile.citizenship')}
            onPress={() => setListPicker('citizenship')}
            placeholder={t('profile.selectPlaceholder')}
            required
          />
        )}
      />

      <View style={styles.inputWrap}>
        <Text style={styles.label}>{t('profile.phone')}</Text>
        <Text style={styles.readOnly}>{phone}</Text>
      </View>

      <Controller
        control={control}
        name="iin"
        render={({ field: { onBlur, onChange, value } }) => (
          <ProfileFormField
            error={errors.iin ? t(errors.iin.message as any) : undefined}
            keyboardType="number-pad"
            label={t('profile.iin')}
            maxLength={12}
            onBlur={onBlur}
            onChangeText={text => onChange(text.replace(/\D/g, '').slice(0, 12))}
            required
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="idSeries"
        render={({ field: { onBlur, onChange, value } }) => (
          <ProfileFormField
            autoCapitalize="characters"
            error={
              errors.idSeries ? t(errors.idSeries.message as any) : undefined
            }
            label={t('profile.idSeries')}
            onBlur={onBlur}
            onChangeText={onChange}
            required
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="idIssueDate"
        render={({ field: { value } }) => (
          <ProfileTouchableField
            displayValue={fmtDate(value)}
            error={
              errors.idIssueDate
                ? t(errors.idIssueDate.message as any)
                : undefined
            }
            hasValue={!!value}
            label={t('profile.idIssueDate')}
            onPress={() => openDatePicker('idIssueDate', value)}
            placeholder={t('profile.datePlaceholder')}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="idIssuedBy"
        render={({ field: { onBlur, onChange, value } }) => (
          <ProfileFormField
            autoCapitalize="sentences"
            error={
              errors.idIssuedBy
                ? t(errors.idIssuedBy.message as any)
                : undefined
            }
            label={t('profile.idIssuedBy')}
            onBlur={onBlur}
            onChangeText={onChange}
            required
            value={value}
          />
        )}
      />

      {isTransport && (
        <>
          <View style={styles.sectionDivider}>
            <Text style={styles.sectionTitle}>
              {t('profile.driverSection')}
            </Text>
          </View>

          <Controller
            control={control}
            name="driverLicenseNumber"
            render={({ field: { onBlur, onChange, value } }) => (
              <ProfileFormField
                autoCapitalize="characters"
                error={
                  errors.driverLicenseNumber
                    ? t(errors.driverLicenseNumber.message as any)
                    : undefined
                }
                label={t('profile.driverLicense')}
                onBlur={onBlur}
                onChangeText={onChange}
                required
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="driverLicenseCategory"
            render={({ field: { value } }) => (
              <ProfileTouchableField
                displayValue={value}
                error={
                  errors.driverLicenseCategory
                    ? t(errors.driverLicenseCategory.message as any)
                    : undefined
                }
                hasValue={!!value}
                label={t('profile.driverCategory')}
                onPress={() => setListPicker('category')}
                placeholder={t('profile.selectPlaceholder')}
                required
              />
            )}
          />

          <Controller
            control={control}
            name="driverLicenseDate"
            render={({ field: { value } }) => (
              <ProfileTouchableField
                displayValue={fmtDate(value)}
                error={
                  errors.driverLicenseDate
                    ? t(errors.driverLicenseDate.message as any)
                    : undefined
                }
                hasValue={!!value}
                label={t('profile.driverIssueDate')}
                onPress={() => openDatePicker('driverLicenseDate', value)}
                placeholder={t('profile.datePlaceholder')}
                required
              />
            )}
          />
        </>
      )}

      <DatePickerModal
        onChange={onDateChange}
        onConfirm={confirmDate}
        value={tempDate}
        visible={activeDateField !== null}
      />

      <PickerListModal
        data={
          listPicker === 'citizenship'
            ? CITIZENSHIPS
            : listPicker === 'category'
              ? DRIVER_CATEGORIES
              : []
        }
        flatListExtraData={listPicker}
        onClose={() => setListPicker(null)}
        onSelect={item => {
          if (listPicker === 'citizenship') {
            setValue('citizenship', item, { shouldValidate: true });
          } else if (listPicker === 'category') {
            setValue('driverLicenseCategory', item, { shouldValidate: true });
          }
          setListPicker(null);
        }}
        title={
          listPicker === 'citizenship'
            ? t('profile.citizenship')
            : listPicker === 'category'
              ? t('profile.driverCategory')
              : ''
        }
        visible={listPicker !== null}
      />

      <TouchableOpacity onPress={saveDraft} style={styles.draftBtn}>
        <Text style={styles.draftText}>
          {draftSaved ? t('profile.draftSaved') : t('profile.saveDraft')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        disabled={!isValid}
        onPress={handleSubmit(data => onSubmit(data))}
        style={[styles.submit, !isValid && styles.submitDisabled]}
      >
        <Text style={styles.submitText}>{t('profile.submit')}</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: 28,
  },
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
    marginBottom: 8,
  },
  inputWrap: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 6,
  },
  label: {
    color: Colors.slate,
    fontSize: 13,
    lineHeight: 16,
    marginBottom: 4,
  },
  readOnly: {
    color: Colors.slate,
    fontSize: 16,
    paddingVertical: 2,
  },
  sectionDivider: {
    marginTop: 20,
    marginBottom: 4,
  },
  sectionTitle: {
    color: Colors.midnight,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  draftBtn: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.accentCyan,
    marginTop: 16,
    paddingVertical: 14,
  },
  draftText: {
    color: Colors.accentCyan,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
  },
  submit: {
    alignItems: 'center',
    backgroundColor: Colors.accentCyan,
    borderRadius: 16,
    marginTop: 12,
    paddingVertical: 14,
  },
  submitDisabled: {
    backgroundColor: '#8EDDF0',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 21,
  },
});

export default ProfileStep;
