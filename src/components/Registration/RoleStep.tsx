import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import CustomerIcon from '../../assets/icons/RegestrationIcons/CustomerIcon';
import TransportIcon from '../../assets/icons/RegestrationIcons/TransportIcon';
import { Colors } from '../../theme';

type Role = 'customer' | 'transport';

type Props = {
  selectedRole: Role | null;
  isDisabled: boolean;
  onSelectRole: (role: Role) => void;
  onSubmit: () => void;
};

function RoleStep({
  selectedRole,
  isDisabled,
  onSelectRole,
  onSubmit,
}: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Text style={styles.title}>{t('role.title')}</Text>
      <Text style={styles.desc}>{t('role.description')}</Text>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onSelectRole('customer')}
        style={[styles.card, selectedRole === 'customer' && styles.cardActive]}
      >
        <View
          style={[
            styles.cardIcon,
            selectedRole === 'customer' && styles.cardIconActive,
          ]}
        >
          <CustomerIcon
            color={selectedRole === 'customer' ? '#FFFFFF' : Colors.accentCyan}
          />
        </View>
        <View style={styles.cardText}>
          <Text
            style={[
              styles.cardTitle,
              selectedRole === 'customer' && styles.cardTitleActive,
            ]}
          >
            {t('role.customerTitle')}
          </Text>
          <Text
            style={[
              styles.cardDesc,
              selectedRole === 'customer' && styles.cardDescActive,
            ]}
          >
            {t('role.customerDesc')}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onSelectRole('transport')}
        style={[styles.card, selectedRole === 'transport' && styles.cardActive]}
      >
        <View
          style={[
            styles.cardIcon,
            selectedRole === 'transport' && styles.cardIconActive,
          ]}
        >
          <TransportIcon
            color={selectedRole === 'transport' ? '#FFFFFF' : Colors.accentCyan}
          />
        </View>
        <View style={styles.cardText}>
          <Text
            style={[
              styles.cardTitle,
              selectedRole === 'transport' && styles.cardTitleActive,
            ]}
          >
            {t('role.transportTitle')}
          </Text>
          <Text
            style={[
              styles.cardDesc,
              selectedRole === 'transport' && styles.cardDescActive,
            ]}
          >
            {t('role.transportDesc')}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isDisabled}
        onPress={onSubmit}
        style={[styles.submit, isDisabled && styles.submitDisabled]}
      >
        <Text style={styles.submitText}>{t('role.submit')}</Text>
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 12,
    padding: 16,
    gap: 12,
  },
  cardActive: {
    backgroundColor: Colors.accentCyan,
  },
  cardIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF9FD',
    borderRadius: 12,
  },
  cardIconActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    color: Colors.midnight,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  cardTitleActive: {
    color: '#FFFFFF',
  },
  cardDesc: {
    color: Colors.slate,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  cardDescActive: {
    color: 'rgba(255,255,255,0.85)',
  },
  submit: {
    alignItems: 'center',
    backgroundColor: Colors.accentCyan,
    borderRadius: 16,
    marginTop: 'auto',
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

export default RoleStep;
