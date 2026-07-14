import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { getHomeRouteForRole, ROUTES } from "@/routes/paths";
import { AuthCard } from "@/screens/Auth/components/AuthCard";
import { AuthDivider } from "@/screens/Auth/components/AuthDivider";
import { AuthFormField } from "@/screens/Auth/components/AuthFormField";
import { GoogleSignInButton } from "@/screens/Auth/components/GoogleSignInButton";
import { PasswordInput } from "@/screens/Auth/components/PasswordInput";
import {
  AUTH_FORM_OPTIONS,
  getTouchedFieldError,
  isSchemaValid,
} from "@/screens/Auth/lib/auth-form";
import {
  loginSchema,
  type LoginFormData,
} from "@/screens/Auth/schemas/login.schema";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from
    ?.pathname;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, touchedFields },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    ...AUTH_FORM_OPTIONS,
  });

  const values = watch();
  const canSubmit = isSchemaValid(loginSchema, values);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const user = await login(data);
      navigate(from ?? getHomeRouteForRole(user.role), { replace: true });
    } catch {
      setError("root", { message: "Invalid email or password" });
    }
  };

  return (
    <AuthCard title="Welcome back" description="Sign in to your Lumio account">
      <GoogleSignInButton />
      <AuthDivider />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-stack"
      >
        <AuthFormField
          label="Email"
          type="email"
          autoComplete="email"
          error={getTouchedFieldError(touchedFields, errors, "email")}
          {...register("email")}
        />

        <PasswordInput
          label="Password"
          autoComplete="current-password"
          error={getTouchedFieldError(touchedFields, errors, "password")}
          {...register("password")}
        />

        <div className="flex justify-end">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {errors.root?.message ? (
          <p className="text-sm text-destructive" role="alert">
            {errors.root.message}
          </p>
        ) : null}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !canSubmit}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to={ROUTES.REGISTER}
            className="text-sm text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
