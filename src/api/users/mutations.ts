import { graphqlRequest } from '@/api/graphql-client';
import type { GraphQLUserRole } from '@/constants/roles';
import type { MessagePayload, User } from '@/types/auth';
import { mapUser } from '@/types/auth';
import type { CreateUserInput, UpdateUserRoleInput } from '@/types/user';
import { mapUsers } from '@/types/user';

const USER_FIELDS = `
  fragment UserFields on User {
    id
    name
    email
    role
    createdAt
  }
`;

export const USERS_QUERY = `
  ${USER_FIELDS}
  query Users {
    users {
      ...UserFields
    }
  }
`;

interface UsersResponse {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: GraphQLUserRole;
    createdAt: string;
  }>;
}

export async function fetchUsers(): Promise<User[]> {
  const data = await graphqlRequest<UsersResponse>(USERS_QUERY);
  return mapUsers(data.users);
}

export const CREATE_USER_MUTATION = `
  ${USER_FIELDS}
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...UserFields
    }
  }
`;

interface CreateUserResponse {
  createUser: UsersResponse['users'][number];
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const data = await graphqlRequest<CreateUserResponse>(CREATE_USER_MUTATION, { input });
  return mapUser(data.createUser);
}

export const UPDATE_USER_ROLE_MUTATION = `
  ${USER_FIELDS}
  mutation UpdateUserRole($input: UpdateUserRoleInput!) {
    updateUserRole(input: $input) {
      ...UserFields
    }
  }
`;

interface UpdateUserRoleResponse {
  updateUserRole: UsersResponse['users'][number];
}

export async function updateUserRole(input: UpdateUserRoleInput): Promise<User> {
  const data = await graphqlRequest<UpdateUserRoleResponse>(UPDATE_USER_ROLE_MUTATION, { input });
  return mapUser(data.updateUserRole);
}

export const DELETE_USER_MUTATION = `
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      message
      success
    }
  }
`;

export async function deleteUser(id: string): Promise<MessagePayload> {
  const data = await graphqlRequest<{ deleteUser: MessagePayload }>(DELETE_USER_MUTATION, { id });
  return data.deleteUser;
}
