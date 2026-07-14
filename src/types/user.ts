import type { GraphQLUserRole } from '@/constants/roles';
import type { User } from '@/types/auth';
import { mapUser } from '@/types/auth';

export type { User };

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: GraphQLUserRole;
}

export interface UpdateUserRoleInput {
  id: string;
  role: GraphQLUserRole;
}

interface GraphQLUser {
  id: string;
  name: string;
  email: string;
  role: GraphQLUserRole;
  createdAt: string;
}

export function mapUsers(users: GraphQLUser[]): User[] {
  return users.map(mapUser);
}
