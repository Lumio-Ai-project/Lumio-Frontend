import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { DataTable, type DataTableColumn } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeleteTemplatePopover } from '@/screens/Dashboard/components/DeleteTemplatePopover';
import { useTemplates } from '@/hooks/use-templates';
import { ROUTES } from '@/routes/paths';
import type { Template } from '@/types/template';

function templateDetailPath(id: string) {
  return ROUTES.DASHBOARD_TEMPLATE_DETAIL.replace(':id', id);
}

export function TemplatesPage() {
  const navigate = useNavigate();
  const { data: templates = [], isLoading } = useTemplates();

  const columns: DataTableColumn<Template>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      id: 'slug',
      header: 'Slug',
      cell: (row) => <code className="text-xs">{row.slug}</code>,
    },
    {
      id: 'channel',
      header: 'Channel',
      cell: (row) => row.channel,
    },
    {
      id: 'isActive',
      header: 'Active',
      cell: (row) => (row.isActive ? 'Yes' : 'No'),
    },
    {
      id: 'actions',
      header: 'Actions',
      className: 'w-[8rem]',
      cell: (row) => (
        <div className="flex gap-stack-sm">
          <Button
            type="button"
            variant="outline"
            onClick={(event) => {
              event.stopPropagation();
              navigate(templateDetailPath(row.id));
            }}
            aria-label={`View ${row.name}`}
          >
            <Eye className="size-icon-sm" aria-hidden />
          </Button>
          <DeleteTemplatePopover template={row} />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-stack">
      <div>
        <h1 className="text-2xl font-bold">Templates</h1>
        <p className="mt-stack-sm text-sm text-muted-foreground">
          View and edit notification templates.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All templates</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={templates}
            columns={columns}
            getRowKey={(row) => row.id}
            isLoading={isLoading}
            emptyMessage="No templates found"
            onRowClick={(row) => navigate(templateDetailPath(row.id))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
