import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { getHomeRouteForRole, ROUTES } from '@/routes/paths';
import { AuthCard } from '@/screens/Auth/components/AuthCard';
import { AuthDivider } from '@/screens/Auth/components/AuthDivider';
import { AuthFormField } from '@/screens/Auth/components/AuthFormField';
import { GoogleSignInButton } from '@/screens/Auth/components/GoogleSignInButton';
import { PasswordInput } from '@/screens/Auth/components/PasswordInput';
import {
  AUTH_FORM_OPTIONS,
  getTouchedFieldError,
  isSchemaValid,
} from '@/screens/Auth/lib/auth-form';
import { registerSchema, type RegisterFormData } from '@/screens/Auth/schemas/register.schema';

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, touchedFields },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    ...AUTH_FORM_OPTIONS,
  });

  const values = watch();
  const canSubmit = isSchemaValid(registerSchema, values);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const user = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate(getHomeRouteForRole(user.role), { replace: true });
    } catch {
      setError('root', { message: 'Registration failed. This email may already be in use.' });
    }
  };

  return (
    <AuthCard title="Create an account" description="Get started with Lumio today">
      <GoogleSignInButton />
      <AuthDivider />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-stack">
        <AuthFormField
          label="Name"
          autoComplete="name"
          error={getTouchedFieldError(touchedFields, errors, 'name')}
          {...register('name')}
        />

        <AuthFormField
          label="Email"
          type="email"
          autoComplete="email"
          error={getTouchedFieldError(touchedFields, errors, 'email')}
          {...register('email')}
        />

        <PasswordInput
          label="Password"
          autoComplete="new-password"
          error={getTouchedFieldError(touchedFields, errors, 'password')}
          {...register('password')}
        />

        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          error={getTouchedFieldError(touchedFields, errors, 'confirmPassword')}
          {...register('confirmPassword')}
        />

        {errors.root?.message ? (
          <p className="text-sm text-destructive" role="alert">
            {errors.root.message}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={isSubmitting || !canSubmit}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-sm text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
