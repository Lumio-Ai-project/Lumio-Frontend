import { ClientError, GraphQLClient } from 'graphql-request';

import { clearAuthStorage, getAccessToken } from '@/lib/auth-storage';

const endpoint = import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:4000/graphql';

export function createGraphQLClient(): GraphQLClient {
  const token = getAccessToken();

  return new GraphQLClient(endpoint, {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
}

function isUnauthenticatedError(error: unknown): boolean {
  if (!(error instanceof ClientError)) {
    return false;
  }

  const errors = error.response?.errors ?? [];
  return errors.some((entry) => entry.extensions?.code === 'UNAUTHENTICATED');
}

export async function graphqlRequest<T>(
  document: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  try {
    return await createGraphQLClient().request<T>(document, variables);
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      clearAuthStorage();
      window.location.href = '/login';
    }
    throw error;
  }
}

export function getGraphQLErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof ClientError) {
    const firstError = error.response?.errors?.[0];
    if (firstError?.message) {
      return firstError.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function getGraphQLErrorCode(error: unknown): string | undefined {
  if (error instanceof ClientError) {
    return error.response?.errors?.[0]?.extensions?.code as string | undefined;
  }
  return undefined;
}
