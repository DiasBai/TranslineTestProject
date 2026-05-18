import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserProfile } from '../types';

const MOCK_DELAY = 2000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export type UserRole = 'customer' | 'transporter';

export interface LoginPayload {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    phoneNumber: string;
    name: string;
    role: UserRole;
  };
}

export interface SendOtpPayload {
  phoneNumber: string;
}

export interface SendOtpResponse {
  message: string;
}

export interface ConfirmOtpPayload {
  phoneNumber: string;
  code: string;
}

export interface ConfirmOtpResponse {
  verified: boolean;
}

export interface RegisterResponse {
  token: string;
  user: UserProfile;
}

const CREDENTIALS_KEY = '@auth_credentials';

type CredentialStore = Record<string, string>;

async function loadCredentials(): Promise<CredentialStore> {
  try {
    const json = await AsyncStorage.getItem(CREDENTIALS_KEY);
    return json ? (JSON.parse(json) as CredentialStore) : {};
  } catch {
    return {};
  }
}

async function saveCredentials(store: CredentialStore): Promise<void> {
  await AsyncStorage.setItem(CREDENTIALS_KEY, JSON.stringify(store));
}

const MOCK_OTP = '123456';
const verifiedPhones = new Set<string>();

export const authService = {
  async login({ phoneNumber, password }: LoginPayload): Promise<LoginResponse> {
    await delay(MOCK_DELAY);

    const credentials = await loadCredentials();

    if (!(phoneNumber in credentials)) {
      throw new Error('user_not_found');
    }

    if (credentials[phoneNumber] !== password) {
      throw new Error('wrong_credentials');
    }

    return {
      token: `mock-token-${Date.now()}`,
      user: {
        phoneNumber,
        name: '',
        role: 'customer',
      },
    };
  },

  async sendOtp({ phoneNumber }: SendOtpPayload): Promise<SendOtpResponse> {
    await delay(MOCK_DELAY);

    if (!phoneNumber || phoneNumber.length < 10) {
      throw new Error('Некорректный номер телефона');
    }

    console.log(`[Mock] OTP для ${phoneNumber}: ${MOCK_OTP}`);

    return { message: 'OTP отправлен' };
  },

  async confirmOtp({
    phoneNumber,
    code,
  }: ConfirmOtpPayload): Promise<ConfirmOtpResponse> {
    await delay(MOCK_DELAY);

    if (code !== MOCK_OTP) {
      throw new Error('Неверный код');
    }

    verifiedPhones.add(phoneNumber);

    return { verified: true };
  },

  async register(
    payload: UserProfile,
    password: string,
  ): Promise<RegisterResponse> {
    await delay(MOCK_DELAY);

    const credentials = await loadCredentials();
    credentials[payload.phone] = password;
    await saveCredentials(credentials);

    return {
      token: `mock-token-${Date.now()}`,
      user: payload,
    };
  },
};
