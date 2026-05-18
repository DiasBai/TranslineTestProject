import { Resolver } from 'react-hook-form';
import * as yup from 'yup';

export type PasswordForm = {
  password: string;
  confirm: string;
};

export const PASSWORD_SPECIAL_REGEX =
  /[!@#$%^&*()\-_=+[\]{};:'",.<>?/\\|`~]/;

const schema = yup.object({
  password: yup
    .string()
    .required()
    .min(8)
    .matches(/[A-Z]/)
    .matches(/[a-z]/)
    .matches(/\d/)
    .matches(PASSWORD_SPECIAL_REGEX),
  confirm: yup
    .string()
    .required()
    .oneOf([yup.ref('password')]),
});

export const passwordStepResolver: Resolver<PasswordForm> = async values => {
  try {
    const data = await schema.validate(values, { abortEarly: false });
    return { values: data, errors: {} };
  } catch (e) {
    if (!(e instanceof yup.ValidationError)) throw e;
    return {
      values: {},
      errors: e.inner.reduce<Record<string, { type: string; message: string }>>(
        (acc, err) => {
          if (err.path && !acc[err.path]) {
            acc[err.path] = { type: err.type ?? 'validation', message: err.message };
          }
          return acc;
        },
        {},
      ),
    };
  }
};
