import { graphqlRequest } from '@/api/graphql-client';
import type { Template, TemplateChannel, UpdateTemplateInput } from '@/types/template';
import type { MessagePayload } from '@/types/auth';

const TEMPLATE_FIELDS = `
  fragment TemplateFields on Template {
    id
    slug
    name
    channel
    subject
    bodyHtml
    bodyText
    variables {
      key
      label
      required
      defaultValue
    }
    isActive
  }
`;

export const TEMPLATES_QUERY = `
  ${TEMPLATE_FIELDS}
  query Templates($channel: TemplateChannel, $activeOnly: Boolean) {
    templates(channel: $channel, activeOnly: $activeOnly) {
      ...TemplateFields
    }
  }
`;

interface TemplatesResponse {
  templates: Template[];
}

export async function fetchTemplates(filters?: {
  channel?: TemplateChannel;
  activeOnly?: boolean;
}): Promise<Template[]> {
  const data = await graphqlRequest<TemplatesResponse>(TEMPLATES_QUERY, filters ?? {});
  return data.templates;
}

export const TEMPLATE_QUERY = `
  ${TEMPLATE_FIELDS}
  query Template($id: ID!) {
    template(id: $id) {
      ...TemplateFields
    }
  }
`;

interface TemplateResponse {
  template: Template;
}

export async function fetchTemplate(id: string): Promise<Template> {
  const data = await graphqlRequest<TemplateResponse>(TEMPLATE_QUERY, { id });
  return data.template;
}

export const UPDATE_TEMPLATE_MUTATION = `
  ${TEMPLATE_FIELDS}
  mutation UpdateTemplate($input: UpdateTemplateInput!) {
    updateTemplate(input: $input) {
      ...TemplateFields
    }
  }
`;

interface UpdateTemplateResponse {
  updateTemplate: Template;
}

export async function updateTemplate(input: UpdateTemplateInput): Promise<Template> {
  const data = await graphqlRequest<UpdateTemplateResponse>(UPDATE_TEMPLATE_MUTATION, { input });
  return data.updateTemplate;
}

export const DELETE_TEMPLATE_MUTATION = `
  mutation DeleteTemplate($id: ID!) {
    deleteTemplate(id: $id) {
      message
      success
    }
  }
`;

export async function deleteTemplate(id: string): Promise<MessagePayload> {
  const data = await graphqlRequest<{ deleteTemplate: MessagePayload }>(DELETE_TEMPLATE_MUTATION, {
    id,
  });
  return data.deleteTemplate;
}
