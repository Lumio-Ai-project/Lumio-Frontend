import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useForgotPassword } from "@/hooks/use-auth-mutations";
import { ROUTES } from "@/routes/paths";
import { AuthCard } from "@/screens/Auth/components/AuthCard";
import { AuthFormField } from "@/screens/Auth/components/AuthFormField";
import {
  AUTH_FORM_OPTIONS,
  getTouchedFieldError,
  isSchemaValid,
} from "@/screens/Auth/lib/auth-form";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/screens/Auth/schemas/forgot-password.schema";

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    ...AUTH_FORM_OPTIONS,
  });

  const values = watch();
  const canSubmit = isSchemaValid(forgotPasswordSchema, values);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await forgotPassword.mutateAsync(data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AuthCard
        title="Check your email"
        description="If an account exists, we sent reset instructions to your inbox."
      >
        <Link to={ROUTES.LOGIN}>
          <Button variant="outline" className="w-full">
            Back to login
          </Button>
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot password"
      description="Enter your email and we'll send you reset instructions"
    >
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

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !canSubmit}
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link
            to={ROUTES.LOGIN}
            className="text-sm text-primary hover:underline"
          >
            Back to login
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
