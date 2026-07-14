import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChatModules } from "@/hooks/use-chat-modules";
import type { ChatModule } from "@/types/chat-module";

import { DeleteApiKeyPopover } from "./DeleteApiKeyPopover";
import { EditApiKeyPopover } from "./EditApiKeyPopover";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatProvider(provider: ChatModule["provider"]) {
  if (provider === "OPENROUTER") return "OpenRouter";
  return provider === "GEMINI" ? "Gemini" : provider;
}

export function ApiKeyTable() {
  const { data: modules = [], isLoading } = useChatModules();

  const columns: DataTableColumn<ChatModule>[] = [
    {
      id: "name",
      header: "Name",
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      id: "slug",
      header: "Slug",
      cell: (row) => <code className="text-xs">{row.slug}</code>,
    },
    {
      id: "provider",
      header: "Provider",
      cell: (row) => formatProvider(row.provider),
    },
    {
      id: "model",
      header: "Model",
      cell: (row) => row.model,
    },
    {
      id: "isActive",
      header: "Active",
      cell: (row) => (row.isActive ? "Yes" : "No"),
    },
    {
      id: "isGlobal",
      header: "Scope",
      cell: (row) => (row.isGlobal ? "Global" : "Specific"),
    },
    {
      id: "isDefault",
      header: "Default",
      cell: (row) => (row.isDefault ? "Yes" : "No"),
    },
    {
      id: "maskedApiKey",
      header: "API key",
      cell: (row) => (
        <code className="whitespace-nowrap text-xs text-muted-foreground">
          {row.maskedApiKey ?? (row.hasApiKey ? "****" : "—")}
        </code>
      ),
    },
    {
      id: "createdAt",
      header: "Created",
      cell: (row) => formatDate(row.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      className: "w-[6rem]",
      sticky: "right",
      cell: (row) => (
        <div className="flex gap-stack-sm">
          <EditApiKeyPopover module={row} />
          <DeleteApiKeyPopover module={row} />
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>All API keys</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={modules}
          columns={columns}
          getRowKey={(row) => row.id}
          isLoading={isLoading}
          emptyMessage="No API keys found"
        />
      </CardContent>
    </Card>
  );
}
