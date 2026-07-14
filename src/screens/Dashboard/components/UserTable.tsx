import { DataTable, type DataTableColumn } from '@/components/shared/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toGraphQLRole } from '@/constants/roles';
import { useAuth } from '@/hooks/use-auth';
import { useUpdateUserRole, useUsers } from '@/hooks/use-users';
import type { User } from '@/types/auth';

import { DeleteUserPopover } from './DeleteUserPopover';
import { UserRoleSelect } from './UserRoleSelect';

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function UserTable() {
  const { user: currentUser } = useAuth();
  const { data: users = [], isLoading } = useUsers();
  const updateRole = useUpdateUserRole();

  const columns: DataTableColumn<User>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      id: 'email',
      header: 'Email',
      cell: (row) => row.email,
    },
    {
      id: 'role',
      header: 'Role',
      cell: (row) => (
        <UserRoleSelect
          value={row.role}
          disabled={updateRole.isPending}
          onChange={(role) => {
            void updateRole.mutateAsync({ id: row.id, role: toGraphQLRole(role) });
          }}
          className="max-w-40"
        />
      ),
    },
    {
      id: 'createdAt',
      header: 'Created',
      cell: (row) => formatDate(row.createdAt),
    },
    {
      id: 'actions',
      header: 'Actions',
      className: 'w-[6rem]',
      sticky: 'right',
      cell: (row) => (
        <DeleteUserPopover
          user={row}
          disabled={row.id === currentUser?.id}
        />
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>All users</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={users}
          columns={columns}
          getRowKey={(row) => row.id}
          isLoading={isLoading}
          emptyMessage="No users found"
        />
      </CardContent>
    </Card>
  );
}
