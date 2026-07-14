import { USER_ROLES, toGraphQLRole, type UserRole } from '@/constants/roles';
import { cn } from '@/lib/utils';

interface UserRoleSelectProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  moderator: 'Moderator',
  guest: 'Guest',
};

export function UserRoleSelect({ value, onChange, disabled, className, id }: UserRoleSelectProps) {
  return (
    <select
      id={id}
      value={toGraphQLRole(value)}
      disabled={disabled}
      onChange={(event) => {
        const selected = USER_ROLES.find((role) => toGraphQLRole(role) === event.target.value);
        if (selected) {
          onChange(selected);
        }
      }}
      className={cn(
        'flex h-input w-full rounded-md border border-input bg-inherit px-3 py-2 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      {USER_ROLES.map((role) => (
        <option key={role} value={toGraphQLRole(role)}>
          {ROLE_LABELS[role]}
        </option>
      ))}
    </select>
  );
}
