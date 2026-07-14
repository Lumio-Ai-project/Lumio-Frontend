import type { FieldErrors, FieldValues, UseFormProps } from 'react-hook-form';
import type { ZodType } from 'zod';

export const AUTH_FORM_OPTIONS = {
  mode: 'onTouched',
  reValidateMode: 'onChange',
} satisfies Pick<UseFormProps<FieldValues>, 'mode' | 'reValidateMode'>;

export function getTouchedFieldError<T extends FieldValues>(
  touchedFields: Partial<Readonly<Record<keyof T, boolean>>>,
  errors: FieldErrors<T>,
  name: keyof T & string,
): string | undefined {
  if (!touchedFields[name]) {
    return undefined;
  }

  const error = errors[name];
  if (error && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  return undefined;
}

export function isSchemaValid<T>(schema: ZodType<T>, values: unknown): boolean {
  return schema.safeParse(values).success;
}
