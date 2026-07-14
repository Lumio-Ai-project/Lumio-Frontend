export type TemplateChannel = 'EMAIL' | 'SMS' | 'PUSH' | 'HTML' | 'TEXT';

export interface TemplateVariable {
  key: string;
  label: string;
  required: boolean;
  defaultValue: string | null;
}

export interface Template {
  id: string;
  slug: string;
  name: string;
  channel: TemplateChannel;
  subject: string | null;
  bodyHtml: string | null;
  bodyText: string | null;
  variables: TemplateVariable[];
  isActive: boolean;
}

export interface TemplateVariableInput {
  key: string;
  label: string;
  required: boolean;
  defaultValue?: string | null;
}

export interface UpdateTemplateInput {
  id: string;
  name?: string;
  channel?: TemplateChannel;
  subject?: string | null;
  bodyHtml?: string | null;
  bodyText?: string | null;
  variables?: TemplateVariableInput[];
  isActive?: boolean;
}
