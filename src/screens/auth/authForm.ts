import { Resolver } from 'react-hook-form';
import * as yup from 'yup';

export type AuthFormValues = {
  phone: string;
  password: string;
  agreement: boolean;
};

export const getPhoneDigits = (value: string) =>
  value.replace(/\D/g, '').slice(0, 10);

const authSchema: yup.ObjectSchema<AuthFormValues> = yup.object({
  phone: yup
    .string()
    .required('validation.phoneRequired')
    .test('phone-length', 'validation.phoneLength', value => {
      return getPhoneDigits(value ?? '').length === 10;
    }),
  password: yup
    .string()
    .required('validation.passwordRequired')
    .min(6, 'validation.passwordMin'),
  agreement: yup
    .boolean()
    .oneOf([true], 'validation.agreementRequired')
    .required(),
});

export const authFormResolver: Resolver<AuthFormValues> = async values => {
  try {
    const data = await authSchema.validate(values, { abortEarly: false });

    return {
      values: data,
      errors: {},
    };
  } catch (error) {
    if (!(error instanceof yup.ValidationError)) {
      throw error;
    }

    return {
      values: {},
      errors: error.inner.reduce<
        Record<string, { type: string; message: string }>
      >((acc, currentError) => {
        if (currentError.path && !acc[currentError.path]) {
          acc[currentError.path] = {
            type: currentError.type ?? 'validation',
            message: currentError.message,
          };
        }

        return acc;
      }, {}),
    };
  }
};
