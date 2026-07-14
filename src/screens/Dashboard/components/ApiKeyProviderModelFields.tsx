import { Label } from '@/components/ui/label';
import {
  AI_PROVIDER_OPTIONS,
  getDefaultModelForProvider,
  getModelOptionsForProvider,
} from '@/constants/ai-providers';
import { cn } from '@/lib/utils';
import type { AiProvider } from '@/types/chat-module';

const selectClassName = cn(
  'h-10 w-full rounded-md border border-input bg-background px-3 text-sm',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
);

interface ApiKeyProviderModelFieldsProps {
  idPrefix: string;
  provider: AiProvider;
  model: string;
  onProviderChange: (provider: AiProvider) => void;
  onModelChange: (model: string) => void;
  providerError?: string;
  modelError?: string;
}

export function ApiKeyProviderModelFields({
  idPrefix,
  provider,
  model,
  onProviderChange,
  onModelChange,
  providerError,
  modelError,
}: ApiKeyProviderModelFieldsProps) {
  const modelOptions = getModelOptionsForProvider(provider, model);

  const handleProviderChange = (nextProvider: AiProvider) => {
    onProviderChange(nextProvider);

    const nextModels = getModelOptionsForProvider(nextProvider, model);
    const modelStillValid = nextModels.some((option) => option.value === model);

    if (!modelStillValid) {
      onModelChange(getDefaultModelForProvider(nextProvider));
    }
  };

  return (
    <>
      <div className="flex flex-col gap-stack-sm">
        <Label htmlFor={`${idPrefix}-provider`}>Provider</Label>
        <select
          id={`${idPrefix}-provider`}
          className={selectClassName}
          value={provider}
          onChange={(event) => handleProviderChange(event.target.value as AiProvider)}
        >
          {AI_PROVIDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {providerError ? (
          <p className="text-sm text-destructive">{providerError}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-stack-sm">
        <Label htmlFor={`${idPrefix}-model`}>Model</Label>
        <select
          id={`${idPrefix}-model`}
          className={selectClassName}
          value={model}
          onChange={(event) => onModelChange(event.target.value)}
        >
          {modelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {modelError ? <p className="text-sm text-destructive">{modelError}</p> : null}
      </div>
    </>
  );
}
