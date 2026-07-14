import { CreateUserDialog } from '../components/CreateUserDialog';
import { UserTable } from '../components/UserTable';

export function UsersPage() {
  return (
    <div className="flex flex-col gap-stack">
      <div className="flex flex-wrap items-center justify-between gap-stack-sm">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="mt-stack-sm text-sm text-muted-foreground">
            Manage user accounts, roles, and access.
          </p>
        </div>
        <CreateUserDialog />
      </div>
      <UserTable />
    </div>
  );
}
