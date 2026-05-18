import type { ProfileForm } from '../components/Registration/ProfileStep.tsx';

export type UserRole = 'customer' | 'transport';

export type UserProfile = {
  phone: string;
  role: UserRole;
  iin: string;
  profile: ProfileForm;
};
