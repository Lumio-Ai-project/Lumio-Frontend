import { CreateApiKeyPopover } from '../components/CreateApiKeyPopover';
import { ApiKeyTable } from '../components/ApiKeyTable';
import { useRole } from '@/hooks/use-role';

export function ApiKeysPage() {
  const { isGuest } = useRole();

  return (
    <div className="flex flex-col gap-stack">
      <div className="flex flex-wrap items-center justify-between gap-stack-sm">
        <div>
          <h1 className="text-2xl font-bold">API Keys</h1>
          <p className="mt-stack-sm text-sm text-muted-foreground">
            {isGuest
              ? 'Manage your personal API keys for chat.'
              : 'Manage AI modules and API keys for chat.'}
          </p>
        </div>
        <CreateApiKeyPopover />
      </div>
      <ApiKeyTable />
    </div>
  );
}
