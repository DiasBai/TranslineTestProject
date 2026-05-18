import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import LogoIcon from '../../assets/icons/AuthIcons/LogoIcon';

import { Colors } from '../../theme';

export default function AuthLogo() {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language === 'en' ? 'en' : 'ru';

  const changeLanguage = (language: typeof i18n.language) => {
    i18n.changeLanguage(language).catch(() => {});
  };

  return (
    <View style={styles.hero}>
      <View style={styles.heroTopRow}>
        <View style={styles.logoCircle}>
          <LogoIcon />
        </View>

        <View style={styles.languageSwitcher}>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.8}
            onPress={() => changeLanguage('ru')}
            style={[
              styles.languageOption,
              currentLanguage === 'ru' && styles.languageOptionActive,
            ]}
          >
            <Text
              style={[
                styles.languageOptionText,
                currentLanguage === 'ru' && styles.languageOptionTextActive,
              ]}
            >
              {t('language.ru')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.8}
            onPress={() => changeLanguage('en')}
            style={[
              styles.languageOption,
              currentLanguage === 'en' && styles.languageOptionActive,
            ]}
          >
            <Text
              style={[
                styles.languageOptionText,
                currentLanguage === 'en' && styles.languageOptionTextActive,
              ]}
            >
              {t('language.en')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title}>{t('auth.title')}</Text>
      <Text style={styles.description}>{t('auth.description')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 28,
    paddingBottom: 40,
  },
  heroTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logoCircle: {
    alignItems: 'center',
    backgroundColor: Colors.accentCyan,
    borderRadius: 36,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  languageSwitcher: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    padding: 4,
  },
  languageOption: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  languageOptionActive: {
    backgroundColor: Colors.accentCyan,
  },
  languageOptionText: {
    color: Colors.charcoal,
    fontSize: 13,
    fontWeight: '600',
  },
  languageOptionTextActive: {
    color: '#FFFFFF',
  },
  title: {
    color: Colors.charcoal,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 31,
    marginBottom: 12,
  },
  description: {
    color: '#4A4A4E',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 19,
    maxWidth: 340,
  },
});
