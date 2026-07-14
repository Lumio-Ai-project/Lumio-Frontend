import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useResetPassword } from "@/hooks/use-auth-mutations";
import { ROUTES } from "@/routes/paths";
import { AuthCard } from "@/screens/Auth/components/AuthCard";
import { PasswordInput } from "@/screens/Auth/components/PasswordInput";
import {
  AUTH_FORM_OPTIONS,
  getTouchedFieldError,
  isSchemaValid,
} from "@/screens/Auth/lib/auth-form";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/screens/Auth/schemas/reset-password.schema";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, touchedFields },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    ...AUTH_FORM_OPTIONS,
  });

  const values = watch();
  const canSubmit = isSchemaValid(resetPasswordSchema, values);

  if (!token) {
    return (
      <AuthCard
        title="Invalid reset link"
        description="This password reset link is invalid or expired."
      >
        <Link to={ROUTES.FORGOT_PASSWORD}>
          <Button className="w-full">Request a new link</Button>
        </Link>
      </AuthCard>
    );
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword.mutateAsync({ token, password: data.password });
      navigate(ROUTES.LOGIN, { replace: true });
    } catch {
      setError("root", { message: "Invalid or expired reset token" });
    }
  };

  return (
    <AuthCard
      title="Reset password"
      description="Enter your new password below"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-stack"
      >
        <PasswordInput
          label="New password"
          autoComplete="new-password"
          error={getTouchedFieldError(touchedFields, errors, "password")}
          {...register("password")}
        />

        <PasswordInput
          label="Confirm new password"
          autoComplete="new-password"
          error={getTouchedFieldError(touchedFields, errors, "confirmPassword")}
          {...register("confirmPassword")}
        />

        {errors.root?.message ? (
          <div className="flex flex-col gap-stack-sm">
            <p className="text-sm text-destructive" role="alert">
              {errors.root.message}
            </p>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-sm text-primary hover:underline"
            >
              Request a new reset link
            </Link>
          </div>
        ) : null}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !canSubmit}
        >
          {isSubmitting ? "Updating..." : "Update password"}
        </Button>
      </form>
    </AuthCard>
  );
}
