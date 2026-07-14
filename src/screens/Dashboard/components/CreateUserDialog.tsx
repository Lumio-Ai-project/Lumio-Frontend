import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Popover } from '@/components/shared/Popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toGraphQLRole } from '@/constants/roles';
import { useCreateUser } from '@/hooks/use-users';
import { PasswordInput } from '@/screens/Auth/components/PasswordInput';
import { AuthFormField } from '@/screens/Auth/components/AuthFormField';

import { UserRoleSelect } from './UserRoleSelect';

const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number'),
  role: z.enum(['admin', 'moderator', 'guest']),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserDialogProps {
  onSuccess?: () => void;
}

export function CreateUserDialog({ onSuccess }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: '', email: '', password: '', role: 'guest' },
  });

  const role = watch('role');

  const onSubmit = async (data: CreateUserFormData) => {
    await createUser.mutateAsync({
      name: data.name,
      email: data.email,
      password: data.password,
      role: toGraphQLRole(data.role),
    });
    reset();
    setOpen(false);
    onSuccess?.();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset();
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <Button type="button">Create user</Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Overlay />
        <Popover.Content size="half">
          <Popover.CloseIcon />
          <Popover.Header>
            <Popover.Title>Create user</Popover.Title>
            <Popover.Description>
              Add a new account with name, email, password, and role.
            </Popover.Description>
          </Popover.Header>

          <Popover.Body>
            <form
              id="create-user-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-stack"
            >
              <AuthFormField label="Name" error={errors.name?.message} {...register('name')} />

              <AuthFormField
                label="Email"
                type="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <PasswordInput
                label="Password"
                error={errors.password?.message}
                {...register('password')}
              />

              <div className="flex flex-col gap-stack-sm">
                <Label htmlFor="create-user-role">Role</Label>
                <UserRoleSelect
                  id="create-user-role"
                  value={role}
                  onChange={(value) => setValue('role', value)}
                />
              </div>
            </form>
          </Popover.Body>

          <Popover.Footer>
            <Popover.Close asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Popover.Close>
            <Button
              type="submit"
              form="create-user-form"
              disabled={isSubmitting || createUser.isPending}
            >
              {createUser.isPending ? 'Creating…' : 'Create user'}
            </Button>
          </Popover.Footer>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}
