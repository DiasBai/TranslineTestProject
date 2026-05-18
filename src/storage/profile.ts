import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

export const PROFILE_KEY = '@user_profile';
export const DRAFT_KEY = '@profile_draft';

export async function loadProfile(): Promise<UserProfile | null> {
  try {
    const json = await AsyncStorage.getItem(PROFILE_KEY);
    if (!json) return null;
    return JSON.parse(json) as UserProfile;
  } catch {
    return null;
  }
}

export async function saveProfile(data: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(data));
}

export async function clearProfileStorage(): Promise<void> {
  await AsyncStorage.removeMany([PROFILE_KEY, DRAFT_KEY]);
}

export function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
}
