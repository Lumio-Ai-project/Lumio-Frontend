import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getGraphQLErrorMessage } from '@/api/graphql-client';
import { templateKeys } from '@/api/templates/keys';
import {
  deleteTemplate,
  fetchTemplate,
  fetchTemplates,
  updateTemplate,
} from '@/api/templates/mutations';
import type { TemplateChannel, UpdateTemplateInput } from '@/types/template';

export function useTemplates(filters?: { channel?: TemplateChannel; activeOnly?: boolean }) {
  return useQuery({
    queryKey: templateKeys.list(filters),
    queryFn: () => fetchTemplates(filters),
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => fetchTemplate(id),
    enabled: Boolean(id),
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTemplateInput) => updateTemplate(input),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      void queryClient.setQueryData(templateKeys.detail(data.id), data);
      toast.success('Template updated');
    },
    onError: (error) => {
      toast.error(getGraphQLErrorMessage(error, 'Failed to update template'));
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTemplate(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      toast.success('Template deleted');
    },
    onError: (error) => {
      toast.error(getGraphQLErrorMessage(error, 'Failed to delete template'));
    },
  });
}
