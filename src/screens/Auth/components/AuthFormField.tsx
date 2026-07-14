import type { InputHTMLAttributes } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AuthFormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AuthFormField({ label, error, id, className, ...props }: AuthFormFieldProps) {
  const inputId = id ?? props.name;

  return (
    <div className="flex flex-col gap-stack-sm">
      <Label htmlFor={inputId}>{label}</Label>
      <Input
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={cn(error && 'border-destructive', className)}
        {...props}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
