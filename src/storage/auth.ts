import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_TOKEN = '@auth_token';

export async function getToken(): Promise<string | null> {
  try {
    return AsyncStorage.getItem(AUTH_TOKEN);
  } catch {
    return null;
  }
}

export async function removeToken() {
  await AsyncStorage.removeItem(AUTH_TOKEN);
}

export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem(AUTH_TOKEN, token);
}
