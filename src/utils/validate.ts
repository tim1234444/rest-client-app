import { ValidationError } from 'yup';
import { schema } from '../schemas';
import { Dispatch, SetStateAction } from 'react';

type DataType = {
  url: string;
  method: string;
};
export async function Validate(
  formData: DataType,
  setErrors: Dispatch<SetStateAction<Record<string, string>>>,
) {
  try {
    await schema.validate(formData, { abortEarly: false });
    return true;
  } catch (err) {
    if (err instanceof ValidationError) {
      const errors = err.inner.reduce(
        (acc, curr) => {
          if (curr.path) {
            acc[curr.path] = curr.message;
          }
          return acc;
        },
        {} as Record<string, string>,
      );
      setErrors(errors);
    }
    return false;
  }
}
